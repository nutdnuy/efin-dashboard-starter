---
name: dashboard-class
description: Guide a learner through this repository's Efin dashboard exercise, from a working offline sample through one verified customization. Use when the learner asks to run this class workflow.
disable-model-invocation: true
---

# Dashboard class workflow

Read AGENTS.md and BRIEF.md from the project root. This is a thin course workflow, not a fork of Matt Pocock's skills.

1. Establish the requested output and current data mode. Use the default synthetic sample unless the user supplies authorized data. Run npm run doctor and npm test.
2. Open the dashboard with npm start. Verify one synthetic asset against the formula in src/metrics.js before changing the interface.
3. Translate the user's goal into a small scope in BRIEF.md. Use existing model-invocable engineering skills when suitable. Never chain to a user-only skill without explicit human invocation.
4. Implement one end-to-end change. If importing data, follow docs/data-contract.md and keep the previous valid snapshot on failure. Read actual Efin tool definitions before requesting data; do not assume a backend connection from agent authentication.
5. Run the acceptance checklist. Show the working result, evidence and any gap. For scheduling, prepare and test the refresh command first; enable a real recurring task only on explicit request.

If optional skills are unavailable, complete the exercise through project instructions. Do not install or edit global skills as a prerequisite.
