export interface PoseMetrics {
  balance: number;
  pose_class: string;
  knee_angle: number;
  posture_angle: number;
  fps: number;
  inferMs?: number;
  jsonMs?: number;
  encodeMs?: number;
  sizeKB?: number;
  drawMs?: number;
  uplink_ms?: number;
  wait_ms?: number;
  downlinkMs?: number;
  latencyMs?: number;
  clientFps?: number;
  droppedFrames?: number;
  model?: string;
  cpu_percent?: number;
  rss_bytes?: number;
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
  const inferMs = Number(data?.inferMs ?? 0);
  const jsonMs = Number(data?.jsonMs ?? 0);
  const encodeMs = Number(data?.encodeMs ?? 0);
  const sizeKB = Number(data?.sizeKB ?? 0);
  const drawMs = Number(data?.drawMs ?? 0);
  const uplinkMs = Number((data as any)?.uplink_ms ?? 0);
  const waitMs = Number((data as any)?.wait_ms ?? 0);
  const downlinkMs = Number(data?.downlinkMs ?? 0);
  const latencyMs = Number(data?.latencyMs ?? 0);
  const clientFps = Number(data?.clientFps ?? 0);
  const droppedFrames = Number(data?.droppedFrames ?? 0);
  const model = data?.model ?? '';
  const cpu = Number((data as any)?.cpu_percent ?? 0);
  const rssMB = Number((data as any)?.rss_bytes ?? 0) / (1024 * 1024);
  return (
    <div className="metrics-panel">
      <p>Balance: {balance.toFixed(2)}</p>
      <p>Pose: {pose}</p>
      <p>Knee Angle: {knee.toFixed(2)}°</p>
      <p>Posture: {posture.toFixed(2)}°</p>
      <p>FPS: {fps.toFixed(2)}</p>
      <p>Infer: {inferMs.toFixed(2)} ms</p>
      <p>JSON: {jsonMs.toFixed(2)} ms</p>
      <p>Encode: {encodeMs.toFixed(2)} ms</p>
      <p>Size: {sizeKB.toFixed(1)} KB</p>
      <p>Draw: {drawMs.toFixed(2)} ms</p>
      <p>Uplink: {uplinkMs.toFixed(2)} ms</p>
      <p>Wait: {waitMs.toFixed(2)} ms</p>
      <p>Downlink: {downlinkMs.toFixed(2)} ms</p>
      <p>Latency: {latencyMs.toFixed(2)} ms</p>
      <p>Client FPS: {clientFps.toFixed(2)}</p>
      <p>Dropped Frames: {droppedFrames}</p>
      <p>Model: {model}</p>
      <p>CPU: {cpu.toFixed(0)} %</p>
      <p>Mem: {rssMB.toFixed(0)} MB</p>
    </div>
  );
};

export default MetricsPanel;
