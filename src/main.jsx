import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import './polyfills.js';

const root = createRoot(document.getElementById('root'));

root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
