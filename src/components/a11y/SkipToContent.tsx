'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Компонент для пропуска навигации и перехода к основному содержимому
 * Важный компонент для доступности, позволяющий пользователям клавиатуры
 * быстро переходить к основному содержимому страницы
 *
 * Отображается только на страницах, отличных от главной
 */
export function SkipToContent() {
  const [isFocused, setIsFocused] = useState(false);
  const pathname = usePathname();

  // Не отображаем на главной странице
  if (pathname === '/') {
    return null;
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.tabIndex = -1;
      mainContent.focus();
      // Восстанавливаем tabIndex после фокусировки
      setTimeout(() => {
        if (mainContent) {
          mainContent.removeAttribute('tabindex');
        }
      }, 100);
    }
  };

  return (
    <a
      href="#main-content"
      className={`
        fixed top-0 left-0 p-3 m-3 bg-blue-600 text-white z-50 transition-transform duration-200
        ${isFocused ? 'transform-none' : '-translate-y-full'}
        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
      `}
      onClick={handleClick}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      Перейти к содержимому
    </a>
  );
}
