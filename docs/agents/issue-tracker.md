# Local project tracker

Use Markdown under `.scratch/`; no remote account is needed. Small changes need
only a concise acceptance note, not a mandatory task graph.

## One effort, separate record types

- `.scratch/<effort>/spec.md`: agreed behavior, design, data assumptions and checks.
- `.scratch/<effort>/map.md`: outcome, accepted decisions, open choices, exclusions and next action.
- `decisions/NN-<slug>.md`: one concrete question; `Owner:`, `Blocked by:` and `Status: open | in-progress | resolved | out-of-scope`. Record the answer and evidence. Resolve blockers before dependent questions; claim before work and release abandoned claims.
- `tasks/NN-<slug>.md`: one complete user-visible slice; acceptance checks, `Blocked by:` and `Status: ready | in-progress | done | blocked`. Only work tasks whose blockers are done.
- `backlog/NN-<slug>.md`: incoming request, current and desired behavior, comments and the configured triage role as `Status:`. See [triage-labels.md](triage-labels.md). Triage status is separate from task execution status.

Paths above are relative to `.scratch/<effort>/`. Number within each record type.
Use relative record paths in `Blocked by:` to avoid ambiguous IDs. Decisions
marked out-of-scope do not automatically unblock dependent work: revise its
scope first. Keep prior comments and answers; append context instead of
restarting an interview. A user rejection may be recorded under `.scratch/<effort>/.out-of-scope/`
with the reason; already implemented behavior is not a rejection.

## Coordination

Read the referenced file to fetch a task. Update local files to record progress;
“publish to the tracker” means local persistence unless a remote is explicitly
configured and the action authorized. The coordinator owns shared statuses.
Pass absolute paths to the main workspace's ignored tracker files to worktree
agents; do not assume those files exist in another checkout. Work sequentially
when isolation is unavailable.

These files are private drafts ignored by Git. Verify the learner's destination
before any authorized remote action; never publish to the instructor template
by default. Preserve existing tracker choices when running setup-project.
