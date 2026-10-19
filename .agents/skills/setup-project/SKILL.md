---
name: setup-project
description: Configure where this dashboard project keeps tasks, decisions, glossary and project rules when the learner explicitly wants to set up or change those conventions.
disable-model-invocation: true
---

# Set up the project

Inspect AGENTS.md, the current tracker/docs and the existing Git remote first.
This class already uses local Markdown; preserve working defaults unless the
learner wants a change. Opening the starter does not require running setup again.

Keep configuration in docs/agents/issue-tracker.md, triage-labels.md and domain.md,
with one Agent skills section in AGENTS.md. Update the existing section rather
than duplicating it in multiple instruction files. Project pointers CLAUDE.md and
GEMINI.md should continue to defer to AGENTS.md.

- Local work: [issue-tracker-local.md](issue-tracker-local.md) separates specs,
  decisions and implementation tasks.
- An explicitly selected remote tracker: use the relevant
  [GitHub](issue-tracker-github.md) or [GitLab](issue-tracker-gitlab.md) template
  as a starting point, verify the student's destination and existing access.
- Use [triage-labels.md](triage-labels.md) for backlog roles and
  [domain.md](domain.md) for glossary/decision conventions.

Ask only about an unresolved consequential choice (for example whether work
should be private locally or published to a tracker). Once agreed, write the
configuration and verify links. Do not require another confirmation for routine
local setup already requested. Creating remote labels, issues, or credentials
requires the user's authorization for that action; never target the instructor's
template by default.

Leave global skills, credentials and unrelated tool settings alone.
