from fastapi import FastAPI, WebSocket
import cv2

from .pose_detector import PoseDetector

app = FastAPI()
_detector = PoseDetector()
_capture = cv2.VideoCapture(0)


@app.on_event("shutdown")
def _cleanup() -> None:
    _capture.release()


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
