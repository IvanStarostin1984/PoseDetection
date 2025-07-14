interface MetricsPanelProps {
  data?: Record<string, number | string>;
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ data }) => {
  const balance = Number(data?.balance ?? 0);
  const pose = data?.pose_class ?? '';
  return (
    <div className="metrics-panel">Balance: {balance.toFixed(2)} Pose: {pose}</div>
  );
};

export default MetricsPanel;
