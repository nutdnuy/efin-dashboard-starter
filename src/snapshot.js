import { readFile, mkdir, rename, writeFile } from "node:fs/promises";
import { join, basename } from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { parseCSV, validateRows } from "./data.js";
import { buildDashboard } from "./metrics.js";

export async function readConfig(root) {
  const c = JSON.parse(
    await readFile(join(root, "dashboard.config.json"), "utf8"),
  );
  if (
    typeof c.title !== "string" ||
    !c.title.trim() ||
    typeof c.benchmark !== "string" ||
    !Array.isArray(c.symbols) ||
    !c.symbols.length ||
    c.symbols.some((s) => typeof s !== "string" || !s.trim()) ||
    new Set(c.symbols).size !== c.symbols.length ||
    !Number.isInteger(c.lookbackPeriods) ||
    c.lookbackPeriods < 1 ||
    !Number.isFinite(c.staleAfterDays) ||
    c.staleAfterDays < 0
  )
    throw new Error(
      "Invalid dashboard.config.json: check title, benchmark, unique symbols, lookbackPeriods and staleAfterDays.",
    );
  c.benchmark = c.benchmark.trim().toUpperCase();
  c.symbols = c.symbols.map((s) => s.trim().toUpperCase());
  if (
    new Set(c.symbols).size !== c.symbols.length ||
    c.symbols.includes(c.benchmark) ||
    [c.benchmark, ...c.symbols].some(
      (s) => !/^[A-Z0-9][A-Z0-9._&-]{0,31}$/.test(s),
    )
  )
    throw new Error(
      "Config symbols must be unique valid tickers and exclude the benchmark.",
    );
  return c;
}
export async function readSnapshot(root) {
  try {
    const saved = JSON.parse(
      await readFile(join(root, "data/private/current.json"), "utf8"),
    );
    if (saved.schemaVersion !== 1 || saved.source?.type !== "csv")
      throw new Error("Unsupported imported snapshot.");
    saved.rows = validateRows(saved.rows);
    return saved;
  } catch (e) {
    if (e.code !== "ENOENT") throw e; // Never hide an invalid real import behind demo values.
  }
  const rows = parseCSV(
    await readFile(join(root, "data/sample/prices.csv"), "utf8"),
  );
  return {
    schemaVersion: 1,
    source: {
      type: "demo",
      label: "Synthetic classroom fixture",
      importedAt: null,
    },
    rows,
  };
}
export async function getPayload(root, now = new Date()) {
  const config = await readConfig(root),
    snapshot = await readSnapshot(root);
  return {
    config,
    source: snapshot.source,
    rows: snapshot.rows,
    dashboard: buildDashboard(snapshot.rows, config, now),
  };
}
export async function importCSV(root, input, now = new Date()) {
  const raw = await readFile(input);
  if (raw.byteLength > 1048576)
    throw new Error("CSV exceeds the 1 MiB classroom limit.");
  const rows = parseCSV(raw.toString("utf8")),
    config = await readConfig(root);
  const dashboard = buildDashboard(rows, config, now);
  if (!dashboard.records.length)
    throw new Error(
      "No calculable configured symbols. Match config to CSV; include benchmark and enough aligned history.",
    );
  const hash = createHash("sha256").update(raw).digest("hex"),
    dir = join(root, "data/private"),
    target = join(dir, "current.json");
  try {
    const old = JSON.parse(await readFile(target, "utf8"));
    if (old.schemaVersion !== 1 || old.source?.type !== "csv")
      throw new Error("Unsupported saved schema");
    validateRows(old.rows);
    if (old.source?.sha256 === hash)
      return { changed: false, dashboard, source: old.source };
  } catch (e) {
    if (e.code !== "ENOENT")
      throw new Error(
        "Existing snapshot cannot be read; repair it before importing: " +
          e.message,
      );
  }
  const source = {
    type: "csv",
    label: basename(input),
    sha256: hash,
    importedAt: now.toISOString(),
  };
  const snapshot = { schemaVersion: 1, source, rows };
  await mkdir(dir, { recursive: true });
  const temp = join(dir, ".snapshot-" + randomUUID() + ".tmp");
  await writeFile(temp, JSON.stringify(snapshot, null, 2) + "\n", {
    mode: 0o600,
    flag: "wx",
  });
  await rename(temp, target);
  return { changed: true, dashboard, source };
}
