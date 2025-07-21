# Documentation

This project demonstrates a basic real-time human pose estimation system. The
full assignment and requirements are listed in
[tech-challenge.txt](tech-challenge.txt).

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
webcam frames, encodes each one as a JPEG and sends it to this endpoint. The
server decodes these bytes, runs `PoseDetector`, and streams pose metrics as
JSON. The metrics are calculated in `backend/analytics.py`:

```python
from backend.analytics import extract_pose_metrics

# landmarks is a dict like {'left_hip': {'x': 0.5, 'y': 0.5}, ...}
metrics = extract_pose_metrics(landmarks)
```

The returned dictionary contains ``knee_angle`` in degrees,
``balance`` between the hips, ``posture_angle`` and ``pose_class``.
It also includes an ``fps`` metric for the current frame rate.

Start the backend server with:

```bash
python -m backend.server
```

The pose detector uses `static_image_mode=False` for real-time
performance with continuous frames.

## Frontend metrics panel

The React frontend displays these metrics below the video feed. They now appear
in a vertical list for readability. When connected you might see text like:

```text
Balance: 0.85
Pose: standing
Knee Angle: 160.00°
Posture: 30.00°
FPS: 25.00
```
