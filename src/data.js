/** Dependency-free, browser-compatible CSV parsing and market-row validation. */
export const MAX_CSV_BYTES = 1024 * 1024;
const SYMBOL = /^[A-Z0-9][A-Z0-9._&-]{0,31}$/;
const NUMBER = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;

function fail(context, message) {
  throw new Error(`${context}: ${message}`);
}

function validDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  const [year, month, day] = value.split("-").map(Number);
  if (year < 1 || month < 1 || month > 12 || day < 1) return false;
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= days[month - 1];
}

function normalizeRow(row, context) {
  if (!row || typeof row !== "object" || Array.isArray(row))
    fail(context, "expected a row object");
  if (!validDate(row.date))
    fail(context, "date must be a real calendar date in YYYY-MM-DD format");
  const symbol =
    typeof row.symbol === "string" ? row.symbol.trim().toUpperCase() : "";
  if (!SYMBOL.test(symbol))
    fail(
      context,
      "symbol must contain 1–32 letters, digits, dots, underscores, ampersands or hyphens",
    );
  if (
    typeof row.close !== "number" ||
    !Number.isFinite(row.close) ||
    row.close <= 0
  ) {
    fail(context, "close must be a finite number greater than zero");
  }
  const result = { date: row.date, symbol, close: row.close };
  if (row.volume !== undefined) {
    if (
      typeof row.volume !== "number" ||
      !Number.isFinite(row.volume) ||
      row.volume < 0
    ) {
      fail(
        context,
        "volume must be a finite, non-negative number when supplied",
      );
    }
    result.volume = row.volume;
  }
  return result;
}

/** Return a new date/symbol-sorted array; reject invalid or duplicate observations. */
export function validateRows(rows) {
  if (!Array.isArray(rows) || rows.length === 0)
    throw new Error("Rows must be a non-empty array");
  const seen = new Map();
  const result = rows.map((row, index) => {
    const normalized = normalizeRow(row, `Row ${index + 1}`);
    const key = `${normalized.date}|${normalized.symbol}`;
    if (seen.has(key))
      fail(
        `Row ${index + 1}`,
        `duplicate date/symbol ${normalized.date} ${normalized.symbol} (first at row ${seen.get(key)})`,
      );
    seen.set(key, index + 1);
    return normalized;
  });
  return result.sort(
    (a, b) => a.date.localeCompare(b.date) || a.symbol.localeCompare(b.symbol),
  );
}

// A small CSV state machine: escaped quotes, quoted newlines, CRLF and BOM are
// supported. Syntax errors retain physical line numbers for classroom feedback.
function tokenize(text) {
  const records = [];
  let fields = [],
    field = "",
    state = "plain",
    line = 1,
    startLine = 1;
  function finishRecord() {
    fields.push(field);
    if (fields.length > 1 || fields.some((value) => value.trim() !== ""))
      records.push({ fields, line: startLine });
    fields = [];
    field = "";
    state = "plain";
  }
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const newline = char === "\r" || char === "\n";
    if (state === "quoted") {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else state = "closed";
      } else if (newline) {
        field += "\n";
        if (char === "\r" && text[i + 1] === "\n") i++;
        line++;
      } else field += char;
    } else if (newline) {
      finishRecord();
      if (char === "\r" && text[i + 1] === "\n") i++;
      line++;
      startLine = line;
    } else if (char === ",") {
      fields.push(field);
      field = "";
      state = "plain";
    } else if (state === "closed") {
      if (char !== " " && char !== "\t")
        fail(`Line ${line}`, "unexpected character after a closing quote");
    } else if (char === '"') {
      if (field !== "")
        fail(`Line ${line}`, "a quoted field must start with a quote");
      state = "quoted";
    } else field += char;
  }
  if (state === "quoted") fail(`Line ${startLine}`, "unclosed quoted field");
  finishRecord();
  return records;
}

function parseNumber(value, field, context, optional = false) {
  const trimmed = value.trim();
  if (!trimmed && optional) return undefined;
  if (!trimmed) fail(context, `${field} is required`);
  if (!NUMBER.test(trimmed))
    fail(
      context,
      `${field} must be a plain number without thousands separators`,
    );
  return Number(trimmed);
}

/**
 * Parse at most 1 MiB of UTF-8 CSV into validated rows.
 * Header is exactly date,symbol,close or date,symbol,close,volume in that order.
 * Empty optional volume cells are omitted. Prices are never filled or inferred.
 */
export function parseCSV(text) {
  if (typeof text !== "string") throw new Error("CSV input must be text");
  if (
    text.length > MAX_CSV_BYTES ||
    new TextEncoder().encode(text).byteLength > MAX_CSV_BYTES
  ) {
    throw new Error("CSV exceeds the 1 MiB input limit");
  }
  const records = tokenize(text.replace(/^\uFEFF/, ""));
  if (!records.length) throw new Error("CSV is empty");
  const header = records[0].fields.map((value) => value.trim());
  if (new Set(header).size !== header.length)
    fail(`Line ${records[0].line}`, "duplicate column headers");
  const expected =
    header.length === 4
      ? ["date", "symbol", "close", "volume"]
      : ["date", "symbol", "close"];
  if (
    header.length !== expected.length ||
    header.some((value, index) => value !== expected[index])
  ) {
    fail(
      `Line ${records[0].line}`,
      "expected header date,symbol,close with optional final volume column",
    );
  }
  if (records.length === 1)
    throw new Error("CSV contains a header but no observations");
  const seen = new Map();
  const rows = records.slice(1).map((record) => {
    const context = `Line ${record.line}`;
    if (record.fields.length !== header.length)
      fail(
        context,
        `expected ${header.length} fields, found ${record.fields.length}`,
      );
    const [date, symbol, close, volume] = record.fields;
    const row = normalizeRow(
      {
        date: date.trim(),
        symbol,
        close: parseNumber(close, "close", context),
        ...(volume === undefined
          ? {}
          : { volume: parseNumber(volume, "volume", context, true) }),
      },
      context,
    );
    const key = `${row.date}|${row.symbol}`;
    if (seen.has(key))
      fail(
        context,
        `duplicate date/symbol ${row.date} ${row.symbol} (first at line ${seen.get(key)})`,
      );
    seen.set(key, record.line);
    return row;
  });
  return rows.sort(
    (a, b) => a.date.localeCompare(b.date) || a.symbol.localeCompare(b.symbol),
  );
}
