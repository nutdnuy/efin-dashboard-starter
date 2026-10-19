# Starter verification

This checks the teaching kit, not a learner's finished dashboard or satisfaction.

Run from the repository root:

```bash
python3 scripts/check_starter.py
```

The standard-library checker verifies manifest version 2, the exact 4 primary
and 8 helper identities/folders, deployed hashes, source-origin metadata,
frontmatter names, Thai UI metadata, invocation policies, local Markdown and
skill paths, removed command references, and obvious private-path/secret
patterns in authored documentation. Students do not need to run it before
starting a chat. Origin metadata is not a fresh network comparison with upstream.

## 2026-10-19 consolidation checks

- All eight selected build/maintenance commands now share one build-dashboard
  entry point; helper names, references and local tracker templates were reviewed.
- The checker passed a valid temporary bundle and 14 mutation scenarios covering
  invalid hashes, names, metadata, policies, provenance, links, extra folders and
  privacy. Ordinary prose and example route paths remain accepted.
- Skill-creator quick validation passed the 8 actual helper files. Its older
  frontmatter allowlist rejects the retained disable-model-invocation field in
  the 4 primary files. Their remaining frontmatter passed on temporary copies
  with only that field omitted; the distributed originals keep the field and
  both explicit-invocation policies are checked by the repository checker.
- The portable instruction/skill bundle was compared byte for byte with its
  canonical source. Original files were backed up before migration.

## Bounded synthetic forward test

An independent agent executed the merged skill in an isolated local HTML
portfolio fixture with labeled synthetic holdings and a pre-existing user
comment. This is a proxy evaluation, not a real student session.

| Request | Observed result |
|---|---|
| Plan a stock-search field only | A local spec was written; application SHA-256 stayed unchanged. |
| Implement that plan and show it | Added search and empty state; existing comment, holdings and total were preserved. |

The browser check first failed for the absent search field, then failed for the
missing empty state. The final 8 checks passed: case-insensitive match, no-match
state, trimmed partial query, clearing the filter, portfolio total, synthetic
label, user comment, and no overflow at 1280px/390px. Actual local-file desktop
and mobile screenshots were inspected. The agent reported no phase-confirmation
stops and performed separate Standards and Spec review passes.

This test used headless Chromium, a saved pre-change file as its baseline and
no remote publishing, scheduling or global configuration edits. It did not
exercise Git/worktree coordination, a live provider, native skill discovery in
every app, or real human design approval. Test those capabilities when the
learner's chosen dashboard requires them, using its actual commands, UI and
data and the [acceptance checklist](acceptance-checklist.md).
