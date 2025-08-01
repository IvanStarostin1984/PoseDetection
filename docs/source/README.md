# Documentation

This project demonstrates a basic real-time human pose estimation system. The
full assignment and requirements are listed in
[tech-challenge.txt](../tech-challenge.txt).

Placeholder for project docs.

The pose detector outputs 17 landmarks in the following order:
``nose``, ``left_eye``, ``right_eye``, ``left_ear``, ``right_ear``,
``left_shoulder``, ``right_shoulder``, ``left_elbow``, ``right_elbow``,
``left_wrist``, ``right_wrist``, ``left_hip``, ``right_hip``, ``left_knee``,
``right_knee``, ``left_ankle`` and ``right_ankle``.

The landmark coordinates are normalized between 0 and 1. When drawing the
pose skeleton these values are multiplied by the video's width and height to
obtain pixel positions.

## Backend analytics

The backend exposes a WebSocket endpoint at `/pose`. The browser captures
webcam frames, scales them so neither side exceeds `MAX_SIDE` pixels, encodes
each one as a JPEG with a quality around `0.55` and sends it to this endpoint.
The
server decodes these bytes, runs `PoseDetector`, and streams pose metrics as
JSON. The metrics are calculated in `backend/analytics.py`:

Webcam capture defaults to **640×360** so images stay small. Before
running inference the backend resizes each frame to `256` px using the
`backend.config.CAM_TARGET_RES` constant. Increase this value for higher
accuracy if the extra processing time is acceptable.

```python
from backend.analytics import extract_pose_metrics

# landmarks is a dict like {'left_hip': {'x': 0.5, 'y': 0.5}, ...}
metrics = extract_pose_metrics(landmarks)
```

The returned dictionary contains ``knee_angle`` in degrees,
``balance`` between the hips, ``posture_angle`` and ``pose_class``.
It also includes ``fps`` and ``fps_avg`` metrics for the current and average
frame rate. When ``psutil`` is installed the dictionary adds ``cpu_percent`` and
``rss_bytes`` for process usage statistics.

Start the backend server with:

```bash
python -m backend.server
```

The pose detector uses `static_image_mode=False` for real-time
performance with continuous frames.

## Frontend metrics panel

The React frontend displays these metrics below the video feed in a vertical
list for readability. Each line shows balance, pose, knee angle, posture angle,
FPS, infer and JSON times, encode time, blob size, draw time, uplink and wait
times, downlink delay, end-to-end latency, client FPS, dropped frames and the
model name. When `psutil` is installed the panel also shows CPU and memory
usage. When connected you might see text like:

```text
Balance: 0.85
Pose: standing
Knee Angle: 160.00°
Posture: 30.00°
FPS: 25.00
Encode: 5.00 ms
Size: 12.3 KB
Draw: 8.00 ms
Uplink: 4.00 ms
Wait: 1.00 ms
Downlink: 6.00 ms
Latency: 9.00 ms
Client FPS: 24.00
Dropped Frames: 0
CPU: 80.0 %
Mem: 120 MB
```
