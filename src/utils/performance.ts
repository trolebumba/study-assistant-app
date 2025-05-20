/**
 * Утилиты для оптимизации производительности приложения
 */

/**
 * Функция для кэширования результатов вычислений
 * @param fn Функция, результаты которой нужно кэшировать
 * @param keyFn Функция для генерации ключа кэша (по умолчанию использует первый аргумент)
 * @returns Кэширующая обертка вокруг исходной функции
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  keyFn: (...args: Parameters<T>) => string = (...args) => String(args[0])
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = keyFn(...args);
    if (cache.has(key)) {
      return cache.get(key) as ReturnType<T>;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Функция для отложенной загрузки компонентов
 * @param importFn Функция импорта компонента
 * @returns Промис с компонентом
 */
export function lazyImport<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
): Promise<{ default: T }> {
  return importFn();
}

/**
 * Функция для измерения времени выполнения функции
 * @param fn Функция для измерения
 * @param name Название функции для логирования
 * @returns Обертка вокруг исходной функции с измерением времени
 */
export function measurePerformance<T extends (...args: any[]) => any>(
  fn: T,
  name: string = fn.name
): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    console.log(`[Performance] ${name} took ${end - start}ms`);
    return result;
  }) as T;
}

/**
 * Функция для дебаунса (предотвращения частого вызова функции)
 * @param fn Функция для дебаунса
 * @param delay Задержка в миллисекундах
 * @returns Дебаунсированная функция
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Функция для троттлинга (ограничения частоты вызова функции)
 * @param fn Функция для троттлинга
 * @param limit Минимальный интервал между вызовами в миллисекундах
 * @returns Троттлированная функция
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  let lastArgs: Parameters<T> | null = null;

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          const currentArgs = lastArgs;
          lastArgs = null;
          fn(...currentArgs);
        }
      }, limit);
    } else {
      lastArgs = args;
    }
  };
}

/**
 * Функция для кэширования данных в localStorage
 * @param key Ключ для хранения в localStorage
 * @param data Данные для кэширования
 * @param ttl Время жизни кэша в миллисекундах (по умолчанию 1 час)
 */
export function cacheToLocalStorage<T>(key: string, data: T, ttl: number = 3600000): void {
  const cacheItem = {
    data,
    expiry: Date.now() + ttl
  };
  localStorage.setItem(key, JSON.stringify(cacheItem));
}

/**
 * Функция для получения данных из кэша localStorage
 * @param key Ключ для получения из localStorage
 * @returns Данные из кэша или null, если кэш отсутствует или устарел
 */
export function getFromLocalStorageCache<T>(key: string): T | null {
  const cachedItem = localStorage.getItem(key);
  if (!cachedItem) return null;

  try {
    const { data, expiry } = JSON.parse(cachedItem);
    if (expiry < Date.now()) {
      localStorage.removeItem(key);
      return null;
    }
    return data as T;
  } catch (error) {
    localStorage.removeItem(key);
    return null;
  }
}

/**
 * Функция для очистки всего кэша localStorage
 */
export function clearLocalStorageCache(): void {
  localStorage.clear();
}

/**
 * Функция для очистки устаревших элементов кэша localStorage
 */
export function cleanExpiredCache(): void {
  const now = Date.now();
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          const { expiry } = JSON.parse(item);
          if (expiry < now) {
            localStorage.removeItem(key);
          }
        } catch (error) {
          // Если элемент не является кэшем, пропускаем его
        }
      }
    }
  }
}
