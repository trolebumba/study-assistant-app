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

  // Проверяем, находимся ли мы на главной странице
  const isHomePage = pathname === '/';

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
    <nav className="bg-gradient-to-r from-teal-500 to-blue-500 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-white hover:text-teal-100 transition-colors">
                StudyAssistant
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/dashboard"
                className={`${
                  isActive('/dashboard')
                    ? 'border-white text-white font-semibold'
                    : 'border-transparent text-teal-100 hover:border-teal-200 hover:text-white'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
              >
                Дашборд
              </Link>
              <Link
                href="/study-plan"
                className={`${
                  isActive('/study-plan')
                    ? 'border-white text-white font-semibold'
                    : 'border-transparent text-teal-100 hover:border-teal-200 hover:text-white'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
              >
                Учебный план
              </Link>
              <Link
                href="/tests"
                className={`${
                  isActive('/tests')
                    ? 'border-white text-white font-semibold'
                    : 'border-transparent text-teal-100 hover:border-teal-200 hover:text-white'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
              >
                Тесты
              </Link>
              <Link
                href="/assistant"
                className={`${
                  isActive('/assistant')
                    ? 'border-white text-white font-semibold'
                    : 'border-transparent text-teal-100 hover:border-teal-200 hover:text-white'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
              >
                Ассистент
              </Link>
              <Link
                href="/recommendations"
                className={`${
                  isActive('/recommendations')
                    ? 'border-white text-white font-semibold'
                    : 'border-transparent text-teal-100 hover:border-teal-200 hover:text-white'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
              >
                Рекомендации
              </Link>
              <Link
                href="/achievements"
                className={`${
                  isActive('/achievements')
                    ? 'border-white text-white font-semibold'
                    : 'border-transparent text-teal-100 hover:border-teal-200 hover:text-white'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
              >
                Достижения
              </Link>
              <Link
                href="/integrations"
                className={`${
                  isActive('/integrations')
                    ? 'border-white text-white font-semibold'
                    : 'border-transparent text-teal-100 hover:border-teal-200 hover:text-white'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
              >
                Интеграции
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {/* Профиль пользователя */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center gap-4">
              {!isGuestUser && isHomePage && (
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
                  className="p-2 rounded-md text-white hover:text-teal-100 flex items-center transition-colors"
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
                  {!isGuestUser && isHomePage && (
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
                className="p-2 rounded-md text-white hover:text-teal-100 focus:outline-none transition-colors"
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
        <div className="sm:hidden bg-gradient-to-r from-teal-600 to-blue-600">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/dashboard"
              className={`${
                isActive('/dashboard')
                  ? 'bg-teal-700 border-white text-white font-semibold'
                  : 'border-transparent text-teal-100 hover:bg-teal-700/50 hover:text-white'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors`}
              onClick={() => setIsOpen(false)}
            >
              Дашборд
            </Link>
            <Link
              href="/study-plan"
              className={`${
                isActive('/study-plan')
                  ? 'bg-teal-700 border-white text-white font-semibold'
                  : 'border-transparent text-teal-100 hover:bg-teal-700/50 hover:text-white'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors`}
              onClick={() => setIsOpen(false)}
            >
              Учебный план
            </Link>
            <Link
              href="/tests"
              className={`${
                isActive('/tests')
                  ? 'bg-teal-700 border-white text-white font-semibold'
                  : 'border-transparent text-teal-100 hover:bg-teal-700/50 hover:text-white'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors`}
              onClick={() => setIsOpen(false)}
            >
              Тесты
            </Link>
            <Link
              href="/assistant"
              className={`${
                isActive('/assistant')
                  ? 'bg-teal-700 border-white text-white font-semibold'
                  : 'border-transparent text-teal-100 hover:bg-teal-700/50 hover:text-white'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors`}
              onClick={() => setIsOpen(false)}
            >
              Ассистент
            </Link>
            <Link
              href="/recommendations"
              className={`${
                isActive('/recommendations')
                  ? 'bg-teal-700 border-white text-white font-semibold'
                  : 'border-transparent text-teal-100 hover:bg-teal-700/50 hover:text-white'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors`}
              onClick={() => setIsOpen(false)}
            >
              Рекомендации
            </Link>
            <Link
              href="/achievements"
              className={`${
                isActive('/achievements')
                  ? 'bg-teal-700 border-white text-white font-semibold'
                  : 'border-transparent text-teal-100 hover:bg-teal-700/50 hover:text-white'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors`}
              onClick={() => setIsOpen(false)}
            >
              Достижения
            </Link>
            <Link
              href="/integrations"
              className={`${
                isActive('/integrations')
                  ? 'bg-teal-700 border-white text-white font-semibold'
                  : 'border-transparent text-teal-100 hover:bg-teal-700/50 hover:text-white'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors`}
              onClick={() => setIsOpen(false)}
            >
              Интеграции
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-teal-500">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-teal-700 flex items-center justify-center text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">
                  {isGuestUser ? 'Гость' : 'Пользователь'}
                </div>
                <div className="text-sm font-medium text-teal-100">
                  {isGuestUser ? 'Временный доступ' : 'user@example.com'}
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              {!isGuestUser && isHomePage && (
                <button
                  className="block w-full text-left px-4 py-2 text-base font-medium text-white bg-teal-700 hover:bg-teal-800 transition-colors"
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
                className="block px-4 py-2 text-base font-medium text-teal-100 hover:text-white hover:bg-teal-700/50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Профиль
              </Link>
              <Link
                href="/settings"
                className="block px-4 py-2 text-base font-medium text-teal-100 hover:text-white hover:bg-teal-700/50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Настройки
              </Link>
              {isGuestUser ? (
                <button
                  className="block w-full text-left px-4 py-2 text-base font-medium text-teal-100 hover:text-white hover:bg-teal-700/50 transition-colors"
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
                  className="block w-full text-left px-4 py-2 text-base font-medium text-teal-100 hover:text-white hover:bg-teal-700/50 transition-colors"
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
