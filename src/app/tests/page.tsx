'use client';

import { useState } from 'react';
import Link from 'next/link';
import MainNavigation from '@/components/MainNavigation';
import Footer from '@/components/Footer';

// Типы для вопросов и ответов
type Answer = {
  id: string;
  text: string;
  isCorrect: boolean;
};

type Question = {
  id: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  answers: Answer[];
  explanation: string;
};

// Компонент для отображения вопроса
const QuestionCard = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  showExplanation,
}: {
  question: Question;
  selectedAnswer: string | null;
  onSelectAnswer: (answerId: string) => void;
  showExplanation: boolean;
}) => {
  const isAnswered = selectedAnswer !== null;
  const correctAnswer = question.answers.find(a => a.isCorrect);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold">{question.text}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
          question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {question.difficulty === 'easy' ? 'Легкий' :
           question.difficulty === 'medium' ? 'Средний' : 'Сложный'}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        {question.answers.map((answer) => (
          <div
            key={answer.id}
            onClick={() => !isAnswered && onSelectAnswer(answer.id)}
            className={`p-3 border rounded-md cursor-pointer transition-colors ${
              !isAnswered ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : 'cursor-default'
            } ${
              isAnswered && answer.id === selectedAnswer && answer.isCorrect ? 'bg-green-100 border-green-500 dark:bg-green-900 dark:border-green-600' :
              isAnswered && answer.id === selectedAnswer && !answer.isCorrect ? 'bg-red-100 border-red-500 dark:bg-red-900 dark:border-red-600' :
              isAnswered && answer.isCorrect ? 'bg-green-50 border-green-300 dark:bg-green-900/30 dark:border-green-800' :
              'border-gray-300 dark:border-gray-600'
            }`}
          >
            {answer.text}
          </div>
        ))}
      </div>

      {showExplanation && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md">
          <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Объяснение:</h4>
          <p className="text-gray-700 dark:text-gray-300">{question.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default function TestsPage() {
  // Состояния для теста
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);

  // Моковые данные для вопросов
  const questions: Question[] = [
    {
      id: '1',
      text: 'Какое из следующих утверждений о функции f(x) = x² верно?',
      difficulty: 'easy',
      answers: [
        { id: 'a', text: 'Функция убывает на всей области определения', isCorrect: false },
        { id: 'b', text: 'Функция возрастает на всей области определения', isCorrect: false },
        { id: 'c', text: 'Функция убывает при x < 0 и возрастает при x > 0', isCorrect: true },
        { id: 'd', text: 'Функция возрастает при x < 0 и убывает при x > 0', isCorrect: false },
      ],
      explanation: 'Функция f(x) = x² имеет производную f\'(x) = 2x, которая отрицательна при x < 0 и положительна при x > 0. Поэтому функция убывает при x < 0 и возрастает при x > 0.'
    },
    {
      id: '2',
      text: 'Решите уравнение: 2x² - 5x + 3 = 0',
      difficulty: 'medium',
      answers: [
        { id: 'a', text: 'x = 1 и x = 3', isCorrect: false },
        { id: 'b', text: 'x = 1 и x = 1.5', isCorrect: true },
        { id: 'c', text: 'x = 0.5 и x = 3', isCorrect: false },
        { id: 'd', text: 'x = 2 и x = 0.75', isCorrect: false },
      ],
      explanation: 'Используя формулу для квадратного уравнения: x = (-b ± √(b² - 4ac)) / 2a, где a = 2, b = -5, c = 3. Получаем: x = (5 ± √(25 - 24)) / 4 = (5 ± 1) / 4 = 1.5 или 1.'
    },
    {
      id: '3',
      text: 'Найдите производную функции f(x) = e^(2x) · sin(x)',
      difficulty: 'hard',
      answers: [
        { id: 'a', text: 'e^(2x) · (2sin(x) + cos(x))', isCorrect: true },
        { id: 'b', text: 'e^(2x) · (sin(x) + cos(x))', isCorrect: false },
        { id: 'c', text: '2e^(2x) · sin(x) + e^(2x) · cos(x)', isCorrect: false },
        { id: 'd', text: 'e^(2x) · (sin(x) - cos(x))', isCorrect: false },
      ],
      explanation: 'Используя правило произведения: (f·g)\' = f\'·g + f·g\'. Имеем f(x) = e^(2x) и g(x) = sin(x). Тогда f\'(x) = 2e^(2x) и g\'(x) = cos(x). Подставляя, получаем: (e^(2x) · sin(x))\' = 2e^(2x) · sin(x) + e^(2x) · cos(x) = e^(2x) · (2sin(x) + cos(x)).'
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];

  // Обработчик выбора ответа
  const handleSelectAnswer = (answerId: string) => {
    if (selectedAnswers[currentQuestion.id]) return;

    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: answerId
    });
  };

  // Переход к следующему вопросу
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  // Подсчет результатов
  const calculateResults = () => {
    let correctCount = 0;

    questions.forEach(question => {
      const selectedAnswerId = selectedAnswers[question.id];
      if (selectedAnswerId) {
        const selectedAnswer = question.answers.find(a => a.id === selectedAnswerId);
        if (selectedAnswer && selectedAnswer.isCorrect) {
          correctCount++;
        }
      }
    });

    return {
      total: questions.length,
      correct: correctCount,
      percentage: Math.round((correctCount / questions.length) * 100)
    };
  };

  // Результаты теста
  const results = calculateResults();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <MainNavigation />

      {/* Основное содержимое */}
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Адаптивное тестирование</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Проверьте свои знания и получите персонализированные рекомендации
            </p>
          </div>
        </header>

        <main>
          <div className="max-w-3xl mx-auto sm:px-6 lg:px-8 py-6">
            {!showResults ? (
              <>
                {/* Прогресс */}
                <div className="mb-6 px-4 sm:px-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Вопрос {currentQuestionIndex + 1} из {questions.length}
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Текущий вопрос */}
                <div className="px-4 sm:px-0">
                  <QuestionCard
                    question={currentQuestion}
                    selectedAnswer={selectedAnswers[currentQuestion.id] || null}
                    onSelectAnswer={handleSelectAnswer}
                    showExplanation={!!selectedAnswers[currentQuestion.id]}
                  />

                  <div className="flex justify-between">
                    <button
                      onClick={() => currentQuestionIndex > 0 && setCurrentQuestionIndex(currentQuestionIndex - 1)}
                      disabled={currentQuestionIndex === 0}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Назад
                    </button>

                    <button
                      onClick={handleNextQuestion}
                      disabled={!selectedAnswers[currentQuestion.id]}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {currentQuestionIndex < questions.length - 1 ? 'Следующий вопрос' : 'Завершить тест'}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Результаты теста */
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Результаты теста</h2>

                <div className="flex justify-center mb-6">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="3"
                        strokeDasharray="100, 100"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={results.percentage >= 70 ? '#10B981' : results.percentage >= 40 ? '#F59E0B' : '#EF4444'}
                        strokeWidth="3"
                        strokeDasharray={`${results.percentage}, 100`}
                      />
                      <text x="18" y="20.5" textAnchor="middle" fontSize="8" fill="currentColor" className="font-bold">
                        {results.percentage}%
                      </text>
                    </svg>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <p className="text-lg">
                    Вы ответили правильно на <span className="font-bold">{results.correct}</span> из <span className="font-bold">{results.total}</span> вопросов
                  </p>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {results.percentage >= 70 ? 'Отличный результат! Вы хорошо знаете материал.' :
                     results.percentage >= 40 ? 'Неплохой результат, но есть над чем поработать.' :
                     'Вам стоит уделить больше внимания изучению материала.'}
                  </p>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      setCurrentQuestionIndex(0);
                      setSelectedAnswers({});
                      setShowResults(false);
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Пройти тест заново
                  </button>

                  <Link
                    href="/dashboard"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Вернуться на дашборд
                  </Link>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
