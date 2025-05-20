import { Metadata } from 'next';

interface MetaTagsProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonical?: string;
  noindex?: boolean;
}

/**
 * Генерирует метаданные для SEO
 */
export function generateMetadata({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  canonical,
  noindex = false,
}: MetaTagsProps): Metadata {
  // Базовый URL сайта
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://study-assistant-app.vercel.app';
  
  // Формируем канонический URL
  const canonicalUrl = canonical ? `${baseUrl}${canonical}` : baseUrl;
  
  // Формируем URL изображения для Open Graph
  const ogImageUrl = ogImage ? `${baseUrl}${ogImage}` : `${baseUrl}/og-image.jpg`;

  return {
    title,
    description,
    keywords: keywords || 'образование, подготовка к экзаменам, ИИ, искусственный интеллект, обучение, тесты',
    authors: [{ name: 'Study Assistant Team' }],
    robots: noindex ? 'noindex, nofollow' : 'index, follow',
    openGraph: {
      title,
      description,
      type: ogType,
      url: canonicalUrl,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'ru_RU',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

/**
 * Генерирует структурированные данные для SEO
 */
export function generateStructuredData(type: 'WebSite' | 'Article' | 'FAQPage' | 'Course', data: any) {
  switch (type) {
    case 'WebSite':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: data.name,
        url: data.url,
        description: data.description,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${data.url}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      };
    
    case 'Article':
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: data.title,
        description: data.description,
        image: data.image,
        datePublished: data.datePublished,
        dateModified: data.dateModified,
        author: {
          '@type': 'Person',
          name: data.author,
        },
      };
    
    case 'FAQPage':
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: data.questions.map((q: any) => ({
          '@type': 'Question',
          name: q.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: q.answer,
          },
        })),
      };
    
    case 'Course':
      return {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: data.name,
        description: data.description,
        provider: {
          '@type': 'Organization',
          name: data.provider,
          sameAs: data.providerUrl,
        },
      };
    
    default:
      return null;
  }
}

/**
 * Компонент для вставки структурированных данных в страницу
 */
export function StructuredData({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
