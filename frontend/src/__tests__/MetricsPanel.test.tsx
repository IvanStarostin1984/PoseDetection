import { render, screen } from '@testing-library/react';
import MetricsPanel from '../components/MetricsPanel';
import '@testing-library/jest-dom';

test('displays balance, pose, knee and posture angle', () => {
  render(
    <MetricsPanel
      data={{
        balance: 0.5,
        pose_class: 'standing',
        knee_angle: 45.5,
        posture_angle: 30.0,
      }}
    />,
  );
  expect(screen.getByText(/Balance: 0\.50/)).toBeInTheDocument();
  expect(screen.getByText(/Pose: standing/)).toBeInTheDocument();
  expect(screen.getByText(/Knee Angle: 45\.50°/)).toBeInTheDocument();
  expect(screen.getByText(/Posture: 30\.00°/)).toBeInTheDocument();
});
