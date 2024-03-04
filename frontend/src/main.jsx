import React from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register'
import App from './App';
import './assets/css/style.sass';

if ("serviceWorker" in navigator) {
  registerSW({ immediate: true })
}

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App />);
