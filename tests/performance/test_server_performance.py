import asyncio
import time
from typing import Any

import backend.server as server


class DummyCap:
    def __init__(self, frames: int, times: list[float]) -> None:
        self._frames = frames
        self.released = False
        self.times = times

    def read(self) -> tuple[bool, Any]:
        if self._frames <= 0:
            return False, None
        self._frames -= 1
        self.times.append(time.perf_counter())
        return True, object()

    def release(self) -> None:
        self.released = True

    def isOpened(self) -> bool:
        return True


class DummyDetector:
    def process(self, frame: Any) -> list[dict[str, float]]:
        return [{"x": 0.0, "y": 0.0, "visibility": 1.0}] * 17

    def close(self) -> None:
        pass


class DummyWS:
    def __init__(self, times: list[float]) -> None:
        self.accepted = False
        self.sent: list[str] = []
        self.times = times
        self.closed = False

    async def accept(self) -> None:
        self.accepted = True

    async def send_text(self, text: str) -> None:
        self.sent.append(text)
        self.times.append(time.perf_counter())

    async def close(self) -> None:
        self.closed = True


async def _dummy_read_frame(cap: DummyCap) -> tuple[bool, Any]:
    return cap.read()


async def _dummy_process(det: DummyDetector, frame: Any) -> list[dict[str, float]]:
    return det.process(frame)


def test_pose_endpoint_performance(monkeypatch: Any) -> None:
    frame_count = 10
    cap_times: list[float] = []
    ws_times: list[float] = []

    monkeypatch.setattr(server, "_read_frame", _dummy_read_frame)
    monkeypatch.setattr(server, "_process", _dummy_process)
    monkeypatch.setattr(
        server.cv2, "VideoCapture", lambda *_a, **_k: DummyCap(frame_count, cap_times)
    )
    monkeypatch.setattr(server, "PoseDetector", lambda *_a, **_k: DummyDetector())

    ws = DummyWS(ws_times)
    asyncio.run(server.pose_endpoint(ws))

    assert ws.closed
    assert len(ws.sent) == frame_count + 1
    assert len(cap_times) == frame_count

    durations = [ws_times[i] - cap_times[i] for i in range(frame_count)]
    avg_loop = sum(durations) / frame_count
    assert avg_loop <= 0.05
    assert max(durations) < 0.2
