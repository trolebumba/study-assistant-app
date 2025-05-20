'use client';

import { useState, useEffect, useRef, Suspense, lazy, ComponentType } from 'react';

interface LazyComponentProps<T = any> {
  component: () => Promise<{ default: ComponentType<T> }>;
  props?: T;
  fallback?: React.ReactNode;
  threshold?: number; // 0-1, процент видимости элемента для загрузки
  rootMargin?: string; // отступ для IntersectionObserver
}

/**
 * Компонент для ленивой загрузки других компонентов
 */
export function LazyComponent<T = any>({
  component,
  props,
  fallback = <div className="w-full h-64 bg-gray-100 animate-pulse rounded-md" />,
  threshold = 0.1,
  rootMargin = '200px',
}: LazyComponentProps<T>) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const LazyLoadedComponent = lazy(component);

  useEffect(() => {
    if (containerRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setShouldLoad(true);
              observer.disconnect();
            }
          });
        },
        { threshold, rootMargin }
      );

      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [threshold, rootMargin]);

  return (
    <div ref={containerRef}>
      {shouldLoad ? (
        <Suspense fallback={fallback}>
          <LazyLoadedComponent {...(props as any)} />
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
}

/**
 * HOC для создания ленивых компонентов
 * @param importFn Функция импорта компонента
 * @param options Опции для ленивой загрузки
 * @returns Компонент с ленивой загрузкой
 */
export function withLazyLoading<T = any>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: Omit<LazyComponentProps<T>, 'component' | 'props'> = {}
) {
  return function LazyWrappedComponent(props: T) {
    return (
      <LazyComponent
        component={importFn}
        props={props}
        fallback={options.fallback}
        threshold={options.threshold}
        rootMargin={options.rootMargin}
      />
    );
  };
}
