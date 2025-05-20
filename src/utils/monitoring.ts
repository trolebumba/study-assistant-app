/**
 * Утилиты для мониторинга приложения
 */

import * as Sentry from '@sentry/nextjs';

/**
 * Типы событий для мониторинга
 */
export enum MonitoringEventType {
  // Пользовательские события
  USER_REGISTRATION = 'user.registration',
  USER_LOGIN = 'user.login',
  USER_LOGOUT = 'user.logout',
  USER_PROFILE_UPDATE = 'user.profile_update',
  USER_FEEDBACK = 'user.feedback',

  // События обучения
  STUDY_PLAN_CREATED = 'study.plan_created',
  STUDY_PLAN_UPDATED = 'study.plan_updated',
  LESSON_COMPLETED = 'study.lesson_completed',
  MODULE_COMPLETED = 'study.module_completed',

  // События тестирования
  TEST_STARTED = 'test.started',
  TEST_COMPLETED = 'test.completed',
  TEST_CREATED = 'test.created',

  // События ИИ
  AI_ASSISTANT_QUERY = 'ai.assistant_query',
  AI_RECOMMENDATION_GENERATED = 'ai.recommendation_generated',
  AI_MATERIAL_GENERATED = 'ai.material_generated',

  // События интеграций
  INTEGRATION_CONNECTED = 'integration.connected',
  INTEGRATION_DISCONNECTED = 'integration.disconnected',
  COURSE_IMPORTED = 'integration.course_imported',

  // События производительности
  PERFORMANCE_ISSUE = 'performance.issue',
  API_LATENCY = 'performance.api_latency',
  PAGE_LOAD = 'performance.page_load',

  // События ошибок
  ERROR_API = 'error.api',
  ERROR_UI = 'error.ui',
  ERROR_AUTHENTICATION = 'error.authentication',

  // События масштабирования
  SCALING_NEEDED = 'scaling.needed',
  RESOURCE_SCALED = 'scaling.resource_scaled',

  // События бета-программы
  BETA_SIGNUP = 'beta.signup',
}

/**
 * Интерфейс для метрик мониторинга
 */
export interface MonitoringMetrics {
  [key: string]: number | string | boolean | null;
}

/**
 * Класс для мониторинга приложения
 */
export class AppMonitoring {
  private static instance: AppMonitoring;
  private isInitialized: boolean = false;

  private constructor() {}

  /**
   * Получение экземпляра класса (Singleton)
   */
  public static getInstance(): AppMonitoring {
    if (!AppMonitoring.instance) {
      AppMonitoring.instance = new AppMonitoring();
    }
    return AppMonitoring.instance;
  }

  /**
   * Инициализация мониторинга
   */
  public initialize(): void {
    if (this.isInitialized) return;

    // Sentry уже инициализирован в sentry.*.config.js
    this.isInitialized = true;

    // Добавляем обработчик необработанных ошибок
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.captureError(event.error || new Error(event.message), {
          category: 'unhandled',
          source: event.filename,
          line: event.lineno,
          column: event.colno,
        });
      });

      window.addEventListener('unhandledrejection', (event) => {
        this.captureError(event.reason || new Error('Unhandled Promise rejection'), {
          category: 'unhandled_promise',
        });
      });
    }

    console.log('AppMonitoring initialized');
  }

  /**
   * Отслеживание события
   * @param eventType Тип события
   * @param metrics Метрики события
   */
  public trackEvent(eventType: MonitoringEventType, metrics?: MonitoringMetrics): void {
    if (!this.isInitialized) {
      this.initialize();
    }

    // Отправляем событие в Sentry
    Sentry.addBreadcrumb({
      category: 'event',
      message: eventType,
      level: 'info',
      data: metrics,
    });

    // Логируем событие в консоль в режиме разработки
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Monitoring] Event: ${eventType}`, metrics);
    }
  }

  /**
   * Отслеживание ошибки
   * @param error Объект ошибки
   * @param context Контекст ошибки
   */
  public captureError(error: Error, context?: Record<string, any>): void {
    if (!this.isInitialized) {
      this.initialize();
    }

    // Отправляем ошибку в Sentry
    Sentry.captureException(error, {
      tags: context,
    });

    // Логируем ошибку в консоль в режиме разработки
    if (process.env.NODE_ENV === 'development') {
      console.error(`[Monitoring] Error:`, error, context);
    }
  }

  /**
   * Отслеживание производительности страницы
   * @param url URL страницы
   */
  public trackPagePerformance(url: string): void {
    if (!this.isInitialized || typeof window === 'undefined') {
      return;
    }

    // Получаем метрики производительности
    const performance = window.performance;
    if (!performance) return;

    // Вычисляем время загрузки страницы
    const navigationStart = performance.timing.navigationStart;
    const loadEventEnd = performance.timing.loadEventEnd;
    const loadTime = loadEventEnd - navigationStart;

    // Отправляем метрики в Sentry
    this.trackEvent(MonitoringEventType.PAGE_LOAD, {
      url,
      loadTime,
      dnsTime: performance.timing.domainLookupEnd - performance.timing.domainLookupStart,
      tcpTime: performance.timing.connectEnd - performance.timing.connectStart,
      ttfb: performance.timing.responseStart - performance.timing.requestStart,
      domTime: performance.timing.domComplete - performance.timing.domLoading,
    });

    // Проверяем, не превышает ли время загрузки порог
    if (loadTime > 3000) {
      this.trackEvent(MonitoringEventType.PERFORMANCE_ISSUE, {
        url,
        loadTime,
        issue: 'slow_page_load',
      });
    }
  }

  /**
   * Отслеживание производительности API
   * @param endpoint Эндпоинт API
   * @param duration Длительность запроса в мс
   */
  public trackApiPerformance(endpoint: string, duration: number): void {
    if (!this.isInitialized) {
      this.initialize();
    }

    this.trackEvent(MonitoringEventType.API_LATENCY, {
      endpoint,
      duration,
    });

    // Проверяем, не превышает ли время запроса порог
    if (duration > 1000) {
      this.trackEvent(MonitoringEventType.PERFORMANCE_ISSUE, {
        endpoint,
        duration,
        issue: 'slow_api_request',
      });
    }
  }
}

// Экспортируем экземпляр для использования в приложении
export const monitoring = AppMonitoring.getInstance();
