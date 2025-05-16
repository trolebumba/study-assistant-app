import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Виртуальный ассистент для подготовки к экзаменам
        </h1>

        <div className="bg-white/30 dark:bg-black/30 p-6 md:p-8 rounded-lg shadow-lg backdrop-blur-sm">
          <p className="text-xl mb-6 text-center">
            Персонализированное обучение с использованием ИИ-технологий
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h2 className="text-2xl font-semibold mb-2">Адаптивное тестирование</h2>
              <p>Оценка уровня знаний и выявление пробелов</p>
            </div>

            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h2 className="text-2xl font-semibold mb-2">Учебные планы</h2>
              <p>Индивидуальные планы обучения на основе ваших знаний</p>
            </div>

            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h2 className="text-2xl font-semibold mb-2">Интеллектуальные подсказки</h2>
              <p>Персонализированные объяснения сложных концепций</p>
            </div>

            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h2 className="text-2xl font-semibold mb-2">Аналитика обучения</h2>
              <p>Отслеживание прогресса и анализ результатов</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/login"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center"
            >
              Войти
            </Link>
            <Link
              href="/auth/register"
              className="px-6 py-3 bg-gray-200 dark:bg-gray-800 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors text-center"
            >
              Зарегистрироваться
            </Link>
          </div>
        </div>
      </div>

      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>© 2024 Виртуальный ассистент для подготовки к экзаменам</p>
      </footer>
    </main>
  );
}
