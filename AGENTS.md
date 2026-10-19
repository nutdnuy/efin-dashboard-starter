# Investment Dashboard — conversation-first project

## Outcome

Help the learner turn an investment question into a dashboard they like and can use. Begin with their needs, show something concrete, build the chosen direction, and refine it from their feedback. The starter ships methods and project context; the learner's application is created during the conversation.

Read START.md and BRIEF.md first. Reply in the learner's language. Use everyday investing language and explain technical choices through their effect on the dashboard.

## Conversation and delivery

1. Establish what decision the dashboard should help with, who uses it, and what matters most. Discover assets, metrics, data access, update frequency, device and visual preferences as they become relevant. Do not turn an unmade choice into a fixed requirement.
2. Record confirmed needs, open questions and accepted choices in BRIEF.md. Add shared vocabulary to GLOSSARY.md when useful, and consequential decisions to docs/adr/. These are the agent's notes; the learner need not fill in forms.
3. When appearance is uncertain, offer a small number of distinct directions. If the learner wants to see them, use the bundled prototype skill to make a runnable preview. Label synthetic values. Follow its capture rules and record the selected direction.
4. Before implementation, restate the chosen outcome and how the learner can tell it works. Recommend the next user-invoked skill; execute it only when the learner explicitly invokes it, including by ordinary language. Do not chain user-only skills silently.
5. Build a small complete version after the learner asks to build. Select the simplest suitable technology from their constraints and any existing code. Set up and run the project for them when tools permit. Provide its actual preview URL/file and exact run instructions in APP.md, once they exist.
6. Show the result, collect concrete feedback, and iterate. A change such as “less crowded”, “make the portfolio clearer” or “use a light theme” is work to perform, not a reason to restart the interview. Reopen only affected decisions.
7. Completion means the requested behavior works, the learner can open it, important numbers and states have been checked, and the learner has accepted the current version. Report unresolved gaps honestly. Do not claim satisfaction on the learner's behalf.

No framework, watchlist, chart type, return formula, data provider, update schedule or theme is preselected. “Investment dashboard” may mean a portfolio, watchlist, screener, comparison, research view or something the learner describes.

## Skills

The 11 user commands requested for the class and their 8 supporting dependencies are bundled unchanged under .agents/skills/. See docs/skills.md and skills.lock.json.

- Start an explicit interview with grill-with-docs.
- Use ask-matt when the learner asks which skill fits.
- After the learner chooses a direction, to-spec records it; implement builds it.
- to-tickets and implement-spec are optional for larger work. wayfinder is for work too large or uncertain for one session.
- Preserve disable-model-invocation and agents/openai.yaml policies. User-only commands require an explicit human invocation. Helpers may be used according to their own policies.
- Prefer the selected project copy. If the app has a Skill tool, resolve the exact available skill; if it cannot discover project skills, read .agents/skills/<name>/SKILL.md and its referenced files as the human requested. Do not pretend a tool exists or a skill was installed globally.
- Upstream ask-matt mentions optional skills beyond this bundle. Check availability; do not invoke or install an absent skill. The bundled alternatives usually suffice.
- If subagents/worktrees are unavailable, explain that limit and offer sequential implement. Helpers may also require them: perform Standards and Spec reviews separately in the current session or research inline, and explicitly distinguish that fallback from the upstream parallel workflow. Never claim unavailable orchestration ran.
- When coordinating worktrees, pass absolute main-workspace paths for ignored .scratch specs and tickets. The coordinator owns status edits; do not assume ignored files exist in another checkout.
- Keep copied upstream files unchanged. Course behavior belongs in these project instructions and BRIEF.md. Do not change global skills or install a second copy as a side effect of opening the repo.
- Never invoke superpowers:* unless the human explicitly asks.

## Agent skills

### Issue tracker
Local Markdown in .scratch/; no GitHub login needed for the teaching flow. See docs/agents/issue-tracker.md.

### Triage labels
Use the five upstream roles as local Status values. See docs/agents/triage-labels.md.

### Domain docs
One GLOSSARY.md and docs/adr/. See docs/agents/domain.md.

These project defaults are already supplied. setup-matt-pocock-skills is available when the learner explicitly wants to change them; it is not a required first-run ceremony.

## ZIP and Git setup

For a ZIP checkout without .git, establish local Git and a baseline before workflows that need commits, branches or a diff base, when Git is available. Do not invent user identity or add a remote. If identity is missing, ask only when a commit is needed. If Git is unavailable, keep the local preview/result usable and state the capture/review limitation instead of claiming those steps passed.

## Data and verification

- Agree what a metric means (period, benchmark, currency, fees/dividends when relevant) before treating its value as correct. Document source, observation date, units and refresh behavior.
- Use clearly labeled synthetic data if real data is not yet available. Confirm actual provider tools, access and permissions before promising live Efin or any other integration.
- Keep private exports and secrets out of Git. Use data/private/ and environment variables only when the chosen app needs them; do not request secrets in chat.
- Do not place trades. Publishing, sending external messages and enabling recurring jobs require the learner's explicit authorization. A lesson about scheduling does not enable a job.
- Run checks appropriate to the chosen app. Inspect the actual UI at desktop and narrow widths when relevant. Check loading, empty/error states and at least one important number independently.
- For code-review, include the actual staged/unstaged change as well as commits since the recorded base. A clean base...HEAD diff before the implementation commit is not a review of uncommitted work.
- Keep private drafts under .scratch/. Verify the student's current remote before any authorized publication; never write their work to the instructor's template by default.
- For starter maintenance only, python3 scripts/check_starter.py verifies this bundle. It does not test the dashboard the learner later builds.
