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
 * Keep the canvas size in sync with the video element.
 * @param video Source video element.
 * @param canvas Overlay canvas to resize.
 */
export function resizeCanvas(video: HTMLVideoElement, canvas: HTMLCanvasElement): void {
  const rect = video.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
}

/**
 * Draw pose landmarks and edges on a canvas.
 * Clears the context before drawing.
 * @param ctx Canvas context used for drawing.
 * @param landmarks Normalized landmark array.
 * @param visibilityMin Visibility threshold for drawing.
 */
export function drawSkeleton(
  ctx: CanvasRenderingContext2D,
  landmarks: PoseLandmark[],
  visibilityMin = 0.5,
): void {
  const scale = typeof (ctx as any).getTransform === 'function'
    ? Math.abs((ctx as any).getTransform().a) || 1
    : 1;
  const pixels = landmarks.map((lm) => ({
    x: lm.x * ctx.canvas.width,
    y: lm.y * ctx.canvas.height,
    visibility: lm.visibility,
  }));
  ctx.fillStyle = 'red';
  const radius = 4 / scale;
  const visible = new Set<number>();
  pixels.forEach((p, idx) => {
    if (p.visibility < visibilityMin) return;
    visible.add(idx);
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.strokeStyle = 'lime';
  ctx.lineWidth = 2 / scale;
  for (const [a, b] of EDGES) {
    if (!visible.has(a) || !visible.has(b)) continue;
    const pa = pixels[a];
    const pb = pixels[b];
    if (!pa || !pb) continue;
    ctx.beginPath();
    ctx.moveTo(pa.x, pa.y);
    ctx.lineTo(pb.x, pb.y);
    ctx.stroke();
  }
}
