# Verification record

Verified on 2026-10-19.

- Node.js 22.22.3: 28 automated tests passed.
- `npm run check`: JavaScript syntax, local Markdown links, config, sample pipeline and known token/personal-path patterns passed.
- `npm run doctor`: required files and Node version passed. Optional installed skills were detected without reading credentials.
- Actual Chromium browser: initial 3-asset demo, symbol selection, 5/21-period switching, return sorting, rejected CSV retaining previous results, stale-data state, API-error state, disabled export on error.
- Desktop 1440px and mobile 390px inspected; no horizontal document overflow or browser page errors.
- Import tests cover unchanged-input idempotence, invalid data preserving prior snapshot and corrupt snapshots failing explicitly.
- Formula example: 100 → 110 versus 200 → 210 gives 10% versus 5%, excess 5 percentage points.
- Human-readable documentation was independently reviewed against executable behavior; sample lookback and preview order were corrected.

Scope: synthetic data and the local CSV pipeline. Live Efin authentication/data access, a production API adapter, cloud deployment, exchange holidays, and scheduled jobs have not been implemented or verified.

The repository's CI independently reruns tests/checks on Node 22 and 24 after pushes. See its actual run status for remote results.

