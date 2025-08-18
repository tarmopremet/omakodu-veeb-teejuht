import { useEffect } from 'react';
import { SEOData } from '../components/SEOHead';

export const useSEO = (seoData: SEOData) => {
  useEffect(() => {
    // Update document title
    document.title = seoData.title;

    // Update meta description
    const updateMetaTag = (name: string, content: string) => {
      if (!content) return;
      
      let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (element) {
        element.content = content;
      } else {
        element = document.createElement('meta');
        element.name = name;
        element.content = content;
        document.head.appendChild(element);
      }
    };

    const updateMetaProperty = (property: string, content: string) => {
      if (!content) return;
      
      let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (element) {
        element.content = content;
      } else {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        element.content = content;
        document.head.appendChild(element);
      }
    };

    // Basic SEO tags
    updateMetaTag('description', seoData.description);
    if (seoData.keywords) {
      updateMetaTag('keywords', seoData.keywords);
    }
    if (seoData.author) {
      updateMetaTag('author', seoData.author);
    }

    // Open Graph tags
    updateMetaProperty('og:title', seoData.title);
    updateMetaProperty('og:description', seoData.description);
    updateMetaProperty('og:type', seoData.type || 'website');
    updateMetaProperty('og:url', seoData.url || window.location.href);
    
    if (seoData.image) {
      updateMetaProperty('og:image', seoData.image);
      updateMetaProperty('og:image:alt', seoData.title);
    }

    if (seoData.siteName) {
      updateMetaProperty('og:site_name', seoData.siteName);
    }

    if (seoData.locale) {
      updateMetaProperty('og:locale', seoData.locale);
    }

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', seoData.title);
    updateMetaTag('twitter:description', seoData.description);
    if (seoData.image) {
      updateMetaTag('twitter:image', seoData.image);
    }

    // Canonical URL
    const updateCanonicalUrl = (url: string) => {
      let element = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (element) {
        element.href = url;
      } else {
        element = document.createElement('link');
        element.rel = 'canonical';
        element.href = url;
        document.head.appendChild(element);
      }
    };

    updateCanonicalUrl(seoData.url || window.location.href);

    // Structured Data
    if (seoData.structuredData) {
      // Remove existing structured data
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Add new structured data
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(seoData.structuredData);
      document.head.appendChild(script);
    }

  }, [seoData]);
};