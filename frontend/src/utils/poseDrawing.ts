export interface Point {
  x: number;
  y: number;
}

export function drawSkeleton(
  ctx: CanvasRenderingContext2D,
  landmarks: Point[]
): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = 'red';
  for (const p of landmarks) {
    ctx.beginPath();
    ctx.arc(p.x * ctx.canvas.width, p.y * ctx.canvas.height, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}
