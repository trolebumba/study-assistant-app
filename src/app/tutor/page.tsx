'use client';

import { useState } from 'react';
import MainNavigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import VirtualTutor from '@/components/VirtualTutor';

export default function TutorPage() {
  // Состояние для выбранной темы
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<string | null>(null);
  
  // Доступные темы и подтемы
  const topics = [
    {
      id: 'calculus',
      name: 'Математический анализ',
      subtopics: [
        { id: 'limits', name: 'Пределы' },
        { id: 'derivatives', name: 'Производные' },
        { id: 'integrals', name: 'Интегралы' },
        { id: 'series', name: 'Ряды' },
      ],
    },
    {
      id: 'algebra',
      name: 'Алгебра',
      subtopics: [
        { id: 'equations', name: 'Уравнения' },
        { id: 'matrices', name: 'Матрицы' },
        { id: 'polynomials', name: 'Полиномы' },
        { id: 'groups', name: 'Группы' },
      ],
    },
    {
      id: 'set_theory',
      name: 'Теория множеств',
      subtopics: [
        { id: 'operations', name: 'Операции над множествами' },
        { id: 'relations', name: 'Отношения' },
        { id: 'functions', name: 'Функции' },
        { id: 'cardinality', name: 'Мощность множеств' },
      ],
    },
    {
      id: 'analysis',
      name: 'Анализ',
      subtopics: [
        { id: 'continuity', name: 'Непрерывность' },
        { id: 'differentiability', name: 'Дифференцируемость' },
        { id: 'integration', name: 'Интегрирование' },
        { id: 'measure', name: 'Теория меры' },
      ],
    },
  ];
  
  // Получаем подтемы для выбранной темы
  const subtopics = selectedTopic
    ? topics.find(topic => topic.id === selectedTopic)?.subtopics || []
    : [];
  
  // Функция для начала сессии с тьютором
  const startTutorSession = () => {
    // Проверяем, что тема выбрана
    if (!selectedTopic) {
      alert('Пожалуйста, выберите тему для обсуждения с тьютором.');
      return;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <MainNavigation />
      
      {/* Основное содержимое */}
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Виртуальный тьютор</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Интерактивное обучение с персональным виртуальным тьютором
            </p>
          </div>
        </header>
        
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-6">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Выберите тему для обсуждения</h2>
                
                {/* Выбор темы */}
                <div className="mb-6">
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Тема
                  </label>
                  <select
                    id="topic"
                    value={selectedTopic || ''}
                    onChange={(e) => {
                      setSelectedTopic(e.target.value || null);
                      setSelectedSubtopic(null);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">Выберите тему</option>
                    {topics.map(topic => (
                      <option key={topic.id} value={topic.id}>{topic.name}</option>
                    ))}
                  </select>
                </div>
                
                {/* Выбор подтемы */}
                {selectedTopic && (
                  <div className="mb-6">
                    <label htmlFor="subtopic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Подтема (опционально)
                    </label>
                    <select
                      id="subtopic"
                      value={selectedSubtopic || ''}
                      onChange={(e) => setSelectedSubtopic(e.target.value || null)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">Выберите подтему</option>
                      {subtopics.map(subtopic => (
                        <option key={subtopic.id} value={subtopic.id}>{subtopic.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                {/* Кнопка для начала сессии */}
                <div className="flex justify-end">
                  <button
                    onClick={startTutorSession}
                    disabled={!selectedTopic}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-beach-leaf hover:bg-beach-leafDark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Начать сессию с тьютором
                  </button>
                </div>
              </div>
            </div>
            
            {/* Виртуальный тьютор */}
            {selectedTopic && (
              <div className="mt-6">
                <VirtualTutor 
                  topic={selectedTopic} 
                  subtopic={selectedSubtopic || undefined} 
                />
              </div>
            )}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
