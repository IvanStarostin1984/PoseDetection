import { render, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import useWebSocket from '../hooks/useWebSocket';

jest.mock('../hooks/useWebSocket');
const mockWS = useWebSocket as jest.Mock;

beforeEach(() => {
  mockWS.mockReturnValue({ poseData: null, status: 'open', error: null, close: jest.fn() });
});

class FakeStream {
  getTracks() {
    return [];
  }
}

function mockMedia() {
  const stream = new FakeStream() as unknown as MediaStream;
  const getUserMedia = jest.fn().mockResolvedValue(stream);
  Object.defineProperty(navigator, 'mediaDevices', {
    value: { getUserMedia },
    configurable: true,
  });
  return { stream, getUserMedia };
}

test('assigns webcam stream to video element', async () => {
  const { stream, getUserMedia } = mockMedia();
  const PoseViewer = require('../components/PoseViewer').default;
  const { container } = render(<PoseViewer />);
  await waitFor(() => {
    const video = container.querySelector('video') as HTMLVideoElement;
    expect(video.srcObject).toBe(stream);
  });
  expect(getUserMedia).toHaveBeenCalled();
});

test('canvas matches video dimensions after metadata loads', async () => {
  const { stream } = mockMedia();
  const PoseViewer = require('../components/PoseViewer').default;
  const { container } = render(<PoseViewer />);
  const video = container.querySelector('video') as HTMLVideoElement;
  const canvas = container.querySelector('canvas') as HTMLCanvasElement;
  await waitFor(() => {
    expect(video.srcObject).toBe(stream);
  });
  Object.defineProperty(video, 'videoWidth', { value: 320 });
  Object.defineProperty(video, 'videoHeight', { value: 240 });
  fireEvent(video, new Event('loadedmetadata'));
  await waitFor(() => {
    expect(canvas.width).toBe(320);
    expect(canvas.height).toBe(240);
  });
});

test('toggle button stops and starts the webcam', async () => {
  const { stream, getUserMedia } = mockMedia();
  const PoseViewer = require('../components/PoseViewer').default;
  const { container, getByRole } = render(<PoseViewer />);
  const button = getByRole('button');

  await waitFor(() => {
    const video = container.querySelector('video') as HTMLVideoElement;
    expect(video.srcObject).toBe(stream);
  });
  expect(button).toHaveTextContent('Stop Webcam');

  fireEvent.click(button);
  await waitFor(() => {
    const video = container.querySelector('video') as HTMLVideoElement;
    expect(video.srcObject).toBeFalsy();
  });
  expect(button).toHaveTextContent('Start Webcam');

  fireEvent.click(button);
  await waitFor(() => {
    const video = container.querySelector('video') as HTMLVideoElement;
    expect(video.srcObject).toBe(stream);
  });
  expect(getUserMedia).toHaveBeenCalledTimes(2);
});

test('stop button closes the WebSocket', async () => {
  const { stream, getUserMedia } = mockMedia();
  mockWS.mockImplementation(() => {
    const [status, setStatus] = require('react').useState('open');
    return { poseData: null, status: status as 'open' | 'closed', error: null, close: () => setStatus('closed') };
  });
  const PoseViewerMod = require('../components/PoseViewer').default;
  const { getByRole, getByText, container } = render(<PoseViewerMod />);
  const button = getByRole('button');
  await waitFor(() => {
    const video = container.querySelector('video') as HTMLVideoElement;
    expect(video.srcObject).toBe(stream);
  });
  expect(getByText('Connection: open')).toBeInTheDocument();
  fireEvent.click(button);
  await waitFor(() => {
    expect(getByText('Connection: closed')).toBeInTheDocument();
  });
  expect(getUserMedia).toHaveBeenCalled();
});
