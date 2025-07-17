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
