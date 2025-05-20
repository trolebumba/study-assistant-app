import { MetadataRoute } from 'next';

/**
 * Генерирует файл robots.txt для SEO
 */
export default function robots(): MetadataRoute.Robots {
  // Базовый URL сайта
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://study-assistant-app.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/auth/',
        '/private/',
        '/admin/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
