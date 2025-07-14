import { render, screen } from '@testing-library/react';
import MetricsPanel from '../components/MetricsPanel';
import '@testing-library/jest-dom';

test('displays balance and pose', () => {
  render(<MetricsPanel data={{ balance: 0.5, pose_class: 'standing' }} />);
  expect(screen.getByText(/Balance: 0\.50 Pose: standing/)).toBeInTheDocument();
});
