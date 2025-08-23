import { useEffect, useRef } from 'react';
import { useTracking } from './TrackingProvider';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
  connectionType?: string;
}

export const PerformanceMonitor: React.FC<{ pageName: string }> = ({ pageName }) => {
  const { trackEvent } = useTracking();
  const startTime = useRef(Date.now());
  const hasTracked = useRef(false);

  useEffect(() => {
    // Only track once per page load
    if (hasTracked.current) return;
    hasTracked.current = true;

    const trackPerformance = () => {
      try {
        const loadTime = Date.now() - startTime.current;
        
        // Get navigation timing if available
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        const metrics: PerformanceMetrics = {
          loadTime,
          renderTime: navigation?.loadEventEnd - navigation?.loadEventStart || 0
        };

        // Add memory usage if available
        if ('memory' in performance) {
          const memory = (performance as any).memory;
          metrics.memoryUsage = memory.usedJSHeapSize;
        }

        // Add connection info if available
        if ('connection' in navigator) {
          const connection = (navigator as any).connection;
          metrics.connectionType = connection.effectiveType;
        }

        // Track performance metrics
        trackEvent({
          action: 'page_performance',
          category: 'performance',
          label: pageName,
          value: loadTime,
          custom_parameters: {
            ...metrics,
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`,
            timestamp: new Date().toISOString()
          }
        });

        // Log slow pages
        if (loadTime > 3000) {
          console.warn(`Slow page load detected: ${pageName} took ${loadTime}ms`);
          
          trackEvent({
            action: 'slow_page_load',
            category: 'performance',
            label: pageName,
            value: loadTime
          });
        }

        // Track Core Web Vitals
        if ('web-vitals' in window) {
          // You would typically import web-vitals library here
          // import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
        }

      } catch (error) {
        console.error('Performance tracking error:', error);
      }
    };

    // Track performance after page load
    if (document.readyState === 'complete') {
      setTimeout(trackPerformance, 100);
    } else {
      window.addEventListener('load', () => {
        setTimeout(trackPerformance, 100);
      });
    }

    // Track when user leaves the page
    const handleBeforeUnload = () => {
      const sessionDuration = Date.now() - startTime.current;
      
      trackEvent({
        action: 'session_end',
        category: 'engagement',
        label: pageName,
        value: sessionDuration
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pageName, trackEvent]);

  return null;
};

// Hook for manual performance tracking
export const usePerformanceTracking = () => {
  const { trackEvent } = useTracking();

  const trackUserAction = (action: string, duration?: number) => {
    trackEvent({
      action: 'user_action_performance',
      category: 'performance',
      label: action,
      value: duration || 0,
      custom_parameters: {
        timestamp: new Date().toISOString()
      }
    });
  };

  const trackApiCall = (endpoint: string, duration: number, status: 'success' | 'error') => {
    trackEvent({
      action: 'api_performance',
      category: 'performance',
      label: endpoint,
      value: duration,
      custom_parameters: {
        status,
        timestamp: new Date().toISOString()
      }
    });
  };

  return { trackUserAction, trackApiCall };
};