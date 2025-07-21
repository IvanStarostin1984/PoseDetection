import { render, screen } from '@testing-library/react';
import MetricsPanel from '../components/MetricsPanel';
import '@testing-library/jest-dom';

test('displays all metrics', () => {
  render(
    <MetricsPanel
      data={{
        balance: 0.5,
        pose_class: 'standing',
        knee_angle: 45.5,
        posture_angle: 30.0,
        fps: 20,
        cpu_percent: 50,
        mem_mb: 200,
        encodeMs: 5,
        sizeKB: 12.3,
        drawMs: 8,
        clientFps: 15,
        droppedFrames: 2,
      }}
    />,
  );
  expect(screen.getByText(/Balance: 0\.50/)).toBeInTheDocument();
  expect(screen.getByText(/Pose: standing/)).toBeInTheDocument();
  expect(screen.getByText(/Knee Angle: 45\.50°/)).toBeInTheDocument();
  expect(screen.getByText(/Posture: 30\.00°/)).toBeInTheDocument();
  expect(screen.getByText(/FPS: 20\.00/)).toBeInTheDocument();
  expect(screen.getByText(/CPU: 50 %/)).toBeInTheDocument();
  expect(screen.getByText(/Mem: 200 MB/)).toBeInTheDocument();
  expect(screen.getByText(/Encode: 5\.00 ms/)).toBeInTheDocument();
  expect(screen.getByText(/Size: 12\.3 KB/)).toBeInTheDocument();
  expect(screen.getByText(/Draw: 8\.00 ms/)).toBeInTheDocument();
  expect(screen.getByText(/Client FPS: 15\.00/)).toBeInTheDocument();
  expect(screen.getByText(/Dropped Frames: 2/)).toBeInTheDocument();
});
