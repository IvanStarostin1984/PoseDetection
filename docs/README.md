# Documentation

This project demonstrates a basic real-time human pose estimation system. The
full assignment and requirements are listed in
[tech-challenge.txt](tech-challenge.txt).

Placeholder for project docs.

## Backend analytics

The backend exposes a WebSocket endpoint at `/pose`. It captures webcam frames
with MediaPipe and streams pose metrics as JSON. The metrics are calculated in
`backend/analytics.py`:

```python
from backend.analytics import extract_pose_metrics

# landmarks is a dict like {'left_hip': {'x': 0.5, 'y': 0.5}, ...}
metrics = extract_pose_metrics(landmarks)
```

The returned dictionary contains ``knee_angle`` in degrees,
``balance`` between the hips and ``pose_class`` which is either
``"standing"`` or ``"sitting"`` when the angles can be computed.

Start the backend server with:

```bash
python -m backend.server

```

It listens on port 8000 by default, so the frontend must connect to
`ws://localhost:8000/pose`. Use the `--port` option from issue #1 to change
the port if needed.
