import { render, waitFor, fireEvent } from '@testing-library/react';
import PoseViewer from '../components/PoseViewer';
import '@testing-library/jest-dom';

class FakeStream {
  getTracks() {
    return [];
  }
}

function mockMedia() {
  const stream = new FakeStream() as unknown as MediaStream;
  const getUserMedia = jest.fn().mockResolvedValue(stream);
  Object.defineProperty(navigator, 'mediaDevices', {
    value: { getUserMedia },
    configurable: true,
  });
  return { stream, getUserMedia };
}

test('assigns webcam stream to video element', async () => {
  const { stream, getUserMedia } = mockMedia();
  const { container } = render(<PoseViewer />);
  await waitFor(() => {
    const video = container.querySelector('video') as HTMLVideoElement;
    expect(video.srcObject).toBe(stream);
  });
  expect(getUserMedia).toHaveBeenCalled();
});

test('toggle button stops and starts the webcam', async () => {
  const { stream, getUserMedia } = mockMedia();
  const { container, getByRole } = render(<PoseViewer />);
  const button = getByRole('button');

  await waitFor(() => {
    const video = container.querySelector('video') as HTMLVideoElement;
    expect(video.srcObject).toBe(stream);
  });
  expect(button).toHaveTextContent('Stop Webcam');

  fireEvent.click(button);
  await waitFor(() => {
    const video = container.querySelector('video') as HTMLVideoElement;
    expect(video.srcObject).toBeFalsy();
  });
  expect(button).toHaveTextContent('Start Webcam');

  fireEvent.click(button);
  await waitFor(() => {
    const video = container.querySelector('video') as HTMLVideoElement;
    expect(video.srcObject).toBe(stream);
  });
  expect(getUserMedia).toHaveBeenCalledTimes(2);
});
