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
 * @param landmarks Landmark array in pixel units.
 */
export function drawSkeleton(
  ctx: CanvasRenderingContext2D,
  landmarks: Point[],
): void {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();

  ctx.strokeStyle = 'lime';
  ctx.lineWidth = 2;
  for (const [a, b] of EDGES) {
    const pa = landmarks[a];
    const pb = landmarks[b];
    if (!pa || !pb) continue;
    ctx.beginPath();
    ctx.moveTo(pa.x, pa.y);
    ctx.lineTo(pb.x, pb.y);
    ctx.stroke();
  }
  ctx.fillStyle = 'red';
  for (const p of landmarks) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}
