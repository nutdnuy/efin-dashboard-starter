#!/usr/bin/env python3
"""Validate the portable class kit, not a learner's future application."""
from pathlib import Path
from urllib.parse import unquote
import hashlib
import json
import re
import sys

root = Path(__file__).resolve().parents[1]
lock = json.loads((root / "skills.lock.json").read_text())
errors = []
primary = lock["primary"]
helpers = lock["supporting"]
if len(primary) != 11 or len(set(primary)) != 11:
    errors.append("Expected 11 distinct user commands.")
if len(helpers) != 8 or len(set(helpers)) != 8 or set(primary) & set(helpers):
    errors.append("Expected 8 distinct supporting skills.")
if not re.fullmatch(r"[0-9a-f]{40}", lock["revision"]):
    errors.append("Upstream revision must be pinned to a full commit SHA.")

for rel, entry in lock["files"].items():
    path = root / rel
    if not path.is_file():
        errors.append("Missing upstream file: " + rel)
    elif hashlib.sha256(path.read_bytes()).hexdigest() != entry["sha256"]:
        errors.append("Upstream file differs from pinned copy: " + rel)
actual = {str(p.relative_to(root)) for p in (root / ".agents/skills").rglob("*") if p.is_file()}
if actual != set(lock["files"]):
    errors.append("Skill files differ from the exact manifest: " + str(sorted(actual ^ set(lock["files"]))))
for name in primary + helpers:
    skill = root / ".agents/skills" / name / "SKILL.md"
    if not skill.is_file():
        errors.append("Missing skill: " + name)
        continue
    text = skill.read_text()
    if not re.search(r"(?m)^name:\s*" + re.escape(name) + r"\s*$", text):
        errors.append("Skill name mismatch: " + name)
    if name in primary:
        config = skill.parent / "agents/openai.yaml"
        if "disable-model-invocation: true" not in text:
            errors.append("User-only frontmatter missing: " + name)
        if not config.is_file() or "allow_implicit_invocation: false" not in config.read_text():
            errors.append("User-only Codex policy missing: " + name)

authored = [root / name for name in ["README.md", "START.md", "AGENTS.md", "CLAUDE.md", "GEMINI.md", "BRIEF.md", "GLOSSARY.md", "THIRD_PARTY_NOTICES.md"]]
authored += list((root / "docs").rglob("*.md"))
markdown = authored + list((root / ".agents/skills").rglob("*.md"))
for path in markdown:
    if not path.is_file():
        errors.append("Missing document: " + str(path.relative_to(root)))
        continue
    text = path.read_text()
    # Ignore examples inside fenced code; check actual file navigation.
    prose = re.sub(r"(?ms)^```.*?^```[^\n]*", "", text)
    for match in re.finditer(r"\]\(([^)]+)\)", prose):
        link = match.group(1).split("#", 1)[0].split("?", 1)[0]
        if not link or re.match(r"[a-zA-Z][a-zA-Z0-9+.-]*:", link) or "<" in link:
            continue
        if not (path.parent / unquote(link)).exists():
            errors.append("Broken local link: " + str(path.relative_to(root)) + " -> " + link)
    if path in authored:
        if re.search(r"/Users/[A-Za-z0-9_-]+/", text):
            errors.append("Personal filesystem path: " + str(path.relative_to(root)))
        if re.search(r"gh[pousr]_[A-Za-z0-9]{30,}|sk-[A-Za-z0-9]{32,}|-----BEGIN (RSA |OPENSSH )?PRIVATE KEY-----", text):
            errors.append("Potential secret: " + str(path.relative_to(root)))

if errors:
    print("\n".join("FAIL: " + error for error in errors))
    sys.exit(1)
print(f"PASS: {len(primary)} user commands + {len(helpers)} helpers; {len(lock['files'])} pinned files; invocation policies; {len(markdown)} Markdown documents and local links.")
print("Structural verification only: this does not prove an agent session or future dashboard works.")

