import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PlatformIntegrationCard } from '../PlatformIntegrationCard';
import { PlatformCourse } from '@/utils/platform-integrations';

// Мок для window.open
const mockOpen = jest.fn();
window.open = mockOpen;

describe('PlatformIntegrationCard', () => {
  const mockCourse: PlatformCourse = {
    id: 'test-course-1',
    title: 'Тестовый курс',
    description: 'Описание тестового курса',
    platform: 'coursera',
    url: 'https://example.com/course',
    imageUrl: 'https://example.com/image.jpg',
    instructors: ['Тестовый преподаватель'],
    duration: '8 недель',
    level: 'Средний',
    topics: ['JavaScript', 'React']
  };

  const mockImport = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders course information correctly', () => {
    render(<PlatformIntegrationCard course={mockCourse} onImport={mockImport} />);
    
    expect(screen.getByText('Тестовый курс')).toBeInTheDocument();
    expect(screen.getByText('Описание тестового курса')).toBeInTheDocument();
    expect(screen.getByText('coursera')).toBeInTheDocument();
    expect(screen.getByText('Преподаватели:')).toBeInTheDocument();
    expect(screen.getByText(/Тестовый преподаватель/)).toBeInTheDocument();
    expect(screen.getByText('Продолжительность:')).toBeInTheDocument();
    expect(screen.getByText(/8 недель/)).toBeInTheDocument();
    expect(screen.getByText('Уровень:')).toBeInTheDocument();
    expect(screen.getByText(/Средний/)).toBeInTheDocument();
    
    // Проверяем теги
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('opens course URL in new tab when "Открыть на платформе" button is clicked', () => {
    render(<PlatformIntegrationCard course={mockCourse} onImport={mockImport} />);
    
    const openButton = screen.getByText('Открыть на платформе');
    fireEvent.click(openButton);
    
    expect(mockOpen).toHaveBeenCalledWith('https://example.com/course', '_blank');
  });

  it('calls onImport with course ID when "Импортировать" button is clicked', async () => {
    render(<PlatformIntegrationCard course={mockCourse} onImport={mockImport} />);
    
    const importButton = screen.getByText('Импортировать');
    fireEvent.click(importButton);
    
    expect(importButton).toHaveTextContent('Импортирование...');
    expect(mockImport).toHaveBeenCalledWith('test-course-1');
    
    await waitFor(() => {
      expect(screen.getByText('Импортировано')).toBeInTheDocument();
    });
  });

  it('shows error state when import fails', async () => {
    const mockFailedImport = jest.fn().mockRejectedValue(new Error('Import failed'));
    
    render(<PlatformIntegrationCard course={mockCourse} onImport={mockFailedImport} />);
    
    const importButton = screen.getByText('Импортировать');
    fireEvent.click(importButton);
    
    expect(importButton).toHaveTextContent('Импортирование...');
    
    await waitFor(() => {
      expect(screen.getByText('Ошибка импорта')).toBeInTheDocument();
    });
  });

  it('disables import button after successful import', async () => {
    render(<PlatformIntegrationCard course={mockCourse} onImport={mockImport} />);
    
    const importButton = screen.getByText('Импортировать');
    fireEvent.click(importButton);
    
    await waitFor(() => {
      const successButton = screen.getByText('Импортировано');
      expect(successButton).toBeDisabled();
    });
  });
});
