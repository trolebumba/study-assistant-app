'use client';

import { useState, useEffect } from 'react';

interface UserStatsProps {
  // Дополнительные пропсы, если потребуются
}

// Типы для статистики
interface Stats {
  testsCompleted: number;
  averageScore: number;
  studyHours: number;
  streak: number;
  progress: {
    math: number;
    physics: number;
    literature: number;
    history: number;
  };
}

export default function UserStats({}: UserStatsProps) {
  // Моковые данные статистики
  const [stats, setStats] = useState<Stats>({
    testsCompleted: 0,
    averageScore: 0,
    studyHours: 0,
    streak: 0,
    progress: {
      math: 0,
      physics: 0,
      literature: 0,
      history: 0,
    },
  });
  
  // Имитация загрузки данных
  useEffect(() => {
    // В реальном приложении здесь будет запрос к API
    const timer = setTimeout(() => {
      setStats({
        testsCompleted: 42,
        averageScore: 78,
        studyHours: 64,
        streak: 7,
        progress: {
          math: 65,
          physics: 48,
          literature: 82,
          history: 71,
        },
      });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-5">Ваша статистика</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">{stats.testsCompleted}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Тестов пройдено</div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-300">{stats.averageScore}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Средний балл</div>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-300">{stats.studyHours}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Часов обучения</div>
          </div>
          
          <div className="bg-orange-50 dark:bg-orange-900 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-300">{stats.streak}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Дней подряд</div>
          </div>
        </div>
        
        <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Прогресс по предметам</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Математика</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{stats.progress.math}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${stats.progress.math}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Физика</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{stats.progress.physics}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-green-600 h-2.5 rounded-full" 
                style={{ width: `${stats.progress.physics}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Литература</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{stats.progress.literature}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-purple-600 h-2.5 rounded-full" 
                style={{ width: `${stats.progress.literature}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">История</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{stats.progress.history}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-orange-600 h-2.5 rounded-full" 
                style={{ width: `${stats.progress.history}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
