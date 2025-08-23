import React from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  sizes?: string;
}

// Utility function to generate responsive image URLs
const generateResponsiveUrls = (originalUrl: string, widths: number[]) => {
  // For existing uploaded images, we'll use CSS to optimize display
  // In a real production setup, you'd have a CDN service generate these
  return widths.map(width => ({
    url: originalUrl,
    width
  }));
};

// Optimized image component with responsive loading and lazy loading
export const OptimizedImage = React.forwardRef<HTMLImageElement, OptimizedImageProps>(({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}, ref) => {
  const responsiveWidths = [320, 480, 768, 1024, 1200, 1920];
  const responsiveUrls = generateResponsiveUrls(src, responsiveWidths);
  const srcSet = responsiveUrls.map(({ url, width: w }) => `${url} ${w}w`).join(', ');
  const loadingStrategy = priority ? 'eager' : loading;
  const optimizedStyles: React.CSSProperties = {
    maxWidth: '100%', height: 'auto', objectFit: 'cover',
    ...(width && height ? { aspectRatio: `${width}/${height}` } : {}),
  };

  return (
    <picture>
      <source srcSet={srcSet} sizes={sizes} type="image/webp" />
      <img
        ref={ref}
        src={src} srcSet={srcSet} sizes={sizes} alt={alt} width={width} height={height}
        loading={loadingStrategy} decoding="async" className={`optimized-image ${className}`}
        style={optimizedStyles}
        onError={(e) => {
          console.warn('Image failed to load:', src);
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    </picture>
  );
});

// Hook for lazy loading images with Intersection Observer
export const useLazyImage = (ref: React.RefObject<HTMLImageElement>) => {
  React.useEffect(() => {
    const imageElement = ref.current;
    if (!imageElement) return;

    // Check if Intersection Observer is available
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              
              // Load the actual image
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.remove('lazy-loading');
                img.classList.add('lazy-loaded');
                observer.unobserve(img);
              }
            }
          });
        },
        {
          rootMargin: '50px 0px', // Start loading 50px before image enters viewport
          threshold: 0.1,
        }
      );

      observer.observe(imageElement);

      return () => {
        observer.unobserve(imageElement);
      };
    } else {
      // Fallback for browsers without Intersection Observer
      if (imageElement.dataset.src) {
        imageElement.src = imageElement.dataset.src;
      }
    }
  }, [ref]);
};

// Performance-optimized image component with lazy loading
export const LazyImage: React.FC<OptimizedImageProps & { placeholder?: string }> = ({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciPjxzdG9wIHN0b3AtY29sb3I9IiNmNmY3ZjgiIG9mZnNldD0iMjAlIi8+PHN0b3Agc3RvcC1jb2xvcj0iI2VlZWZmMSIgb2Zmc2V0PSI4MCUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+',
  ...props
}) => {
  const imageRef = React.useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  useLazyImage(imageRef);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {/* Low-quality placeholder */}
      {!isLoaded && (
        <img
          src={placeholder}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-sm lazy-loading"
          style={{ filter: 'blur(4px)' }}
        />
      )}
      
      {/* Main optimized image */}
      <OptimizedImage
        ref={imageRef}
        data-src={src}
        src={isLoaded ? src : placeholder}
        alt={alt}
        width={width}
        height={height}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleLoad}
        {...props}
      />
    </div>
  );
};

// Higher-order component to wrap existing images with optimization
export const withImageOptimization = <P extends { src?: string; alt?: string }>(
  Component: React.ComponentType<P>
) => {
  const OptimizedComponent = (props: P) => {
    if (props.src) {
      return (
        <Component
          {...props}
          src={props.src}
          loading="lazy"
          decoding="async"
          style={{
            maxWidth: '100%',
            height: 'auto',
            objectFit: 'cover',
          }}
        />
      );
    }
    
    return <Component {...props} />;
  };

  OptimizedComponent.displayName = `withImageOptimization(${Component.displayName || Component.name})`;
  return OptimizedComponent;
};