import React from 'react';
import { createRoot } from 'react-dom/client';
import PoseViewer from './components/PoseViewer';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<PoseViewer />);
}
