export interface PoseLandmark {
  x: number;
  y: number;
  visibility: number;
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
 * @param getScale Callback returning the pixel scale factors.
 * @param visibilityMin Visibility threshold for drawing.
 */
export function drawSkeleton(
  ctx: CanvasRenderingContext2D,
  landmarks: PoseLandmark[],
  getScale: () => { scaleX: number; scaleY: number },
  visibilityMin = 0.5,
): void {
  const { scaleX, scaleY } = getScale();
  const scale = typeof (ctx as any).getTransform === 'function'
    ? Math.abs((ctx as any).getTransform().a) || 1
    : 1;
  ctx.strokeStyle = 'lime';
  ctx.lineWidth = 2 / scale;
  const pixels = landmarks.map((lm) => ({
    x: lm.x * scaleX,
    y: lm.y * scaleY,
    visibility: lm.visibility,
  }));
  for (const [a, b] of EDGES) {
    const pa = pixels[a];
    const pb = pixels[b];
    if (!pa || !pb) continue;
    if (pa.visibility < visibilityMin || pb.visibility < visibilityMin) continue;
    ctx.beginPath();
    ctx.moveTo(pa.x, pa.y);
    ctx.lineTo(pb.x, pb.y);
    ctx.stroke();
  }
  ctx.fillStyle = 'red';
  const radius = 4 / scale;
  for (const p of pixels) {
    if (p.visibility < visibilityMin) continue;
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
