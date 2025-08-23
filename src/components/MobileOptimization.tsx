import { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

// Hook for detecting device capabilities
export const useDeviceCapabilities = () => {
  const [capabilities, setCapabilities] = useState({
    isTouch: false,
    hasHover: false,
    canInstall: false,
    isStandalone: false,
    orientation: 'portrait' as 'portrait' | 'landscape',
  });

  useEffect(() => {
    const updateCapabilities = () => {
      setCapabilities({
        isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        hasHover: window.matchMedia('(hover: hover)').matches,
        canInstall: 'serviceWorker' in navigator && 'PushManager' in window,
        isStandalone: window.matchMedia('(display-mode: standalone)').matches,
        orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
      });
    };

    updateCapabilities();
    window.addEventListener('resize', updateCapabilities);
    window.addEventListener('orientationchange', updateCapabilities);

    return () => {
      window.removeEventListener('resize', updateCapabilities);
      window.removeEventListener('orientationchange', updateCapabilities);
    };
  }, []);

  return capabilities;
};

// Component for handling mobile-specific optimizations
export const MobileOptimization: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isMobile = useIsMobile();
  const capabilities = useDeviceCapabilities();

  useEffect(() => {
    if (isMobile) {
      // Optimize viewport for mobile
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        viewportMeta.setAttribute('content', 
          'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover'
        );
      }

      // Add mobile-specific CSS classes
      document.body.classList.add('mobile-optimized');
      
      if (capabilities.isTouch) {
        document.body.classList.add('touch-device');
      }

      if (!capabilities.hasHover) {
        document.body.classList.add('no-hover');
      }

      // Optimize scrolling performance
      document.body.style.setProperty('-webkit-overflow-scrolling', 'touch');
      document.body.style.setProperty('overscroll-behavior', 'contain');

      // Prevent zoom on input focus (iOS)
      const preventZoom = () => {
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
          if (input instanceof HTMLElement && input.style.fontSize !== '16px') {
            input.style.fontSize = '16px';
          }
        });
      };

      preventZoom();
      
      // Handle orientation changes
      const handleOrientationChange = () => {
        // Delay to ensure layout has adjusted
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 100);
      };

      window.addEventListener('orientationchange', handleOrientationChange);

      return () => {
        window.removeEventListener('orientationchange', handleOrientationChange);
        document.body.classList.remove('mobile-optimized', 'touch-device', 'no-hover');
      };
    }
  }, [isMobile, capabilities]);

  return <>{children}</>;
};

// Hook for touch gestures
export const useTouchGestures = (element: React.RefObject<HTMLElement>) => {
  const [gesture, setGesture] = useState<{
    isSwipe: boolean;
    direction?: 'left' | 'right' | 'up' | 'down';
    distance?: number;
  }>({ isSwipe: false });

  useEffect(() => {
    const el = element.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      endX = e.touches[0].clientX;
      endY = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance > 50) { // Minimum swipe distance
        const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
        
        setGesture({
          isSwipe: true,
          direction: isHorizontal 
            ? (deltaX > 0 ? 'right' : 'left')
            : (deltaY > 0 ? 'down' : 'up'),
          distance
        });
      }
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: true });
    el.addEventListener('touchend', handleTouchEnd);

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [element]);

  return gesture;
};

// Component for mobile navigation optimization
export const MobileNavOptimization: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isMobile = useIsMobile();

  if (!isMobile) return <>{children}</>;

  return (
    <div className="mobile-nav-optimized">
      <style jsx>{`
        .mobile-nav-optimized {
          /* Optimize touch targets */
        }
        .mobile-nav-optimized button,
        .mobile-nav-optimized a {
          min-height: 44px; /* Apple's recommended touch target size */
          min-width: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        /* Improve scrolling on mobile */
        .mobile-nav-optimized * {
          -webkit-tap-highlight-color: transparent;
        }
        
        /* Better button feedback on touch */
        .mobile-nav-optimized button:active,
        .mobile-nav-optimized a:active {
          transform: scale(0.98);
          transition: transform 0.1s;
        }
      `}</style>
      {children}
    </div>
  );
};