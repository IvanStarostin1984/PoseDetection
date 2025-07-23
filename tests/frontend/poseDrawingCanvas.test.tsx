import 'jest-canvas-mock';
import { drawSkeleton, resizeCanvas, PoseLandmark, EDGES } from '../../frontend/src/utils/poseDrawing';

test('drawSkeleton only connects visible landmarks within bounds', () => {
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 50;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  const origEdges = [...EDGES];
  (EDGES as [number, number][]).length = 0;
  EDGES.push([0, 1]);

  const landmarks: PoseLandmark[] = [
    { x: 0.2, y: 0.3, visibility: 1 },
    { x: 0.8, y: 0.3, visibility: 1 },
    { x: 0.2, y: 0.6, visibility: 0.4 },
    { x: 0.8, y: 0.6, visibility: 0.4 },
  ];

  drawSkeleton(ctx, landmarks, 0.5);

  expect((ctx.lineTo as jest.Mock).mock.calls).toHaveLength(1);

  const [mx, my] = (ctx.moveTo as jest.Mock).mock.calls[0];
  const [lx, ly] = (ctx.lineTo as jest.Mock).mock.calls[0];
  [mx, lx].forEach(x => {
    expect(x).toBeGreaterThanOrEqual(0);
    expect(x).toBeLessThanOrEqual(100);
  });
  [my, ly].forEach(y => {
    expect(y).toBeGreaterThanOrEqual(0);
    expect(y).toBeLessThanOrEqual(50);
  });

  expect((ctx.arc as jest.Mock).mock.calls).toHaveLength(2);

  (EDGES as [number, number][]).length = 0;
  origEdges.forEach((e) => EDGES.push(e));
});

test('resizeCanvas is idempotent for identical sizes', () => {
  const video = document.createElement('video');
  Object.defineProperty(video, 'getBoundingClientRect', {
    value: () => ({
      width: 80,
      height: 60,
      top: 0,
      left: 0,
      right: 80,
      bottom: 60,
      x: 0,
      y: 0,
      toJSON: () => '{}',
    }),
  });
  const canvas = document.createElement('canvas');
  resizeCanvas(video, canvas);
  const w = canvas.width;
  const h = canvas.height;
  resizeCanvas(video, canvas);
  expect(canvas.width).toBe(w);
  expect(canvas.height).toBe(h);
});
