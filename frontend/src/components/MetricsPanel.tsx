interface MetricsPanelProps {
  data?: Record<string, number | string>;
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ data }) => {
  const balance = Number(data?.balance ?? 0);
  const pose = data?.pose_class ?? '';
  const knee = Number(data?.knee_angle ?? 0);
  return (
    <div className="metrics-panel">
      Balance: {balance.toFixed(2)} Pose: {pose} Knee Angle: {knee.toFixed(2)}°
    </div>
  );
};

export default MetricsPanel;
