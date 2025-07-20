import { render, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import useWebSocket from '../hooks/useWebSocket';

jest.mock('../hooks/useWebSocket');
const mockWS = useWebSocket as jest.Mock;

let resizeCb: ResizeObserverCallback;
class MockRO {
  observe = jest.fn();
  disconnect = jest.fn();
  constructor(cb: ResizeObserverCallback) {
    resizeCb = cb;
  }
}

beforeEach(() => {
  (global as any).ResizeObserver = MockRO as unknown as typeof ResizeObserver;
  mockWS.mockReturnValue({
    poseData: null,
    status: 'open',
    error: null,
    close: jest.fn(),
    send: jest.fn(),
  });
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
        save: jest.fn(),
        restore: jest.fn(),
        scale: jest.fn(),
        translate: jest.fn(),
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
  delete (global as any).ResizeObserver;
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
  const origRect = HTMLVideoElement.prototype.getBoundingClientRect;
  HTMLVideoElement.prototype.getBoundingClientRect = () => ({
    width: 320,
    height: 240,
  } as DOMRect);
  const PoseViewer = require('../components/PoseViewer').default;
  const { container } = render(<PoseViewer />);
  const video = container.querySelector('video') as HTMLVideoElement;
  const canvas = container.querySelector('canvas') as HTMLCanvasElement;
  await waitFor(() => {
    expect(video.srcObject).toBe(stream);
  });
  fireEvent(video, new Event('loadedmetadata'));
  resizeCb([] as any, {} as ResizeObserver);
  await waitFor(() => {
    expect(canvas.width).toBe(320);
    expect(canvas.height).toBe(240);
  });
  HTMLVideoElement.prototype.getBoundingClientRect = origRect;
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

test('sends frames over WebSocket', async () => {
  jest.useFakeTimers();
  const { stream } = mockMedia();
  const send = jest.fn();
  let setPose: (p: any) => void = () => {};
  mockWS.mockImplementation(() => {
    const [poseData, setData] = require('react').useState(null);
    setPose = setData;
    return { poseData, status: 'open', error: null, close: jest.fn(), send };
  });
  const origGetContext = HTMLCanvasElement.prototype.getContext;
  const origToBlob = HTMLCanvasElement.prototype.toBlob;
  const origRect = HTMLVideoElement.prototype.getBoundingClientRect;
  const rect = { width: 1, height: 1 } as { width: number; height: number };
  Object.defineProperty(HTMLVideoElement.prototype, 'getBoundingClientRect', {
    configurable: true,
    value: () => rect as DOMRect,
  });
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
        save: jest.fn(),
        restore: jest.fn(),
        scale: jest.fn(),
        translate: jest.fn(),
      } as unknown as CanvasRenderingContext2D;
    },
  });
  Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
    configurable: true,
    value: (cb: (b: Blob) => void) => cb(new Blob()),
  });

  const PoseViewer = require('../components/PoseViewer').default;
  const { container } = render(<PoseViewer />);
  const video = container.querySelector('video') as HTMLVideoElement;
  const canvas = container.querySelector('canvas') as HTMLCanvasElement;
  await waitFor(() => {
    expect(video.srcObject).toBe(stream);
  });
  Object.defineProperty(video, 'videoWidth', { value: 1 });
  Object.defineProperty(video, 'videoHeight', { value: 1 });
  fireEvent(video, new Event('loadedmetadata'));
  resizeCb([] as any, {} as ResizeObserver);
  await waitFor(() => {
    expect(canvas.width).toBe(1);
    expect(canvas.height).toBe(1);
  });
  rect.width = 2;
  rect.height = 2;
  resizeCb([] as any, {} as ResizeObserver);
  require('@testing-library/react').act(() => {
    setPose({ landmarks: [], metrics: { balance: 0, pose_class: '', knee_angle: 0, posture_angle: 0 } });
  });
  jest.advanceTimersByTime(100);
  expect(canvas.width).toBe(2);
  expect(canvas.height).toBe(2);
  expect(send).toHaveBeenCalled();
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    configurable: true,
    value: origGetContext,
  });
  Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
    configurable: true,
    value: origToBlob,
  });
  Object.defineProperty(HTMLVideoElement.prototype, 'getBoundingClientRect', {
    configurable: true,
    value: origRect,
  });
  jest.useRealTimers();
});
