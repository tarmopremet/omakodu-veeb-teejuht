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
  // Report web vitals - simplified without external dependency
  const reportWebVitals = (metric: any) => {
    console.log('Web Vital:', metric);
    // In production, send to analytics service
  };

  // Basic performance observer for Core Web Vitals
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          reportWebVitals({
            name: entry.name,
            value: entry.startTime,
            rating: 'good' // simplified
          });
        });
      });
      observer.observe({ entryTypes: ['measure', 'navigation'] });
    } catch (e) {
      console.log('Performance observer not supported');
    }
  }
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
