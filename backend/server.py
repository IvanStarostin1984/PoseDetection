from __future__ import annotations

import json
import cv2
import mediapipe as mp
from fastapi import FastAPI, WebSocket

from typing import Any, Dict, List

from .analytics import extract_pose_metrics
from .pose_detector import PoseDetector

import uvicorn

app = FastAPI()

# names for the first 17 MediaPipe landmarks
_NAMES = [lm.name.lower() for lm in list(mp.solutions.pose.PoseLandmark)[:17]]


def _to_named(points: List[Dict[str, float]]) -> Dict[str, Dict[str, float]]:
    named: Dict[str, Dict[str, float]] = {}
    for idx, pt in enumerate(points):
        if idx >= len(_NAMES):
            break
        named[_NAMES[idx]] = {"x": pt["x"], "y": pt["y"]}
    return named


def build_payload(points: List[Dict[str, float]]) -> Dict[str, Any]:
    """Return WebSocket payload from 17 keypoints."""
    metrics = extract_pose_metrics(_to_named(points))
    return {"landmarks": points, "metrics": metrics}


@app.websocket("/pose")
async def pose_endpoint(ws: WebSocket) -> None:
    """Stream pose metrics over WebSocket."""
    await ws.accept()
    cap = cv2.VideoCapture(0)
    detector = PoseDetector()
    try:
        while True:
            ok, frame = cap.read()
            if not ok:
                await ws.send_text(json.dumps({"error": "no frame"}))
                break

            points = detector.process(frame)
            if not points:
                await ws.send_text(json.dumps({"error": "no landmarks"}))
                continue

            payload = build_payload(points)
            await ws.send_text(json.dumps(payload))
    finally:
        cap.release()
        detector.close()


def main() -> None:
    """Launch the FastAPI application using uvicorn."""
    uvicorn.run(app, host="0.0.0.0", port=8000)


if __name__ == "__main__":
    main()
