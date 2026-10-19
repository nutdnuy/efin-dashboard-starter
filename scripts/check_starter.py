#!/usr/bin/env python3
"""Validate the portable class kit, not a learner's future application."""
from pathlib import Path, PurePosixPath
from urllib.parse import unquote
import hashlib
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
PRIMARY = ["choose-skill", "plan-dashboard", "build-dashboard", "setup-project"]
HELPERS = ["ask-questions", "define-terms", "design-code", "test-first", "review-code",
           "preview-dashboard", "find-information", "write-instructions"]
MERGED = ["to-spec", "implement", "to-tickets", "implement-spec", "wayfinder", "triage",
          "improve-codebase-architecture", "retro"]
RENAMES = dict(zip(
    ["ask-matt", "grill-with-docs", "setup-matt-pocock-skills", "grilling", "domain-modeling",
     "codebase-design", "tdd", "code-review", "prototype", "research", "writing-for-agents"],
    ["choose-skill", "plan-dashboard", "setup-project"] + HELPERS,
))
RENAMES.update({name: "build-dashboard" for name in MERGED})
DISPLAY_NAMES = dict(zip(PRIMARY, ["เลือกตัวช่วย", "คุยออกแบบ Dashboard",
                                 "สร้างและปรับ Dashboard", "ตั้งค่าโปรเจกต์"]))
errors = []


def fail(message):
    errors.append(message)


def sha256(value):
    return isinstance(value, str) and re.fullmatch(r"[0-9a-f]{64}", value) is not None


def portable_path(value):
    return (isinstance(value, str) and bool(value) and "\\" not in value
            and not PurePosixPath(value).is_absolute()
            and ".." not in PurePosixPath(value).parts
            and PurePosixPath(value).as_posix() == value)


def scalar(text, key, indent=0):
    """Read our single-line YAML fields without a third-party YAML dependency."""
    values = re.findall(r"(?m)^" + " " * indent + re.escape(key) + r":[ \t]*([^\n]*)$", text)
    if len(values) != 1:
        return None
    return values[0].strip().strip('"\'')


try:
    lock = json.loads((ROOT / "skills.lock.json").read_text())
except (OSError, json.JSONDecodeError) as exc:
    print("FAIL: Cannot read skills.lock.json:", exc)
    sys.exit(1)
if not isinstance(lock, dict):
    print("FAIL: skills.lock.json must be an object.")
    sys.exit(1)
if lock.get("schemaVersion") != 2:
    fail("Expected manifest schemaVersion 2.")
for key, expected in [("primary", PRIMARY), ("supporting", HELPERS), ("mergedFrom", MERGED)]:
    actual = lock.get(key)
    if (not isinstance(actual, list) or not all(isinstance(n, str) for n in actual)
            or len(actual) != len(expected) or set(actual) != set(expected)):
        fail("Unexpected " + key + " skills; expected: " + ", ".join(expected))
if lock.get("renames") != RENAMES:
    fail("Legacy-name mapping does not match the 4-command / 8-helper bundle.")
if not re.fullmatch(r"[0-9a-f]{40}", str(lock.get("revision", ""))):
    fail("Upstream revision must be pinned to a full commit SHA.")
if lock.get("source") != "https://github.com/mattpocock/skills" or lock.get("license") != "MIT":
    fail("Expected Matt Pocock source and MIT license metadata.")

files = lock.get("files", {})
if not isinstance(files, dict) or not files:
    fail("Manifest files must be a nonempty object.")
    files = {}
for rel, entry in files.items():
    if not portable_path(rel) or not rel.startswith(".agents/skills/"):
        fail("Invalid manifest file path: " + str(rel))
        continue
    if not isinstance(entry, dict):
        fail("Invalid file entry: " + rel)
        continue
    current_hash = entry.get("sha256")
    if not sha256(current_hash):
        fail("Invalid current SHA-256: " + rel)
    path = ROOT / rel
    if not path.is_file() or path.is_symlink():
        fail("Missing or nonportable skill file: " + rel)
    elif hashlib.sha256(path.read_bytes()).hexdigest() != current_hash:
        fail("Skill file differs from manifest current hash: " + rel)
    origins = entry.get("origins")
    if not isinstance(origins, list) or not origins:
        fail("Missing original path/hash provenance: " + rel)
        origins = []
    origin_paths = []
    for origin in origins:
        if not isinstance(origin, dict) or not portable_path(origin.get("path")) or not sha256(origin.get("sha256")):
            fail("Invalid origin path or SHA-256: " + rel)
            continue
        origin_paths.append(origin["path"])
    if len(origin_paths) != len(set(origin_paths)):
        fail("Duplicate origin path: " + rel)
    if not isinstance(entry.get("status"), str) or entry["status"] not in {"adapted", "unchanged"}:
        fail("Status must be adapted or unchanged: " + rel)
    elif entry["status"] == "unchanged":
        if len(origins) != 1 or not isinstance(origins[0], dict) or origins[0].get("sha256") != current_hash:
            fail("Unchanged file must match its single origin hash: " + rel)

skill_root = ROOT / ".agents/skills"
actual_files = {p.relative_to(ROOT).as_posix() for p in skill_root.rglob("*") if p.is_file()}
if actual_files != set(files):
    fail("Skill files differ from exact manifest: " + str(sorted(actual_files ^ set(files))))
actual_dirs = {p.name for p in skill_root.iterdir() if p.is_dir()} if skill_root.is_dir() else set()
if actual_dirs != set(PRIMARY + HELPERS):
    fail("Expected exactly 12 skill folders; difference: " + str(sorted(actual_dirs ^ set(PRIMARY + HELPERS))))
if any(p.is_symlink() for p in skill_root.rglob("*")):
    fail("Skill bundle contains a nonportable symlink.")
for name in PRIMARY + HELPERS:
    skill = skill_root / name / "SKILL.md"
    if not skill.is_file():
        fail("Missing SKILL.md: " + name)
        continue
    text = skill.read_text()
    frontmatter = re.match(r"\A---\r?\n(.*?)\r?\n---(?:\r?\n|$)", text, re.S)
    front = frontmatter.group(1) if frontmatter else ""
    if scalar(front, "name") != name:
        fail("Skill frontmatter name does not match folder: " + name)
    if not scalar(front, "description"):
        fail("Skill frontmatter description missing: " + name)
    config = skill.parent / "agents/openai.yaml"
    if not config.is_file():
        fail("Codex UI metadata missing: " + name)
        continue
    ui = config.read_text()
    if not re.search(r"(?m)^interface:\s*$", ui):
        fail("Codex interface section missing: " + name)
    for key in ["display_name", "short_description", "default_prompt"]:
        value = scalar(ui, key, 2)
        if not value or not re.search(r"[\u0e00-\u0e7f]", value):
            fail("Thai UI " + key + " missing: " + name)
    if name in DISPLAY_NAMES and scalar(ui, "display_name", 2) != DISPLAY_NAMES[name]:
        fail("Unexpected main UI label: " + name)
    if not re.search(r"\$" + re.escape(name) + r"(?![\w-])", scalar(ui, "default_prompt", 2) or ""):
        fail("Default prompt must invoke its current skill name: " + name)
    restricted = scalar(front, "disable-model-invocation")
    implicit = scalar(ui, "allow_implicit_invocation", 2)
    if name in PRIMARY:
        if restricted != "true" or implicit != "false" or not re.search(r"(?m)^policy:\s*$", ui):
            fail("User-only frontmatter / Codex policy missing: " + name)
    elif restricted not in {None, "false"} or implicit not in {None, "true"}:
        fail("Supporting skill must be callable by the main workflow: " + name)

build_entry = files.get(".agents/skills/build-dashboard/SKILL.md", {})
if isinstance(build_entry, dict):
    origins = build_entry.get("origins", [])
    if isinstance(origins, list):
        origin_names = {PurePosixPath(o["path"]).parent.name for o in origins
                        if isinstance(o, dict) and isinstance(o.get("path"), str)}
        if origin_names != set(MERGED):
            fail("build-dashboard must retain provenance for all 8 merged workflows.")

# Historical names in prose are allowed. Detect command syntax, not ordinary
# words such as research, prototype, or implement in explanations.
old_names = "(?:" + "|".join(re.escape(n) for n in sorted(RENAMES, key=len, reverse=True)) + ")"
old_command = re.compile(r"(?<![\w:/.\-])[/\$](" + old_names + r")(?![\w/-])")
old_named_call = re.compile(r"(?:invoke|call|run|use|เรียกใช้|เรียก|ใช้)\s+(?:the\s+)?(?:skill\s+|สกิล\s*)?`(" + old_names + r")`", re.I)
authored = [ROOT / name for name in ["README.md", "START.md", "AGENTS.md", "CLAUDE.md", "GEMINI.md", "BRIEF.md", "GLOSSARY.md", "THIRD_PARTY_NOTICES.md"]]
authored += list((ROOT / "docs").rglob("*.md"))
markdown = authored + list(skill_root.rglob("*.md"))
for path in markdown + list(skill_root.rglob("*.yaml")):
    rel = path.relative_to(ROOT).as_posix()
    if not path.is_file():
        fail("Missing document: " + rel)
        continue
    text = path.read_text()
    for number, line in enumerate(text.splitlines(), 1):
        matches = list(old_command.finditer(line)) + list(old_named_call.finditer(line))
        for match in matches:
            historical = (rel in {"docs/skills.md", "THIRD_PARTY_NOTICES.md"}
                          and line.lstrip().startswith("|") and RENAMES[match.group(1).lower()] in line)
            if not historical:
                fail(f"Legacy skill invocation: {rel}:{number} -> {match.group(1)}")
    # Explicit root-relative skill paths are instructions even inside code fences.
    for match in re.finditer(r"\.agents/skills/[A-Za-z0-9][A-Za-z0-9_.-]*(?:/[A-Za-z0-9_.-]+)*", text):
        target = match.group(0).rstrip(".")
        if not (ROOT / target).exists():
            fail("Missing explicit skill path: " + rel + " -> " + target)
    if path.suffix == ".md":
        # Ignore generic examples inside fenced code; check actual navigation.
        prose = re.sub(r"(?ms)^```.*?^```[^\n]*", "", text)
        for match in re.finditer(r"\]\(([^)]+)\)", prose):
            link = match.group(1).strip()
            if link.startswith("<") and link.endswith(">"):
                link = link[1:-1]
            link = link.split("#", 1)[0].split("?", 1)[0]
            if not link or re.match(r"[a-zA-Z][a-zA-Z0-9+.-]*:", link):
                continue
            if not (path.parent / unquote(link)).exists():
                fail("Broken local link: " + rel + " -> " + link)
    if path in authored:
        if re.search(r"/Users/[A-Za-z0-9_-]+/", text):
            fail("Personal filesystem path: " + rel)
        if re.search(r"gh[pousr]_[A-Za-z0-9]{30,}|sk-[A-Za-z0-9]{32,}|-----BEGIN (RSA |OPENSSH )?PRIVATE KEY-----", text):
            fail("Potential secret: " + rel)

if errors:
    print("\n".join("FAIL: " + error for error in errors))
    sys.exit(1)
print(f"PASS: {len(PRIMARY)} user commands + {len(HELPERS)} helpers; {len(files)} manifest files and provenance; Thai UI metadata and invocation policies; {len(markdown)} Markdown documents and local links.")
print("Structural verification only: this does not prove an agent session, original upstream hashes, or a future dashboard works.")
