#!/usr/bin/env python3
"""Display today's date in ISO format.

This simple utility prints the current date to stdout, useful for checking
what date it is or for scripting purposes.
"""
from __future__ import annotations

import sys
from datetime import date


def main() -> int:
    """Print today's date in ISO format (YYYY-MM-DD).

    Returns
    -------
    int
        Always returns ``0`` to indicate success.
    """
    today = date.today().isoformat()
    print(f"Today's date is: {today}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
