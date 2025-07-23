import { drawSkeleton, EDGES, Point } from '../../frontend/src/utils/poseDrawing';

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

test('low visibility landmarks are skipped', () => {
  const ctx = makeCtx();
  const landmarks: Point[] = Array.from({ length: 17 }, (_, i) => ({
    x: i / 10,
    y: i / 10,
    visibility: i % 2 ? 0.4 : 0.9,
  }));

  const expectedEdges = EDGES.filter(([a, b]) =>
    (landmarks[a].visibility ?? 1) >= 0.5 &&
    (landmarks[b].visibility ?? 1) >= 0.5,
  );

  drawSkeleton(ctx, landmarks, 100, 100);

  expect((ctx.arc as jest.Mock).mock.calls.length).toBe(
    landmarks.filter(p => (p.visibility ?? 1) >= 0.5).length,
  );
  expect((ctx.lineTo as jest.Mock).mock.calls.length).toBe(expectedEdges.length);
});
