export default function alignCanvasToVideo(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
): void {
  const rect = video.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
}
