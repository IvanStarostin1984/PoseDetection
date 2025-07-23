from __future__ import annotations

import sys
from datetime import date
from pathlib import Path
import subprocess


def test_update_todo_date(tmp_path):
    sample = "# TODO – Road‑map (last updated: 2000-01-01)\n" "\n" "rest\n"
    todo_file = tmp_path / "TODO.md"
    todo_file.write_text(sample, encoding="utf-8")

    repo_root = Path(__file__).resolve().parents[1]
    script = repo_root / "scripts" / "update_todo_date.py"
    result = subprocess.run([sys.executable, str(script), str(todo_file)])
    assert result.returncode == 0

    updated = todo_file.read_text().splitlines()[0]
    today = date.today().isoformat()
    assert updated == f"# TODO – Road‑map (last updated: {today})"


def test_update_todo_date_bad_header(tmp_path):
    sample = "# TODO wrong header\nrest\n"
    todo_file = tmp_path / "TODO.md"
    todo_file.write_text(sample, encoding="utf-8")

    repo_root = Path(__file__).resolve().parents[1]
    script = repo_root / "scripts" / "update_todo_date.py"
    result = subprocess.run([sys.executable, str(script), str(todo_file)])
    assert result.returncode == 1
