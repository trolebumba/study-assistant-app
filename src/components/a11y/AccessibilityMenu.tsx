'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface AccessibilityMenuProps {
  className?: string;
}

/**
 * Компонент меню доступности для настройки параметров отображения
 */
export function AccessibilityMenu({ className }: AccessibilityMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100); // процент от базового размера шрифта
  const [contrast, setContrast] = useState('normal'); // normal, high, low
  const [reducedMotion, setReducedMotion] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);

  // Применяем настройки при их изменении
  useEffect(() => {
    // Загружаем сохраненные настройки при монтировании
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setFontSize(settings.fontSize || 100);
        setContrast(settings.contrast || 'normal');
        setReducedMotion(settings.reducedMotion || false);
        setDyslexicFont(settings.dyslexicFont || false);
      } catch (error) {
        console.error('Error loading accessibility settings:', error);
      }
    }
  }, []);

  // Применяем настройки при их изменении
  useEffect(() => {
    // Размер шрифта
    document.documentElement.style.setProperty('--font-size-multiplier', `${fontSize / 100}`);

    // Контрастность
    document.body.classList.remove('high-contrast', 'low-contrast');
    if (contrast === 'high') {
      document.body.classList.add('high-contrast');
    } else if (contrast === 'low') {
      document.body.classList.add('low-contrast');
    }

    // Уменьшенное движение
    if (reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }

    // Шрифт для людей с дислексией
    if (dyslexicFont) {
      document.body.classList.add('dyslexic-font');
    } else {
      document.body.classList.remove('dyslexic-font');
    }

    // Сохраняем настройки
    localStorage.setItem(
      'accessibility-settings',
      JSON.stringify({
        fontSize,
        contrast,
        reducedMotion,
        dyslexicFont,
      })
    );
  }, [fontSize, contrast, reducedMotion, dyslexicFont]);

  const resetSettings = () => {
    setFontSize(100);
    setContrast('normal');
    setReducedMotion(false);
    setDyslexicFont(false);
  };

  return (
    <div className={`relative ${className || ''}`}>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="accessibility-menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </svg>
        <span>Доступность</span>
      </Button>

      {isOpen && (
        <div
          id="accessibility-menu"
          className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-md shadow-lg p-4 z-50 border border-gray-200 dark:border-gray-700"
          role="menu"
        >
          <h3 className="text-lg font-medium mb-3">Настройки доступности</h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="font-size" className="block text-sm font-medium mb-1">
                Размер текста: {fontSize}%
              </label>
              <input
                id="font-size"
                type="range"
                min="80"
                max="200"
                step="10"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="contrast" className="block text-sm font-medium mb-1">
                Контрастность
              </label>
              <select
                id="contrast"
                value={contrast}
                onChange={(e) => setContrast(e.target.value)}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="normal">Обычная</option>
                <option value="high">Высокая</option>
                <option value="low">Низкая</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                id="reduced-motion"
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="reduced-motion" className="text-sm">
                Уменьшить анимацию
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="dyslexic-font"
                type="checkbox"
                checked={dyslexicFont}
                onChange={(e) => setDyslexicFont(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="dyslexic-font" className="text-sm">
                Шрифт для людей с дислексией
              </label>
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" size="sm" onClick={resetSettings}>
                Сбросить
              </Button>
              <Button size="sm" onClick={() => setIsOpen(false)}>
                Закрыть
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
