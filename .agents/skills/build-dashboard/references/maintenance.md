# Improve the existing dashboard within the requested scope

## A bug or a concrete change

Reproduce the issue and inspect relevant code/data before theorizing.
Create a behavioral regression check when appropriate, make the smallest
complete fix, and follow the main skill's review and preview loop. Do not
redesign unrelated screens or restart the whole interview.

## Organize a backlog

Read the configured local tracker first. For each item, distinguish missing
information, ready work, human-only work, already implemented behavior and
substantive rejection. Use the configured triage roles for backlog records.
“Already implemented” is not “the user rejected this feature”.
Read prior comments, answered questions and any local .scratch/<effort>/.out-of-scope/ records before
asking again. Before marking an item ready, record current behavior, desired
behavior and observable acceptance checks. Record a substantive rejection only
when the user actually rejects that scope; preserve the reason and context.

Ask only for unresolved scope decisions. Classify first when asked to organize;
do not start building every item. Execute approved ready items when the user
also asked to implement. Never post comments, close external issues or change
remote labels without existing authorization for that tracker and action.

## Review architecture

Inspect actual pain points: repeated changes scattered across files, unstable
interfaces, unclear responsibilities and hard-to-test behavior. Use design-code.
Show concrete candidates with evidence, a proposed simpler boundary, expected
benefit and relevant risks. When a comparison helps, create a local visual
report. A request to review produces findings; a request to improve authorizes
the selected scoped change, followed by tests and review.

## Improve how the Agent works

Use write-instructions and evidence from the requested/current session.
Distinguish navigation gaps, broken existing checks, missing automated checks
and unclear instructions. Prefer repairing or wiring an existing deterministic
check over accumulating broad rules. Rank useful improvements by impact.

Recommend changes when asked for a retrospective; implement only what the
request authorizes. Keep changes inside the project and preserve persona,
privacy, context routing and invocation policies. Do not edit global agent
configuration as part of a dashboard retrospective.
