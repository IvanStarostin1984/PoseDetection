# Feature A Assumptions and Edge Cases

This project implements the first MVP feature described in the tech challenge:
real‑time pose detection with 17 keypoints and a simple analytics overlay.

## Assumptions

- A standard webcam provides frames at 20 fps or more.
- The environment has good lighting so detection accuracy stays above 80%.
- Clients connect via a local network to keep latency below 200 ms.
- The backend runs on Python with FastAPI and MediaPipe Pose.
- The frontend uses React, TypeScript and the Canvas API.

## Edge cases

- **Low light**: keypoints may be missing or inaccurate; the server should
  still respond without crashing.
- **Occluded joints**: when elbows or knees are hidden, metrics such as angles
  may default to `None`.
- **Slow devices**: if the webcam or CPU cannot maintain 20 fps, the client
  may see stutter and outdated analytics.
- **Network drop**: WebSocket connections might close unexpectedly and should
  reconnect gracefully.

These notes complement the main specification in
[docs/tech-challenge.txt](tech-challenge.txt).
