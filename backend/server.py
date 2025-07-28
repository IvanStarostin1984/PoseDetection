from __future__ import annotations

import json
import contextlib
from contextlib import asynccontextmanager
import cv2
import numpy as np
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from collections import deque
import asyncio
import time
import struct

from typing import Any, Dict, List, Deque

from .config import VISIBILITY_MIN

from .analytics import extract_pose_metrics, replace_nan
from .pose_detector import PoseDetector

try:
    import psutil  # type: ignore
except Exception:  # pragma: no cover - optional dependency
    psutil = None

import uvicorn


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Start and stop optional CPU sampler."""
    global SAMPLER_TASK
    if PROC is not None:
        SAMPLER_TASK = asyncio.create_task(_sample_proc())
    try:
        yield
    finally:
        if SAMPLER_TASK:
            SAMPLER_TASK.cancel()
            with contextlib.suppress(asyncio.CancelledError):
                await SAMPLER_TASK


app = FastAPI(lifespan=lifespan)

# optional CPU/memory sampling
PROC = psutil.Process() if psutil else None
CPU_HISTORY: Deque[float] = deque(maxlen=5)
RSS_HISTORY: Deque[int] = deque(maxlen=5)
SAMPLER_TASK: asyncio.Task[None] | None = None

# names for the 17-landmark subset used by PoseDetector
_NAMES = [lm.name.lower() for lm in PoseDetector.LANDMARKS]


def _to_named(points: List[Dict[str, float]]) -> Dict[str, Dict[str, float]]:
    named: Dict[str, Dict[str, float]] = {}
    for idx, pt in enumerate(points):
        if idx >= len(_NAMES):
            break
        if pt.get("visibility", 0.0) >= VISIBILITY_MIN:
            named[_NAMES[idx]] = {"x": pt["x"], "y": pt["y"]}
    return named


async def _sample_proc() -> None:
    """Collect CPU and memory usage once per second."""
    assert PROC is not None
    while True:
        CPU_HISTORY.append(PROC.cpu_percent(interval=None))
        RSS_HISTORY.append(PROC.memory_info().rss)
        await asyncio.sleep(1)


def build_payload(
    points: List[Dict[str, float]], fps: float, fps_avg: float
) -> Dict[str, Any]:
    """Return WebSocket payload from 17 keypoints and frame rates."""
    metrics = extract_pose_metrics(_to_named(points))
    metrics["fps"] = fps
    metrics["fps_avg"] = fps_avg
    cpu = sum(CPU_HISTORY) / len(CPU_HISTORY) if CPU_HISTORY else 0.0
    rss = int(sum(RSS_HISTORY) / len(RSS_HISTORY)) if RSS_HISTORY else 0
    metrics["cpu_percent"] = cpu
    metrics["rss_bytes"] = rss
    metrics = {k: replace_nan(v) for k, v in metrics.items()}
    complexity = getattr(PoseDetector, "MODEL_COMPLEXITY", 1)
    model = "lite" if complexity == 0 else "full"
    return {"landmarks": points, "metrics": metrics, "model": model}


async def _process(
    det: PoseDetector, data: bytes
) -> tuple[list[dict[str, float]], float]:
    """Decode JPEG bytes, resize and run pose detection."""
    arr = np.frombuffer(data, dtype=np.uint8)
    frame = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if frame is None:
        raise ValueError("decode failed")
    height, width = frame.shape[:2]
    long_side = max(height, width)
    if long_side > 0 and long_side != 256:
        scale = 256 / float(long_side)
        w = int(round(width * scale))
        h = int(round(height * scale))
        frame = cv2.resize(frame, (w, h), interpolation=cv2.INTER_AREA)
    start = time.perf_counter()
    points = await asyncio.to_thread(det.process, frame)
    infer_ms = (time.perf_counter() - start) * 1000.0
    return points, infer_ms


@app.websocket("/pose")
async def pose_endpoint(ws: WebSocket) -> None:
    """Stream pose metrics over WebSocket."""
    await ws.accept()
    last_time = time.perf_counter()
    times: Deque[float] = deque([last_time], maxlen=30)
    detector = PoseDetector()
    try:
        while True:
            try:
                data = await ws.receive_bytes()
            except WebSocketDisconnect:
                break

            ts_send = struct.unpack("<d", data[:8])[0]
            frame_bytes = data[8:]
            ts_recv_ms = time.time() * 1000.0
            ts_recv_perf = time.perf_counter()
            try:
                start_infer = time.perf_counter()
                wait_ms = (start_infer - ts_recv_perf) * 1000.0
                points, infer_ms = await _process(detector, frame_bytes)
                uplink_ms = ts_recv_ms - ts_send
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
            times.append(now)
            fps_avg = (
                (len(times) - 1) / (times[-1] - times[0])
                if len(times) > 1 and times[-1] != times[0]
                else float("inf")
            )

            start_json = time.perf_counter()
            payload = build_payload(points, fps, fps_avg)
            json_ms = (time.perf_counter() - start_json) * 1000.0
            payload["metrics"].update(
                {
                    "infer_ms": replace_nan(infer_ms),
                    "json_ms": replace_nan(json_ms),
                    "uplink_ms": replace_nan(uplink_ms),
                    "wait_ms": replace_nan(wait_ms),
                    "ts_out": replace_nan(time.time()),
                }
            )
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
