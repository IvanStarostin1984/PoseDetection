import { useEffect, useRef, useState } from 'react';
import useWebSocket from '../hooks/useWebSocket';
import { drawSkeleton, Point } from '../utils/poseDrawing';
import alignCanvasToVideo from '../utils/alignCanvas';
import MetricsPanel, { PoseMetrics } from './MetricsPanel';

interface PoseData {
  landmarks: Point[];
  metrics: PoseMetrics;
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
  const streamRef = useRef<MediaStream | null>(null);
  const offscreenRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
  const resizeCanvas = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    alignCanvasToVideo(video, canvas);
  };

  useEffect(() => {
    const video = videoRef.current;
    const off = offscreenRef.current;
    if (!video || !off || !streaming || status !== 'open') return;
    const ctx = off.getContext('2d');
    if (!ctx) return;
    const id = setInterval(() => {
      off.width = video.videoWidth;
      off.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, off.width, off.height);
      off.toBlob((b) => {
        if (b) send(b);
      }, 'image/jpeg');
    }, 100);
    return () => clearInterval(id);
  }, [streaming, status, send]);

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
          video.addEventListener('loadedmetadata', resizeCanvas, { once: true });
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
      video.removeEventListener('loadedmetadata', resizeCanvas);
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
    if (!canvas || !video || !poseData) return;
    alignCanvasToVideo(video, canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawSkeleton(ctx, poseData.landmarks);
  }, [poseData]);

  return (
    <div className="pose-container">
      <video ref={videoRef} autoPlay muted />
      <canvas ref={canvasRef} />
      <MetricsPanel data={poseData?.metrics} />
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
    </div>
  );
};

export default PoseViewer;
