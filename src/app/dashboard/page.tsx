'use client';

import Link from 'next/link';
import { useState } from 'react';
import MainNavigation from '@/components/MainNavigation';
import Footer from '@/components/Footer';
import UserStats from '@/components/UserStats';

// Компонент для отображения карточки курса
const CourseCard = ({ title, progress, description }: { title: string; progress: number; description: string }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
      <div
        className="bg-blue-600 h-2.5 rounded-full"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-500 dark:text-gray-400">{progress}% завершено</span>
      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
        Продолжить
      </button>
    </div>
  </div>
);

// Компонент для отображения статистики
const StatCard = ({ title, value, icon }: { title: string; value: string; icon: string }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
      <div className="text-3xl text-blue-600">{icon}</div>
    </div>
  </div>
);

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('courses');

  // Моковые данные для курсов
  const courses = [
    {
      title: 'Математика: Алгебра',
      progress: 65,
      description: 'Подготовка к ЕГЭ по алгебре'
    },
    {
      title: 'Русский язык',
      progress: 42,
      description: 'Грамматика и синтаксис'
    },
    {
      title: 'Английский язык',
      progress: 78,
      description: 'Подготовка к международному экзамену'
    },
    {
      title: 'История',
      progress: 23,
      description: 'История России XX века'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <MainNavigation />

      {/* Основное содержимое */}
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Дашборд</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* Статистика */}
            <div className="px-4 py-6 sm:px-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="col-span-1">
                  <UserStats />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Завершенные курсы" value="3" icon="📚" />
                    <StatCard title="Часы обучения" value="42" icon="⏱️" />
                    <StatCard title="Средний балл" value="87%" icon="📈" />
                    <StatCard title="Достижения" value="12" icon="🏆" />
                  </div>
                </div>
              </div>

              {/* Вкладки */}
              <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('courses')}
                    className={`${
                      activeTab === 'courses'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Мои курсы
                  </button>
                  <button
                    onClick={() => setActiveTab('recommended')}
                    className={`${
                      activeTab === 'recommended'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Рекомендуемые курсы
                  </button>
                  <button
                    onClick={() => setActiveTab('recent')}
                    className={`${
                      activeTab === 'recent'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Недавняя активность
                  </button>
                </nav>
              </div>

              {/* Содержимое вкладок */}
              {activeTab === 'courses' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course, index) => (
                    <CourseCard
                      key={index}
                      title={course.title}
                      progress={course.progress}
                      description={course.description}
                    />
                  ))}
                </div>
              )}

              {activeTab === 'recommended' && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <p className="text-gray-500 dark:text-gray-400">
                    На основе вашей активности мы рекомендуем следующие курсы...
                  </p>
                  {/* Здесь будет содержимое для рекомендуемых курсов */}
                </div>
              )}

              {activeTab === 'recent' && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <p className="text-gray-500 dark:text-gray-400">
                    Ваша недавняя активность...
                  </p>
                  {/* Здесь будет содержимое для недавней активности */}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
