---
name: ask-questions
description: Clarify a plan, decision or dashboard idea through focused questions, one consequential topic at a time, until the next useful version is understood.
---

Build a shared understanding of the current outcome. Reuse answers already
given. Map only decisions needed for the next useful version as a **design
tree**; do not expand into every possible future feature.

Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled: the questions you can ask _now_ without guessing at answers you haven't heard yet. Ask one consequential topic at a time for this class. Offer a recommended option; group questions only when the learner asks for a questionnaire or batching helps them. Then wait for the user's answers before the next round.

Format a round like so:

```
❓ **Q1** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>

---

❓ **Q2** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>
```

Word each question so "yes" accepts your recommended answer.

Each round the user answers reshapes the tree: settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier and ask the next round. A question whose answer depends on another question still open in this round belongs to a _later_ round, not this one.

Finding _facts_ is your job, never the user's. When a frontier question needs a fact from the environment (filesystem, tools, etc.), look it up yourself, delegating only when the tools and scope permit; don't ask the user for anything you could look up yourself. Don't block on it: a running exploration is an unsettled prerequisite, so only the questions downstream of it wait for the sub-agent to report; ask the rest of the frontier now. The _decisions_ are the user's: put each to them and wait.

The discussion is sufficient when choices needed for the next useful version
are settled. Keep later questions in the brief without blocking current work.
Wait for the learner's answer on unresolved material choices. Resume an
already-authorized task without another generic approval round.
