import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { MAX_CSV_BYTES, parseCSV, validateRows } from "../src/data.js";

test("quoted BOM/CRLF input is normalized, sorted and retains optional volume", () => {
  assert.deepEqual(
    parseCSV(
      '\uFEFFdate,symbol,close,volume\r\n"2026-10-16","ptt","34.50",123\r\n2026-10-15,ADVANC,300,\r\n',
    ),
    [
      { date: "2026-10-15", symbol: "ADVANC", close: 300 },
      { date: "2026-10-16", symbol: "PTT", close: 34.5, volume: 123 },
    ],
  );
});

test("strict headers reject duplicate, reordered, unexpected and missing columns", () => {
  for (const header of [
    "date,symbol,close,close",
    "symbol,date,close",
    "date,symbol,price",
    "date,symbol,close,volume,extra",
    "date,symbol",
  ]) {
    assert.throws(
      () => parseCSV(`${header}\n2026-10-16,PTT,30`),
      /Line 1:.*(header|column)/,
    );
  }
});

test("missing or extra cells report physical line numbers", () => {
  for (const row of [
    "2026-10-16,PTT",
    "2026-10-16,PTT,30,5",
    "2026-10-16,,30",
    "2026-10-16,PTT,",
    ",,",
  ]) {
    assert.throws(() => parseCSV(`date,symbol,close\r\n\r\n${row}`), /Line 3:/);
  }
});

test("impossible dates and non-ISO dates are rejected; leap-year dates work", () => {
  for (const date of [
    "2026-02-29",
    "1900-02-29",
    "2026-04-31",
    "2026-13-01",
    "2026-00-01",
    "0000-01-01",
    "26-10-16",
    "2026-1-01",
    "2026-10-16T00:00:00Z",
  ]) {
    assert.throws(
      () => parseCSV(`date,symbol,close\n${date},PTT,10`),
      /real calendar date/,
    );
  }
  assert.equal(
    parseCSV("date,symbol,close\n2000-02-29,PTT,10")[0].date,
    "2000-02-29",
  );
});

test("duplicate date/symbol observations are rejected after normalization", () => {
  assert.throws(
    () => parseCSV("date,symbol,close\n2026-10-16,PTT,10\n2026-10-16, ptt ,11"),
    /Line 3: duplicate.*first at line 2/,
  );
  assert.throws(
    () =>
      validateRows([
        { date: "2026-10-16", symbol: "PTT", close: 10 },
        { date: "2026-10-16", symbol: "ptt", close: 10 },
      ]),
    /Row 2: duplicate/,
  );
});

test("invalid prices, unsafe symbols and negative volumes cannot enter the data layer", () => {
  for (const close of [
    "0",
    "-5",
    "NaN",
    "Infinity",
    "1e999",
    "0x10",
    '"1,000"',
    "",
  ]) {
    assert.throws(
      () => parseCSV(`date,symbol,close\n2026-10-16,PTT,${close}`),
      /Line 2: close/,
    );
  }
  for (const symbol of [
    "<img src=x onerror=alert(1)>",
    "A/B",
    "=1+1",
    "A".repeat(33),
  ]) {
    assert.throws(
      () => parseCSV(`date,symbol,close\n2026-10-16,${symbol},10`),
      /Line 2: symbol/,
    );
  }
  assert.throws(
    () => parseCSV("date,symbol,close,volume\n2026-10-16,PTT,10,-1"),
    /volume/,
  );
  assert.throws(
    () =>
      validateRows([{ date: "2026-10-16", symbol: "PTT", close: Infinity }]),
    /finite/,
  );
  assert.throws(
    () => validateRows([{ date: "2026-10-16", symbol: "PTT", close: "10" }]),
    /finite/,
  );
});

test("CSV quote errors are explicit; escaped quotes are parsed before validation", () => {
  assert.throws(
    () => parseCSV('date,symbol,close\n2026-10-16,"PTT,10'),
    /Line 2: unclosed/,
  );
  assert.throws(
    () => parseCSV('date,symbol,close\n2026-10-16,P"TT,10'),
    /Line 2: a quoted field/,
  );
  assert.throws(
    () => parseCSV('date,symbol,close\n2026-10-16,"PTT"oops,10'),
    /Line 2: unexpected character/,
  );
  assert.throws(
    () => parseCSV('date,symbol,close\n2026-10-16,"PT""T",10'),
    /Line 2: symbol/,
  );
});

test("empty input and UTF-8 input over 1 MiB are rejected", () => {
  assert.throws(() => parseCSV(" \r\n"), /empty/);
  assert.throws(() => parseCSV("date,symbol,close\n"), /no observations/);
  assert.throws(() => parseCSV("x".repeat(MAX_CSV_BYTES + 1)), /1 MiB/);
  assert.throws(
    () => parseCSV("ก".repeat(Math.ceil(MAX_CSV_BYTES / 3))),
    /1 MiB/,
  );
  assert.throws(() => parseCSV(null), /must be text/);
});

test("validation returns new rows sorted without mutating caller data", () => {
  const input = [
    { date: "2026-10-16", symbol: "ptt", close: 31 },
    { date: "2026-10-15", symbol: "PTT", close: 30 },
  ];
  const result = validateRows(input);
  assert.equal(result[0].date, "2026-10-15");
  assert.equal(result[1].symbol, "PTT");
  assert.equal(input[0].symbol, "ptt");
  assert.notEqual(input[0], result[1]);
});

test("sample fixture is explicitly synthetic and its provenance matches the file", async () => {
  const csv = await readFile(
    new URL("../data/sample/prices.csv", import.meta.url),
    "utf8",
  );
  const provenance = JSON.parse(
    await readFile(
      new URL("../data/sample/provenance.json", import.meta.url),
      "utf8",
    ),
  );
  const rows = parseCSV(csv);
  assert.equal(rows.length, 360);
  assert.deepEqual([...new Set(rows.map((row) => row.symbol))].sort(), [
    "DEMO_BANK",
    "DEMO_ENERGY",
    "DEMO_SET",
    "DEMO_TECH",
  ]);
  assert.equal(rows.at(-1).date, "2026-10-16");
  assert.equal(provenance.synthetic, true);
  assert.equal(provenance.rowCount, rows.length);
  assert.equal(
    provenance.sha256,
    createHash("sha256").update(csv).digest("hex"),
  );
  assert.match(provenance.description, /not.*Efin|not.*market/i);
  for (const symbol of provenance.symbols)
    assert.equal(rows.filter((row) => row.symbol === symbol).length, 90);
});
