import React, { useEffect } from 'react';

// Image optimization utilities for SEO performance
export const ImageOptimizer = {
  // Detect and set optimal image format support
  detectFormatSupport: () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    // Test WebP support
    const webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    
    // Test AVIF support (newer format)
    const avifSupported = canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
    
    // Add classes to document for CSS targeting
    document.documentElement.classList.toggle('webp', webpSupported);
    document.documentElement.classList.toggle('no-webp', !webpSupported);
    document.documentElement.classList.toggle('avif', avifSupported);
    document.documentElement.classList.toggle('no-avif', !avifSupported);
    
    return { webpSupported, avifSupported };
  },

  // Optimize all existing images on the page
  optimizeExistingImages: () => {
    const images = document.querySelectorAll('img:not(.optimized-image)');
    
    images.forEach((img) => {
      const imageElement = img as HTMLImageElement;
      
      // Add loading="lazy" if not already set
      if (!imageElement.getAttribute('loading')) {
        imageElement.setAttribute('loading', 'lazy');
      }
      
      // Add decoding="async" for better performance
      if (!imageElement.getAttribute('decoding')) {
        imageElement.setAttribute('decoding', 'async');
      }
      
      // Optimize display size if larger than container
      const rect = imageElement.getBoundingClientRect();
      const naturalWidth = imageElement.naturalWidth;
      const naturalHeight = imageElement.naturalHeight;
      
      if (naturalWidth && naturalHeight && rect.width) {
        const displayWidth = rect.width;
        const displayHeight = rect.height;
        
        // If image is significantly larger than display size, add optimization classes
        if (naturalWidth > displayWidth * 1.5 || naturalHeight > displayHeight * 1.5) {
          imageElement.classList.add('oversized-image');
          
          // Log performance warning
          console.warn('Oversized image detected:', {
            src: imageElement.src,
            natural: `${naturalWidth}x${naturalHeight}`,
            display: `${Math.round(displayWidth)}x${Math.round(displayHeight)}`,
            savings: `${Math.round((1 - (displayWidth * displayHeight) / (naturalWidth * naturalHeight)) * 100)}%`
          });
        }
      }
      
      // Add optimization class
      imageElement.classList.add('optimized-image');
    });
  },

  // Set up responsive image attributes for better loading
  makeImageResponsive: (imageElement: HTMLImageElement, breakpoints = [320, 768, 1024, 1200]) => {
    const src = imageElement.src;
    if (!src) return;

    // Create responsive sizes attribute
    const sizes = [
      '(max-width: 320px) 320px',
      '(max-width: 768px) 768px', 
      '(max-width: 1024px) 1024px',
      '1200px'
    ].join(', ');

    imageElement.setAttribute('sizes', sizes);
    
    // In a real implementation with a CDN, you'd generate actual different sized images
    // For now, we'll just ensure proper sizing attributes are set
    const rect = imageElement.getBoundingClientRect();
    if (rect.width && rect.height) {
      imageElement.setAttribute('width', Math.round(rect.width).toString());
      imageElement.setAttribute('height', Math.round(rect.height).toString());
    }
  },

  // Preload critical images
  preloadCriticalImages: (imageSrcs: string[]) => {
    imageSrcs.forEach((src) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  },

  // Monitor image loading performance
  monitorImagePerformance: () => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if ((entry as any).initiatorType === 'img') {
            const duration = entry.duration;
            const size = (entry as any).transferSize || 0;
            
            console.log('Image performance:', {
              url: entry.name,
              duration: `${duration.toFixed(2)}ms`,
              size: `${(size / 1024).toFixed(2)}KB`,
              efficiency: size > 0 ? `${(duration / (size / 1024)).toFixed(2)}ms/KB` : 'N/A'
            });
            
            // Track slow loading images
            if (duration > 1000) {
              console.warn('Slow loading image detected:', entry.name, `${duration.toFixed(2)}ms`);
            }
          }
        });
      });
      
      observer.observe({ entryTypes: ['resource'] });
    }
  }
};

// React hook for automatic image optimization
export const useImageOptimization = (options: {
  optimizeOnLoad?: boolean;
  monitorPerformance?: boolean;
  preloadCritical?: string[];
} = {
  optimizeOnLoad: true,
  monitorPerformance: true,
  preloadCritical: []
}) => {
  useEffect(() => {
    // Detect format support on first load
    ImageOptimizer.detectFormatSupport();
    
    if (options.optimizeOnLoad) {
      // Optimize existing images after DOM is ready
      const optimizeImages = () => {
        ImageOptimizer.optimizeExistingImages();
      };
      
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', optimizeImages);
      } else {
        optimizeImages();
      }
      
      // Also optimize dynamically added images
      const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              const images = element.querySelectorAll('img:not(.optimized-image)');
              images.forEach((img) => {
                const imageElement = img as HTMLImageElement;
                imageElement.setAttribute('loading', 'lazy');
                imageElement.setAttribute('decoding', 'async');
                imageElement.classList.add('optimized-image');
              });
            }
          });
        });
      });
      
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      return () => {
        document.removeEventListener('DOMContentLoaded', optimizeImages);
        mutationObserver.disconnect();
      };
    }
    
    if (options.monitorPerformance) {
      ImageOptimizer.monitorImagePerformance();
    }
    
    if (options.preloadCritical && options.preloadCritical.length > 0) {
      ImageOptimizer.preloadCriticalImages(options.preloadCritical);
    }
  }, []);
};

// Component wrapper for global image optimization
export const ImageOptimizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useImageOptimization({
    optimizeOnLoad: true,
    monitorPerformance: true,
    preloadCritical: [
      '/lovable-uploads/df0e8fbf-70e2-43c9-85f7-287560a031d1.png'
    ]
  });

  return React.createElement(React.Fragment, null, children);
};