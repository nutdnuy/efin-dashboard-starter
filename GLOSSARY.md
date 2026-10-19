# Shared terms

- **Source**: Original CSV or provider response; not the chart cache.
- **Snapshot**: Validated rows plus provenance saved locally after an import.
- **Benchmark**: Comparison series. Demo uses DEMO_SET; live work may use SET after its source is verified.
- **As-of**: Latest usable benchmark date, not the time the page was opened.
- **Lookback period**: One aligned observed date shared by stock and benchmark, not one calendar day.
- **Rebased performance**: `100 × close / first close` within the aligned lookback window.
- **Excess return**: Stock return minus benchmark return, in percentage points (pp).
- **Stale**: As-of exceeds the configured calendar-day age threshold. This is not an exchange holiday calendar.
- **Partial**: One or more requested symbols cannot be calculated at the common anchor.
- **Demo**: Deterministic synthetic data, never current market data.
- **Skill**: Reusable agent instructions. It neither grants data access nor installs credentials.
