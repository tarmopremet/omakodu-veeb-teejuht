import { useEffect } from 'react';

export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  siteName?: string;
  locale?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  structuredData?: any;
}

interface SEOHeadProps {
  data: SEOData;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ data }) => {
  useEffect(() => {
    // Update document title
    document.title = data.title;

    // Update meta tags
    updateMetaTag('description', data.description);
    updateMetaTag('keywords', data.keywords || '');
    updateMetaTag('author', data.author || 'RendiIse - Koristusvahendite Rent');
    
    // Open Graph tags
    updateMetaProperty('og:title', data.title);
    updateMetaProperty('og:description', data.description);
    updateMetaProperty('og:type', data.type || 'website');
    updateMetaProperty('og:url', data.url || window.location.href);
    updateMetaProperty('og:site_name', data.siteName || 'RendiIse');
    updateMetaProperty('og:locale', data.locale || 'et_EE');
    
    if (data.image) {
      updateMetaProperty('og:image', data.image);
      updateMetaProperty('og:image:alt', data.title);
    }

    // Twitter Card tags
    updateMetaName('twitter:card', 'summary_large_image');
    updateMetaName('twitter:title', data.title);
    updateMetaName('twitter:description', data.description);
    if (data.image) {
      updateMetaName('twitter:image', data.image);
    }

    // Article specific tags
    if (data.type === 'article') {
      if (data.publishedTime) {
        updateMetaProperty('article:published_time', data.publishedTime);
      }
      if (data.modifiedTime) {
        updateMetaProperty('article:modified_time', data.modifiedTime);
      }
      if (data.author) {
        updateMetaProperty('article:author', data.author);
      }
    }

    // Canonical URL
    updateCanonicalUrl(data.url || window.location.href);

    // Structured Data
    if (data.structuredData) {
      updateStructuredData(data.structuredData);
    }
  }, [data]);

  return null;
};

// Utility functions for updating meta tags
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

const updateMetaName = (name: string, content: string) => {
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

const updateStructuredData = (data: any) => {
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

// Pre-defined SEO data generators
export const generateHomepageSEO = (): SEOData => ({
  title: 'RendiIse - Koristusvahendite Rent Eestis | Aurupesur, Aknapesur, Tolmuimeja',
  description: 'Rent kvaliteetseid koristusseadmeid kogu Eestis. Aurupesurid, aknapesurrobot, tolmuimejad ja palju muud. Kiire kohaletoimetamine Tallinn, Tartu, Pärnu, Rakvere.',
  keywords: 'koristusvahendite rent, aurupesur rent, aknapesur rent, tolmuimeja rent, Tallinn, Tartu, Pärnu, Rakvere, koristusseadmed',
  type: 'website',
  siteName: 'RendiIse',
  locale: 'et_EE',
  structuredData: {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "RendiIse",
    "description": "Koristusvahendite rent kogu Eestis",
    "url": "https://rendi-ise.ee",
    "logo": "https://rendi-ise.ee/logo.png",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "EE"
    },
    "serviceArea": {
      "@type": "Country",
      "name": "Estonia"
    },
    "services": [
      "Aurupesurite rent",
      "Aknapesurrobotite rent", 
      "Tolmuimejate rent",
      "Tekstiilipesurite rent"
    ],
    "areaServed": ["Tallinn", "Tartu", "Pärnu", "Rakvere", "Saku"]
  }
});

export const generateProductSEO = (productName: string, description: string, price: number, category: string): SEOData => ({
  title: `${productName} Rent | RendiIse - Alates ${price}€/päev`,
  description: `Rent ${productName.toLowerCase()} Eestis. ${description} Kiire kohaletoimetamine ja kvaliteetne teenindus.`,
  keywords: `${productName.toLowerCase()} rent, ${category.toLowerCase()}, koristusseadmed, rent eestis`,
  type: 'product',
  structuredData: {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productName,
    "description": description,
    "category": category,
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "RendiIse"
      }
    },
    "brand": {
      "@type": "Brand",
      "name": "RendiIse"
    }
  }
});

export const generateCitySEO = (cityName: string): SEOData => ({
  title: `Koristusvahendite Rent ${cityName}s | RendiIse - Kiire Kohaletoimetamine`,
  description: `Rent kvaliteetseid koristusseadmeid ${cityName}s. Aurupesurid, aknapesurrobotid, tolmuimejad. Kiire kohaletoimetamine ja paindlikud tingimused.`,
  keywords: `koristusvahendite rent ${cityName.toLowerCase()}, ${cityName.toLowerCase()} koristusseadmed, rent ${cityName.toLowerCase()}`,
  type: 'website',
  structuredData: {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `Koristusvahendite rent ${cityName}s`,
    "provider": {
      "@type": "Organization",
      "name": "RendiIse"
    },
    "areaServed": {
      "@type": "City",
      "name": cityName,
      "addressCountry": "EE"
    },
    "serviceType": "Equipment Rental"
  }
});