from __future__ import annotations

import json
import cv2
import mediapipe as mp
from fastapi import FastAPI, WebSocket

from .analytics import extract_pose_metrics

import uvicorn

app = FastAPI()
mp_pose = mp.solutions.pose.Pose()


@app.websocket("/pose")
async def pose_endpoint(ws: WebSocket) -> None:
    """Stream pose metrics over WebSocket."""
    await ws.accept()
    cap = cv2.VideoCapture(0)
    try:
        while True:
            ok, frame = cap.read()
            if not ok:
                await ws.send_text(json.dumps({"error": "no frame"}))
                break

            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = mp_pose.process(rgb)
            if not results.pose_landmarks:
                await ws.send_text(json.dumps({"error": "no landmarks"}))
                continue

            lms: dict[str, dict[str, float]] = {}
            for idx, landmark in enumerate(results.pose_landmarks.landmark):
                name = mp.solutions.pose.PoseLandmark(idx).name.lower()
                lms[name] = {"x": landmark.x, "y": landmark.y}

            metrics = extract_pose_metrics(lms)
            await ws.send_text(json.dumps(metrics))
    finally:
        cap.release()


def main() -> None:
    """Launch the FastAPI application using uvicorn."""
    uvicorn.run(app, host="0.0.0.0", port=8000)


if __name__ == "__main__":
    main()
