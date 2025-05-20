import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-between relative overflow-hidden">
      {/* Градиентный фон */}
      <div className="absolute inset-0 bg-gradient-to-b from-beach-water via-beach-leaf to-beach-palm z-0"></div>

      {/* Декоративные элементы */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-beach-water/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-beach-leaf/30 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-beach-coral/20 rounded-full blur-2xl"></div>

      {/* Волнистый узор внизу страницы */}
      <div className="absolute bottom-0 left-0 right-0 h-24 opacity-20">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" className="fill-beach-sand"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" className="fill-beach-water opacity-30"></path>
        </svg>
      </div>

      {/* Основной контент */}
      <div className="z-10 max-w-5xl w-full items-center justify-between px-6 md:px-24 pt-16 pb-24">
        <h1 className="text-5xl font-bold mb-4 text-center text-white drop-shadow-lg">
          Виртуальный ассистент для подготовки к экзаменам
        </h1>

        <p className="text-2xl mb-12 text-center text-white/90 drop-shadow">
          Персонализированное обучение с использованием ИИ-технологий
        </p>

        <div className="backdrop-blur-md bg-white/20 dark:bg-black/20 p-8 rounded-2xl shadow-2xl border border-white/30 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="beach-card p-6 transform transition-transform hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-beach-leaf flex items-center justify-center text-white mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-beach-palm">Адаптивное тестирование</h2>
              </div>
              <p className="text-gray-700 dark:text-gray-800">Оценка уровня знаний и выявление пробелов для эффективного обучения</p>
            </div>

            <div className="beach-card p-6 transform transition-transform hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-beach-water flex items-center justify-center text-gray-800 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-beach-waterDark">Учебные планы</h2>
              </div>
              <p className="text-gray-700 dark:text-gray-800">Индивидуальные планы обучения на основе ваших знаний и целей</p>
            </div>

            <div className="beach-card p-6 transform transition-transform hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-beach-coral flex items-center justify-center text-white mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-beach-coral">Интеллектуальные подсказки</h2>
              </div>
              <p className="text-gray-700 dark:text-gray-800">Персонализированные объяснения сложных концепций и теорий</p>
            </div>

            <div className="beach-card p-6 transform transition-transform hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-beach-palm flex items-center justify-center text-white mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-beach-leafDark">Аналитика обучения</h2>
              </div>
              <p className="text-gray-700 dark:text-gray-800">Отслеживание прогресса и анализ результатов в реальном времени</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/auth/login"
              className="beach-button text-center text-lg font-medium px-8 py-4 shadow-lg transform transition-transform hover:scale-105"
            >
              Войти в систему
            </Link>
            <Link
              href="/auth/register"
              className="water-button text-center text-lg font-medium px-8 py-4 shadow-lg transform transition-transform hover:scale-105"
            >
              Зарегистрироваться
            </Link>
            <Link
              href="/dashboard"
              className="coral-button text-center text-lg font-medium px-8 py-4 shadow-lg transform transition-transform hover:scale-105"
            >
              Войти без регистрации
            </Link>
          </div>
        </div>
      </div>

      <footer className="relative z-10 w-full py-6 bg-beach-palm/80 backdrop-blur-sm text-white text-center">
        <div className="container mx-auto">
          <p className="text-sm">© 2024 Виртуальный ассистент для подготовки к экзаменам</p>
          <p className="text-xs mt-1 text-white/70">Дизайн: Green Beach</p>
        </div>
      </footer>
    </main>
  );
}
