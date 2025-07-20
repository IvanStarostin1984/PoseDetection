/**
 * Resize `canvas` so it matches the size of `video`.
 * Uses the device pixel ratio to keep drawings crisp.
 * @param video Video element used for sizing.
 * @param canvas Canvas to resize.
 */
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
}
