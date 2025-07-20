export default function alignCanvasToVideo(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
): void {
  const rect = video.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const scaleX = canvas.width / (video.videoWidth || rect.width);
  const scaleY = canvas.height / (video.videoHeight || rect.height);
  ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
}
