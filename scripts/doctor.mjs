import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const major = Number(process.versions.node.split(".")[0]);
console.log(
  "Node " + process.version + (major >= 22 ? " OK" : " — need Node 22+"),
);
if (major < 22) process.exitCode = 1;
for (const f of [
  "AGENTS.md",
  "dashboard.config.json",
  "data/sample/prices.csv",
  "docs/agents/domain.md",
  "docs/agents/issue-tracker.md",
]) {
  const ok = existsSync(join(root, f));
  console.log((ok ? "OK " : "MISSING ") + f);
  if (!ok) process.exitCode = 1;
}
const bases = [
  join(homedir(), ".codex/skills"),
  join(homedir(), ".agents/skills"),
  join(homedir(), ".claude/skills"),
  join(root, ".agents/skills"),
];
const names = [
  "grill-me",
  "research",
  "prototype",
  "tdd",
  "diagnosing-bugs",
  "code-review",
];
console.log(
  "\nOptional existing skills (read-only check; plugin-loaded skills may not appear):",
);
for (const n of names) {
  let found;
  for (const b of bases)
    for (const candidate of [n, "mattpocock-" + n])
      if (existsSync(join(b, candidate, "SKILL.md"))) found = candidate;
  console.log(
    n + ": " + (found || "not detected; ask your agent to list skills"),
  );
}
console.log(
  "\nNo credentials were inspected. Demo works without optional skills or Efin access.",
);
