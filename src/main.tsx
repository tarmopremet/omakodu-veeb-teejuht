import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Register service worker for offline capabilities
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Performance monitoring
if (process.env.NODE_ENV === 'production') {
  // Report web vitals
  const reportWebVitals = (metric: any) => {
    console.log('Web Vital:', metric);
    // In production, send to analytics service
  };

  // Dynamic import to avoid affecting bundle size
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(reportWebVitals);
    getFID(reportWebVitals);
    getFCP(reportWebVitals);
    getLCP(reportWebVitals);
    getTTFB(reportWebVitals);
  }).catch(() => {
    console.log('Web vitals not available');
  });
}

// Global error handling
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // In production, send to error tracking service
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // In production, send to error tracking service
});

createRoot(document.getElementById("root")!).render(<App />);
