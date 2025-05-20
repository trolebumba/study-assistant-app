'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MainNavigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import {
  Question,
  UserAnswer,
  UserProfile,
  createInitialUserProfile,
  updateUserProfile,
  selectNextQuestion,
  analyzeTestResults
} from '@/utils/adaptive-testing';
import { generatePersonalizedFeedback } from '@/utils/error-analysis';

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
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>(createInitialUserProfile());
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [userAnswers, setUserAnswers] = useState<Record<string, UserAnswer>>({});
  const [showResults, setShowResults] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [testStartTime, setTestStartTime] = useState<number | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);

  // Моковые данные для вопросов
  const questions: Question[] = [
    {
      id: '1',
      text: 'Какое из следующих утверждений о функции f(x) = x² верно?',
      difficulty: 'easy',
      topic: 'calculus',
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
      topic: 'algebra',
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
      topic: 'calculus',
      answers: [
        { id: 'a', text: 'e^(2x) · (2sin(x) + cos(x))', isCorrect: true },
        { id: 'b', text: 'e^(2x) · (sin(x) + cos(x))', isCorrect: false },
        { id: 'c', text: '2e^(2x) · sin(x) + e^(2x) · cos(x)', isCorrect: false },
        { id: 'd', text: 'e^(2x) · (sin(x) - cos(x))', isCorrect: false },
      ],
      explanation: 'Используя правило произведения: (f·g)\' = f\'·g + f·g\'. Имеем f(x) = e^(2x) и g(x) = sin(x). Тогда f\'(x) = 2e^(2x) и g\'(x) = cos(x). Подставляя, получаем: (e^(2x) · sin(x))\' = 2e^(2x) · sin(x) + e^(2x) · cos(x) = e^(2x) · (2sin(x) + cos(x)).'
    },
    {
      id: '4',
      text: 'Какое из следующих множеств является подмножеством множества действительных чисел?',
      difficulty: 'easy',
      topic: 'set_theory',
      answers: [
        { id: 'a', text: 'Множество комплексных чисел', isCorrect: false },
        { id: 'b', text: 'Множество рациональных чисел', isCorrect: true },
        { id: 'c', text: 'Множество матриц 2×2', isCorrect: false },
        { id: 'd', text: 'Множество функций от R в R', isCorrect: false },
      ],
      explanation: 'Множество рациональных чисел (числа, которые можно представить в виде дроби p/q, где p и q - целые числа, q ≠ 0) является подмножеством множества действительных чисел.'
    },
    {
      id: '5',
      text: 'Вычислите интеграл ∫sin²(x)dx',
      difficulty: 'medium',
      topic: 'calculus',
      answers: [
        { id: 'a', text: 'x/2 - sin(2x)/4 + C', isCorrect: true },
        { id: 'b', text: 'x/2 + sin(2x)/4 + C', isCorrect: false },
        { id: 'c', text: '-cos(x) + C', isCorrect: false },
        { id: 'd', text: 'sin(x) + C', isCorrect: false },
      ],
      explanation: 'Используя тригонометрическую формулу sin²(x) = (1 - cos(2x))/2, получаем: ∫sin²(x)dx = ∫(1 - cos(2x))/2 dx = x/2 - sin(2x)/4 + C.'
    },
    {
      id: '6',
      text: 'Решите систему уравнений: { x + y = 5, 2x - y = 4 }',
      difficulty: 'medium',
      topic: 'algebra',
      answers: [
        { id: 'a', text: 'x = 3, y = 2', isCorrect: true },
        { id: 'b', text: 'x = 2, y = 3', isCorrect: false },
        { id: 'c', text: 'x = 4, y = 1', isCorrect: false },
        { id: 'd', text: 'x = 1, y = 4', isCorrect: false },
      ],
      explanation: 'Из второго уравнения: y = 2x - 4. Подставляя в первое уравнение: x + (2x - 4) = 5, получаем 3x = 9, откуда x = 3. Тогда y = 2(3) - 4 = 2.'
    },
    {
      id: '7',
      text: 'Какое из следующих утверждений о непрерывных функциях верно?',
      difficulty: 'hard',
      topic: 'analysis',
      answers: [
        { id: 'a', text: 'Любая непрерывная функция на отрезке [a,b] достигает своего максимума и минимума', isCorrect: true },
        { id: 'b', text: 'Любая непрерывная функция является дифференцируемой', isCorrect: false },
        { id: 'c', text: 'Сумма двух разрывных функций всегда разрывна', isCorrect: false },
        { id: 'd', text: 'Произведение непрерывной и разрывной функции всегда непрерывно', isCorrect: false },
      ],
      explanation: 'По теореме Вейерштрасса, любая непрерывная функция на замкнутом ограниченном промежутке [a,b] достигает своего наибольшего и наименьшего значения.'
    },
  ];

  // Инициализация теста при первой загрузке
  useEffect(() => {
    if (!testStartTime) {
      setTestStartTime(Date.now());

      // Выбираем первый вопрос с помощью адаптивного алгоритма
      const nextQuestion = selectNextQuestion(questions, userProfile);
      if (nextQuestion) {
        setCurrentQuestion(nextQuestion);
        setQuestionStartTime(Date.now());
      }
    }
  }, []);

  // Обработчик выбора ответа
  const handleSelectAnswer = (answerId: string) => {
    if (!currentQuestion || selectedAnswers[currentQuestion.id]) return;

    // Записываем выбранный ответ
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: answerId
    });

    // Определяем, правильный ли ответ
    const selectedAnswer = currentQuestion.answers.find(a => a.id === answerId);
    const isCorrect = selectedAnswer?.isCorrect || false;

    // Вычисляем время, затраченное на ответ
    const timeSpent = questionStartTime ? Math.round((Date.now() - questionStartTime) / 1000) : 0;

    // Создаем объект с информацией об ответе
    const userAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      answerId,
      isCorrect,
      timeSpent
    };

    // Обновляем список ответов пользователя
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: userAnswer
    });

    // Обновляем профиль пользователя на основе ответа
    const updatedProfile = updateUserProfile(userProfile, currentQuestion, userAnswer);
    setUserProfile(updatedProfile);
  };

  // Переход к следующему вопросу
  const handleNextQuestion = () => {
    if (!currentQuestion) return;

    // Проверяем, достигнут ли лимит вопросов (максимум 10 вопросов)
    if (Object.keys(userAnswers).length >= 10 || Object.keys(userAnswers).length >= questions.length) {
      setShowResults(true);
      setTestCompleted(true);
      return;
    }

    // Выбираем следующий вопрос с помощью адаптивного алгоритма
    const nextQuestion = selectNextQuestion(questions, userProfile);

    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
      setQuestionStartTime(Date.now());
    } else {
      // Если подходящих вопросов больше нет, показываем результаты
      setShowResults(true);
      setTestCompleted(true);
    }
  };

  // Анализ результатов теста
  const testResults = userAnswers && Object.keys(userAnswers).length > 0
    ? analyzeTestResults(
        questions.filter(q => Object.keys(userAnswers).includes(q.id)),
        userAnswers
      )
    : null;

  // Генерация персонализированной обратной связи
  const personalizedFeedback = userAnswers && Object.keys(userAnswers).length > 0
    ? generatePersonalizedFeedback(
        questions.filter(q => Object.keys(userAnswers).includes(q.id)),
        userAnswers
      )
    : null;

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
            {!showResults && currentQuestion ? (
              <>
                {/* Прогресс */}
                <div className="mb-6 px-4 sm:px-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Вопрос {Object.keys(userAnswers).length + 1} из {Math.min(10, questions.length)}
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {Math.round(((Object.keys(userAnswers).length + 1) / Math.min(10, questions.length)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-beach-leaf h-2.5 rounded-full"
                      style={{ width: `${((Object.keys(userAnswers).length + 1) / Math.min(10, questions.length)) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Информация о сложности */}
                <div className="mb-4 px-4 sm:px-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
                        Сложность:
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {currentQuestion.difficulty === 'easy' ? 'Легкий' :
                         currentQuestion.difficulty === 'medium' ? 'Средний' : 'Сложный'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
                        Тема:
                      </span>
                      <span className="px-3 py-1 bg-beach-water/30 text-beach-waterDark dark:text-beach-water rounded-full text-xs font-medium">
                        {currentQuestion.topic === 'calculus' ? 'Математический анализ' :
                         currentQuestion.topic === 'algebra' ? 'Алгебра' :
                         currentQuestion.topic === 'set_theory' ? 'Теория множеств' :
                         currentQuestion.topic === 'analysis' ? 'Анализ' :
                         currentQuestion.topic}
                      </span>
                    </div>
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

                  <div className="flex justify-end">
                    <button
                      onClick={handleNextQuestion}
                      disabled={!selectedAnswers[currentQuestion.id]}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-beach-leaf hover:bg-beach-leafDark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Следующий вопрос
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Результаты теста */
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Результаты адаптивного теста</h2>

                {testResults && (
                  <>
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
                            stroke={testResults.overallResult.percentage >= 70 ? '#3cb371' : testResults.overallResult.percentage >= 40 ? '#a2d5f2' : '#ff7f50'}
                            strokeWidth="3"
                            strokeDasharray={`${testResults.overallResult.percentage}, 100`}
                          />
                          <text x="18" y="20.5" textAnchor="middle" fontSize="8" fill="currentColor" className="font-bold">
                            {Math.round(testResults.overallResult.percentage)}%
                          </text>
                        </svg>
                      </div>
                    </div>

                    <div className="text-center mb-6">
                      <p className="text-lg">
                        Вы ответили правильно на <span className="font-bold">{testResults.overallResult.correct}</span> из <span className="font-bold">{testResults.overallResult.total}</span> вопросов
                      </p>
                      <p className="mt-2 text-gray-600 dark:text-gray-400">
                        {testResults.overallResult.percentage >= 70 ? 'Отличный результат! Вы хорошо знаете материал.' :
                         testResults.overallResult.percentage >= 40 ? 'Неплохой результат, но есть над чем поработать.' :
                         'Вам стоит уделить больше внимания изучению материала.'}
                      </p>
                    </div>

                    {/* Результаты по темам */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3">Результаты по темам:</h3>
                      <div className="space-y-3">
                        {Object.entries(testResults.topicResults).map(([topic, result]) => (
                          <div key={topic} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium">
                                {topic === 'calculus' ? 'Математический анализ' :
                                 topic === 'algebra' ? 'Алгебра' :
                                 topic === 'set_theory' ? 'Теория множеств' :
                                 topic === 'analysis' ? 'Анализ' :
                                 topic}
                              </span>
                              <span className={`text-sm font-medium ${
                                result.percentage >= 70 ? 'text-green-600 dark:text-green-400' :
                                result.percentage >= 40 ? 'text-yellow-600 dark:text-yellow-400' :
                                'text-red-600 dark:text-red-400'
                              }`}>
                                {result.correct}/{result.total} ({Math.round(result.percentage)}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  result.percentage >= 70 ? 'bg-beach-leaf' :
                                  result.percentage >= 40 ? 'bg-beach-water' :
                                  'bg-beach-coral'
                                }`}
                                style={{ width: `${result.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Рекомендации */}
                    <div className="mb-6 p-4 bg-beach-water/20 border border-beach-water rounded-lg">
                      <h3 className="text-lg font-semibold mb-2 text-beach-waterDark">Рекомендации:</h3>

                      {testResults.weakTopics.length > 0 ? (
                        <div className="mb-3">
                          <p className="font-medium mb-1">Темы, требующие внимания:</p>
                          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                            {testResults.weakTopics.map(topic => (
                              <li key={topic}>
                                {topic === 'calculus' ? 'Математический анализ' :
                                 topic === 'algebra' ? 'Алгебра' :
                                 topic === 'set_theory' ? 'Теория множеств' :
                                 topic === 'analysis' ? 'Анализ' :
                                 topic}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          У вас нет тем, требующих срочного внимания. Продолжайте в том же духе!
                        </p>
                      )}

                      {testResults.strongTopics.length > 0 && (
                        <div className="mb-3">
                          <p className="font-medium mb-1">Ваши сильные стороны:</p>
                          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                            {testResults.strongTopics.map(topic => (
                              <li key={topic}>
                                {topic === 'calculus' ? 'Математический анализ' :
                                 topic === 'algebra' ? 'Алгебра' :
                                 topic === 'set_theory' ? 'Теория множеств' :
                                 topic === 'analysis' ? 'Анализ' :
                                 topic}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Персонализированная обратная связь */}
                      {personalizedFeedback && personalizedFeedback.recommendationsByTopic && Object.keys(personalizedFeedback.recommendationsByTopic).length > 0 && (
                        <div>
                          <p className="font-medium mb-1">Персонализированные рекомендации:</p>
                          <div className="space-y-3 mt-2">
                            {Object.entries(personalizedFeedback.recommendationsByTopic).map(([topic, recommendations]) => (
                              <div key={topic} className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                                <p className="font-medium mb-1">
                                  {topic === 'calculus' ? 'Математический анализ' :
                                   topic === 'algebra' ? 'Алгебра' :
                                   topic === 'set_theory' ? 'Теория множеств' :
                                   topic === 'analysis' ? 'Анализ' :
                                   topic}:
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                                  {recommendations.map((recommendation, index) => (
                                    <li key={index}>{recommendation}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      setUserProfile(createInitialUserProfile());
                      setSelectedAnswers({});
                      setUserAnswers({});
                      setShowResults(false);
                      setTestCompleted(false);
                      setTestStartTime(Date.now());

                      // Выбираем первый вопрос с помощью адаптивного алгоритма
                      const nextQuestion = selectNextQuestion(questions, createInitialUserProfile());
                      if (nextQuestion) {
                        setCurrentQuestion(nextQuestion);
                        setQuestionStartTime(Date.now());
                      }
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Пройти тест заново
                  </button>

                  <Link
                    href="/dashboard"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-beach-leaf hover:bg-beach-leafDark transition-colors"
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
