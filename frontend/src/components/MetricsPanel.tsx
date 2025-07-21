export interface PoseMetrics {
  balance: number;
  pose_class: string;
  knee_angle: number;
  posture_angle: number;
  fps: number;
  encodeMs?: number;
  sizeKB?: number;
  drawMs?: number;
  clientFps?: number;
  droppedFrames?: number;
  [key: string]: number | string | undefined;
}

interface MetricsPanelProps {
  data?: PoseMetrics;
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ data }) => {
  const balance = Number(data?.balance ?? 0);
  const pose = data?.pose_class ?? '';
  const knee = Number(data?.knee_angle ?? 0);
  const posture = Number(data?.posture_angle ?? 0);
  const fps = Number(data?.fps ?? 0);
  const encodeMs = Number(data?.encodeMs ?? 0);
  const sizeKB = Number(data?.sizeKB ?? 0);
  const drawMs = Number(data?.drawMs ?? 0);
  const clientFps = Number(data?.clientFps ?? 0);
  const droppedFrames = Number(data?.droppedFrames ?? 0);
  return (
    <div className="metrics-panel">
      <p>Balance: {balance.toFixed(2)}</p>
      <p>Pose: {pose}</p>
      <p>Knee Angle: {knee.toFixed(2)}°</p>
      <p>Posture: {posture.toFixed(2)}°</p>
      <p>FPS: {fps.toFixed(2)}</p>
      <p>Encode: {encodeMs.toFixed(2)} ms</p>
      <p>Size: {sizeKB.toFixed(1)} KB</p>
      <p>Draw: {drawMs.toFixed(2)} ms</p>
      <p>Client FPS: {clientFps.toFixed(2)}</p>
      <p>Dropped Frames: {droppedFrames}</p>
    </div>
  );
};

export default MetricsPanel;
