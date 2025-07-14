interface MetricsPanelProps {
  data?: Record<string, number>;
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ data }) => {
  const balance = data?.balance ?? 0;
  return (
    <div className="metrics-panel">Balance: {balance.toFixed(2)}</div>
  );
};

export default MetricsPanel;
