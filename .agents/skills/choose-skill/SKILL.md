---
name: choose-skill
description: Help a learner choose the next step for their investment dashboard when they ask which skill to use or how to continue.
disable-model-invocation: true
---

# Choose a helper

Read the current request and BRIEF.md if present. Recommend one next action in
the learner's language, with its plain Thai name and short command:

- **คุยออกแบบ Dashboard — plan-dashboard:** the learner is shaping the question,
  choosing what to see, or deciding how it should look.
- **สร้างและปรับ Dashboard — build-dashboard:** the learner wants a working
  result, changes to an existing one, a plan for a large effort, or maintenance.
  This one skill handles planning, task breakdown, building, testing and review.
- **ตั้งค่าโปรเจกต์ — setup-project:** the learner explicitly wants to change
  where tasks/documents live or configure a new project.

If the request already identifies the outcome, do not make them take a quiz.
Give one copyable sentence that invokes the recommended skill. Recommending a
user-only skill is not permission to invoke it. Do not start another user-only
command automatically or suggest removed upstream commands.
