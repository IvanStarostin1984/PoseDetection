import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import PoseViewer from '../components/PoseViewer';

jest.mock('../hooks/useWebSocket', () => ({
  __esModule: true,
  default: () => ({ poseData: null, status: 'open', error: 'failed to parse', send: jest.fn() }),
}));

beforeEach(() => {
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    configurable: true,
    value: function () {
      return {
        canvas: this,
        drawImage: jest.fn(),
        clearRect: jest.fn(),
        beginPath: jest.fn(),
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        stroke: jest.fn(),
        arc: jest.fn(),
        fill: jest.fn(),
      } as unknown as CanvasRenderingContext2D;
    },
  });
  Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
    configurable: true,
    value: (cb: (b: Blob) => void) => cb(new Blob()),
  });
});

afterEach(() => {
  delete (HTMLCanvasElement.prototype as any).getContext;
  delete (HTMLCanvasElement.prototype as any).toBlob;
});

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

test('shows camera error when getUserMedia fails', async () => {
  const getUserMedia = jest.fn().mockRejectedValue(new Error('denied'));
  Object.defineProperty(navigator, 'mediaDevices', {
    value: { getUserMedia },
    configurable: true,
  });

  const { findByText } = render(<PoseViewer />);
  expect(await findByText('Error: Webcam access denied')).toBeInTheDocument();
});


