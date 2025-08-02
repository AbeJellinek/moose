import './global.css';
import * as React from 'react';
import { initI18n } from './i18n.ts';
import { createRoot } from 'react-dom/client';
import App from './components/App.tsx';

initI18n();
createRoot(document.getElementById('app')!).render(<App/>);
