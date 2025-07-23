export interface Point {
  x: number;
  y: number;
  visibility?: number;
}

const VISIBILITY_MIN = 0.5;

/**
 * Index pairs describing how to connect the pose landmarks.
 */
export const EDGES: [number, number][] = [
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

/**
 * Draw pose landmarks and edges on a canvas.
 * Clears the context before drawing.
 * @param ctx Canvas context used for drawing.
 * @param landmarks Normalized landmark array.
 * @param videoWidth Width of the source video in pixels.
 * @param videoHeight Height of the source video in pixels.
 */
export function drawSkeleton(
  ctx: CanvasRenderingContext2D,
  landmarks: Point[],
  videoWidth: number,
  videoHeight: number,
): void {
  const scale = typeof (ctx as any).getTransform === 'function'
    ? Math.abs((ctx as any).getTransform().a) || 1
    : 1;
  ctx.strokeStyle = 'lime';
  ctx.lineWidth = 2 / scale;
  for (const [a, b] of EDGES) {
    const pa = landmarks[a];
    const pb = landmarks[b];
    if (!pa || !pb) continue;
    if ((pa.visibility ?? 1) < VISIBILITY_MIN) continue;
    if ((pb.visibility ?? 1) < VISIBILITY_MIN) continue;
    ctx.beginPath();
    ctx.moveTo(pa.x * videoWidth, pa.y * videoHeight);
    ctx.lineTo(pb.x * videoWidth, pb.y * videoHeight);
    ctx.stroke();
  }
  ctx.fillStyle = 'red';
  const radius = 4 / scale;
  for (const p of landmarks) {
    if ((p.visibility ?? 1) < VISIBILITY_MIN) {
      continue;
    }
    ctx.beginPath();
    ctx.arc(p.x * videoWidth, p.y * videoHeight, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
