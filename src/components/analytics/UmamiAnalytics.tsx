'use client';

import Script from 'next/script';

export default function UmamiAnalytics() {
  // Получаем ID сайта из переменных окружения
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  // Если ID сайта не указан, не добавляем скрипт
  if (!websiteId) {
    return null;
  }

  return (
    <Script
      src="https://analytics.umami.is/script.js"
      data-website-id={websiteId}
      strategy="lazyOnload"
      async
      defer
    />
  );
}
