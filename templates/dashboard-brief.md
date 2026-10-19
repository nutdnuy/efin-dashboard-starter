# Dashboard brief

Copy this template into a project document and fill in the blanks before asking an agent to build a change. Keep private data and credentials out of public documents.

## Goal

- Who will use this dashboard?
- What question should it help them answer?
- What is the smallest useful change for this exercise?

## Data

- Mode: synthetic demo / private CSV / separately implemented provider
- Source and permission to use it:
- Input file or documented tool:
- Symbols:
- Benchmark:
- Date range and frequency:
- Price basis: adjusted / unadjusted / unknown
- Expected latest observation date:
- Missing data that must be addressed:

## Display

- Dashboard title:
- Main chart/table:
- Lookback periods:
- Staleness threshold:
- Target screen: classroom desktop / laptop / mobile
- Language and units:

## Behavior

- One interaction to implement:
- What should happen with invalid input?
- What should happen when a stock lacks the benchmark's latest date?
- What should happen when there is insufficient aligned history?

## Acceptance

- A visible before/after difference:
- One calculation to verify independently:
- Commands/checks to run:
- Evidence to show on completion:
- Explicitly out of scope:

## Agent request

```text
Read the root AGENTS.md, this brief, and docs/data-contract.md.
Inspect the existing implementation and installed skills before acting.
Implement the smallest change that meets this brief.
Respect each skill's invocation policy; do not edit upstream skill files.
Use the existing validation and calculation boundaries.
Run the relevant checks and report actual results and remaining gaps.
```
