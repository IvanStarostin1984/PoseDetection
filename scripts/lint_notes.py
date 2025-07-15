import re
import sys
from pathlib import Path

DATE_RE = re.compile(r"^#+\s*(\d{4}-\d{2}-\d{2})")
MARKER_RE = re.compile(r"<{7}|={7}|>{7}")


def collect_markdown_files(repo: Path) -> list[Path]:
    """Return all markdown files under repo excluding generated output."""
    return [
        p
        for p in repo.rglob("*.md")
        if "generated" not in p.parts and "openapi" not in p.parts
    ]


def check_notes_order(notes_path: Path) -> bool:
    """Ensure NOTES.md headings are chronological."""
    try:
        lines = notes_path.read_text().splitlines()
    except Exception as exc:  # defensive coding
        print(f"error: {exc}", file=sys.stderr)
        return False
    dates = [m.group(1) for m in (DATE_RE.match(line) for line in lines) if m]
    if len(dates) < 2:
        return True
    if dates[-1] < dates[-2]:
        print(
            f"error: {notes_path} not chronological: {dates[-1]} < {dates[-2]}",
            file=sys.stderr,
        )
        return False
    return True


def check_markdown(files: list[Path]) -> bool:
    """Check each file for trailing spaces and conflict markers."""
    ok = True
    for path in files:
        try:
            lines = path.read_text().splitlines()
        except Exception as exc:
            print(f"error: {exc}", file=sys.stderr)
            ok = False
            continue
        for idx, line in enumerate(lines, 1):
            if line.rstrip() != line:
                print(f"{path}:{idx}: trailing spaces", file=sys.stderr)
                ok = False
            if MARKER_RE.search(line):
                print(f"{path}:{idx}: conflict marker", file=sys.stderr)
                ok = False
    return ok


def lint_notes(repo: Path) -> int:
    """Run all lint checks."""
    notes_file = repo / "NOTES.md"
    files = collect_markdown_files(repo)
    ok = check_notes_order(notes_file)
    ok &= check_markdown(files)
    return 0 if ok else 1


if __name__ == "__main__":
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parents[1]
    sys.exit(lint_notes(root))
