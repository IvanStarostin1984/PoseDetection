import { useEffect, useRef, useState } from 'react';

function resolveUrl(path: string): string {
  if (path.startsWith('ws')) return path;
  const loc = window.location;
  const protocol = loc.protocol === 'https:' ? 'wss' : 'ws';
  return `${protocol}://${loc.host}${path}`;
}

export default function useWebSocket<T>(path: string) {
  const [poseData, setPoseData] = useState<T | null>(null);
  const wsRef = useRef<WebSocket>();

  useEffect(() => {
    const url = resolveUrl(path);
    const ws = new WebSocket(url);
    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        setPoseData(data);
      } catch {
        // ignore malformed messages
      }
    };
    wsRef.current = ws;
    return () => {
      ws.close();
    };
  }, [path]);

  return { poseData };
}
