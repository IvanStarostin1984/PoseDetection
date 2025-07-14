import sys
import subprocess
import time


def test_server_starts():
    proc = subprocess.Popen(
        [sys.executable, '-m', 'backend.server'],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
    )
    try:
        time.sleep(1)
        assert proc.poll() is None
    finally:
        proc.terminate()
        proc.wait(timeout=5)


