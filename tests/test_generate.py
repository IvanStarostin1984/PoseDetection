import sys
from pathlib import Path
import subprocess


def test_generate_script(tmp_path):
    repo_root = Path(__file__).resolve().parents[1]
    example = repo_root / "generated" / "example.txt"
    if example.exists():
        example.unlink()
    result = subprocess.run([sys.executable, "scripts/generate.py"], cwd=repo_root)
    assert result.returncode == 0
    assert example.exists()
    assert example.read_text() == "placeholder output\n"
