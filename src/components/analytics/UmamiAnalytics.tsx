'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

// Интерфейс для Umami, доступный глобально
declare global {
  interface Window {
    umami?: {
      track: (event_name: string, event_data?: Record<string, any>) => void;
      trackView: (url: string) => void;
    };
  }
}

export default function UmamiAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Отслеживание изменений страницы
  useEffect(() => {
    if (window.umami) {
      // Создаем полный URL для отслеживания
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      
      // Отправляем событие просмотра страницы
      window.umami.trackView(url);
    }
  }, [pathname, searchParams]);
  
  // Получаем ID сайта из переменных окружения
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL || 'https://analytics.umami.is/script.js';
  
  // Если ID сайта не указан, не добавляем скрипт
  if (!websiteId) {
    return null;
  }
  
  return (
    <Script
      src={umamiUrl}
      data-website-id={websiteId}
      strategy="lazyOnload"
      async
      defer
    />
  );
}
