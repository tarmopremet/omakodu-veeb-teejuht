import { createContext, useContext, useEffect, ReactNode } from 'react';
import { tracking, TrackingConfig } from '../lib/tracking';

interface TrackingContextType {
  trackEvent: typeof tracking.trackEvent;
  trackPageView: typeof tracking.trackPageView;
  trackRentalBooking: typeof tracking.trackRentalBooking;
  trackLead: typeof tracking.trackLead;
  trackSearch: typeof tracking.trackSearch;
}

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

interface TrackingProviderProps {
  children: ReactNode;
  config?: TrackingConfig;
}

export const TrackingProvider: React.FC<TrackingProviderProps> = ({ children, config }) => {
  useEffect(() => {
    // Default configuration - can be overridden via props or environment
    const defaultConfig: TrackingConfig = {
      // These would typically come from environment variables
      // For now using placeholder values that can be configured
      googleAnalyticsId: config?.googleAnalyticsId || process.env.VITE_GA_TRACKING_ID || 'G-XXXXXXXXXX',
      facebookPixelId: config?.facebookPixelId || process.env.VITE_FB_PIXEL_ID || '000000000000000',
      googleTagManagerId: config?.googleTagManagerId || process.env.VITE_GTM_ID || 'GTM-XXXXXXX',
    };

    // Only initialize if we have at least one tracking ID
    if (defaultConfig.googleAnalyticsId !== 'G-XXXXXXXXXX' || 
        defaultConfig.facebookPixelId !== '000000000000000' ||
        defaultConfig.googleTagManagerId !== 'GTM-XXXXXXX') {
      tracking.initialize(defaultConfig);
    } else {
      console.log('Tracking not initialized - no valid tracking IDs provided');
    }
  }, [config]);

  const contextValue: TrackingContextType = {
    trackEvent: tracking.trackEvent.bind(tracking),
    trackPageView: tracking.trackPageView.bind(tracking),
    trackRentalBooking: tracking.trackRentalBooking.bind(tracking),
    trackLead: tracking.trackLead.bind(tracking),
    trackSearch: tracking.trackSearch.bind(tracking),
  };

  return (
    <TrackingContext.Provider value={contextValue}>
      {children}
    </TrackingContext.Provider>
  );
};

export const useTracking = () => {
  const context = useContext(TrackingContext);
  if (!context) {
    // Return no-op functions if tracking is not available
    return {
      trackEvent: () => {},
      trackPageView: () => {},
      trackRentalBooking: () => {},
      trackLead: () => {},
      trackSearch: () => {},
    };
  }
  return context;
};