'use client';

import React from 'react';
import MainNavigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PredictiveAnalytics from '@/components/PredictiveAnalytics';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <MainNavigation />
      
      {/* Основное содержимое */}
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Аналитика обучения</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Прогнозирование результатов и анализ вашего прогресса
            </p>
          </div>
        </header>
        
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Предиктивная аналитика */}
              <PredictiveAnalytics />
              
              {/* Дополнительные блоки аналитики можно добавить здесь */}
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
