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
    setTransform: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
  } as unknown as CanvasRenderingContext2D;
};

test('drawSkeleton connects edge landmarks', () => {
  const ctx = makeCtx();
  const landmarks: Point[] = Array.from({ length: 17 }, (_, i) => ({
    x: i,
    y: i,
  }));
  drawSkeleton(ctx, landmarks);
  expect(ctx.lineTo).toHaveBeenCalledTimes(EDGES.length);
  EDGES.forEach((edge, i) => {
    const s = landmarks[edge[0]];
    const e = landmarks[edge[1]];
    const m = (ctx.moveTo as jest.Mock).mock.calls[i];
    const l = (ctx.lineTo as jest.Mock).mock.calls[i];
    expect(m[0]).toBeCloseTo(s.x);
    expect(m[1]).toBeCloseTo(s.y);
    expect(l[0]).toBeCloseTo(e.x);
    expect(l[1]).toBeCloseTo(e.y);
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
