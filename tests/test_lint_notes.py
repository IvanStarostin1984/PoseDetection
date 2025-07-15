import sys
import subprocess
from pathlib import Path


def run_script(tmp_path: Path) -> subprocess.CompletedProcess:
    script = Path(__file__).resolve().parents[1] / "scripts" / "lint_notes.py"
    return subprocess.run([sys.executable, str(script), str(tmp_path)])


def test_lint_notes_ok(tmp_path):
    notes = (
        "## 2024-01-01 PR #1\n\n- entry\n\n"
        "## 2024-01-02 PR #2\n\n- entry\n"
    )
    (tmp_path / "NOTES.md").write_text(notes)
    (tmp_path / "README.md").write_text("# Title\n")
    result = run_script(tmp_path)
    assert result.returncode == 0


def test_lint_notes_bad_order(tmp_path):
    notes = (
        "## 2024-01-02 PR #1\n\n- entry\n\n"
        "## 2024-01-01 PR #2\n\n- entry\n"
    )
    (tmp_path / "NOTES.md").write_text(notes)
    result = run_script(tmp_path)
    assert result.returncode == 1


def test_lint_notes_trailing(tmp_path):
    notes = "## 2024-01-01 PR #1 \n"
    (tmp_path / "NOTES.md").write_text(notes)
    result = run_script(tmp_path)
    assert result.returncode == 1
