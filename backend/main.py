from fastapi import FastAPI, WebSocket
import cv2
from contextlib import asynccontextmanager

from .pose_detector import PoseDetector

_capture = cv2.VideoCapture(0)
_detector = PoseDetector()


@asynccontextmanager
async def lifespan(_: FastAPI):
    yield
    _capture.release()


app = FastAPI(lifespan=lifespan)


@app.websocket("/pose")
async def pose_stream(websocket: WebSocket) -> None:
    """Send pose keypoints for each captured frame."""
    await websocket.accept()
    try:
        while True:
            ret, frame = _capture.read()
            if not ret:
                await websocket.send_json({"error": "capture failed"})
                break
            keypoints = _detector.process(frame)
            await websocket.send_json({"keypoints": keypoints})
    except Exception:
        await websocket.close()
        raise
