import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, readFile, mkdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { importCSV, readConfig, readSnapshot } from "../src/snapshot.js";
const config = {
  title: "Test",
  benchmark: "INDEX",
  symbols: ["AAA"],
  lookbackPeriods: 1,
  staleAfterDays: 7,
};
const csv =
  "date,symbol,close\n2026-10-01,AAA,100\n2026-10-02,AAA,110\n2026-10-01,INDEX,200\n2026-10-02,INDEX,210\n";
async function project(t) {
  const root = await mkdtemp(join(tmpdir(), "efin-test-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await writeFile(join(root, "dashboard.config.json"), JSON.stringify(config));
  const input = join(root, "input.csv");
  await writeFile(input, csv);
  return { root, input };
}
test("valid import persists provenance and repeating identical input does not write snapshot", async (t) => {
  const { root, input } = await project(t);
  const a = await importCSV(root, input, new Date("2026-10-03"));
  const before = await readFile(
    join(root, "data/private/current.json"),
    "utf8",
  );
  const b = await importCSV(root, input, new Date("2026-10-04"));
  assert.equal(a.changed, true);
  assert.equal(b.changed, false);
  assert.equal(
    before,
    await readFile(join(root, "data/private/current.json"), "utf8"),
  );
  assert.equal(a.source.type, "csv");
  assert.equal(a.dashboard.records[0].excessPct.toFixed(2), "5.00");
});
test("bad import retains prior snapshot exactly", async (t) => {
  const { root, input } = await project(t);
  await importCSV(root, input);
  const before = await readFile(
    join(root, "data/private/current.json"),
    "utf8",
  );
  await writeFile(input, "date,symbol,close\n2026-10-01,AAA,0");
  await assert.rejects(importCSV(root, input));
  assert.equal(
    before,
    await readFile(join(root, "data/private/current.json"), "utf8"),
  );
});
test("corrupt saved snapshot is not silently replaced by demo or unchanged hash", async (t) => {
  const { root, input } = await project(t);
  await importCSV(root, input);
  const path = join(root, "data/private/current.json");
  const s = JSON.parse(await readFile(path, "utf8"));
  s.rows = [{ date: "no", symbol: "AAA", close: 1 }];
  await writeFile(path, JSON.stringify(s));
  await assert.rejects(readSnapshot(root));
  await assert.rejects(importCSV(root, input));
});
test("config rejects symbols duplicated by case/whitespace normalization", async (t) => {
  const { root } = await project(t);
  await writeFile(
    join(root, "dashboard.config.json"),
    JSON.stringify({ ...config, symbols: ["AAA", " aaa "] }),
  );
  await assert.rejects(readConfig(root), /unique/);
});
test("insufficient imported history never replaces saved data", async (t) => {
  const { root, input } = await project(t);
  await importCSV(root, input);
  const before = await readFile(
    join(root, "data/private/current.json"),
    "utf8",
  );
  await writeFile(
    input,
    "date,symbol,close\n2026-10-02,AAA,110\n2026-10-02,INDEX,210",
  );
  await assert.rejects(importCSV(root, input), /No calculable/);
  assert.equal(
    before,
    await readFile(join(root, "data/private/current.json"), "utf8"),
  );
});
