import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import PoseViewer from '../components/PoseViewer';

jest.mock('../hooks/useWebSocket', () => ({
  __esModule: true,
  default: () => ({ poseData: null, status: 'open', error: 'failed to parse' }),
}));

test('renders WebSocket error message', () => {
  class FakeStream {
    getTracks() {
      return [];
    }
  }
  const getUserMedia = jest.fn().mockResolvedValue(new FakeStream() as unknown as MediaStream);
  Object.defineProperty(navigator, 'mediaDevices', {
    value: { getUserMedia },
    configurable: true,
  });

  const { getByText } = render(<PoseViewer />);
  expect(getByText('Error: failed to parse')).toBeInTheDocument();
});


