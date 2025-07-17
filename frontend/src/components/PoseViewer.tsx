import { useEffect, useRef, useState } from 'react';
import useWebSocket from '../hooks/useWebSocket';
import { drawSkeleton, Point } from '../utils/poseDrawing';
import MetricsPanel, { PoseMetrics } from './MetricsPanel';

interface PoseData {
  landmarks: Point[];
  metrics: PoseMetrics;
}

const PoseViewer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { poseData, status, error } = useWebSocket<PoseData>('/pose');
  const [streaming, setStreaming] = useState(true);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = canvasRef.current;
    let cancel = false;
    let onMeta: (() => void) | null = null;
    if (streaming) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (cancel) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }
          onMeta = () => {
            if (canvas) {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
            }
          };
          video.addEventListener('loadedmetadata', onMeta);
          video.srcObject = stream;
          streamRef.current = stream;
        })
        .catch(() => {
          // ignore failure to access webcam
        });
    } else if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      video.srcObject = null;
    }
    return () => {
      cancel = true;
      if (onMeta) {
        video.removeEventListener('loadedmetadata', onMeta);
        onMeta = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        video.srcObject = null;
        streamRef.current = null;
      }
    };
  }, [streaming]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !poseData) return;
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
      <div className="connection-status">Connection: {status}</div>
      <button onClick={() => setStreaming((s) => !s)}>
        {streaming ? 'Stop Webcam' : 'Start Webcam'}
      </button>
    </div>
  );
};

export default PoseViewer;
