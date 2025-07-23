import 'jest-canvas-mock';
import { drawSkeleton, PoseLandmark } from '../../frontend/src/utils/poseDrawing';

test('drawSkeleton only connects visible landmarks within bounds', () => {
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 50;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  const landmarks: PoseLandmark[] = Array.from({ length: 17 }, () => ({
    x: 0,
    y: 0,
    visibility: 0.4,
  }));

  landmarks[5] = { x: 0.2, y: 0.3, visibility: 1 };
  landmarks[7] = { x: 0.8, y: 0.3, visibility: 1 };
  landmarks[6] = { x: 0.2, y: 0.6, visibility: 0.4 };
  landmarks[8] = { x: 0.8, y: 0.6, visibility: 0.4 };

  drawSkeleton(ctx, landmarks, 100, 50, 0.5);

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
});
