from backend.server import build_payload
import subprocess
import sys
import time

def test_build_payload_format():
    lms = {
        'hip': {'x': 0.1, 'y': 0.2},
        'knee': {'x': 0.3, 'y': 0.4},
        'ankle': {'x': 0.5, 'y': 0.6},
        'left_hip': {'x': 0.1, 'y': 0.2},
        'right_hip': {'x': 0.2, 'y': 0.2},
    }
    payload = build_payload(lms)
    assert isinstance(payload['landmarks'], list)
    assert payload['landmarks'][0] == {'x': 0.1, 'y': 0.2}
    metrics = payload['metrics']
    assert {'knee_angle', 'balance'} <= metrics.keys()


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
