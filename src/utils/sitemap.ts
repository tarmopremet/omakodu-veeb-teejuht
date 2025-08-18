// Sitemap generator for RendiIse platform

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: string;
}

export const generateSitemap = (): SitemapUrl[] => {
  const baseUrl = 'https://rendi-ise.ee';
  const currentDate = new Date().toISOString().split('T')[0];

  const urls: SitemapUrl[] = [
    // Main pages
    {
      loc: `${baseUrl}/`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '1.0'
    },
    {
      loc: `${baseUrl}/renditooted`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.9'
    },
    {
      loc: `${baseUrl}/myygitooted`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8'
    },

    // City pages
    {
      loc: `${baseUrl}/tallinn`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.9'
    },
    {
      loc: `${baseUrl}/tartu`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.9'
    },
    {
      loc: `${baseUrl}/parnu`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.9'
    },
    {
      loc: `${baseUrl}/rakvere`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.9'
    },
    {
      loc: `${baseUrl}/saku`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.9'
    },

    // Product category pages
    {
      loc: `${baseUrl}/tekstiilipesuri-rent`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8'
    },
    {
      loc: `${baseUrl}/aurupesuri-rent`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8'
    },
    {
      loc: `${baseUrl}/aknapesuroboti-rent`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8'
    },
    {
      loc: `${baseUrl}/tolmuimeja-rent`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8'
    },
    {
      loc: `${baseUrl}/aknapesuri-rent`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8'
    },

    // Alternative product URLs
    {
      loc: `${baseUrl}/renditooted/tekstiilipesurid`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7'
    },
    {
      loc: `${baseUrl}/renditooted/aurupesurid`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7'
    },
    {
      loc: `${baseUrl}/renditooted/aknapesurobotid`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7'
    },
    {
      loc: `${baseUrl}/renditooted/tolmuimejad`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7'
    },
    {
      loc: `${baseUrl}/renditooted/aknapesurid`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7'
    },

    // Legal pages
    {
      loc: `${baseUrl}/kasutajatingimused`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.3'
    },
  ];

  return urls;
};

export const generateSitemapXML = (): string => {
  const urls = generateSitemap();
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  urls.forEach(url => {
    xml += '  <url>\n';
    xml += `    <loc>${url.loc}</loc>\n`;
    
    if (url.lastmod) {
      xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
    }
    
    if (url.changefreq) {
      xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    }
    
    if (url.priority) {
      xml += `    <priority>${url.priority}</priority>\n`;
    }
    
    xml += '  </url>\n';
  });

  xml += '</urlset>';
  
  return xml;
};

// Generate robots.txt content
export const generateRobotsTxt = (): string => {
  const baseUrl = 'https://rendi-ise.ee';
  
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for being nice to servers
Crawl-delay: 1

# Disallow admin and auth pages
Disallow: /admin
Disallow: /auth

# Allow all rental and sales pages
Allow: /renditooted
Allow: /myygitooted
Allow: /tallinn
Allow: /tartu
Allow: /parnu
Allow: /rakvere
Allow: /saku
Allow: /*-rent

# Allow all assets and images
Allow: /assets/
Allow: /public/
Allow: /*.jpg
Allow: /*.png
Allow: /*.svg
Allow: /*.webp`;
};

// SEO performance optimization suggestions
export const getSEOSuggestions = () => {
  return {
    technical: [
      'Seadista Googlei Search Console',
      'Lisa structured data kõikidele toodetele',
      'Optimeeri piltide suurusi ja lisa alt tekstid',
      'Seadista 301 redirectid vanale URL-idele',
      'Lisa meta description kõikidele lehekülgedele'
    ],
    content: [
      'Loo sisu iga renditoote kohta (vähemalt 300 sõna)',
      'Lisa klientide arvustused ja hinnangud',
      'Loo KKK (Korduma Kippuvad Küsimused) sektsioon',
      'Kirjuta blogiposts koristusnõuannete kohta',
      'Lisa videoõpetused seadmete kasutamise kohta'
    ],
    performance: [
      'Kompresse pildid WebP formaati',
      'Seadista CDN (Content Delivery Network)',
      'Minimiseeri CSS ja JavaScript failid',
      'Lisa lazy loading piltidele',
      'Optimeeri server response time'
    ],
    local: [
      'Registreeri Google My Business',
      'Lisa äri kohalikesse kataloogidesse',
      'Seadista lokaalsed maatrikslehte iga linna jaoks',
      'Lisa kontaktinfo ja lahtiolekuajad',
      'Kogu kohalikke backlinke'
    ]
  };
};