import React, { Suspense } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { LoadingFallback, PageSkeleton } from './LoadingFallback';
import { PerformanceMonitor } from './PerformanceMonitor';
import { MobileNavOptimization } from './MobileOptimization';
import { useAnalytics } from '@/hooks/useAnalytics';

interface ProductionReadyWrapperProps {
  children: React.ReactNode;
  pageName: string;
  fallback?: React.ReactNode;
  enablePerformanceMonitoring?: boolean;
  enableMobileOptimization?: boolean;
}

export const ProductionReadyWrapper: React.FC<ProductionReadyWrapperProps> = ({
  children,
  pageName,
  fallback,
  enablePerformanceMonitoring = true,
  enableMobileOptimization = true
}) => {
  const { trackUserEngagement } = useAnalytics();

  const handleError = (error: Error) => {
    trackUserEngagement('error', 'page_error', error.message);
  };

  const loadingFallback = fallback || <PageSkeleton />;

  let content = (
    <Suspense fallback={loadingFallback}>
      <ErrorBoundary onError={handleError}>
        {children}
        {enablePerformanceMonitoring && <PerformanceMonitor pageName={pageName} />}
      </ErrorBoundary>
    </Suspense>
  );

  if (enableMobileOptimization) {
    content = (
      <MobileNavOptimization>
        {content}
      </MobileNavOptimization>
    );
  }

  return content;
};

// Hook for production-ready page setup
export const useProductionPage = (pageName: string) => {
  const { trackUserEngagement, trackConversionFunnel } = useAnalytics();

  const trackPageInteraction = (action: string, element: string) => {
    trackUserEngagement(action, element, pageName);
  };

  const trackConversionStep = (step: string, value?: number) => {
    trackConversionFunnel(`${pageName}_${step}`, value);
  };

  const trackBusinessEvent = (event: string, data?: Record<string, any>) => {
    trackUserEngagement('business_event', event, JSON.stringify(data));
  };

  return {
    trackPageInteraction,
    trackConversionStep,
    trackBusinessEvent
  };
};

// Enhanced version for pages with specific monitoring needs
export const withProductionReady = <P extends object>(
  Component: React.ComponentType<P>,
  config: {
    pageName: string;
    fallback?: React.ReactNode;
    enablePerformanceMonitoring?: boolean;
    enableMobileOptimization?: boolean;
  }
) => {
  const WrappedComponent = (props: P) => (
    <ProductionReadyWrapper {...config}>
      <Component {...props} />
    </ProductionReadyWrapper>
  );

  WrappedComponent.displayName = `withProductionReady(${Component.displayName || Component.name})`;
  return WrappedComponent;
};