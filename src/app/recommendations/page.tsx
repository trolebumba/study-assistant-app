'use client';

import MainNavigation from '@/components/MainNavigation';
import Footer from '@/components/Footer';
import RecommendationList from '@/components/ai/RecommendationList';

export default function RecommendationsPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <MainNavigation />
      
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Рекомендации</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Персонализированные рекомендации на основе вашего прогресса и интересов
            </p>
          </div>
        </header>
        
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
                <h2 className="text-xl font-semibold mb-4">Как это работает</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Наша система искусственного интеллекта анализирует ваш прогресс, результаты тестов, 
                  время, затраченное на различные темы, и ваши интересы, чтобы предложить наиболее 
                  подходящие для вас материалы и активности.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="text-blue-500 mb-2">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <h3 className="font-medium mb-1">Анализ прогресса</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Мы отслеживаем ваш прогресс по различным предметам и темам
                    </p>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="text-green-500 mb-2">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <h3 className="font-medium mb-1">Выявление сильных сторон</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Определяем ваши сильные стороны и предлагаем развивать их дальше
                    </p>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="text-purple-500 mb-2">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-medium mb-1">Обнаружение пробелов</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Находим пробелы в знаниях и предлагаем материалы для их устранения
                    </p>
                  </div>
                </div>
              </div>
              
              <RecommendationList />
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
