import sys
from pathlib import Path


def generate() -> int:
    """Create the example file used in tests.

    Purpose
    -------
    Write ``placeholder output`` to ``generated/example.txt`` so unit
    tests have a known artefact to check.

    Parameters
    ----------
    None

    Returns
    -------
    int
        ``0`` on success, ``1`` when a filesystem error occurs.

    Raises
    ------
    None: all exceptions are caught and converted into the return code.
    """
    try:
        out_path = Path(__file__).resolve().parents[1] / "generated" / "example.txt"
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text("placeholder output\n")
    except Exception as exc:  # defensive coding
        print(f"error: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(generate())
