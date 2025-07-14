import { useEffect, useRef } from 'react';
import useWebSocket from '../hooks/useWebSocket';
import { drawSkeleton, Point } from '../utils/poseDrawing';
import MetricsPanel from './MetricsPanel';

interface PoseData {
  landmarks: Point[];
  metrics: Record<string, number>;
}

const PoseViewer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { poseData } = useWebSocket<PoseData>('/pose');

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
      <canvas ref={canvasRef} width={640} height={480} />
      <MetricsPanel data={poseData?.metrics} />
    </div>
  );
};

export default PoseViewer;
