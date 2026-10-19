# Starter verification

This checks the teaching kit, not a dashboard application or a completed learner session.

Run from the repository root:

```bash
python3 scripts/check_starter.py
```

The checker verifies the pinned file hashes, the 11 user-invoked commands and
8 supporting skills, invocation policies, local Markdown links, and obvious
personal-path/credential patterns in the class documents. It needs only the
Python standard library. Students do not need to run this before starting a chat.

For the 2026-10-19 revision, all 57 upstream files were also compared byte for byte
against commit `49dd158d1076134a641b33efb035946536778336`. A separate read-only
review checked dependency coverage and the conversation → preview → choice →
explicit implementation → feedback path. It identified Git/ZIP, ignored tracker
files in worktrees, and missing-subagent fallbacks; the project instructions now
cover those cases.

This is structural verification and instruction review. Native skill discovery
varies by agent application, and no complete real-student dashboard session is
claimed. Verify the resulting application separately using its actual commands,
UI and data, with the [acceptance checklist](acceptance-checklist.md).
