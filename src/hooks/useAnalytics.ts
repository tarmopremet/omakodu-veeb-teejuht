import { useEffect, useRef } from 'react';
import { useTracking } from '@/components/TrackingProvider';
import { useLocation } from 'react-router-dom';

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  customParameters?: Record<string, any>;
}

interface UserBehavior {
  pageViews: number;
  sessionDuration: number;
  interactions: number;
  conversionEvents: string[];
}

export const useAnalytics = () => {
  const { trackEvent, trackPageView, trackRentalBooking, trackLead, trackSearch } = useTracking();
  const location = useLocation();
  const sessionStartTime = useRef(Date.now());
  const userBehavior = useRef<UserBehavior>({
    pageViews: 0,
    sessionDuration: 0,
    interactions: 0,
    conversionEvents: []
  });

  // Track page views automatically
  useEffect(() => {
    const pageName = location.pathname;
    trackPageView(pageName);
    userBehavior.current.pageViews++;

    // Track time spent on previous page
    const timeSpent = Date.now() - sessionStartTime.current;
    if (timeSpent > 1000) { // Only track if spent more than 1 second
      trackEvent({
        action: 'page_time_spent',
        category: 'engagement',
        label: pageName,
        value: timeSpent
      });
    }

    sessionStartTime.current = Date.now();
  }, [location, trackEvent, trackPageView]);

  // Business-specific analytics functions
  const trackEquipmentView = (equipmentName: string, category: string, location: string) => {
    userBehavior.current.interactions++;
    trackEvent({
      action: 'equipment_view',
      category: 'product_engagement',
      label: equipmentName,
      customParameters: {
        equipment_category: category,
        equipment_location: location,
        timestamp: new Date().toISOString()
      }
    });
  };

  const trackEquipmentFilter = (filterType: string, filterValue: string) => {
    trackEvent({
      action: 'equipment_filter',
      category: 'product_discovery',
      label: `${filterType}:${filterValue}`,
      customParameters: {
        filter_type: filterType,
        filter_value: filterValue
      }
    });
  };

  const trackBookingStart = (equipmentName: string, location: string) => {
    userBehavior.current.interactions++;
    trackEvent({
      action: 'booking_start',
      category: 'conversion',
      label: equipmentName,
      customParameters: {
        equipment_name: equipmentName,
        booking_location: location,
        step: 'initiated'
      }
    });
  };

  const trackBookingStep = (step: string, equipmentName: string, data?: Record<string, any>) => {
    trackEvent({
      action: 'booking_step',
      category: 'conversion_funnel',
      label: step,
      customParameters: {
        equipment_name: equipmentName,
        booking_step: step,
        ...data
      }
    });
  };

  const trackBookingComplete = (bookingData: {
    equipmentName: string;
    location: string;
    duration: number;
    totalAmount: number;
    bookingId: string;
  }) => {
    userBehavior.current.conversionEvents.push('booking_complete');
    
    trackRentalBooking({
      equipment_name: bookingData.equipmentName,
      location: bookingData.location,
      duration_hours: bookingData.duration,
      total_amount: bookingData.totalAmount,
      booking_id: bookingData.bookingId
    });

    trackEvent({
      action: 'booking_complete',
      category: 'conversion',
      label: bookingData.equipmentName,
      value: bookingData.totalAmount,
      customParameters: {
        ...bookingData,
        conversion_type: 'rental_booking'
      }
    });
  };

  const trackContactForm = (formType: string, source: string) => {
    userBehavior.current.conversionEvents.push('contact_form');
    
    trackLead({
      form_type: formType,
      source: source
    });

    trackEvent({
      action: 'contact_form_submit',
      category: 'lead_generation',
      label: formType,
      customParameters: {
        form_type: formType,
        source: source
      }
    });
  };

  const trackSearchQuery = (query: string, category?: string, resultsCount?: number) => {
    trackSearch(query, category);
    
    trackEvent({
      action: 'search',
      category: 'product_discovery',
      label: query,
      customParameters: {
        search_query: query,
        search_category: category,
        results_count: resultsCount
      }
    });
  };

  const trackUserEngagement = (action: string, element: string, context?: string) => {
    userBehavior.current.interactions++;
    
    trackEvent({
      action: 'user_interaction',
      category: 'engagement',
      label: `${action}:${element}`,
      customParameters: {
        interaction_type: action,
        element: element,
        context: context,
        page: location.pathname
      }
    });
  };

  const trackConversionFunnel = (step: string, value?: number) => {
    trackEvent({
      action: 'conversion_funnel',
      category: 'conversion',
      label: step,
      value: value,
      customParameters: {
        funnel_step: step,
        session_interactions: userBehavior.current.interactions,
        session_page_views: userBehavior.current.pageViews
      }
    });
  };

  const trackBusinessMetric = (metric: string, value: number, context?: Record<string, any>) => {
    trackEvent({
      action: 'business_metric',
      category: 'business_intelligence',
      label: metric,
      value: value,
      customParameters: {
        metric_name: metric,
        metric_value: value,
        ...context
      }
    });
  };

  // Track session end
  const trackSessionEnd = () => {
    const sessionDuration = Date.now() - sessionStartTime.current;
    userBehavior.current.sessionDuration = sessionDuration;

    trackEvent({
      action: 'session_summary',
      category: 'session',
      label: 'session_end',
      value: sessionDuration,
      customParameters: {
        session_duration: sessionDuration,
        page_views: userBehavior.current.pageViews,
        interactions: userBehavior.current.interactions,
        conversion_events: userBehavior.current.conversionEvents,
        pages_per_session: userBehavior.current.pageViews,
        engagement_rate: userBehavior.current.interactions / userBehavior.current.pageViews
      }
    });
  };

  // Track page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      trackSessionEnd();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return {
    trackEquipmentView,
    trackEquipmentFilter,
    trackBookingStart,
    trackBookingStep,
    trackBookingComplete,
    trackContactForm,
    trackSearchQuery,
    trackUserEngagement,
    trackConversionFunnel,
    trackBusinessMetric,
    trackSessionEnd,
    userBehavior: userBehavior.current
  };
};

// Higher-order component for automatic interaction tracking
export const withAnalytics = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  const WrappedComponent = (props: P) => {
    const { trackUserEngagement } = useAnalytics();

    const handleClick = (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      const elementType = target.tagName.toLowerCase();
      const elementText = target.textContent?.slice(0, 50) || '';
      
      trackUserEngagement('click', `${componentName}_${elementType}`, elementText);
    };

    return React.createElement('div', { onClick: handleClick }, React.createElement(Component, props));
  };

  WrappedComponent.displayName = `withAnalytics(${componentName})`;
  return WrappedComponent;
};