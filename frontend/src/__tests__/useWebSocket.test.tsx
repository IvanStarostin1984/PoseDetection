import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import useWebSocket, { resolveUrl } from '../hooks/useWebSocket';

test('defaults to port 8000 when no protocol is given', () => {
  Object.defineProperty(window, 'location', {
    value: { protocol: 'http:', hostname: 'example.com', host: 'example.com' },
    writable: true,
  });
  expect(resolveUrl('/pose')).toBe('ws://example.com:8000/pose');
});

test('accepts custom host and port', () => {
  Object.defineProperty(window, 'location', {
    value: {
      protocol: 'http:',
      hostname: 'unused',
      host: 'unused',
    },
    writable: true,
  });
  expect(resolveUrl('/pose', 'example.com', 9000)).toBe(
    'ws://example.com:9000/pose',
  );
});

class MockWebSocket {
  onopen: (() => void) | null = null;
  onclose: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onmessage: ((ev: { data: string }) => void) | null = null;
  constructor(public url: string) {}
  send = jest.fn();
  triggerOpen() {
    this.onopen?.();
  }
  triggerClose() {
    this.onclose?.();
  }
  triggerMessage(data: string) {
    this.onmessage?.({ data });
  }
  close() {
    this.triggerClose();
  }
}

test('status changes on open and close events', async () => {
  const ws = new MockWebSocket('ws://test');
  const OriginalWebSocket = window.WebSocket;
  // @ts-ignore
  window.WebSocket = jest.fn(() => ws);

  const { result } = renderHook(() => useWebSocket('/pose'));

  expect(result.current.status).toBe('connecting');

  act(() => {
    ws.triggerOpen();
  });
  expect(result.current.status).toBe('open');

  act(() => {
    ws.triggerClose();
  });
  expect(result.current.status).toBe('closed');

  window.WebSocket = OriginalWebSocket;
});

test('ignores messages containing an error key', () => {
  const ws = new MockWebSocket('ws://test');
  const OriginalWebSocket = window.WebSocket;
  // @ts-ignore
  window.WebSocket = jest.fn(() => ws);

  const { result } = renderHook(() => useWebSocket('/pose'));

  act(() => {
    ws.triggerOpen();
    ws.triggerMessage(JSON.stringify({ error: 'bad frame' }));
  });

  expect(result.current.poseData).toBeNull();
  expect(result.current.error).toBe('bad frame');

  window.WebSocket = OriginalWebSocket;
});

test('valid messages clear previous error', () => {
  const ws = new MockWebSocket('ws://test');
  const OriginalWebSocket = window.WebSocket;
  // @ts-ignore
  window.WebSocket = jest.fn(() => ws);

  interface Payload {
    landmarks: { visibility: number }[];
  }
  const { result } = renderHook(() => useWebSocket<Payload>('/pose'));

  act(() => {
    ws.triggerOpen();
    ws.triggerMessage(JSON.stringify({ error: 'oops' }));
    ws.triggerMessage(
      JSON.stringify({ landmarks: [{ visibility: 0.7 }] }),
    );
  });

  expect(result.current.poseData?.landmarks[0].visibility).toBeCloseTo(0.7);
  expect(result.current.error).toBeNull();

  window.WebSocket = OriginalWebSocket;
});

test('close function sets status to closed', () => {
  const ws = new MockWebSocket('ws://test');
  const OriginalWebSocket = window.WebSocket;
  // @ts-ignore
  window.WebSocket = jest.fn(() => ws);

  const { result } = renderHook(() => useWebSocket('/pose'));

  act(() => {
    ws.triggerOpen();
  });
  expect(result.current.status).toBe('open');

  act(() => {
    result.current.close();
  });
  expect(result.current.status).toBe('closed');

  window.WebSocket = OriginalWebSocket;
});

test('send function forwards data to WebSocket', () => {
  const ws = new MockWebSocket('ws://test');
  const OriginalWebSocket = window.WebSocket;
  // @ts-ignore
  window.WebSocket = jest.fn(() => ws);

  const { result } = renderHook(() => useWebSocket('/pose'));

  act(() => {
    ws.triggerOpen();
    result.current.send(new Blob());
  });

  expect(ws.send).toHaveBeenCalled();

  window.WebSocket = OriginalWebSocket;
});

