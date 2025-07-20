import { render, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import useWebSocket from '../hooks/useWebSocket';
import { drawSkeleton } from '../utils/poseDrawing';

jest.mock('../hooks/useWebSocket');
jest.mock('../utils/poseDrawing');
const mockWS = useWebSocket as jest.Mock;
const mockDraw = drawSkeleton as jest.Mock;

let resizeCb: ResizeObserverCallback;
class MockRO {
  observe = jest.fn();
  disconnect = jest.fn();
  constructor(cb: ResizeObserverCallback) {
    resizeCb = cb;
  }
}

let origDevicePixelRatio: number | undefined;


beforeEach(() => {
  (global as any).ResizeObserver = MockRO as unknown as typeof ResizeObserver;
  mockWS.mockReturnValue({
    poseData: null,
    status: 'open',
    error: null,
    close: jest.fn(),
    send: jest.fn(),
  });
  origDevicePixelRatio = (window as any).devicePixelRatio;
  Object.defineProperty(window, 'devicePixelRatio', {
    configurable: true,
    value: 2,
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
        lineWidth: 0,
        getTransform: () => ({ a: 1 }),
        save: jest.fn(),
        setTransform: jest.fn(),
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
  mockDraw.mockReset();
  if (origDevicePixelRatio === undefined) {
    delete (window as any).devicePixelRatio;
  } else {
    Object.defineProperty(window, 'devicePixelRatio', {
      configurable: true,
      value: origDevicePixelRatio,
    });
  }
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
    expect(canvas.width).toBe(640);
    expect(canvas.height).toBe(480);
  });
  HTMLVideoElement.prototype.getBoundingClientRect = origRect;
});

test('mirrors context when video transform flips horizontally', async () => {
  const { stream } = mockMedia();
  const ctx: any = {
    canvas: null,
    drawImage: jest.fn(),
    clearRect: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    lineWidth: 0,
    getTransform: () => ({ a: 1 }),
    save: jest.fn(),
    setTransform: jest.fn(),
    restore: jest.fn(),
    scale: jest.fn(),
    translate: jest.fn(),
  };
  const origGetContext = HTMLCanvasElement.prototype.getContext;
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    configurable: true,
    value: function () {
      ctx.canvas = this as HTMLCanvasElement;
      return ctx;
    },
  });
  const origRect = HTMLVideoElement.prototype.getBoundingClientRect;
  HTMLVideoElement.prototype.getBoundingClientRect = () => ({
    width: 100,
    height: 50,
  } as DOMRect);
  let setPose: (p: any) => void = () => {};
  mockWS.mockImplementation(() => {
    const [poseData, setData] = require('react').useState(null);
    setPose = setData;
    return { poseData, status: 'open', error: null, close: jest.fn(), send: jest.fn() };
  });
  const spy = jest
    .spyOn(window, 'getComputedStyle')
    .mockReturnValue({ transform: 'matrix(-1, 0, 0, 1, 0, 0)' } as CSSStyleDeclaration);
  const PoseViewer = require('../components/PoseViewer').default;
  const { container } = render(<PoseViewer />);
  const video = container.querySelector('video') as HTMLVideoElement;
  await waitFor(() => {
    expect(video.srcObject).toBe(stream);
  });
  Object.defineProperty(video, 'videoWidth', { value: 100 });
  Object.defineProperty(video, 'videoHeight', { value: 50 });
  fireEvent(video, new Event('loadedmetadata'));
  resizeCb([] as any, {} as ResizeObserver);
  require('@testing-library/react').act(() => {
    setPose({ landmarks: [], metrics: { balance: 0, pose_class: '', knee_angle: 0, posture_angle: 0 } });
  });
  await waitFor(() => {
    expect(ctx.translate).toHaveBeenCalledWith(100, 0);
    expect(ctx.scale).toHaveBeenCalledWith(-1, 1);
    expect(mockDraw).toHaveBeenCalled();
    const call = mockDraw.mock.calls[0];
    expect(call[2]).toBe(100);
    expect(call[3]).toBe(50);
    expect(ctx.lineWidth).toBeCloseTo(1);
  });
  spy.mockRestore();
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    configurable: true,
    value: origGetContext,
  });
  HTMLVideoElement.prototype.getBoundingClientRect = origRect;
});

test('scales context when rect size differs from video size', async () => {
  const { stream } = mockMedia();
  const ctx: any = {
    canvas: null,
    drawImage: jest.fn(),
    clearRect: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    lineWidth: 0,
    getTransform: () => ({ a: 1 }),
    save: jest.fn(),
    setTransform: jest.fn(),
    restore: jest.fn(),
    scale: jest.fn(),
    translate: jest.fn(),
  };
  const origGetContext = HTMLCanvasElement.prototype.getContext;
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    configurable: true,
    value: function () {
      ctx.canvas = this as HTMLCanvasElement;
      return ctx;
    },
  });
  const origRect = HTMLVideoElement.prototype.getBoundingClientRect;
  HTMLVideoElement.prototype.getBoundingClientRect = () => ({
    width: 100,
    height: 50,
  } as DOMRect);
  let setPose: (p: any) => void = () => {};
  mockWS.mockImplementation(() => {
    const [poseData, setData] = require('react').useState(null);
    setPose = setData;
    return { poseData, status: 'open', error: null, close: jest.fn(), send: jest.fn() };
  });
  const PoseViewer = require('../components/PoseViewer').default;
  const { container } = render(<PoseViewer />);
  const video = container.querySelector('video') as HTMLVideoElement;
  const canvas = container.querySelector('canvas') as HTMLCanvasElement;
  await waitFor(() => {
    expect(video.srcObject).toBe(stream);
  });
  Object.defineProperty(video, 'videoWidth', { value: 400 });
  Object.defineProperty(video, 'videoHeight', { value: 200 });
  fireEvent(video, new Event('loadedmetadata'));
  resizeCb([] as any, {} as ResizeObserver);
  require('@testing-library/react').act(() => {
    setPose({ landmarks: [], metrics: { balance: 0, pose_class: '', knee_angle: 0, posture_angle: 0 } });
  });
  await waitFor(() => {
    expect(canvas.width).toBe(200);
    expect(canvas.height).toBe(100);
    expect(ctx.save).toHaveBeenCalled();
    expect(ctx.scale).toHaveBeenCalledWith(0.5, 0.5);
    expect(ctx.lineWidth).toBeCloseTo(4);
  });
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    configurable: true,
    value: origGetContext,
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
  const ctx: any = {
    canvas: null,
    drawImage: jest.fn(),
    clearRect: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    lineWidth: 0,
    getTransform: () => ({ a: 1 }),
    scale: jest.fn(),
    save: jest.fn(),
    setTransform: jest.fn(),
    restore: jest.fn(),
    translate: jest.fn(),
  };
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    configurable: true,
    value: function () {
      ctx.canvas = this as HTMLCanvasElement;
      return ctx as CanvasRenderingContext2D;
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
  require('@testing-library/react').act(() => {
    setPose({ landmarks: [], metrics: { balance: 0, pose_class: '', knee_angle: 0, posture_angle: 0 } });
  });
  jest.advanceTimersByTime(100);
  expect(ctx.save).toHaveBeenCalled();
  expect(ctx.scale).toHaveBeenCalledWith(2, 2);
  expect(canvas.width).toBe(2);
  expect(canvas.height).toBe(2);
  rect.width = 2;
  rect.height = 2;
  resizeCb([] as any, {} as ResizeObserver);
  require('@testing-library/react').act(() => {
    setPose({ landmarks: [], metrics: { balance: 0, pose_class: '', knee_angle: 0, posture_angle: 0 } });
  });
  jest.advanceTimersByTime(100);
  expect(canvas.width).toBe(4);
  expect(canvas.height).toBe(4);
  expect(ctx.scale).toHaveBeenLastCalledWith(4, 4);
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
