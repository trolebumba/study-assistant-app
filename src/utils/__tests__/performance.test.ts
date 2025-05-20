import {
  memoize,
  debounce,
  throttle,
  cacheToLocalStorage,
  getFromLocalStorageCache,
  clearLocalStorageCache
} from '../performance';

describe('Performance utilities', () => {
  describe('memoize', () => {
    it('caches function results based on input', () => {
      const mockFn = jest.fn((x: number) => x * 2);
      const memoizedFn = memoize(mockFn);
      
      // Первый вызов должен вызвать оригинальную функцию
      expect(memoizedFn(5)).toBe(10);
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      // Повторный вызов с тем же аргументом должен использовать кэш
      expect(memoizedFn(5)).toBe(10);
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      // Вызов с другим аргументом должен вызвать оригинальную функцию
      expect(memoizedFn(10)).toBe(20);
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
    
    it('uses custom key function if provided', () => {
      const mockFn = jest.fn((obj: { id: number }) => obj.id * 2);
      const keyFn = (obj: { id: number }) => `id-${obj.id}`;
      const memoizedFn = memoize(mockFn, keyFn);
      
      const obj1 = { id: 5 };
      const obj2 = { id: 5 }; // Другой объект с тем же id
      
      // Первый вызов
      expect(memoizedFn(obj1)).toBe(10);
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      // Вызов с другим объектом, но тем же id
      expect(memoizedFn(obj2)).toBe(10);
      expect(mockFn).toHaveBeenCalledTimes(1); // Функция не должна вызываться снова
    });
  });
  
  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });
    
    afterEach(() => {
      jest.useRealTimers();
    });
    
    it('delays function execution until after wait time', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 1000);
      
      // Вызываем функцию несколько раз
      debouncedFn();
      debouncedFn();
      debouncedFn();
      
      // Функция не должна быть вызвана сразу
      expect(mockFn).not.toHaveBeenCalled();
      
      // Перематываем таймеры на 500мс
      jest.advanceTimersByTime(500);
      expect(mockFn).not.toHaveBeenCalled();
      
      // Перематываем таймеры еще на 500мс (всего 1000мс)
      jest.advanceTimersByTime(500);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
    
    it('resets the timer when called again during wait time', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 1000);
      
      debouncedFn();
      
      // Перематываем таймеры на 500мс
      jest.advanceTimersByTime(500);
      
      // Вызываем функцию снова
      debouncedFn();
      
      // Перематываем таймеры еще на 500мс (всего 1000мс от начала)
      jest.advanceTimersByTime(500);
      
      // Функция не должна быть вызвана, так как таймер был сброшен
      expect(mockFn).not.toHaveBeenCalled();
      
      // Перематываем таймеры еще на 500мс (всего 1500мс от начала)
      jest.advanceTimersByTime(500);
      
      // Теперь функция должна быть вызвана
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('throttle', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });
    
    afterEach(() => {
      jest.useRealTimers();
    });
    
    it('executes function immediately and then limits further calls', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 1000);
      
      // Первый вызов должен выполниться сразу
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      // Последующие вызовы в течение лимита не должны выполняться
      throttledFn();
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      // Перематываем таймеры на 1000мс
      jest.advanceTimersByTime(1000);
      
      // Должен выполниться только последний отложенный вызов
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });
  
  describe('localStorage cache utilities', () => {
    beforeEach(() => {
      // Мокаем localStorage
      const localStorageMock = (() => {
        let store: Record<string, string> = {};
        return {
          getItem: jest.fn((key: string) => store[key] || null),
          setItem: jest.fn((key: string, value: string) => {
            store[key] = value.toString();
          }),
          removeItem: jest.fn((key: string) => {
            delete store[key];
          }),
          clear: jest.fn(() => {
            store = {};
          }),
          length: 0,
          key: jest.fn((index: number) => ''),
        };
      })();
      
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true
      });
      
      jest.spyOn(Date, 'now').mockImplementation(() => 1000);
    });
    
    it('caches data to localStorage with expiry', () => {
      const testData = { test: 'data' };
      cacheToLocalStorage('test-key', testData, 5000);
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify({
          data: testData,
          expiry: 6000 // 1000 (current time) + 5000 (ttl)
        })
      );
    });
    
    it('retrieves valid data from localStorage cache', () => {
      const testData = { test: 'data' };
      const cachedItem = JSON.stringify({
        data: testData,
        expiry: 6000 // 1000 (current time) + 5000 (ttl)
      });
      
      (localStorage.getItem as jest.Mock).mockReturnValueOnce(cachedItem);
      
      const result = getFromLocalStorageCache('test-key');
      expect(result).toEqual(testData);
    });
    
    it('returns null for expired cache items', () => {
      const testData = { test: 'data' };
      const cachedItem = JSON.stringify({
        data: testData,
        expiry: 500 // Expired (less than current time 1000)
      });
      
      (localStorage.getItem as jest.Mock).mockReturnValueOnce(cachedItem);
      
      const result = getFromLocalStorageCache('test-key');
      expect(result).toBeNull();
      expect(localStorage.removeItem).toHaveBeenCalledWith('test-key');
    });
    
    it('clears all localStorage cache', () => {
      clearLocalStorageCache();
      expect(localStorage.clear).toHaveBeenCalled();
    });
  });
});
