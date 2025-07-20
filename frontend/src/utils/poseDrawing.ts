export interface Point {
  x: number;
  y: number;
}

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
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.strokeStyle = 'lime';
  ctx.lineWidth = 2;
  for (const [a, b] of EDGES) {
    const pa = landmarks[a];
    const pb = landmarks[b];
    if (!pa || !pb) continue;
    ctx.beginPath();
    ctx.moveTo(pa.x * videoWidth, pa.y * videoHeight);
    ctx.lineTo(pb.x * videoWidth, pb.y * videoHeight);
    ctx.stroke();
  }
  ctx.fillStyle = 'red';
  for (const p of landmarks) {
    ctx.beginPath();
    ctx.arc(p.x * videoWidth, p.y * videoHeight, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}
