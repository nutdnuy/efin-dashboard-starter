---
name: build-dashboard
description: Build or refine an investment dashboard from the learner's conversation, including scope, planning, tasks, implementation, testing and review; also handle explicitly requested planning or maintenance.
disable-model-invocation: true
---

# Build and improve a dashboard

One invocation carries the requested work through its routine phases.
Do the work inside this skill; do not ask the learner to invoke separate
planning, specification, ticketing or implementation commands.

Read AGENTS.md, BRIEF.md, the user's latest request and relevant existing files.
Preserve their choices, current branch and uncommitted work. Match their language.

## Pick the needed path

- **Build or change:** use the working loop below. Small changes need no task tree.
- **A consequential unknown:** read [planning.md](references/planning.md).
- **Many dependent changes or work spanning sessions:** read
  [large-builds.md](references/large-builds.md).
- **Bugs, backlog decisions, architecture or workflow review:** read
  [maintenance.md](references/maintenance.md).

Load only the relevant reference. A request to “plan only”, “review” or “suggest”
does not authorize implementation. A request to build already authorizes routine
local planning, edits and checks; do not stop for a confirmation at each phase.
Ask only about a missing choice that materially changes the result. Never
infer a user's answer, visual approval or satisfaction.

## Working loop

1. **Capture the agreed outcome.** Reuse the conversation, selected preview and
   brief. Write a compact local spec in .scratch/<feature>/spec.md if one would
   help: purpose, behavior, chosen design, data assumptions, acceptance checks,
   and what is outside this version. For a tiny fix, concise acceptance notes
   in the current task suffice. Do not restart an interview or generate an
   exhaustive form.
2. **Choose the next complete slice.** Deliver something the learner can try.
   Use the simplest suitable approach based on constraints and existing code.
   Resolve technical facts yourself; ask the learner only for real choices.
   Record a baseline and changed files for later review. For ZIP/no Git,
   continue locally and disclose Git-only limits; never invent identity.
3. **Build and check.** Use test-first for meaningful behavior, design-code
   when an interface needs a design decision, and find-information for missing
   source facts. Derive routine test boundaries from accepted behavior; do not
   require the learner to approve test internals already implied by the task.
   Work one behavior at a time. Preserve existing checks; run those appropriate
   to the change, then the relevant full suite once.
4. **Review the actual work.** Use review-code against the accepted behavior
   and project standards. Include staged, unstaged and new files, not just
   commits since the baseline. Fix material findings. No subagent availability
   is required: separate Standards and Spec passes in this session are a valid
   fallback, reported honestly.
5. **Open the result.** Inspect the real UI and intended interactions, including
   narrow screens when relevant. Check data provenance/dates, empty/error states
   and an important investment value independently. Use labeled synthetic data
   if real access is not available. Give the actual preview URL/file and record
   verified start instructions in APP.md. Never invent a running URL.
6. **Refine from feedback.** Apply requested changes to the same project, update
   affected decisions and recheck affected behavior. Stop to receive feedback
   when a real human choice is needed; do not simulate it. End each delivered
   iteration with what is ready, how to open it, and any material remaining gap.

## Helpers and boundaries

Helpers are ask-questions, define-terms, design-code, test-first, review-code,
preview-dashboard, find-information and write-instructions. Read the selected
local SKILL.md if the harness cannot discover it; never pretend a tool exists.

Keep specs and private data local under the configured tracker/data locations.
Do not publish, message others, enable schedules, place trades, change global
skills, reset existing checkouts, or discard user work as a side effect.
Preserve existing authorization for external work, and verify its actual target.
Make a focused local commit only when authorized and Git is configured; its
absence must not prevent showing a working result.
