import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { parseCSV } from "../src/data.js";
import { buildDashboard } from "../src/metrics.js";

const NOW = new Date("2026-10-19T05:00:00Z");
const options = {
  benchmark: "SET",
  symbols: ["AAA"],
  lookbackPeriods: 2,
  staleAfterDays: 7,
};
const rows = [
  { date: "2026-10-14", symbol: "SET", close: 100 },
  { date: "2026-10-15", symbol: "SET", close: 105 },
  { date: "2026-10-16", symbol: "SET", close: 110 },
  { date: "2026-10-14", symbol: "AAA", close: 50 },
  { date: "2026-10-15", symbol: "AAA", close: 55 },
  { date: "2026-10-16", symbol: "AAA", close: 60 },
];
const approx = (actual, expected) =>
  assert.ok(Math.abs(actual - expected) < 1e-10, `${actual} != ${expected}`);

test("returns and chart values use price return and percentage-point excess", () => {
  const dashboard = buildDashboard(rows, options, NOW);
  assert.equal(dashboard.status, "fresh");
  assert.equal(dashboard.asOf, "2026-10-16");
  assert.deepEqual(dashboard.warnings, []);
  assert.deepEqual(dashboard.missingSymbols, []);
  assert.deepEqual(dashboard.skippedSymbols, []);
  const record = dashboard.records[0];
  approx(record.returnPct, 20);
  approx(record.benchmarkReturnPct, 10);
  approx(record.excessPct, 10);
  assert.equal(record.close, 60);
  assert.equal(record.observations, 3);
  assert.equal(record.asOf, dashboard.asOf);
  assert.deepEqual(record.series[0], {
    date: "2026-10-14",
    value: 100,
    benchmarkValue: 100,
  });
  approx(record.series.at(-1).value, 120);
  approx(record.series.at(-1).benchmarkValue, 110);
});

test("only exact common dates are used; gaps are not forward-filled", () => {
  const extra = [
    { date: "2026-10-13", symbol: "AAA", close: 40 },
    { date: "2026-10-13", symbol: "SET", close: 80 },
  ];
  const sparse = rows.filter(
    (row) => !(row.symbol === "AAA" && row.date === "2026-10-15"),
  );
  const record = buildDashboard([...extra, ...sparse], options, NOW).records[0];
  assert.deepEqual(
    record.series.map((point) => point.date),
    ["2026-10-13", "2026-10-14", "2026-10-16"],
  );
  approx(record.returnPct, 50);
  approx(record.benchmarkReturnPct, 37.5);
  const insufficient = buildDashboard(sparse, options, NOW);
  assert.equal(insufficient.status, "partial");
  assert.deepEqual(insufficient.records, []);
  assert.deepEqual(insufficient.skippedSymbols, ["AAA"]);
  assert.match(
    insufficient.warnings.join(" "),
    /needs 3 common observations, found 2/,
  );
});

test("every asset must have the latest benchmark anchor, never an asynchronous return", () => {
  const oldAsset = rows.filter(
    (row) => !(row.symbol === "AAA" && row.date === "2026-10-16"),
  );
  const dashboard = buildDashboard(
    oldAsset,
    { ...options, lookbackPeriods: 1 },
    NOW,
  );
  assert.equal(dashboard.asOf, "2026-10-16");
  assert.equal(dashboard.status, "partial");
  assert.deepEqual(dashboard.records, []);
  assert.deepEqual(dashboard.skippedSymbols, ["AAA"]);
  assert.match(dashboard.warnings.join(" "), /anchor date 2026-10-16/);
});

test("asset-only dates after benchmark anchor cannot leak into its metric", () => {
  const dashboard = buildDashboard(
    [...rows, { date: "2026-10-19", symbol: "AAA", close: 999 }],
    options,
    NOW,
  );
  assert.equal(dashboard.records[0].close, 60);
  assert.equal(dashboard.records[0].series.at(-1).date, "2026-10-16");
});

test("future observations are excluded from anchor, prices and series", () => {
  const dashboard = buildDashboard(
    [
      ...rows,
      { date: "2026-10-20", symbol: "SET", close: 900 },
      { date: "2026-10-20", symbol: "AAA", close: 999 },
    ],
    options,
    NOW,
  );
  assert.equal(dashboard.status, "partial");
  assert.equal(dashboard.asOf, "2026-10-16");
  assert.equal(dashboard.records[0].close, 60);
  assert.ok(
    dashboard.records[0].series.every((point) => point.date <= "2026-10-19"),
  );
  assert.match(dashboard.warnings.join(" "), /Ignored 2 future-dated/);
});

test("staleness uses calendar-day gap, includes a clear warning and wins over partial", () => {
  const atLimit = buildDashboard(
    rows,
    options,
    new Date("2026-10-23T23:59:59Z"),
  );
  assert.equal(atLimit.status, "fresh");
  const old = buildDashboard(
    rows,
    { ...options, symbols: ["AAA", "MISSING"] },
    new Date("2026-10-24T00:00:00Z"),
  );
  assert.equal(old.status, "stale");
  assert.match(old.warnings.join(" "), /8 calendar days old/);
  assert.deepEqual(old.missingSymbols, ["MISSING"]);
  assert.equal(old.records.length, 1);
});

test("missing symbols and benchmark yield explicit incomplete data, not zero returns", () => {
  const missing = buildDashboard(
    rows,
    { ...options, symbols: ["AAA", "ZZZ"] },
    NOW,
  );
  assert.deepEqual(missing.missingSymbols, ["ZZZ"]);
  assert.equal(missing.records.length, 1);
  const noBenchmark = buildDashboard(
    rows.filter((row) => row.symbol !== "SET"),
    options,
    NOW,
  );
  assert.equal(noBenchmark.asOf, null);
  assert.equal(noBenchmark.status, "partial");
  assert.deepEqual(noBenchmark.records, []);
  assert.deepEqual(noBenchmark.skippedSymbols, ["AAA"]);
  assert.match(noBenchmark.warnings.join(" "), /benchmark has no observations/);
});

test("non-finite calculated ratios are skipped rather than rendered as numbers", () => {
  const extreme = rows.map((row) =>
    row.symbol === "AAA" && row.date === "2026-10-14"
      ? { ...row, close: Number.MIN_VALUE }
      : row,
  );
  const dashboard = buildDashboard(extreme, options, NOW);
  assert.deepEqual(dashboard.records, []);
  assert.deepEqual(dashboard.skippedSymbols, ["AAA"]);
  assert.match(dashboard.warnings.join(" "), /finite numeric range/);
});

test("invalid input and invalid options fail before producing a dashboard", () => {
  assert.throws(
    () => buildDashboard([...rows, rows[0]], options, NOW),
    /duplicate/,
  );
  for (const lookbackPeriods of [0, -1, 1.5, NaN, Infinity, "2"]) {
    assert.throws(
      () => buildDashboard(rows, { ...options, lookbackPeriods }, NOW),
      /lookbackPeriods/,
    );
  }
  for (const staleAfterDays of [-1, NaN, Infinity, "7"]) {
    assert.throws(
      () => buildDashboard(rows, { ...options, staleAfterDays }, NOW),
      /staleAfterDays/,
    );
  }
  assert.throws(() => buildDashboard(rows, {}, NOW), /benchmark/);
  assert.throws(
    () => buildDashboard(rows, { ...options, symbols: "AAA" }, NOW),
    /symbols must be an array/,
  );
  assert.throws(
    () => buildDashboard(rows, { ...options, symbols: ["SET"] }, NOW),
    /must not include the benchmark/,
  );
  assert.throws(
    () => buildDashboard(rows, options, new Date("invalid")),
    /valid Date/,
  );
});

test("sample supports the configured 21-period window with a deterministic as-of date", async () => {
  const csv = await readFile(
    new URL("../data/sample/prices.csv", import.meta.url),
    "utf8",
  );
  const dashboard = buildDashboard(
    parseCSV(csv),
    {
      benchmark: "DEMO_SET",
      symbols: ["DEMO_BANK", "DEMO_ENERGY", "DEMO_TECH"],
      lookbackPeriods: 21,
      staleAfterDays: 7,
    },
    NOW,
  );
  assert.equal(dashboard.status, "fresh");
  assert.equal(dashboard.asOf, "2026-10-16");
  assert.equal(dashboard.records.length, 3);
  assert.ok(
    dashboard.records.every(
      (record) => record.observations === 22 && record.series.length === 22,
    ),
  );
  assert.deepEqual(dashboard.warnings, []);
});
