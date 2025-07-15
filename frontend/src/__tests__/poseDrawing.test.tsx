import { drawSkeleton, EDGES, Point } from '../utils/poseDrawing';

const makeCtx = () => {
  return {
    canvas: { width: 100, height: 100 },
    clearRect: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
  } as unknown as CanvasRenderingContext2D;
};

test('drawSkeleton connects edge landmarks', () => {
  const ctx = makeCtx();
  const landmarks: Point[] = Array.from({ length: 29 }, (_, i) => ({
    x: i / 100,
    y: i / 100,
  }));
  drawSkeleton(ctx, landmarks);
  expect(ctx.lineTo).toHaveBeenCalledTimes(EDGES.length);
  EDGES.forEach((edge, i) => {
    const s = landmarks[edge[0]];
    const e = landmarks[edge[1]];
    const m = (ctx.moveTo as jest.Mock).mock.calls[i];
    const l = (ctx.lineTo as jest.Mock).mock.calls[i];
    expect(m[0]).toBeCloseTo(s.x * 100);
    expect(m[1]).toBeCloseTo(s.y * 100);
    expect(l[0]).toBeCloseTo(e.x * 100);
    expect(l[1]).toBeCloseTo(e.y * 100);
  });
});
