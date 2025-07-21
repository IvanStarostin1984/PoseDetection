export interface PoseMetrics {
  balance: number;
  pose_class: string;
  knee_angle: number;
  posture_angle: number;
  fps: number;
  [key: string]: number | string;
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
  return (
    <div className="metrics-panel">
      <p>Balance: {balance.toFixed(2)}</p>
      <p>Pose: {pose}</p>
      <p>Knee Angle: {knee.toFixed(2)}°</p>
      <p>Posture: {posture.toFixed(2)}°</p>
      <p>FPS: {fps.toFixed(2)}</p>
    </div>
  );
};

export default MetricsPanel;
