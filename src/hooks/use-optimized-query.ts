'use client';

import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useEffect } from 'react';
import { cacheToLocalStorage, getFromLocalStorageCache } from '@/utils/performance';

interface OptimizedQueryOptions<TData, TError> extends UseQueryOptions<TData, TError> {
  localStorageCacheKey?: string;
  localStorageCacheTtl?: number; // в миллисекундах
  prefetch?: boolean;
}

/**
 * Хук для оптимизированных запросов с использованием React Query и localStorage
 * @param queryKey Ключ запроса для React Query
 * @param queryFn Функция запроса
 * @param options Дополнительные опции
 * @returns Результат запроса
 */
export function useOptimizedQuery<TData, TError = Error>(
  queryKey: string[],
  queryFn: () => Promise<TData>,
  options?: OptimizedQueryOptions<TData, TError>
): UseQueryResult<TData, TError> {
  const {
    localStorageCacheKey,
    localStorageCacheTtl = 3600000, // 1 час по умолчанию
    prefetch = false,
    ...queryOptions
  } = options || {};

  // Проверяем наличие данных в localStorage перед запросом
  const cachedData = localStorageCacheKey
    ? getFromLocalStorageCache<TData>(localStorageCacheKey)
    : null;

  // Используем React Query с учетом кэша из localStorage
  const queryResult = useQuery<TData, TError>({
    queryKey,
    queryFn,
    initialData: cachedData || undefined,
    staleTime: localStorageCacheTtl / 2, // Половина TTL для staleTime
    ...queryOptions,
  });

  // Сохраняем результат в localStorage, если есть ключ кэша и данные
  useEffect(() => {
    if (localStorageCacheKey && queryResult.data && !queryResult.isLoading) {
      cacheToLocalStorage(localStorageCacheKey, queryResult.data, localStorageCacheTtl);
    }
  }, [localStorageCacheKey, queryResult.data, queryResult.isLoading, localStorageCacheTtl]);

  // Предзагрузка данных, если включена опция prefetch
  useEffect(() => {
    if (prefetch && !queryResult.data && !queryResult.isLoading) {
      queryResult.refetch();
    }
  }, [prefetch, queryResult]);

  return queryResult;
}

/**
 * Хук для оптимизированных запросов с пагинацией
 * @param baseQueryKey Базовый ключ запроса
 * @param fetchPage Функция для загрузки страницы
 * @param options Дополнительные опции
 * @returns Результат запроса с пагинацией
 */
export function usePaginatedQuery<TData, TError = Error>(
  baseQueryKey: string[],
  fetchPage: (page: number) => Promise<TData>,
  options?: OptimizedQueryOptions<TData, TError> & { initialPage?: number }
) {
  const { initialPage = 1, ...queryOptions } = options || {};
  const [page, setPage] = React.useState(initialPage);

  const queryKey = [...baseQueryKey, `page=${page}`];
  const localStorageCacheKey = queryOptions.localStorageCacheKey
    ? `${queryOptions.localStorageCacheKey}_page${page}`
    : undefined;

  const queryResult = useOptimizedQuery<TData, TError>(
    queryKey,
    () => fetchPage(page),
    {
      ...queryOptions,
      localStorageCacheKey,
    }
  );

  const goToNextPage = () => setPage((prev) => prev + 1);
  const goToPreviousPage = () => setPage((prev) => Math.max(1, prev - 1));
  const goToPage = (pageNumber: number) => setPage(Math.max(1, pageNumber));

  return {
    ...queryResult,
    page,
    goToNextPage,
    goToPreviousPage,
    goToPage,
  };
}
