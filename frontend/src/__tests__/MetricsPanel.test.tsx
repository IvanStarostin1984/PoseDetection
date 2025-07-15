import { render, screen } from '@testing-library/react';
import MetricsPanel from '../components/MetricsPanel';
import '@testing-library/jest-dom';

test('displays balance, pose and knee angle', () => {
  render(
    <MetricsPanel
      data={{ balance: 0.5, pose_class: 'standing', knee_angle: 45.5 }}
    />,
  );
  expect(
    screen.getByText(/Balance: 0\.50 Pose: standing Knee Angle: 45\.50°/),
  ).toBeInTheDocument();
});
