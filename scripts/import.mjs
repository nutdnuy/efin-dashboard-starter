import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { importCSV } from "../src/snapshot.js";
const root = fileURLToPath(new URL("../", import.meta.url));
const input = process.argv[2];
if (!input) {
  console.error("Usage: npm run import -- /path/prices.csv");
  process.exitCode = 1;
} else
  try {
    const r = await importCSV(root, resolve(input));
    console.log(
      JSON.stringify(
        {
          changed: r.changed,
          source: r.source.label,
          asOf: r.dashboard.asOf,
          status: r.dashboard.status,
          calculated: r.dashboard.records.length,
          warnings: r.dashboard.warnings,
        },
        null,
        2,
      ),
    );
  } catch (e) {
    console.error("Import rejected; previous snapshot retained. " + e.message);
    process.exitCode = 1;
  }
