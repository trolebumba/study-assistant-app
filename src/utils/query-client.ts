import { QueryClient } from '@tanstack/react-query';

// Создаем экземпляр QueryClient с настройками
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Данные считаются устаревшими через 5 минут
      staleTime: 5 * 60 * 1000,
      // Повторные попытки при ошибке
      retry: 1,
      // Кэширование данных на 10 минут
      gcTime: 10 * 60 * 1000,
      // Рефетч данных при фокусе на окне
      refetchOnWindowFocus: true,
    },
    mutations: {
      // Повторные попытки при ошибке
      retry: 1,
    },
  },
});
