import { resolveUrl } from '../hooks/useWebSocket';

test('defaults to port 8000 when no protocol is given', () => {
  Object.defineProperty(window, 'location', {
    value: { protocol: 'http:', hostname: 'example.com', host: 'example.com' },
    writable: true,
  });
  expect(resolveUrl('/pose')).toBe('ws://example.com:8000/pose');
});

