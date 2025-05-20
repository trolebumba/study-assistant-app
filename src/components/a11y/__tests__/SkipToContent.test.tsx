import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SkipToContent } from '../SkipToContent';

describe('SkipToContent', () => {
  beforeEach(() => {
    // Создаем элемент main-content для тестирования
    const mainContent = document.createElement('div');
    mainContent.id = 'main-content';
    document.body.appendChild(mainContent);
  });

  afterEach(() => {
    // Удаляем элемент после тестирования
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      document.body.removeChild(mainContent);
    }
  });

  it('renders correctly', () => {
    render(<SkipToContent />);
    const skipLink = screen.getByText('Перейти к содержимому');
    expect(skipLink).toBeInTheDocument();
  });

  it('is hidden by default and visible on focus', () => {
    render(<SkipToContent />);
    const skipLink = screen.getByText('Перейти к содержимому');
    
    // Проверяем, что ссылка изначально скрыта (трансформирована)
    expect(skipLink).toHaveClass('-translate-y-full');
    
    // Фокусируемся на ссылке
    fireEvent.focus(skipLink);
    
    // Проверяем, что ссылка стала видимой
    expect(skipLink).not.toHaveClass('-translate-y-full');
    
    // Убираем фокус
    fireEvent.blur(skipLink);
    
    // Проверяем, что ссылка снова скрыта
    expect(skipLink).toHaveClass('-translate-y-full');
  });

  it('focuses on main content when clicked', () => {
    render(<SkipToContent />);
    const skipLink = screen.getByText('Перейти к содержимому');
    const mainContent = document.getElementById('main-content') as HTMLElement;
    
    // Мокаем функцию focus
    const focusSpy = jest.spyOn(mainContent, 'focus');
    
    // Кликаем на ссылку
    fireEvent.click(skipLink);
    
    // Проверяем, что focus был вызван
    expect(focusSpy).toHaveBeenCalled();
    
    focusSpy.mockRestore();
  });
});
