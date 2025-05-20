'use client';

import React, { useState } from 'react';
import { 
  Prediction, 
  PredictionType,
  predictExamScore,
  predictLearningTime,
  predictOptimalDifficulty,
  predictMasteryProbability
} from '@/utils/predictive-analytics';
import { ErrorType } from '@/utils/error-analysis';

// Моковые данные для демонстрации
const mockUserHistory = {
  userId: 'user123',
  testResults: [
    {
      testId: 'test1',
      score: 75,
      date: Date.now() - 1000 * 60 * 60 * 24 * 7, // 7 дней назад
      topics: ['calculus', 'algebra'],
      answers: {},
    },
    {
      testId: 'test2',
      score: 82,
      date: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 дня назад
      topics: ['calculus', 'set_theory'],
      answers: {},
    },
  ],
  topicProgress: {
    'calculus': {
      startLevel: 0.3,
      currentLevel: 0.7,
      studyTime: 480, // 8 часов
      lastUpdated: Date.now() - 1000 * 60 * 60 * 24, // 1 день назад
    },
    'algebra': {
      startLevel: 0.2,
      currentLevel: 0.5,
      studyTime: 360, // 6 часов
      lastUpdated: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 дня назад
    },
    'set_theory': {
      startLevel: 0.1,
      currentLevel: 0.4,
      studyTime: 240, // 4 часа
      lastUpdated: Date.now() - 1000 * 60 * 60 * 24 * 4, // 4 дня назад
    },
  },
  learningPatterns: {
    averageSessionDuration: 45, // 45 минут
    sessionsPerWeek: 5,
    preferredTimeOfDay: [9, 10, 18, 19, 20], // утро и вечер
    completionRate: 0.8, // 80% завершения
  },
  commonErrors: {
    'calculus': [ErrorType.APPLICATION],
    'algebra': [ErrorType.CALCULATION, ErrorType.MEMORY],
    'set_theory': [ErrorType.CONCEPTUAL],
  },
};

interface PredictiveAnalyticsProps {
  className?: string;
}

export default function PredictiveAnalytics({ className = '' }: PredictiveAnalyticsProps) {
  const [selectedTopic, setSelectedTopic] = useState<string>('calculus');
  const [targetLevel, setTargetLevel] = useState<number>(0.8);
  const [timeframe, setTimeframe] = useState<number>(30); // 30 дней
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  
  // Доступные темы
  const topics = [
    { id: 'calculus', name: 'Математический анализ' },
    { id: 'algebra', name: 'Алгебра' },
    { id: 'set_theory', name: 'Теория множеств' },
  ];
  
  // Генерирует все прогнозы для выбранной темы
  const generatePredictions = () => {
    const examTopics = [selectedTopic];
    
    const examScorePrediction = predictExamScore(mockUserHistory, examTopics);
    const learningTimePrediction = predictLearningTime(mockUserHistory, selectedTopic, targetLevel);
    const difficultyPrediction = predictOptimalDifficulty(mockUserHistory, selectedTopic);
    const masteryPrediction = predictMasteryProbability(mockUserHistory, selectedTopic, targetLevel, timeframe);
    
    setPredictions([
      examScorePrediction,
      learningTimePrediction,
      difficultyPrediction,
      masteryPrediction,
    ]);
  };
  
  // Форматирует значение прогноза в зависимости от его типа
  const formatPredictionValue = (prediction: Prediction): string => {
    switch (prediction.type) {
      case PredictionType.EXAM_SCORE:
        return `${prediction.value}%`;
      case PredictionType.LEARNING_TIME:
        if (prediction.value === 0) return 'Уже достигнуто';
        const hours = Math.floor(prediction.value / 60);
        const minutes = prediction.value % 60;
        return hours > 0 
          ? `${hours} ч ${minutes > 0 ? `${minutes} мин` : ''}`
          : `${minutes} мин`;
      case PredictionType.DIFFICULTY_LEVEL:
        if (prediction.value < 0.3) return 'Начальный';
        if (prediction.value < 0.6) return 'Средний';
        if (prediction.value < 0.8) return 'Продвинутый';
        return 'Экспертный';
      case PredictionType.TOPIC_MASTERY:
        return `${Math.round(prediction.value * 100)}%`;
      case PredictionType.OPTIMAL_CONTENT:
        return prediction.value.toString();
      default:
        return prediction.value.toString();
    }
  };
  
  // Возвращает заголовок для прогноза
  const getPredictionTitle = (prediction: Prediction): string => {
    switch (prediction.type) {
      case PredictionType.EXAM_SCORE:
        return 'Прогноз результата экзамена';
      case PredictionType.LEARNING_TIME:
        return 'Время до достижения цели';
      case PredictionType.DIFFICULTY_LEVEL:
        return 'Оптимальный уровень сложности';
      case PredictionType.TOPIC_MASTERY:
        return 'Вероятность достижения цели';
      case PredictionType.OPTIMAL_CONTENT:
        return 'Рекомендуемый контент';
      default:
        return 'Прогноз';
    }
  };
  
  // Возвращает иконку для прогноза
  const getPredictionIcon = (prediction: Prediction): JSX.Element => {
    switch (prediction.type) {
      case PredictionType.EXAM_SCORE:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case PredictionType.LEARNING_TIME:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case PredictionType.DIFFICULTY_LEVEL:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case PredictionType.TOPIC_MASTERY:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case PredictionType.OPTIMAL_CONTENT:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };
  
  // Возвращает цвет для индикатора уверенности
  const getConfidenceColor = (confidence: number): string => {
    if (confidence < 0.4) return 'bg-red-500';
    if (confidence < 0.7) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Предиктивная аналитика</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Прогнозирование результатов обучения на основе ваших данных
        </p>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {/* Выбор темы */}
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Тема
            </label>
            <select
              id="topic"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              {topics.map(topic => (
                <option key={topic.id} value={topic.id}>{topic.name}</option>
              ))}
            </select>
          </div>
          
          {/* Целевой уровень */}
          <div>
            <label htmlFor="targetLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Целевой уровень владения: {Math.round(targetLevel * 100)}%
            </label>
            <input
              id="targetLevel"
              type="range"
              min="0.5"
              max="1"
              step="0.05"
              value={targetLevel}
              onChange={(e) => setTargetLevel(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          {/* Временной период */}
          <div>
            <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Временной период: {timeframe} дней
            </label>
            <input
              id="timeframe"
              type="range"
              min="7"
              max="90"
              step="1"
              value={timeframe}
              onChange={(e) => setTimeframe(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          {/* Кнопка генерации прогнозов */}
          <div className="flex justify-end">
            <button
              onClick={generatePredictions}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-beach-leaf hover:bg-beach-leafDark transition-colors"
            >
              Сгенерировать прогнозы
            </button>
          </div>
        </div>
        
        {/* Отображение прогнозов */}
        {predictions.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Результаты прогнозирования</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predictions.map((prediction) => (
                <div 
                  key={prediction.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 text-beach-leaf dark:text-beach-water">
                        {getPredictionIcon(prediction)}
                      </div>
                      <h4 className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                        {getPredictionTitle(prediction)}
                      </h4>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full ${getConfidenceColor(prediction.confidence)} mr-1`}></div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {Math.round(prediction.confidence * 100)}% уверенность
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {formatPredictionValue(prediction)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {prediction.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
