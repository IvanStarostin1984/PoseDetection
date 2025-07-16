import { useEffect, useRef, useState } from 'react';

export function resolveUrl(
  path: string,
  host: string = window.location.hostname,
  port = 8000,
): string {
  if (path.startsWith('ws')) return path;
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const addr = host.includes(':') ? host : `${host}:${port}`;
  return `${protocol}://${addr}${path}`;
}

export default function useWebSocket<T>(
  path: string,
  host?: string,
  port = 8000,
) {
  const [poseData, setPoseData] = useState<T | null>(null);
  const [status, setStatus] = useState<'connecting' | 'open' | 'closed' | 'error'>('connecting');
  const wsRef = useRef<WebSocket>();

  useEffect(() => {
    const url = resolveUrl(path, host, port);
    const ws = new WebSocket(url);
    setStatus('connecting');
    ws.onopen = () => setStatus('open');
    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        setPoseData(data);
      } catch {
        // ignore malformed messages
      }
    };
    ws.onerror = () => setStatus('error');
    ws.onclose = () => setStatus('closed');
    wsRef.current = ws;
    return () => {
      ws.close();
      setStatus('closed');
    };
  }, [path, host, port]);

  return { poseData, status };
}
