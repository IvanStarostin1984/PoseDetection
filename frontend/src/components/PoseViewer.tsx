import { useEffect, useRef, useState } from 'react';
import useWebSocket from '../hooks/useWebSocket';
import { drawSkeleton, PoseLandmark, resizeCanvas } from '../utils/poseDrawing';
import MetricsPanel, { PoseMetrics } from './MetricsPanel';

interface PoseData {
  landmarks: PoseLandmark[];
  metrics: PoseMetrics;
  model: string;
}

const PoseViewer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [wsKey, setWsKey] = useState(0);
  const { poseData, status, error, close, send } = useWebSocket<PoseData>(
    `/pose?c=${wsKey}`,
  );
  const [streaming, setStreaming] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [encodeMs, setEncodeMs] = useState(0);
  const [sizeKB, setSizeKB] = useState(0);
  const [clientFps, setClientFps] = useState(0);
  const [droppedFrames, setDroppedFrames] = useState(0);
  const [drawMs, setDrawMs] = useState(0);
  const [downlinkMs, setDownlinkMs] = useState(0);
  const [latencyMs, setLatencyMs] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const offscreenRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
  const encodePending = useRef(false);
  const frameTimes = useRef<number[]>([]);
  const tsSendRef = useRef(0);
  const maxVisHistory = useRef<{ ts: number; v: number }[]>([]);
  const watchdogRef = useRef<number>();

  const captureAndSend = () => {
    const video = videoRef.current;
    const off = offscreenRef.current;
    if (!video || !off || encodePending.current || document.hidden) {
      if (encodePending.current) {
        setDroppedFrames((d) => d + 1);
      }
      return;
    }
    const ctx = off.getContext('2d');
    if (!ctx) return;
    encodePending.current = true;
    const start = performance.now();
    off.width = video.videoWidth;
    off.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, off.width, off.height);
    off.toBlob(
      async (b) => {
        const end = performance.now();
        setEncodeMs(end - start);
        if (b) {
          setSizeKB(b.size / 1024);
          const ts = Date.now();
          tsSendRef.current = ts;
          const buf = new ArrayBuffer(8 + b.size);
          new DataView(buf).setFloat64(0, ts, true);
          let arrayBuf: ArrayBuffer;
          if ('arrayBuffer' in b) {
            arrayBuf = await (b as any).arrayBuffer();
          } else {
            arrayBuf = await new Promise((resolve) => {
              const fr = new FileReader();
              fr.onloadend = () => resolve(fr.result as ArrayBuffer);
              fr.readAsArrayBuffer(b);
            });
          }
          new Uint8Array(buf, 8).set(new Uint8Array(arrayBuf));
          send(buf);
        }
        encodePending.current = false;
        const now = end;
        frameTimes.current.push(now);
        while (frameTimes.current.length > 0 && now - frameTimes.current[0] > 1000) {
          frameTimes.current.shift();
        }
        if (frameTimes.current.length > 1) {
          const first = frameTimes.current[0];
          const last = frameTimes.current[frameTimes.current.length - 1];
          setClientFps(
            ((frameTimes.current.length - 1) * 1000) / (last - first),
          );
        } else {
          setClientFps(0);
        }
        scheduleWatchdog();
      },
      'image/jpeg',
    );
  };

  const scheduleWatchdog = () => {
    clearTimeout(watchdogRef.current);
    watchdogRef.current = window.setTimeout(() => {
      if (streaming && status === 'open' && videoReady) {
        captureAndSend();
      }
    }, 500);
  };

  useEffect(() => {
    if (streaming && status === 'open' && videoReady) {
      requestAnimationFrame(captureAndSend);
    } else {
      clearTimeout(watchdogRef.current);
    }
  }, [streaming, status, videoReady]);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const resize = () => resizeCanvas(video, canvas);
    video.addEventListener('loadedmetadata', resize);
    window.addEventListener('resize', resize);
    return () => {
      video.removeEventListener('loadedmetadata', resize);
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const ready = () => setVideoReady(true);
    video.addEventListener('canplay', ready);
    return () => {
      video.removeEventListener('canplay', ready);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let cancel = false;
    if (streaming) {
      setCameraError(null);
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (cancel) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }
          video.srcObject = stream;
          streamRef.current = stream;
        })
        .catch(() => {
          setCameraError('Webcam access denied');
        });
    } else if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      video.srcObject = null;
      setCameraError(null);
    }
    return () => {
      cancel = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        video.srcObject = null;
        streamRef.current = null;
      }
      setCameraError(null);
    };
  }, [streaming]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || !poseData || document.hidden) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const recv = Date.now();
    const tsOut = Number((poseData.metrics as any).ts_out ?? 0);
    setDownlinkMs(recv - tsOut * 1000);
    const nowVis = Math.max(
      0,
      ...poseData.landmarks.map((l) => Number(l.visibility ?? 0)),
    );
    const nowTs = performance.now();
    maxVisHistory.current.push({ ts: nowTs, v: nowVis });
    while (maxVisHistory.current.length > 0 &&
           nowTs - maxVisHistory.current[0].ts > 500) {
      maxVisHistory.current.shift();
    }
    const sorted = maxVisHistory.current
      .map((h) => h.v)
      .sort((a, b) => a - b);
    const median = sorted.length
      ? sorted[Math.floor(sorted.length / 2)]
      : 0;
    const threshold = Math.max(0.3, 0.6 * median);
    const start = performance.now();
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const transform = getComputedStyle(video).transform;
    if (transform.startsWith('matrix(-1')) {
      ctx.translate(video.videoWidth, 0);
      ctx.scale(-1, 1);
    }
    drawSkeleton(ctx, poseData.landmarks, threshold);
    ctx.restore();
    const end = performance.now();
    setDrawMs(end - start);
    setLatencyMs(Date.now() - tsSendRef.current);
    requestAnimationFrame(captureAndSend);
  }, [poseData]);

  const metrics: PoseMetrics | undefined = poseData
    ? {
        ...poseData.metrics,
        fps: Number((poseData.metrics as any).fps ?? 0),
        inferMs: Number((poseData.metrics as any).infer_ms ?? 0),
        jsonMs: Number((poseData.metrics as any).json_ms ?? 0),
        encodeMs,
        sizeKB,
        drawMs,
        downlinkMs,
        latencyMs,
        clientFps,
        droppedFrames,
        model: poseData.model,
      }
    : undefined;

  return (
    <>
      <div className="pose-container">
        <video ref={videoRef} autoPlay muted playsInline />
        <canvas ref={canvasRef} className="overlay" />
      </div>
      <MetricsPanel data={metrics} />
      {error && <div className="ws-error">Error: {error}</div>}
      {cameraError && (
        <div className="camera-error">Error: {cameraError}</div>
      )}
      <div className="connection-status">Connection: {status}</div>
      <button
        onClick={() => {
          if (streaming) {
            close();
            setStreaming(false);
          } else {
            setWsKey((k) => k + 1);
            setStreaming(true);
          }
        }}
      >
        {streaming ? 'Stop Webcam' : 'Start Webcam'}
      </button>
    </>
  );
};

export default PoseViewer;
