'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { captureException } from '@/utils/sentry';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Обновляем состояние, чтобы при следующем рендере показать запасной UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Можно также отправить отчет об ошибке в сервис аналитики
    this.setState({
      error,
      errorInfo,
    });
    
    // Отправляем ошибку в Sentry
    captureException(error, {
      componentStack: errorInfo.componentStack,
    });
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Если определен пользовательский fallback, используем его
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Иначе показываем стандартный UI для ошибок
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="text-red-500 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">
              Что-то пошло не так
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
              Произошла ошибка при отображении этого компонента. Мы уже получили уведомление об этой проблеме и работаем над её устранением.
            </p>
            <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded overflow-auto max-h-40">
              <p className="text-sm font-mono text-gray-800 dark:text-gray-200">
                {this.state.error?.toString()}
              </p>
            </div>
            <div className="flex justify-center">
              <Button onClick={this.resetError}>
                Попробовать снова
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
