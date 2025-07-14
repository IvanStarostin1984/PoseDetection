import { render, screen } from '@testing-library/react';
import MetricsPanel from '../components/MetricsPanel';
import '@testing-library/jest-dom';

test('displays balance metric', () => {
  render(<MetricsPanel data={{ balance: 0.5 }} />);
  expect(screen.getByText(/Balance: 0\.50/)).toBeInTheDocument();
});
