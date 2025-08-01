import { render, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import useWebSocket from "../hooks/useWebSocket";
import { drawSkeleton } from "../utils/poseDrawing";

jest.mock("../hooks/useWebSocket");
jest.mock("../utils/poseDrawing", () => {
  const actual = jest.requireActual("../utils/poseDrawing");
  return { ...actual, drawSkeleton: jest.fn() };
});
const mockWS = useWebSocket as jest.Mock;
const mockDraw = drawSkeleton as jest.Mock;

let origDevicePixelRatio: number | undefined;
let origRAF: typeof requestAnimationFrame;
let mockToBlob: jest.Mock;

beforeEach(() => {
  mockWS.mockReturnValue({
    poseData: null,
    status: "open",
    error: null,
    close: jest.fn(),
    send: jest.fn(),
  });
  origDevicePixelRatio = (window as any).devicePixelRatio;
  Object.defineProperty(window, "devicePixelRatio", {
    configurable: true,
    value: 2,
  });
  Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
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
  Object.defineProperty(HTMLCanvasElement.prototype, "toBlob", {
    configurable: true,
    value: (...args: unknown[]) => {
      const [cb] = args as [(b: Blob) => void];
      mockToBlob(...args);
      cb(new Blob());
    },
  });
  origRAF = window.requestAnimationFrame;
  window.requestAnimationFrame = (cb: FrameRequestCallback) => {
    cb(0);
    return 1;
  };
});

afterEach(() => {
  delete (HTMLCanvasElement.prototype as any).getContext;
  delete (HTMLCanvasElement.prototype as any).toBlob;
  mockDraw.mockReset();
  mockToBlob.mockReset();
  if (origDevicePixelRatio === undefined) {
    delete (window as any).devicePixelRatio;
  } else {
    Object.defineProperty(window, "devicePixelRatio", {
      configurable: true,
      value: origDevicePixelRatio,
    });
  }
  window.requestAnimationFrame = origRAF;
});

class FakeVideoTrack {
  getSettings() {
    return { width: 640, height: 360 };
  }
  stop() {
    return undefined;
  }
}

class FakeStream {
  tracks = [new FakeVideoTrack()];
  getTracks() {
    return this.tracks;
  }
  getVideoTracks() {
    return this.tracks;
  }
}

function mockMedia() {
  const stream = new FakeStream() as unknown as MediaStream;
  const getUserMedia = jest.fn().mockResolvedValue(stream);
  Object.defineProperty(navigator, "mediaDevices", {
    value: { getUserMedia },
    configurable: true,
  });
  return { stream, getUserMedia };
}

test("assigns webcam stream to video element", async () => {
  const { stream, getUserMedia } = mockMedia();
  const PoseViewer = require("../components/PoseViewer").default;
  const { container } = render(<PoseViewer />);
  await waitFor(() => {
    const video = container.querySelector("video") as HTMLVideoElement;
    expect(video.srcObject).toBe(stream);
  });
  expect(getUserMedia).toHaveBeenCalledWith({
    video: { width: { ideal: 640 }, height: { ideal: 360 } },
  });
});

test("canvas matches video dimensions after metadata loads", async () => {
  const { stream } = mockMedia();
  const origRect = HTMLVideoElement.prototype.getBoundingClientRect;
  HTMLVideoElement.prototype.getBoundingClientRect = () =>
    ({
      width: 320,
      height: 240,
    }) as DOMRect;
  const PoseViewer = require("../components/PoseViewer").default;
  const { container } = render(<PoseViewer />);
  const video = container.querySelector("video") as HTMLVideoElement;
  const canvas = container.querySelector("canvas") as HTMLCanvasElement;
  await waitFor(() => {
    expect(video.srcObject).toBe(stream);
  });
  fireEvent(video, new Event("loadedmetadata"));
  window.dispatchEvent(new Event("resize"));
  await waitFor(() => {
    expect(canvas.width).toBe(640);
    expect(canvas.height).toBe(480);
    const panel = container.querySelector(".metrics-panel");
    expect(panel?.textContent).toContain("Camera input: 640×360");
  });
  HTMLVideoElement.prototype.getBoundingClientRect = origRect;
});

test("mirrors context when video transform flips horizontally", async () => {
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
  Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
    configurable: true,
    value: function () {
      ctx.canvas = this as HTMLCanvasElement;
      return ctx;
    },
  });
  const origRect = HTMLVideoElement.prototype.getBoundingClientRect;
  HTMLVideoElement.prototype.getBoundingClientRect = () =>
    ({
      width: 100,
      height: 50,
    }) as DOMRect;
  let setPose: (p: any) => void = () => {};
  mockWS.mockImplementation(() => {
    const [poseData, setData] = require("react").useState(null);
    setPose = setData;
    return {
      poseData,
      status: "open",
      error: null,
      close: jest.fn(),
      send: jest.fn(),
    };
  });
  const spy = jest
    .spyOn(window, "getComputedStyle")
    .mockReturnValue({
      transform: "matrix(-1, 0, 0, 1, 0, 0)",
    } as CSSStyleDeclaration);
  const PoseViewer = require("../components/PoseViewer").default;
  const { container } = render(<PoseViewer />);
  const video = container.querySelector("video") as HTMLVideoElement;
  await waitFor(() => {
    expect(video.srcObject).toBe(stream);
  });
  Object.defineProperty(video, "videoWidth", { value: 100 });
  Object.defineProperty(video, "videoHeight", { value: 50 });
  fireEvent(video, new Event("loadedmetadata"));
  window.dispatchEvent(new Event("resize"));
  require("@testing-library/react").act(() => {
    setPose({
      landmarks: [],
      metrics: {
        balance: 0,
        pose_class: "",
        knee_angle: 0,
        posture_angle: 0,
        fps: 0,
      },
    });
  });
  await waitFor(() => {
    expect(ctx.translate).toHaveBeenCalledWith(100, 0);
    expect(ctx.scale).toHaveBeenCalledWith(-1, 1);
    expect(mockDraw).toHaveBeenCalled();
    const call = mockDraw.mock.calls[0];
    expect(call[2]).toBeCloseTo(0.3);
  });
  spy.mockRestore();
  Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
    configurable: true,
    value: origGetContext,
  });
  HTMLVideoElement.prototype.getBoundingClientRect = origRect;
});

test("scales context when rect size differs from video size", async () => {
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
  Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
    configurable: true,
    value: function () {
      ctx.canvas = this as HTMLCanvasElement;
      return ctx;
    },
  });
  const origRect = HTMLVideoElement.prototype.getBoundingClientRect;
  HTMLVideoElement.prototype.getBoundingClientRect = () =>
    ({
      width: 100,
      height: 50,
    }) as DOMRect;
  let setPose: (p: any) => void = () => {};
  mockWS.mockImplementation(() => {
    const [poseData, setData] = require("react").useState(null);
    setPose = setData;
    return {
      poseData,
      status: "open",
      error: null,
      close: jest.fn(),
      send: jest.fn(),
    };
  });
  const PoseViewer = require("../components/PoseViewer").default;
  const { container } = render(<PoseViewer />);
  const video = container.querySelector("video") as HTMLVideoElement;
  const canvas = container.querySelector("canvas") as HTMLCanvasElement;
  await waitFor(() => {
    expect(video.srcObject).toBe(stream);
  });
  Object.defineProperty(video, "videoWidth", { value: 400 });
  Object.defineProperty(video, "videoHeight", { value: 200 });
  fireEvent(video, new Event("loadedmetadata"));
  window.dispatchEvent(new Event("resize"));
  require("@testing-library/react").act(() => {
    setPose({
      landmarks: [],
      metrics: {
        balance: 0,
        pose_class: "",
        knee_angle: 0,
        posture_angle: 0,
        fps: 0,
      },
    });
  });
  await waitFor(() => {
    expect(canvas.width).toBe(200);
    expect(canvas.height).toBe(100);
    expect(ctx.save).toHaveBeenCalled();
    expect(ctx.scale).not.toHaveBeenCalled();
  });
  Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
    configurable: true,
    value: origGetContext,
  });
  HTMLVideoElement.prototype.getBoundingClientRect = origRect;
});

test("toggle button stops and starts the webcam", async () => {
  const { stream, getUserMedia } = mockMedia();
  const PoseViewer = require("../components/PoseViewer").default;
  const { container, getByRole } = render(<PoseViewer />);
  const button = getByRole("button");

  await waitFor(() => {
    const video = container.querySelector("video") as HTMLVideoElement;
    expect(video.srcObject).toBe(stream);
  });
  expect(button).toHaveTextContent("Stop Webcam");

  fireEvent.click(button);
  await waitFor(() => {
    const video = container.querySelector("video") as HTMLVideoElement;
    expect(video.srcObject).toBeFalsy();
  });
  expect(button).toHaveTextContent("Start Webcam");

  fireEvent.click(button);
  await waitFor(() => {
    const video = container.querySelector("video") as HTMLVideoElement;
    expect(video.srcObject).toBe(stream);
  });
  expect(getUserMedia).toHaveBeenCalledTimes(2);
});

test("stop button closes the WebSocket", async () => {
  const { stream, getUserMedia } = mockMedia();
  mockWS.mockImplementation(() => {
    const [status, setStatus] = require("react").useState("open");
    return {
      poseData: null,
      status: status as "open" | "closed",
      error: null,
      close: () => setStatus("closed"),
      send: jest.fn(),
    };
  });
  const PoseViewerMod = require("../components/PoseViewer").default;
  const { getByRole, getByText, container } = render(<PoseViewerMod />);
  const button = getByRole("button");
  await waitFor(() => {
    const video = container.querySelector("video") as HTMLVideoElement;
    expect(video.srcObject).toBe(stream);
  });
  expect(getByText("Connection: open")).toBeInTheDocument();
  fireEvent.click(button);
  await waitFor(() => {
    expect(getByText("Connection: closed")).toBeInTheDocument();
  });
  expect(getUserMedia).toHaveBeenCalled();
});

test("sends frames over WebSocket", async () => {
  const { stream } = mockMedia();
  const send = jest.fn();
  let setPose: (p: any) => void = () => {};
  mockWS.mockImplementation(() => {
    const [poseData, setData] = require("react").useState(null);
    setPose = setData;
    return { poseData, status: "open", error: null, close: jest.fn(), send };
  });
  const origGetContext = HTMLCanvasElement.prototype.getContext;
  const origToBlob = HTMLCanvasElement.prototype.toBlob;
  const origRect = HTMLVideoElement.prototype.getBoundingClientRect;
  const rect = { width: 1, height: 1 } as { width: number; height: number };
  Object.defineProperty(HTMLVideoElement.prototype, "getBoundingClientRect", {
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
  Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
    configurable: true,
    value: function () {
      ctx.canvas = this as HTMLCanvasElement;
      return ctx as CanvasRenderingContext2D;
    },
  });
  Object.defineProperty(HTMLCanvasElement.prototype, "toBlob", {
    configurable: true,
    value: (...args: unknown[]) => {
      const [cb] = args as [(b: Blob) => void];
      mockToBlob(...args);
      cb(new Blob());
    },
  });

  const PoseViewer = require("../components/PoseViewer").default;
  const { container } = render(<PoseViewer />);
  const video = container.querySelector("video") as HTMLVideoElement;
  const canvas = container.querySelector("canvas") as HTMLCanvasElement;
  await waitFor(() => {
    expect(video.srcObject).toBe(stream);
  });
  Object.defineProperty(video, "videoWidth", { value: 1 });
  Object.defineProperty(video, "videoHeight", { value: 1 });
  Object.defineProperty(video, "readyState", { value: 2 });
  fireEvent(video, new Event("loadedmetadata"));
  window.dispatchEvent(new Event("resize"));
  require("@testing-library/react").act(() => {
    setPose({
      landmarks: [],
      metrics: {
        balance: 0,
        pose_class: "",
        knee_angle: 0,
        posture_angle: 0,
        fps: 0,
      },
    });
  });
  await waitFor(() => expect(send).toHaveBeenCalled());
  expect(mockToBlob).toHaveBeenCalledWith(
    expect.any(Function),
    "image/jpeg",
    expect.any(Number),
  );
  expect(ctx.save).toHaveBeenCalled();
  expect(canvas.width).toBe(2);
  expect(canvas.height).toBe(2);
  rect.width = 2;
  rect.height = 2;
  window.dispatchEvent(new Event("resize"));
  require("@testing-library/react").act(() => {
    setPose({
      landmarks: [],
      metrics: {
        balance: 0,
        pose_class: "",
        knee_angle: 0,
        posture_angle: 0,
        fps: 0,
      },
    });
  });
  await waitFor(() => expect(send).toHaveBeenCalledTimes(3));
  expect(mockToBlob).toHaveBeenCalledTimes(3);
  expect(canvas.width).toBe(4);
  expect(canvas.height).toBe(4);
  expect(send).toHaveBeenCalled();
  Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
    configurable: true,
    value: origGetContext,
  });
  Object.defineProperty(HTMLCanvasElement.prototype, "toBlob", {
    configurable: true,
    value: origToBlob,
  });
  Object.defineProperty(HTMLVideoElement.prototype, "getBoundingClientRect", {
    configurable: true,
    value: origRect,
  });
});

test("drawMs is non-negative after rendering a frame", async () => {
  const { stream } = mockMedia();
  let setPose: (p: any) => void = () => {};
  mockWS.mockImplementation(() => {
    const [poseData, setData] = require("react").useState(null);
    setPose = setData;
    return {
      poseData,
      status: "open",
      error: null,
      close: jest.fn(),
      send: jest.fn(),
    };
  });
  const PoseViewer = require("../components/PoseViewer").default;
  const { container } = render(<PoseViewer />);
  const video = container.querySelector("video") as HTMLVideoElement;
  await waitFor(() => {
    expect(video.srcObject).toBe(stream);
  });
  Object.defineProperty(video, "videoWidth", { value: 100 });
  Object.defineProperty(video, "videoHeight", { value: 50 });
  fireEvent(video, new Event("loadedmetadata"));
  window.dispatchEvent(new Event("resize"));
  require("@testing-library/react").act(() => {
    setPose({
      landmarks: [],
      metrics: {
        balance: 0,
        pose_class: "",
        knee_angle: 0,
        posture_angle: 0,
        fps: 0,
      },
    });
  });
  await waitFor(() => {
    const panel = container.querySelector(".metrics-panel") as HTMLElement;
    const drawEl = Array.from(panel.querySelectorAll("p")).find((p) =>
      p.textContent?.startsWith("Draw:"),
    );
    expect(drawEl).toBeTruthy();
    const value = parseFloat(drawEl!.textContent!.replace(/[^0-9.-]/g, ""));
    expect(value).toBeGreaterThanOrEqual(0);
  });
});

test("skips drawing when page is hidden", async () => {
  const { stream } = mockMedia();
  let setPose: (p: any) => void = () => {};
  mockWS.mockImplementation(() => {
    const [poseData, setData] = require("react").useState(null);
    setPose = setData;
    return {
      poseData,
      status: "open",
      error: null,
      close: jest.fn(),
      send: jest.fn(),
    };
  });
  const origHidden = document.hidden;
  Object.defineProperty(document, "hidden", {
    configurable: true,
    value: true,
  });
  const PoseViewer = require("../components/PoseViewer").default;
  const { container } = render(<PoseViewer />);
  const video = container.querySelector("video") as HTMLVideoElement;
  await waitFor(() => {
    expect(video.srcObject).toBe(stream);
  });
  Object.defineProperty(video, "videoWidth", { value: 100 });
  Object.defineProperty(video, "videoHeight", { value: 50 });
  fireEvent(video, new Event("loadedmetadata"));
  window.dispatchEvent(new Event("resize"));
  require("@testing-library/react").act(() => {
    setPose({
      landmarks: [],
      metrics: {
        balance: 0,
        pose_class: "",
        knee_angle: 0,
        posture_angle: 0,
        fps: 0,
      },
    });
  });
  await waitFor(() => {
    expect(mockDraw).not.toHaveBeenCalled();
  });
  Object.defineProperty(document, "hidden", {
    configurable: true,
    value: origHidden,
  });
});

test("draws when highest visibility is 0.4", async () => {
  const { stream } = mockMedia();
  let setPose: (p: any) => void = () => {};
  mockWS.mockImplementation(() => {
    const [poseData, setData] = require("react").useState(null);
    setPose = setData;
    return {
      poseData,
      status: "open",
      error: null,
      close: jest.fn(),
      send: jest.fn(),
    };
  });
  const PoseViewer = require("../components/PoseViewer").default;
  const { container } = render(<PoseViewer />);
  const video = container.querySelector("video") as HTMLVideoElement;
  await waitFor(() => {
    expect(video.srcObject).toBe(stream);
  });
  Object.defineProperty(video, "videoWidth", { value: 100 });
  Object.defineProperty(video, "videoHeight", { value: 50 });
  fireEvent(video, new Event("loadedmetadata"));
  window.dispatchEvent(new Event("resize"));
  require("@testing-library/react").act(() => {
    setPose({
      landmarks: [{ x: 0, y: 0, visibility: 0.4 }],
      metrics: {
        balance: 0,
        pose_class: "",
        knee_angle: 0,
        posture_angle: 0,
        fps: 0,
      },
    });
  });
  await waitFor(() => {
    expect(mockDraw).toHaveBeenCalled();
    const call = mockDraw.mock.calls[mockDraw.mock.calls.length - 1];
    expect(call[2]).toBeCloseTo(0.3);
  });
});

test("drops frames during backend delay", async () => {
  jest.useFakeTimers();
  const { stream } = mockMedia();
  const send = jest.fn();
  let setPose: (p: any) => void = () => {};
  mockWS.mockImplementation(() => {
    const [poseData, setData] = require("react").useState(null);
    setPose = setData;
    return { poseData, status: "open", error: null, close: jest.fn(), send };
  });
  const PoseViewer = require("../components/PoseViewer").default;
  const { container } = render(<PoseViewer />);
  const video = container.querySelector("video") as HTMLVideoElement;
  await waitFor(() => {
    expect(video.srcObject).toBe(stream);
  });
  Object.defineProperty(video, "videoWidth", { value: 1 });
  Object.defineProperty(video, "videoHeight", { value: 1 });
  Object.defineProperty(video, "readyState", { value: 2 });
  fireEvent(video, new Event("loadedmetadata"));
  window.dispatchEvent(new Event("resize"));
  await waitFor(() => expect(send).toHaveBeenCalledTimes(1));
  jest.advanceTimersByTime(200);
  expect(send).toHaveBeenCalledTimes(1);
  require("@testing-library/react").act(() => {
    setPose({
      landmarks: [],
      metrics: {
        balance: 0,
        pose_class: "",
        knee_angle: 0,
        posture_angle: 0,
        fps: 0,
      },
    });
  });
  await waitFor(() => expect(send).toHaveBeenCalledTimes(2));
  jest.useRealTimers();
});
