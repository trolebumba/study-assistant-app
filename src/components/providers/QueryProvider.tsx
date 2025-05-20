'use client';

import React, { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/utils/query-client';

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [showDevtools, setShowDevtools] = useState(false);

  useEffect(() => {
    // Загружаем DevTools только на клиенте и только в режиме разработки
    if (process.env.NODE_ENV === 'development') {
      setShowDevtools(true);
    }
  }, []);

  // Используем lazy для динамического импорта компонента
  const ReactQueryDevtoolsProduction = showDevtools
    ? React.lazy(() =>
        import('@tanstack/react-query-devtools/build/lib/index.prod.js').then(
          (d) => ({
            default: d.ReactQueryDevtools,
          })
        )
      )
    : null;

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {showDevtools && (
        <React.Suspense fallback={null}>
          <ReactQueryDevtoolsProduction initialIsOpen={false} />
        </React.Suspense>
      )}
    </QueryClientProvider>
  );
}
