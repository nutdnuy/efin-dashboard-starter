# ADR 0001: Keep course context in the project

- Status: Accepted for the starter
- Date: 2026-10-19

## Context

Learners may already have Matt Pocock Skills installed, including older copies with a `mattpocock-` prefix. The course needs consistent Thai stock terminology, data validation, formulas, and verification without editing each upstream skill or requiring a particular agent application.

The starter must also be useful before an agent is connected. A learner should be able to open a synthetic example, inspect calculations, and import a CSV using only Node.js.

## Decision

Keep shared engineering methods external and unchanged. Store the course-specific contract in the repository: root `AGENTS.md`, a learner brief, `dashboard.config.json`, the data contract, and acceptance checklist.

Use discovered installed skill names and their actual invocation policies. A routing document may recommend skills to a human; it does not authorize implicit invocation of upstream user-invoked skills. Do not install, duplicate, upgrade, or rewrite skills as a side effect of opening this project.

Provide a dependency-free local demonstration and deterministic CSV import/refresh. Keep real inputs and persisted imported data private by default. Expose a small configuration surface for the title, symbols, benchmark, lookback, and staleness threshold.

Build a working manual data path before adding a provider adapter or scheduler. Neither live Efin access nor recurring jobs are included by default.

## Consequences

- A course requirement changes in one project document or config rather than many skills.
- Existing skills remain usable and can be updated independently of the dashboard.
- The learner can run the demo without installing skills, dependencies, or model credentials.
- Different skill versions require discovery and a compatibility check; a prefix mapping alone is not proof of equivalent behavior.
- Live data retrieval, market calendar handling, deployment, and scheduling need separate implementation and verification when requested.

## Alternatives considered

**Fork every skill for the course:** rejected because the same context would be duplicated and diverge during updates.

**Vendor a large preconfigured agent framework:** rejected for this initial class because it increases setup and hides which component performs each action.

**Only provide a prompt:** insufficient because learners need runnable code, data examples, and observable checks.

## References

- [Matt Pocock Skills](https://github.com/mattpocock/skills): composable engineering methods and explicit invocation boundaries.
- [LLM Wiki Starter](https://github.com/Migchw/llm-wiki-starter): onboarding, source-of-truth separation, templates, and a runnable local dashboard in one repository.

These references informed the structure. This starter does not copy their implementation or skill files.
