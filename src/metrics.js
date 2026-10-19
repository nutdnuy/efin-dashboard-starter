import { validateRows } from "./data.js";

const DAY_MS = 86_400_000;

function symbolOption(value, name) {
  if (
    typeof value !== "string" ||
    !/^[A-Z0-9][A-Z0-9._&-]{0,31}$/i.test(value.trim())
  ) {
    throw new Error(`${name} must be a valid symbol`);
  }
  return value.trim().toUpperCase();
}

/**
 * Build comparable price-return records without forward filling.
 *
 * Return shape:
 * { asOf: ISO date|null, status: 'fresh'|'stale'|'partial', warnings: string[],
 *   benchmark: string, lookbackPeriods: number,
 *   records: [{symbol, asOf, close, returnPct, benchmarkReturnPct, excessPct,
 *     series: [{date, value, benchmarkValue}], observations: number}],
 *   missingSymbols: string[], skippedSymbols: string[] }
 *
 * asOf is the latest benchmark date not beyond now's UTC calendar date. Every
 * record must include this same anchor date. Its window contains the final
 * lookbackPeriods + 1 exact common observations with the benchmark, so periods
 * mean observations rather than calendar days. Each series starts at 100.
 * Price returns exclude dividends and fees; excessPct is the difference in
 * simple price returns in percentage points, not a proprietary rotation score.
 * status is stale when the anchor exceeds staleAfterDays (calendar days), else
 * partial if any requested symbol was missing/skipped or future rows excluded.
 * With no usable benchmark the result is partial with asOf null and no records.
 */
export function buildDashboard(rows, options = {}, now = new Date()) {
  const benchmark = symbolOption(options.benchmark, "benchmark");
  const lookbackPeriods = options.lookbackPeriods ?? 20;
  const staleAfterDays = options.staleAfterDays ?? 7;
  if (
    !Number.isInteger(lookbackPeriods) ||
    lookbackPeriods < 1 ||
    lookbackPeriods > 10_000
  ) {
    throw new Error("lookbackPeriods must be an integer between 1 and 10000");
  }
  if (
    typeof staleAfterDays !== "number" ||
    !Number.isFinite(staleAfterDays) ||
    staleAfterDays < 0
  ) {
    throw new Error("staleAfterDays must be a finite, non-negative number");
  }
  if (!(now instanceof Date) || !Number.isFinite(now.getTime()))
    throw new Error("now must be a valid Date");
  const validRows = validateRows(rows);
  let symbols;
  if (options.symbols !== undefined) {
    if (!Array.isArray(options.symbols))
      throw new Error("symbols must be an array");
    symbols = [
      ...new Set(
        options.symbols.map((value) => symbolOption(value, "symbols entry")),
      ),
    ];
    if (symbols.includes(benchmark))
      throw new Error("symbols must not include the benchmark");
  } else
    symbols = [...new Set(validRows.map((row) => row.symbol))].filter(
      (symbol) => symbol !== benchmark,
    );

  const today = now.toISOString().slice(0, 10);
  const usableRows = validRows.filter((row) => row.date <= today);
  const warnings = [];
  const futureCount = validRows.length - usableRows.length;
  if (futureCount)
    warnings.push(
      `Ignored ${futureCount} future-dated observation(s) after ${today}.`,
    );
  const bySymbol = new Map();
  for (const row of usableRows) {
    if (!bySymbol.has(row.symbol)) bySymbol.set(row.symbol, new Map());
    bySymbol.get(row.symbol).set(row.date, row.close);
  }
  const benchmarkRows = bySymbol.get(benchmark);
  const missingSymbols = symbols.filter((symbol) => !bySymbol.has(symbol));
  for (const symbol of missingSymbols)
    warnings.push(`${symbol}: no observations on or before ${today}.`);
  const result = {
    asOf: null,
    status: "partial",
    warnings,
    benchmark,
    lookbackPeriods,
    records: [],
    missingSymbols,
    skippedSymbols: [],
  };
  if (!benchmarkRows?.size) {
    warnings.push(
      `${benchmark}: benchmark has no observations on or before ${today}.`,
    );
    result.skippedSymbols = symbols.filter(
      (symbol) => !missingSymbols.includes(symbol),
    );
    return result;
  }
  const benchmarkDates = [...benchmarkRows.keys()].sort();
  const anchor = benchmarkDates.at(-1);
  result.asOf = anchor;
  const ageDays = Math.floor(
    (Date.parse(`${today}T00:00:00Z`) - Date.parse(`${anchor}T00:00:00Z`)) /
      DAY_MS,
  );
  const stale = ageDays > staleAfterDays;
  if (stale)
    warnings.push(
      `Benchmark data is ${ageDays} calendar days old (limit ${staleAfterDays}); as of ${anchor}.`,
    );

  for (const symbol of symbols) {
    const prices = bySymbol.get(symbol);
    if (!prices) continue;
    const skip = (message) => {
      result.skippedSymbols.push(symbol);
      warnings.push(`${symbol}: ${message}`);
    };
    if (!prices.has(anchor)) {
      skip(
        `missing the benchmark anchor date ${anchor}; asynchronous dates are not compared.`,
      );
      continue;
    }
    const commonDates = benchmarkDates.filter((date) => prices.has(date));
    const needed = lookbackPeriods + 1;
    if (commonDates.length < needed) {
      skip(
        `needs ${needed} common observations, found ${commonDates.length}; no prices were filled.`,
      );
      continue;
    }
    const dates = commonDates.slice(-needed);
    const base = prices.get(dates[0]);
    const benchmarkBase = benchmarkRows.get(dates[0]);
    const series = dates.map((date) => ({
      date,
      value: (prices.get(date) / base) * 100,
      benchmarkValue: (benchmarkRows.get(date) / benchmarkBase) * 100,
    }));
    const returnPct = (prices.get(anchor) / base - 1) * 100;
    const benchmarkReturnPct =
      (benchmarkRows.get(anchor) / benchmarkBase - 1) * 100;
    const excessPct = returnPct - benchmarkReturnPct;
    if (
      ![
        returnPct,
        benchmarkReturnPct,
        excessPct,
        ...series.flatMap((point) => [point.value, point.benchmarkValue]),
      ].every(Number.isFinite)
    ) {
      skip(
        "price ratios exceeded the finite numeric range; no metric was produced.",
      );
      continue;
    }
    result.records.push({
      symbol,
      asOf: anchor,
      close: prices.get(anchor),
      returnPct,
      benchmarkReturnPct,
      excessPct,
      series,
      observations: dates.length,
    });
  }
  if (!symbols.length) warnings.push("No non-benchmark symbols were selected.");
  const partial =
    missingSymbols.length > 0 ||
    result.skippedSymbols.length > 0 ||
    futureCount > 0 ||
    !symbols.length;
  result.status = stale ? "stale" : partial ? "partial" : "fresh";
  return result;
}
