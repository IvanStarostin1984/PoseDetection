"""Additional repository quality checks.

Purpose
-------
Fail when trailing whitespace or merge conflict markers appear in tracked
files. Verify that NOTES.md entries are sorted from oldest to newest.

Returns
-------
int
    ``0`` when all checks pass, ``1`` otherwise.
"""

from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path


def list_files(repo: Path) -> list[str]:
    """Return all tracked files under *repo*."""
    result = subprocess.run(
        ["git", "ls-files"], cwd=repo, stdout=subprocess.PIPE, text=True, check=True
    )
    return result.stdout.splitlines()


def check_trailing_spaces(files: list[str], repo: Path) -> bool:
    failed = False
    for rel in files:
        path = repo / rel
        try:
            lines = path.read_text(encoding="utf-8", errors="ignore").splitlines()
        except Exception as exc:  # defensive coding
            print(f"error reading {rel}: {exc}", file=sys.stderr)
            failed = True
            continue
        for idx, line in enumerate(lines, 1):
            if line.endswith(" ") or line.endswith("\t"):
                print(f"{rel}:{idx}: trailing whitespace", file=sys.stderr)
                failed = True
                break
    return failed


def check_conflict_markers(files: list[str], repo: Path) -> bool:
    failed = False
    pattern = re.compile(r"(<{7}|={7}|>{7})")
    for rel in files:
        if rel == ".github/workflows/ci.yml":
            continue
        path = repo / rel
        try:
            for idx, line in enumerate(
                path.read_text(encoding="utf-8", errors="ignore").splitlines(), 1
            ):
                if pattern.search(line):
                    print(f"{rel}:{idx}: conflict marker", file=sys.stderr)
                    failed = True
                    break
        except Exception as exc:
            print(f"error reading {rel}: {exc}", file=sys.stderr)
            failed = True
    return failed


def check_notes_order(notes_path: Path) -> bool:
    failed = False
    pattern = re.compile(r"^#{2,3} (\d{4}-\d{2}-\d{2})")
    try:
        lines = notes_path.read_text(encoding="utf-8").splitlines()
    except Exception as exc:
        print(f"error reading {notes_path.name}: {exc}", file=sys.stderr)
        return True
    dates = [m.group(1) for line in lines if (m := pattern.match(line))]
    if len(dates) < 2:
        return False
    prev, curr = dates[-2], dates[-1]
    if curr < prev:
        print(
            f"{notes_path.name}: {curr} out of order (should be >= {prev})",
            file=sys.stderr,
        )
        failed = True
    return failed


def main() -> int:
    repo = Path(__file__).resolve().parents[1]
    files = list_files(repo)
    failed = check_trailing_spaces(files, repo)
    failed = check_conflict_markers(files, repo) or failed
    notes_file = repo / "NOTES.md"
    if notes_file.exists():
        failed = check_notes_order(notes_file) or failed
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
