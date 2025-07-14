import re
import sys
from datetime import date
from pathlib import Path


def update_todo_date(todo_path: Path) -> int:
    """Update the date in the TODO header.

    The first line must look like
    '# TODO – Road‑map (last updated: YYYY-MM-DD)'.
    """
    try:
        lines = todo_path.read_text().splitlines()
    except Exception as exc:  # defensive coding
        print(f"error: {exc}", file=sys.stderr)
        return 1
    if not lines:
        print("error: TODO file is empty", file=sys.stderr)
        return 1

    pattern = r"(# TODO – Road\u2011map \(last updated: )(\d{4}-\d{2}-\d{2})(\))"
    match = re.match(pattern, lines[0])
    if not match:
        print("error: unexpected header format", file=sys.stderr)
        return 1
    today = date.today().isoformat()
    if match.group(2) == today:
        return 0
    lines[0] = f"{match.group(1)}{today}{match.group(3)}"
    try:
        todo_path.write_text("\n".join(lines) + "\n")
    except Exception as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parents[1] / "TODO.md"
    sys.exit(update_todo_date(path))
