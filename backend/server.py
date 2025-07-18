from __future__ import annotations

import json
import cv2
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
import asyncio

from typing import Any, Dict, List

from .analytics import extract_pose_metrics
from .pose_detector import PoseDetector

import uvicorn

app = FastAPI()
app.mount(
    "/",
    StaticFiles(directory="frontend/dist", html=True),
    name="static",
)

# names for the 17-landmark subset used by PoseDetector
_NAMES = [lm.name.lower() for lm in PoseDetector.LANDMARKS]


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


async def _read_frame(cap: cv2.VideoCapture) -> tuple[bool, Any]:
    return await asyncio.to_thread(cap.read)


async def _process(det: PoseDetector, frame: Any) -> list[dict[str, float]]:
    return await asyncio.to_thread(det.process, frame)


@app.websocket("/pose")
async def pose_endpoint(ws: WebSocket) -> None:
    """Stream pose metrics over WebSocket."""
    await ws.accept()
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        await ws.send_text(json.dumps({"error": "camera failed"}))
        await ws.close()
        cap.release()
        return
    detector = PoseDetector()
    try:
        while True:
            ok, frame = await _read_frame(cap)
            if not ok:
                await ws.send_text(json.dumps({"error": "no frame"}))
                await ws.close()
                break

            try:
                points = await _process(detector, frame)
            except Exception:
                await ws.send_text(json.dumps({"error": "process failed"}))
                await ws.close()
                break

            if not points:
                await ws.send_text(json.dumps({"error": "no landmarks"}))
                continue

            payload = build_payload(points)
            await ws.send_text(json.dumps(payload))
    except (WebSocketDisconnect, RuntimeError):
        await ws.close()
    except Exception:
        await ws.close()
        raise
    finally:
        cap.release()
        detector.close()


def main() -> None:
    """Launch the FastAPI application using uvicorn."""
    uvicorn.run(app, host="0.0.0.0", port=8000)


if __name__ == "__main__":
    main()
