from __future__ import annotations

import json
import cv2
import numpy as np
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
import asyncio
import time

from typing import Any, Dict, List

from .analytics import extract_pose_metrics
from .pose_detector import PoseDetector

import uvicorn

app = FastAPI()

# names for the 17-landmark subset used by PoseDetector
_NAMES = [lm.name.lower() for lm in PoseDetector.LANDMARKS]


def _to_named(points: List[Dict[str, float]]) -> Dict[str, Dict[str, float]]:
    named: Dict[str, Dict[str, float]] = {}
    for idx, pt in enumerate(points):
        if idx >= len(_NAMES):
            break
        named[_NAMES[idx]] = {"x": pt["x"], "y": pt["y"]}
    return named


def build_payload(points: List[Dict[str, float]], fps: float) -> Dict[str, Any]:
    """Return WebSocket payload from 17 keypoints and frame rate."""
    metrics = extract_pose_metrics(_to_named(points))
    metrics["fps"] = fps
    return {"landmarks": points, "metrics": metrics}


async def _process(det: PoseDetector, data: bytes) -> list[dict[str, float]]:
    arr = np.frombuffer(data, dtype=np.uint8)
    frame = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    return await asyncio.to_thread(det.process, frame)


@app.websocket("/pose")
async def pose_endpoint(ws: WebSocket) -> None:
    """Stream pose metrics over WebSocket."""
    await ws.accept()
    last_time = time.perf_counter()
    detector = PoseDetector()
    try:
        while True:
            try:
                data = await ws.receive_bytes()
            except WebSocketDisconnect:
                break

            try:
                start_infer = time.perf_counter()
                points = await _process(detector, data)
                infer_ms = (time.perf_counter() - start_infer) * 1000.0
            except Exception:
                try:
                    await ws.send_text(json.dumps({"error": "process failed"}))
                except WebSocketDisconnect:
                    break
                continue

            if not points:
                try:
                    await ws.send_text(json.dumps({"error": "no landmarks"}))
                except WebSocketDisconnect:
                    break
                continue

            now = time.perf_counter()
            delta = now - last_time
            fps = 1.0 / delta if delta > 0 else float("inf")
            last_time = now

            start_json = time.perf_counter()
            payload = build_payload(points, fps)
            json_ms = (time.perf_counter() - start_json) * 1000.0
            payload["metrics"]["infer_ms"] = infer_ms
            payload["metrics"]["json_ms"] = json_ms
            try:
                await ws.send_text(json.dumps(payload))
            except WebSocketDisconnect:
                break
    finally:
        detector.close()


app.mount(
    "/",
    StaticFiles(directory="frontend/dist", html=True),
    name="static",
)


def main() -> None:
    """Launch the FastAPI application using uvicorn."""
    uvicorn.run(app, host="0.0.0.0", port=8000)


if __name__ == "__main__":
    main()
