import { render, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import useWebSocket from '../hooks/useWebSocket';
import PoseViewer from '../components/PoseViewer';

jest.mock('../hooks/useWebSocket');
const mockWS = useWebSocket as jest.Mock;

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

let origRAF: typeof requestAnimationFrame;
let mockToBlob: jest.Mock;

beforeEach(() => {
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
  mockToBlob = jest.fn();
  Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
    configurable: true,
    value: (...args: unknown[]) => {
      const [cb] = args as [(b: Blob) => void];
      mockToBlob(...args);
      cb(new Blob());
    },
  });
  jest.spyOn(performance, 'now').mockImplementationOnce(() => 0).mockImplementationOnce(() => 5);
  origRAF = window.requestAnimationFrame;
  window.requestAnimationFrame = (cb: FrameRequestCallback) => {
    cb(0);
    return 1;
  };
});

afterEach(() => {
  delete (HTMLCanvasElement.prototype as any).getContext;
  delete (HTMLCanvasElement.prototype as any).toBlob;
  (performance.now as jest.Mock).mockRestore();
  window.requestAnimationFrame = origRAF;
  mockToBlob.mockReset();
});

test('encodeMs stays below 7ms for 640x360 frame', async () => {
  const { stream } = mockMedia();
  let setPose: (p: any) => void = () => {};
  mockWS.mockImplementation(() => {
    const [poseData, setData] = require('react').useState(null);
    setPose = setData;
    return { poseData, status: 'open', error: null, close: jest.fn(), send: jest.fn() };
  });
  const { container } = render(<PoseViewer />);
  const video = container.querySelector('video') as HTMLVideoElement;
  await waitFor(() => {
    expect(video.srcObject).toBe(stream);
  });
  Object.defineProperty(video, 'videoWidth', { value: 640 });
  Object.defineProperty(video, 'videoHeight', { value: 360 });
  Object.defineProperty(video, 'readyState', { value: 2 });
  fireEvent(video, new Event('loadedmetadata'));
  window.dispatchEvent(new Event('resize'));
  require('@testing-library/react').act(() => {
    setPose({ landmarks: [], metrics: { balance: 0, pose_class: '', knee_angle: 0, posture_angle: 0, fps: 0 } });
  });
  await waitFor(() => {
    const panel = container.querySelector('.metrics-panel') as HTMLElement;
    const enc = Array.from(panel.querySelectorAll('p')).find((p) =>
      p.textContent?.startsWith('Encode:')
    );
    expect(enc).toBeTruthy();
    const value = parseFloat(enc!.textContent!.replace(/[^0-9.-]/g, ''));
    expect(value).toBeLessThan(7);
  });
});
