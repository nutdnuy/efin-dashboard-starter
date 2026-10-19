# Investment Dashboard — conversation-first project

## Outcome

Help the learner turn an investment question into a dashboard they like and can use. Begin with their needs, show something concrete, build the chosen direction, and refine it from their feedback. The starter ships methods and project context; the learner's application is created during the conversation.

Read START.md and BRIEF.md first. Reply in the learner's language. Use everyday investing language and explain technical choices through their effect on the dashboard.

## Conversation and delivery

1. Establish what decision the dashboard should help with, who uses it, and what matters most. Discover assets, metrics, data access, update frequency, device and visual preferences as they become relevant. Do not turn an unmade choice into a fixed requirement.
2. Record confirmed needs, open questions and accepted choices in BRIEF.md. Add shared vocabulary to GLOSSARY.md when useful, and consequential decisions to docs/adr/. These are the agent's notes; the learner need not fill in forms.
3. When appearance is uncertain, offer a small number of distinct directions. If the learner wants to see them, use the bundled preview-dashboard skill to make a runnable preview. Label synthetic values. Follow its capture rules and record the selected direction.
4. Before implementation, restate the chosen outcome and how the learner can tell it works. When the learner invokes build-dashboard, including by ordinary language, carry its routine planning, specification, implementation, testing and review phases in one continuous workflow. Do not require another command or phase confirmation for already authorized work. Planning-only and review-only requests preserve that scope.
5. Build a small complete version after the learner asks to build. Select the simplest suitable technology from their constraints and any existing code. Set up and run the project for them when tools permit. Provide its actual preview URL/file and exact run instructions in APP.md, once they exist.
6. Show the result, collect concrete feedback, and iterate. A change such as “less crowded”, “make the portfolio clearer” or “use a light theme” is work to perform, not a reason to restart the interview. Reopen only affected decisions.
7. Completion means the requested behavior works, the learner can open it, important numbers and states have been checked, and the learner has accepted the current version. Report unresolved gaps honestly. Do not claim satisfaction on the learner's behalf.

No framework, watchlist, chart type, return formula, data provider, update schedule or theme is preselected. “Investment dashboard” may mean a portfolio, watchlist, screener, comparison, research view or something the learner describes.

## Skills

Four user-facing skills and eight supporting helpers are adapted from Matt Pocock under .agents/skills/. See docs/skills.md for the names and skills.lock.json for deployed hashes and upstream origins.

- plan-dashboard: discuss the learner's needs, show options when useful and record their chosen direction.
- build-dashboard: summarize the outcome, plan only as much as needed, implement, test, review and open the result. It also handles requested bugs, backlog work, architecture and workflow improvements. These are phases inside one skill, not eight hidden commands to invoke.
- choose-skill: recommend the suitable entry point when asked.
- setup-project: change project conventions when requested; the supplied local defaults already work.
- Preserve disable-model-invocation and agents/openai.yaml policies. These four entry points require human invocation; helpers follow their own policies. Do not ask for repeated invocation between phases of build-dashboard.
- Prefer this project copy. Use the available skill resolver or read .agents/skills/<name>/SKILL.md and referenced files. This fallback also applies to helper-to-helper calls. Never claim a missing tool exists or a global installation occurred.
- Helpers are ask-questions, define-terms, design-code, test-first, review-code, preview-dashboard, find-information and write-instructions.
- If subagents or worktrees are unavailable, execute ready work sequentially, perform Standards and Spec reviews in separate passes, and research inline. State which fallback actually ran.
- Pass absolute main-workspace paths for ignored .scratch specs and task files to worktree agents. The coordinator owns shared status edits.
- Keep learner-specific choices in BRIEF.md and project docs. Do not edit global skills or install another copy as a side effect of opening this repo.
- Never invoke superpowers:* unless the human explicitly asks.

## Agent skills

### Issue tracker
Local Markdown in .scratch/; no GitHub login needed for the teaching flow. See docs/agents/issue-tracker.md.

### Triage labels
Use the five upstream roles as local backlog Status values, separate from decisions and implementation tasks. See docs/agents/triage-labels.md.

### Domain docs
One GLOSSARY.md and docs/adr/. See docs/agents/domain.md.

These project defaults are already supplied. setup-project is available when the learner explicitly wants to change them; it is not a required first-run ceremony.

## ZIP and Git setup

For a ZIP checkout without .git, establish local Git and a baseline before workflows that need commits, branches or a diff base, when Git is available. Do not invent user identity or add a remote. If identity is missing, ask only when a commit is needed. If Git is unavailable, keep the local preview/result usable and state the capture/review limitation instead of claiming those steps passed.

## Data and verification

- Agree what a metric means (period, benchmark, currency, fees/dividends when relevant) before treating its value as correct. Document source, observation date, units and refresh behavior.
- Use clearly labeled synthetic data if real data is not yet available. Confirm actual provider tools, access and permissions before promising live Efin or any other integration.
- Keep private exports and secrets out of Git. Use data/private/ and environment variables only when the chosen app needs them; do not request secrets in chat.
- Do not place trades. Publishing, sending external messages and enabling recurring jobs require the learner's explicit authorization. A lesson about scheduling does not enable a job.
- Run checks appropriate to the chosen app. Inspect the actual UI at desktop and narrow widths when relevant. Check loading, empty/error states and at least one important number independently.
- For review-code, include the actual staged/unstaged change as well as commits since the recorded base. A clean base...HEAD diff before the implementation commit is not a review of uncommitted work.
- Keep private drafts under .scratch/. Verify the student's current remote before any authorized publication; never write their work to the instructor's template by default.
- For starter maintenance only, python3 scripts/check_starter.py verifies this bundle. It does not test the dashboard the learner later builds.
