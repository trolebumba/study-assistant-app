'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MainNavigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { 
  LearningMaterial, 
  LearningProfile, 
  LearningStyle, 
  MaterialType, 
  DifficultyLevel,
  generateLearningPlan 
} from '@/utils/material-generator';
import { ErrorType } from '@/utils/error-analysis';

// Компонент для отображения карточки материала
const MaterialCard = ({ 
  material,
  onSelect
}: { 
  material: LearningMaterial;
  onSelect: (material: LearningMaterial) => void;
}) => {
  // Определяем цвет карточки в зависимости от типа материала
  const getCardColor = () => {
    switch (material.type) {
      case MaterialType.THEORY:
        return 'bg-beach-water/20 border-beach-water';
      case MaterialType.PRACTICE:
        return 'bg-beach-leaf/20 border-beach-leaf';
      case MaterialType.EXAMPLE:
        return 'bg-beach-sand/20 border-beach-sand';
      case MaterialType.QUIZ:
        return 'bg-beach-coral/20 border-beach-coral';
      case MaterialType.VISUALIZATION:
        return 'bg-purple-100 border-purple-300 dark:bg-purple-900/20 dark:border-purple-800';
      case MaterialType.INTERACTIVE:
        return 'bg-amber-100 border-amber-300 dark:bg-amber-900/20 dark:border-amber-800';
      default:
        return 'bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-700';
    }
  };

  // Определяем иконку в зависимости от типа материала
  const getIcon = () => {
    switch (material.type) {
      case MaterialType.THEORY:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-beach-waterDark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case MaterialType.PRACTICE:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-beach-leaf" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        );
      case MaterialType.EXAMPLE:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-beach-sandDark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case MaterialType.QUIZ:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-beach-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case MaterialType.VISUALIZATION:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        );
      case MaterialType.INTERACTIVE:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  // Определяем текст для уровня сложности
  const getDifficultyText = () => {
    switch (material.difficulty) {
      case DifficultyLevel.BEGINNER:
        return 'Начальный';
      case DifficultyLevel.ELEMENTARY:
        return 'Элементарный';
      case DifficultyLevel.INTERMEDIATE:
        return 'Средний';
      case DifficultyLevel.ADVANCED:
        return 'Продвинутый';
      case DifficultyLevel.EXPERT:
        return 'Экспертный';
      default:
        return 'Неизвестный';
    }
  };

  return (
    <div 
      className={`p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer ${getCardColor()}`}
      onClick={() => onSelect(material)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center">
          {getIcon()}
          <h3 className="ml-2 text-lg font-semibold">{material.title}</h3>
        </div>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/50 dark:bg-gray-800/50">
          {getDifficultyText()}
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{material.description}</p>
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span>Примерное время: {material.estimatedTime} мин.</span>
      </div>
    </div>
  );
};

// Компонент для отображения детальной информации о материале
const MaterialDetail = ({ 
  material,
  onBack
}: { 
  material: LearningMaterial;
  onBack: () => void;
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold">{material.title}</h2>
        <button 
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 bg-beach-water/20 text-beach-waterDark dark:text-beach-water rounded-full text-xs font-medium">
          {material.topic === 'calculus' ? 'Математический анализ' :
           material.topic === 'algebra' ? 'Алгебра' :
           material.topic === 'set_theory' ? 'Теория множеств' :
           material.topic === 'analysis' ? 'Анализ' : 
           material.topic}
        </span>
        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">
          {material.type === MaterialType.THEORY ? 'Теория' :
           material.type === MaterialType.PRACTICE ? 'Практика' :
           material.type === MaterialType.EXAMPLE ? 'Примеры' :
           material.type === MaterialType.QUIZ ? 'Тест' :
           material.type === MaterialType.VISUALIZATION ? 'Визуализация' :
           'Интерактивный материал'}
        </span>
        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">
          {material.difficulty === DifficultyLevel.BEGINNER ? 'Начальный уровень' :
           material.difficulty === DifficultyLevel.ELEMENTARY ? 'Элементарный уровень' :
           material.difficulty === DifficultyLevel.INTERMEDIATE ? 'Средний уровень' :
           material.difficulty === DifficultyLevel.ADVANCED ? 'Продвинутый уровень' :
           'Экспертный уровень'}
        </span>
        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">
          Время: {material.estimatedTime} мин.
        </span>
      </div>
      
      <div className="prose dark:prose-invert max-w-none">
        <div className="whitespace-pre-line">{material.content}</div>
      </div>
    </div>
  );
};

export default function MaterialsPage() {
  // Моковый профиль пользователя для демонстрации
  const [userProfile] = useState<LearningProfile>({
    userId: 'user123',
    preferredStyle: LearningStyle.VISUAL,
    topicProficiency: {
      'calculus': 0.7,
      'algebra': 0.5,
      'set_theory': 0.3,
      'analysis': 0.6,
    },
    commonErrors: {
      'calculus': [ErrorType.APPLICATION],
      'algebra': [ErrorType.CALCULATION, ErrorType.MEMORY],
      'set_theory': [ErrorType.CONCEPTUAL],
      'analysis': [ErrorType.LOGICAL],
    },
    learningGoals: ['Подготовка к экзамену по математике', 'Улучшение навыков решения задач'],
    completedMaterials: [],
    averageStudyTime: 30,
  });

  // Состояния для материалов и выбранного материала
  const [materials, setMaterials] = useState<Record<string, LearningMaterial[]>>({});
  const [selectedMaterial, setSelectedMaterial] = useState<LearningMaterial | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Генерация материалов при загрузке страницы
  useEffect(() => {
    const topics = Object.keys(userProfile.topicProficiency);
    const generatedMaterials = generateLearningPlan(topics, userProfile);
    setMaterials(generatedMaterials);
  }, [userProfile]);

  // Обработчик выбора материала
  const handleSelectMaterial = (material: LearningMaterial) => {
    setSelectedMaterial(material);
  };

  // Обработчик возврата к списку материалов
  const handleBackToList = () => {
    setSelectedMaterial(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <MainNavigation />

      {/* Основное содержимое */}
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Индивидуальные учебные материалы</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Материалы, подобранные специально для вас на основе вашего прогресса и стиля обучения
            </p>
          </div>
        </header>

        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-6">
            {!selectedMaterial ? (
              <>
                {/* Фильтр по темам */}
                <div className="mb-6 px-4 sm:px-0">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedTopic(null)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedTopic === null
                          ? 'bg-beach-leaf text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      Все темы
                    </button>
                    {Object.keys(materials).map(topic => (
                      <button
                        key={topic}
                        onClick={() => setSelectedTopic(topic)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          selectedTopic === topic
                            ? 'bg-beach-leaf text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {topic === 'calculus' ? 'Математический анализ' :
                         topic === 'algebra' ? 'Алгебра' :
                         topic === 'set_theory' ? 'Теория множеств' :
                         topic === 'analysis' ? 'Анализ' : 
                         topic}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Список материалов */}
                <div className="px-4 sm:px-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(materials)
                      .filter(([topic]) => selectedTopic === null || topic === selectedTopic)
                      .flatMap(([_, topicMaterials]) => topicMaterials)
                      .map(material => (
                        <MaterialCard
                          key={material.id}
                          material={material}
                          onSelect={handleSelectMaterial}
                        />
                      ))}
                  </div>
                </div>
              </>
            ) : (
              /* Детальная информация о материале */
              <div className="px-4 sm:px-0">
                <MaterialDetail
                  material={selectedMaterial}
                  onBack={handleBackToList}
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
