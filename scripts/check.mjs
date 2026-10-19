import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readConfig, getPayload } from "../src/snapshot.js";
const root = fileURLToPath(new URL("../", import.meta.url));
const files = [];
async function walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (
      [".git", "node_modules", "private", "outputs", ".scratch"].includes(
        e.name,
      )
    )
      continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p);
    else files.push(p);
  }
}
await walk(root);
const errors = [];
for (const p of files) {
  if (/\.(js|mjs)$/.test(p)) {
    const r = spawnSync(process.execPath, ["--check", p], { encoding: "utf8" });
    if (r.status) errors.push(r.stderr);
  }
  if (/\.md$/.test(p)) {
    const t = await readFile(p, "utf8");
    for (const m of t.matchAll(/\]\(([^)]+)\)/g)) {
      const link = m[1].split("#")[0];
      if (!link || /^(https?:|mailto:)/.test(link)) continue;
      if (!existsSync(resolve(dirname(p), decodeURIComponent(link))))
        errors.push("Broken link in " + p.slice(root.length) + ": " + link);
    }
  }
  if (/\.(md|json|js|mjs|html|css|ya?ml|csv)$/.test(p)) {
    const t = await readFile(p, "utf8");
    if (/\/Users\/[A-Za-z0-9_-]+\//.test(t))
      errors.push("Personal absolute path in " + p.slice(root.length));
    if (
      /(?:gh[pousr]_[A-Za-z0-9]{30,}|sk-[A-Za-z0-9]{32,}|-----BEGIN (?:RSA |OPENSSH )?PRIVATE KEY-----)/.test(
        t,
      )
    )
      errors.push("Potential secret in " + p.slice(root.length));
  }
}
const manifest = JSON.parse(
  await readFile(join(root, "data/sample/provenance.json"), "utf8"),
);
const csv = await readFile(join(root, "data/sample/prices.csv"));
const hash = createHash("sha256").update(csv).digest("hex");
const storedHash =
  manifest.sha256 ||
  manifest.file?.sha256 ||
  manifest.files?.["prices.csv"]?.sha256;
if (storedHash && storedHash !== hash)
  errors.push("Fixture provenance hash differs.");
await readConfig(root);
const payload = await getPayload(root);
if (!payload.dashboard.records.length)
  errors.push("Configured demo produces no records.");
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    "PASS: " +
      files.length +
      " files, JS syntax, local Markdown links, personal-path/token pattern scan, config and data pipeline.",
  );
