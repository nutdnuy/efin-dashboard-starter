# Coordinate a larger build

Use this only when dependencies or session size make a task graph useful.

Write one task per file in .scratch/<feature>/tasks/ with a title, complete
user-visible outcome, acceptance checks, blockers and status
ready / in-progress / done / blocked. Keep decisions/ separate from tasks/.
A task is ready only when its blockers are done. Use complete vertical slices,
not separate “all database / all API / all UI” phases.

Preserve the current checkout. An integration branch is useful only when Git and
the project context support it; never reset an existing branch or overwrite
uncommitted work. When parallel agents and isolated worktrees are available,
assign independent ready tasks with narrow ownership. Pass absolute paths to
the main workspace's ignored spec/decision/task files. The coordinator alone
owns shared status updates and integration; other agents report evidence.

Merge or otherwise integrate each finished change against the current integrated
state, resolve conflicts deliberately, run integration checks, and then unlock
dependent tasks. Parallel completion alone does not prove integration works.
When isolation is unavailable, complete the same ready tasks sequentially.

Do not force wide mechanical refactors into independent slices that cannot stay
working. Prefer an expand/migrate/contract sequence with explicit integration
checks. Keep changes no broader than the authorized outcome.

After the full requested result is integrated, review-code checks the actual
combined work, not just each branch. Demonstrate the app and leave restart
instructions and remaining tasks. Clean up only worktrees created for this task,
after verifying needed work is preserved. PRs, remote pushes and issue posting
follow the user's existing publication authorization, not a default workflow.
