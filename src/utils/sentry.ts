import * as Sentry from '@sentry/nextjs';

// Инициализация Sentry
export const initSentry = () => {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 1.0, // Capture 100% of transactions in development, adjust for production
      integrations: [
        new Sentry.BrowserTracing({
          // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
          tracePropagationTargets: ['localhost', /^https:\/\/study-assistant\.vercel\.app/],
        }),
        new Sentry.Replay({
          // Additional Replay configuration
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      // Performance monitoring
      replaysSessionSampleRate: 0.1, // Sample rate for all sessions (10%)
      replaysOnErrorSampleRate: 1.0, // Sample rate for sessions with errors (100%)
    });
  } else {
    console.warn('Sentry DSN not found. Error tracking disabled.');
  }
};

// Функция для отслеживания ошибок
export const captureException = (error: Error, context?: Record<string, any>) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error captured by Sentry:', error);
    if (context) {
      console.error('Additional context:', context);
    }
  }
  
  Sentry.captureException(error, {
    contexts: context ? { additional: context } : undefined,
  });
};

// Функция для отслеживания событий
export const captureEvent = (
  name: string,
  data?: Record<string, any>,
  level: Sentry.SeverityLevel = 'info'
) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Event captured by Sentry: ${name}`, data);
  }
  
  Sentry.captureEvent({
    message: name,
    level,
    extra: data,
  });
};

// Функция для установки пользовательского контекста
export const setUserContext = (user: {
  id?: string;
  email?: string;
  username?: string;
}) => {
  Sentry.setUser(user);
};

// Функция для очистки пользовательского контекста
export const clearUserContext = () => {
  Sentry.setUser(null);
};

// Функция для создания области действия
export const withScope = (callback: (scope: Sentry.Scope) => void) => {
  Sentry.withScope(callback);
};

// Хук для использования в компонентах с ErrorBoundary
export const useSentryErrorBoundary = () => {
  return {
    showDialog: Sentry.showReportDialog,
  };
};
