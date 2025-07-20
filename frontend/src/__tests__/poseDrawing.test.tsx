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
    getTransform: () => ({ a: 1 }),
  } as unknown as CanvasRenderingContext2D;
};

test('drawSkeleton connects edge landmarks', () => {
  const ctx = makeCtx();
  const landmarks: Point[] = Array.from({ length: 17 }, (_, i) => ({
    x: i / 100,
    y: i / 100,
  }));
  drawSkeleton(ctx, landmarks, 100, 100);
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

test('edges list matches 17-point skeleton', () => {
  const expected: [number, number][] = [
    [5, 7],
    [7, 9],
    [6, 8],
    [8, 10],
    [5, 6],
    [11, 12],
    [5, 11],
    [6, 12],
    [11, 13],
    [13, 15],
    [12, 14],
    [14, 16],
  ];
  expect(EDGES).toEqual(expected);
});

test('lineWidth remains positive when context is mirrored', () => {
  const ctx = makeCtx();
  let transform = { a: 1 };
  (ctx as any).getTransform = () => transform;
  (ctx as any).scale = (x: number, y: number) => {
    transform = { a: transform.a * x };
  };
  (ctx as any).scale(-1, 1);
  drawSkeleton(ctx, [{ x: 0, y: 0 }], 100, 100);
  expect(ctx.lineWidth).toBeGreaterThan(0);
});
