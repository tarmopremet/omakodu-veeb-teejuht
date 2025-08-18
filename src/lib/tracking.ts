// Tracking and Analytics Library for RendiIse Platform
// Supports Google Analytics, Facebook Pixel, Google Tag Manager, and custom events

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    fbq?: (...args: any[]) => void;
  }
}

export interface TrackingConfig {
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  googleTagManagerId?: string;
}

export interface TrackingEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

class TrackingManager {
  private config: TrackingConfig = {};
  private initialized = false;

  initialize(config: TrackingConfig) {
    this.config = config;
    this.loadTrackers();
    this.initialized = true;
  }

  private async loadTrackers() {
    // Load Google Analytics 4
    if (this.config.googleAnalyticsId) {
      await this.loadGoogleAnalytics();
    }

    // Load Facebook Pixel
    if (this.config.facebookPixelId) {
      await this.loadFacebookPixel();
    }

    // Load Google Tag Manager
    if (this.config.googleTagManagerId) {
      await this.loadGoogleTagManager();
    }
  }

  private async loadGoogleAnalytics() {
    if (!this.config.googleAnalyticsId) return;

    // Create script element
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.googleAnalyticsId}`;
    document.head.appendChild(script);

    // Initialize dataLayer and gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer?.push(arguments);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', this.config.googleAnalyticsId, {
      page_title: document.title,
      page_location: window.location.href,
    });

    console.log('Google Analytics loaded:', this.config.googleAnalyticsId);
  }

  private async loadFacebookPixel() {
    if (!this.config.facebookPixelId) return;

    // Facebook Pixel Code
    (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq?.('init', this.config.facebookPixelId);
    window.fbq?.('track', 'PageView');

    console.log('Facebook Pixel loaded:', this.config.facebookPixelId);
  }

  private async loadGoogleTagManager() {
    if (!this.config.googleTagManagerId) return;

    // Google Tag Manager
    (function(w: any, d: any, s: any, l: any, i: any) {
      w[l] = w[l] || [];
      w[l].push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
      });
      const f = d.getElementsByTagName(s)[0];
      const j = d.createElement(s);
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i;
      f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', this.config.googleTagManagerId);

    console.log('Google Tag Manager loaded:', this.config.googleTagManagerId);
  }

  // Track custom events
  trackEvent(event: TrackingEvent) {
    if (!this.initialized) {
      console.warn('Tracking not initialized');
      return;
    }

    // Google Analytics event
    if (this.config.googleAnalyticsId && window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.custom_parameters,
      });
    }

    // Facebook Pixel event
    if (this.config.facebookPixelId && window.fbq) {
      window.fbq('track', 'CustomEvent', {
        action: event.action,
        category: event.category,
        label: event.label,
        value: event.value,
        ...event.custom_parameters,
      });
    }

    console.log('Event tracked:', event);
  }

  // Track page views
  trackPageView(page: string, title?: string) {
    if (!this.initialized) return;

    // Google Analytics
    if (this.config.googleAnalyticsId && window.gtag) {
      window.gtag('config', this.config.googleAnalyticsId, {
        page_title: title || document.title,
        page_location: window.location.href,
        page_path: page,
      });
    }

    // Facebook Pixel
    if (this.config.facebookPixelId && window.fbq) {
      window.fbq('track', 'PageView');
    }

    console.log('Page view tracked:', page, title);
  }

  // E-commerce tracking
  trackPurchase(transactionId: string, value: number, currency: string = 'EUR', items: any[]) {
    if (!this.initialized) return;

    // Google Analytics Enhanced Ecommerce
    if (this.config.googleAnalyticsId && window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: transactionId,
        value: value,
        currency: currency,
        items: items,
      });
    }

    // Facebook Pixel Purchase
    if (this.config.facebookPixelId && window.fbq) {
      window.fbq('track', 'Purchase', {
        value: value,
        currency: currency,
        content_ids: items.map(item => item.item_id),
        content_type: 'product',
      });
    }

    console.log('Purchase tracked:', { transactionId, value, currency, items });
  }

  // Lead tracking
  trackLead(leadData?: Record<string, any>) {
    if (!this.initialized) return;

    this.trackEvent({
      action: 'generate_lead',
      category: 'engagement',
      label: 'contact_form',
      custom_parameters: leadData,
    });

    // Facebook Pixel Lead
    if (this.config.facebookPixelId && window.fbq) {
      window.fbq('track', 'Lead', leadData);
    }

    console.log('Lead tracked:', leadData);
  }

  // Rental specific tracking
  trackRentalBooking(productId: string, productName: string, city: string, duration: number, value: number) {
    this.trackEvent({
      action: 'rental_booking',
      category: 'rental',
      label: productName,
      value: value,
      custom_parameters: {
        product_id: productId,
        product_name: productName,
        city: city,
        rental_duration: duration,
      },
    });

    // Facebook Pixel InitiateCheckout
    if (this.config.facebookPixelId && window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        content_ids: [productId],
        content_name: productName,
        value: value,
        currency: 'EUR',
        content_category: 'rental_equipment',
      });
    }
  }

  // Search tracking
  trackSearch(searchTerm: string, category?: string) {
    this.trackEvent({
      action: 'search',
      category: 'engagement',
      label: searchTerm,
      custom_parameters: {
        search_term: searchTerm,
        search_category: category,
      },
    });
  }
}

// Create singleton instance
export const tracking = new TrackingManager();

// Convenience functions for common events
export const trackRentalView = (productId: string, productName: string, category: string) => {
  tracking.trackEvent({
    action: 'view_item',
    category: 'rental',
    label: productName,
    custom_parameters: {
      item_id: productId,
      item_name: productName,
      item_category: category,
    },
  });
};

export const trackCitySelection = (city: string) => {
  tracking.trackEvent({
    action: 'select_city',
    category: 'navigation',
    label: city,
  });
};

export const trackContactFormSubmit = (formType: string) => {
  tracking.trackLead({ form_type: formType });
};

export const trackEquipmentFilter = (filterType: string, filterValue: string) => {
  tracking.trackEvent({
    action: 'filter_equipment',
    category: 'search',
    label: `${filterType}:${filterValue}`,
  });
};