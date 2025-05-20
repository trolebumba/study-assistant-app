'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { AccessibilityMenu } from '@/components/a11y/AccessibilityMenu';
import { FeedbackButton } from '@/components/feedback/FeedbackButton';

interface MainNavigationProps {
  // Дополнительные пропсы, если потребуются
}

export default function MainNavigation({}: MainNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isGuestUser, setIsGuestUser] = useState(false);
  const pathname = usePathname();
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Функция для определения активного пункта меню
  const isActive = (path: string) => {
    return pathname === path;
  };

  // Функция для входа без регистрации
  const handleGuestLogin = () => {
    setIsGuestUser(true);
    // Можно добавить дополнительную логику, например, создание временного профиля
    console.log('Вход без регистрации');

    // Закрываем меню профиля, если оно открыто
    setIsProfileMenuOpen(false);
  };

  // Закрытие меню профиля при клике вне его
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-blue-600">
                StudyAssistant
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/dashboard"
                className={`${
                  isActive('/dashboard')
                    ? 'border-blue-500 text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Дашборд
              </Link>
              <Link
                href="/study-plan"
                className={`${
                  isActive('/study-plan')
                    ? 'border-blue-500 text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Учебный план
              </Link>
              <Link
                href="/tests"
                className={`${
                  isActive('/tests')
                    ? 'border-blue-500 text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Тесты
              </Link>
              <Link
                href="/assistant"
                className={`${
                  isActive('/assistant')
                    ? 'border-blue-500 text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Ассистент
              </Link>
              <Link
                href="/recommendations"
                className={`${
                  isActive('/recommendations')
                    ? 'border-blue-500 text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Рекомендации
              </Link>
              <Link
                href="/achievements"
                className={`${
                  isActive('/achievements')
                    ? 'border-blue-500 text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Достижения
              </Link>
              <Link
                href="/integrations"
                className={`${
                  isActive('/integrations')
                    ? 'border-blue-500 text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Интеграции
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {/* Профиль пользователя */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center gap-4">
              {!isGuestUser && (
                <button
                  onClick={handleGuestLogin}
                  className="px-4 py-2 rounded-md bg-gradient-to-r from-teal-500 to-blue-500 text-white text-sm font-medium hover:from-teal-600 hover:to-blue-600 transition-colors"
                >
                  Войти без регистрации
                </button>
              )}
              <FeedbackButton />
              <AccessibilityMenu />

              <div className="relative" ref={profileMenuRef}>
                <button
                  className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  aria-expanded={isProfileMenuOpen}
                  aria-controls="profile-menu"
                >
                  <span className="sr-only">Профиль</span>
                  <svg className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm">{isGuestUser ? 'Гость' : 'Пользователь'}</span>
                </button>
                <div
                  id="profile-menu"
                  className={`absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 ${isProfileMenuOpen ? 'block' : 'hidden'}`}
                  role="menu"
                >
                  {!isGuestUser && (
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
                      onClick={handleGuestLogin}
                    >
                      Войти без регистрации
                    </button>
                  )}
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Профиль
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Настройки
                  </Link>
                  {isGuestUser ? (
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        setIsGuestUser(false);
                        console.log('Выход из гостевого режима');
                      }}
                    >
                      Выйти из гостевого режима
                    </button>
                  ) : (
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        // Здесь будет логика выхода из системы
                        console.log('Выход из системы');
                      }}
                    >
                      Выйти
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Мобильное меню */}
            <div className="sm:hidden">
              <button
                type="button"
                className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span className="sr-only">{isOpen ? 'Закрыть меню' : 'Открыть меню'}</span>
                {isOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Мобильное меню, переключается по клику */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/dashboard"
              className={`${
                isActive('/dashboard')
                  ? 'bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-700 dark:text-blue-200'
                  : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              onClick={() => setIsOpen(false)}
            >
              Дашборд
            </Link>
            <Link
              href="/study-plan"
              className={`${
                isActive('/study-plan')
                  ? 'bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-700 dark:text-blue-200'
                  : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              onClick={() => setIsOpen(false)}
            >
              Учебный план
            </Link>
            <Link
              href="/tests"
              className={`${
                isActive('/tests')
                  ? 'bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-700 dark:text-blue-200'
                  : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              onClick={() => setIsOpen(false)}
            >
              Тесты
            </Link>
            <Link
              href="/assistant"
              className={`${
                isActive('/assistant')
                  ? 'bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-700 dark:text-blue-200'
                  : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              onClick={() => setIsOpen(false)}
            >
              Ассистент
            </Link>
            <Link
              href="/recommendations"
              className={`${
                isActive('/recommendations')
                  ? 'bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-700 dark:text-blue-200'
                  : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              onClick={() => setIsOpen(false)}
            >
              Рекомендации
            </Link>
            <Link
              href="/achievements"
              className={`${
                isActive('/achievements')
                  ? 'bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-700 dark:text-blue-200'
                  : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              onClick={() => setIsOpen(false)}
            >
              Достижения
            </Link>
            <Link
              href="/integrations"
              className={`${
                isActive('/integrations')
                  ? 'bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-700 dark:text-blue-200'
                  : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              onClick={() => setIsOpen(false)}
            >
              Интеграции
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800 dark:text-white">
                  {isGuestUser ? 'Гость' : 'Пользователь'}
                </div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {isGuestUser ? 'Временный доступ' : 'user@example.com'}
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              {!isGuestUser && (
                <button
                  className="block w-full text-left px-4 py-2 text-base font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    handleGuestLogin();
                    setIsOpen(false);
                  }}
                >
                  Войти без регистрации
                </button>
              )}
              <Link
                href="/profile"
                className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Профиль
              </Link>
              <Link
                href="/settings"
                className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Настройки
              </Link>
              {isGuestUser ? (
                <button
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    setIsOpen(false);
                    setIsGuestUser(false);
                    console.log('Выход из гостевого режима');
                  }}
                >
                  Выйти из гостевого режима
                </button>
              ) : (
                <button
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    setIsOpen(false);
                    // Здесь будет логика выхода из системы
                    console.log('Выход из системы');
                  }}
                >
                  Выйти
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
