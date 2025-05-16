'use client';

import { useState } from 'react';
import Link from 'next/link';
import MainNavigation from '@/components/MainNavigation';
import Footer from '@/components/Footer';

// Типы для учебного плана
type LessonStatus = 'completed' | 'in-progress' | 'locked' | 'available';

type Lesson = {
  id: string;
  title: string;
  description: string;
  duration: number; // в минутах
  status: LessonStatus;
  type: 'theory' | 'practice' | 'test';
};

type Module = {
  id: string;
  title: string;
  description: string;
  progress: number;
  lessons: Lesson[];
};

// Компонент для отображения урока
const LessonCard = ({ lesson, onClick }: { lesson: Lesson; onClick: () => void }) => {
  const statusClasses = {
    'completed': 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-800',
    'in-progress': 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-800',
    'available': 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700',
    'locked': 'bg-gray-100 dark:bg-gray-900/50 border-gray-300 dark:border-gray-800 opacity-70'
  };

  const statusIcons = {
    'completed': '✓',
    'in-progress': '▶',
    'available': '',
    'locked': '🔒'
  };

  const typeIcons = {
    'theory': '📚',
    'practice': '✏️',
    'test': '📝'
  };

  return (
    <div
      onClick={lesson.status !== 'locked' ? onClick : undefined}
      className={`p-4 border rounded-lg mb-3 ${statusClasses[lesson.status]} ${lesson.status !== 'locked' ? 'cursor-pointer' : 'cursor-not-allowed'}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center">
            <span className="mr-2">{typeIcons[lesson.type]}</span>
            <h4 className="text-lg font-medium">{lesson.title}</h4>
            {lesson.status === 'completed' && <span className="ml-2 text-green-600 dark:text-green-400">{statusIcons[lesson.status]}</span>}
            {lesson.status === 'in-progress' && <span className="ml-2 text-blue-600 dark:text-blue-400">{statusIcons[lesson.status]}</span>}
            {lesson.status === 'locked' && <span className="ml-2 text-gray-500">{statusIcons[lesson.status]}</span>}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{lesson.description}</p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap ml-4">
          {lesson.duration} мин
        </div>
      </div>
    </div>
  );
};

// Компонент для отображения модуля
const ModuleCard = ({ module, expanded, onToggle, onLessonClick }: {
  module: Module;
  expanded: boolean;
  onToggle: () => void;
  onLessonClick: (lessonId: string) => void;
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={onToggle}
      >
        <div>
          <h3 className="text-xl font-semibold">{module.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{module.description}</p>
        </div>
        <div className="flex items-center">
          <div className="mr-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {module.progress}%
            </span>
          </div>
          <button className="p-1">
            {expanded ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Прогресс-бар */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-4">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${module.progress}%` }}
        ></div>
      </div>

      {/* Уроки */}
      {expanded && (
        <div className="mt-6 space-y-2">
          {module.lessons.map(lesson => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onClick={() => onLessonClick(lesson.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function StudyPlanPage() {
  // Состояния для модулей
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    'module1': true,
    'module2': false,
    'module3': false,
  });

  // Моковые данные для модулей и уроков
  const modules: Module[] = [
    {
      id: 'module1',
      title: 'Основы алгебры',
      description: 'Базовые концепции и операции',
      progress: 75,
      lessons: [
        {
          id: 'lesson1',
          title: 'Числовые множества',
          description: 'Натуральные, целые, рациональные и иррациональные числа',
          duration: 30,
          status: 'completed',
          type: 'theory'
        },
        {
          id: 'lesson2',
          title: 'Алгебраические выражения',
          description: 'Операции с алгебраическими выражениями',
          duration: 45,
          status: 'completed',
          type: 'theory'
        },
        {
          id: 'lesson3',
          title: 'Решение линейных уравнений',
          description: 'Методы решения линейных уравнений с одной переменной',
          duration: 60,
          status: 'in-progress',
          type: 'practice'
        },
        {
          id: 'lesson4',
          title: 'Проверочный тест',
          description: 'Тест по основам алгебры',
          duration: 20,
          status: 'available',
          type: 'test'
        }
      ]
    },
    {
      id: 'module2',
      title: 'Квадратные уравнения',
      description: 'Решение квадратных уравнений и их применение',
      progress: 30,
      lessons: [
        {
          id: 'lesson5',
          title: 'Формула квадратного уравнения',
          description: 'Вывод и применение формулы',
          duration: 40,
          status: 'completed',
          type: 'theory'
        },
        {
          id: 'lesson6',
          title: 'Теорема Виета',
          description: 'Связь между корнями и коэффициентами',
          duration: 35,
          status: 'available',
          type: 'theory'
        },
        {
          id: 'lesson7',
          title: 'Практика решения уравнений',
          description: 'Решение различных типов квадратных уравнений',
          duration: 50,
          status: 'locked',
          type: 'practice'
        },
        {
          id: 'lesson8',
          title: 'Проверочный тест',
          description: 'Тест по квадратным уравнениям',
          duration: 25,
          status: 'locked',
          type: 'test'
        }
      ]
    },
    {
      id: 'module3',
      title: 'Функции и графики',
      description: 'Изучение функций и их графическое представление',
      progress: 0,
      lessons: [
        {
          id: 'lesson9',
          title: 'Понятие функции',
          description: 'Определение, область определения и значений',
          duration: 30,
          status: 'locked',
          type: 'theory'
        },
        {
          id: 'lesson10',
          title: 'Линейная функция',
          description: 'Свойства и график линейной функции',
          duration: 40,
          status: 'locked',
          type: 'theory'
        },
        {
          id: 'lesson11',
          title: 'Квадратичная функция',
          description: 'Свойства и график квадратичной функции',
          duration: 45,
          status: 'locked',
          type: 'theory'
        },
        {
          id: 'lesson12',
          title: 'Построение графиков',
          description: 'Практика построения графиков функций',
          duration: 60,
          status: 'locked',
          type: 'practice'
        }
      ]
    }
  ];

  // Обработчик переключения модуля
  const toggleModule = (moduleId: string) => {
    setExpandedModules({
      ...expandedModules,
      [moduleId]: !expandedModules[moduleId]
    });
  };

  // Обработчик клика по уроку
  const handleLessonClick = (lessonId: string) => {
    console.log(`Открыт урок с ID: ${lessonId}`);
    // Здесь будет логика перехода к уроку
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <MainNavigation />

      {/* Основное содержимое */}
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Индивидуальный учебный план</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Ваш персонализированный план обучения, адаптированный под ваши потребности
            </p>
          </div>
        </header>

        <main>
          <div className="max-w-3xl mx-auto sm:px-6 lg:px-8 py-6">
            {/* Общий прогресс */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-semibold mb-4">Общий прогресс</h2>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mr-4">
                  <div
                    className="bg-blue-600 h-4 rounded-full"
                    style={{ width: '35%' }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  35%
                </span>
              </div>
              <div className="mt-4 flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Завершено модулей: 0/3</span>
                <span>Завершено уроков: 3/12</span>
              </div>
            </div>

            {/* Модули */}
            <div className="space-y-6">
              {modules.map(module => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  expanded={expandedModules[module.id] || false}
                  onToggle={() => toggleModule(module.id)}
                  onLessonClick={handleLessonClick}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
