/**
 * Утилита для предиктивной аналитики
 * 
 * Реализует алгоритмы для прогнозирования результатов обучения
 * на основе исторических данных и текущего прогресса пользователя.
 */

import { UserAnswer } from './adaptive-testing';
import { ErrorType } from './error-analysis';

// Типы прогнозов
export enum PredictionType {
  EXAM_SCORE = 'exam_score',
  TOPIC_MASTERY = 'topic_mastery',
  LEARNING_TIME = 'learning_time',
  DIFFICULTY_LEVEL = 'difficulty_level',
  OPTIMAL_CONTENT = 'optimal_content',
}

// Структура прогноза
export interface Prediction {
  id: string;
  type: PredictionType;
  value: number;
  confidence: number; // от 0 до 1
  timestamp: number;
  explanation: string;
  relatedTopics?: string[];
  metadata?: Record<string, any>;
}

// Структура исторических данных пользователя
export interface UserHistory {
  userId: string;
  testResults: {
    testId: string;
    score: number;
    date: number;
    topics: string[];
    answers: Record<string, UserAnswer>;
  }[];
  topicProgress: Record<string, {
    startLevel: number;
    currentLevel: number;
    studyTime: number; // в минутах
    lastUpdated: number;
  }>;
  learningPatterns: {
    averageSessionDuration: number; // в минутах
    sessionsPerWeek: number;
    preferredTimeOfDay: number[]; // часы дня (0-23)
    completionRate: number; // от 0 до 1
  };
  commonErrors: Record<string, ErrorType[]>;
}

/**
 * Генерирует ID для прогноза
 * @returns Уникальный ID
 */
function generatePredictionId(): string {
  return `prediction_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

/**
 * Прогнозирует результат экзамена на основе исторических данных
 * @param history Исторические данные пользователя
 * @param examTopics Темы, которые будут на экзамене
 * @returns Прогноз результата экзамена
 */
export function predictExamScore(
  history: UserHistory,
  examTopics: string[]
): Prediction {
  // Получаем средний уровень владения темами экзамена
  let totalLevel = 0;
  let topicsCount = 0;
  
  examTopics.forEach(topic => {
    if (history.topicProgress[topic]) {
      totalLevel += history.topicProgress[topic].currentLevel;
      topicsCount++;
    }
  });
  
  const averageLevel = topicsCount > 0 ? totalLevel / topicsCount : 0.5;
  
  // Получаем средний результат предыдущих тестов
  const relevantTests = history.testResults.filter(test => 
    test.topics.some(topic => examTopics.includes(topic))
  );
  
  let averageScore = 0;
  if (relevantTests.length > 0) {
    averageScore = relevantTests.reduce((sum, test) => sum + test.score, 0) / relevantTests.length;
  }
  
  // Вычисляем прогнозируемый результат
  // Формула: 0.7 * средний уровень владения темами + 0.3 * средний результат предыдущих тестов
  const predictedScore = averageLevel * 70 + (averageScore / 100) * 30;
  
  // Вычисляем уверенность в прогнозе
  // Уверенность зависит от количества данных и их согласованности
  const dataPoints = topicsCount + relevantTests.length;
  const consistency = 1 - Math.abs(averageLevel - (averageScore / 100));
  const confidence = Math.min(0.3 + (dataPoints / 20) * 0.5 + consistency * 0.2, 0.95);
  
  // Формируем объяснение
  let explanation = `Прогноз основан на вашем текущем уровне владения темами (${Math.round(averageLevel * 100)}%) `;
  
  if (relevantTests.length > 0) {
    explanation += `и результатах предыдущих тестов (${Math.round(averageScore)}%).`;
  } else {
    explanation += 'и общем прогрессе обучения.';
  }
  
  if (confidence < 0.5) {
    explanation += ' Уверенность в прогнозе низкая из-за недостаточного количества данных.';
  } else if (confidence < 0.7) {
    explanation += ' Уверенность в прогнозе средняя.';
  } else {
    explanation += ' Уверенность в прогнозе высокая.';
  }
  
  return {
    id: generatePredictionId(),
    type: PredictionType.EXAM_SCORE,
    value: Math.round(predictedScore),
    confidence,
    timestamp: Date.now(),
    explanation,
    relatedTopics: examTopics,
  };
}

/**
 * Прогнозирует время, необходимое для достижения целевого уровня владения темой
 * @param history Исторические данные пользователя
 * @param topic Тема
 * @param targetLevel Целевой уровень владения (от 0 до 1)
 * @returns Прогноз времени обучения
 */
export function predictLearningTime(
  history: UserHistory,
  topic: string,
  targetLevel: number
): Prediction {
  // Получаем текущий уровень владения темой
  const topicProgress = history.topicProgress[topic];
  if (!topicProgress) {
    return {
      id: generatePredictionId(),
      type: PredictionType.LEARNING_TIME,
      value: 0,
      confidence: 0,
      timestamp: Date.now(),
      explanation: 'Недостаточно данных для прогноза.',
      relatedTopics: [topic],
    };
  }
  
  const currentLevel = topicProgress.currentLevel;
  
  // Если целевой уровень уже достигнут
  if (currentLevel >= targetLevel) {
    return {
      id: generatePredictionId(),
      type: PredictionType.LEARNING_TIME,
      value: 0,
      confidence: 0.9,
      timestamp: Date.now(),
      explanation: 'Вы уже достигли целевого уровня владения этой темой.',
      relatedTopics: [topic],
    };
  }
  
  // Вычисляем скорость обучения (прирост уровня в час)
  const levelGain = topicProgress.currentLevel - topicProgress.startLevel;
  const studyTimeHours = topicProgress.studyTime / 60;
  
  // Если нет данных о времени обучения или прогрессе
  if (studyTimeHours <= 0 || levelGain <= 0) {
    // Используем средние значения
    const learningRate = 0.1; // 10% за час
    const remainingGain = targetLevel - currentLevel;
    const estimatedHours = remainingGain / learningRate;
    
    return {
      id: generatePredictionId(),
      type: PredictionType.LEARNING_TIME,
      value: Math.ceil(estimatedHours * 60), // в минутах
      confidence: 0.3,
      timestamp: Date.now(),
      explanation: 'Прогноз основан на средних значениях, так как недостаточно данных о вашем прогрессе.',
      relatedTopics: [topic],
    };
  }
  
  // Вычисляем скорость обучения
  const learningRate = levelGain / studyTimeHours;
  
  // Прогнозируем оставшееся время
  const remainingGain = targetLevel - currentLevel;
  const estimatedHours = remainingGain / learningRate;
  
  // Корректируем прогноз с учетом сложности оставшегося материала
  // Чем выше уровень, тем сложнее прогрессировать
  const difficultyFactor = 1 + (currentLevel * 0.5);
  const adjustedHours = estimatedHours * difficultyFactor;
  
  // Вычисляем уверенность в прогнозе
  const timeSinceLastUpdate = (Date.now() - topicProgress.lastUpdated) / (1000 * 60 * 60 * 24); // в днях
  const recencyFactor = Math.max(0, 1 - (timeSinceLastUpdate / 30)); // уменьшается со временем
  const dataQualityFactor = Math.min(studyTimeHours / 10, 1); // увеличивается с количеством данных
  
  const confidence = Math.min(0.3 + recencyFactor * 0.4 + dataQualityFactor * 0.3, 0.9);
  
  // Формируем объяснение
  let explanation = `Прогноз основан на вашей текущей скорости обучения (${Math.round(learningRate * 100)}% за час). `;
  
  if (difficultyFactor > 1.2) {
    explanation += 'Учтено, что с повышением уровня владения темой прогресс замедляется. ';
  }
  
  if (confidence < 0.5) {
    explanation += 'Уверенность в прогнозе низкая из-за недостаточного количества данных или устаревшей информации.';
  } else if (confidence < 0.7) {
    explanation += 'Уверенность в прогнозе средняя.';
  } else {
    explanation += 'Уверенность в прогнозе высокая.';
  }
  
  return {
    id: generatePredictionId(),
    type: PredictionType.LEARNING_TIME,
    value: Math.ceil(adjustedHours * 60), // в минутах
    confidence,
    timestamp: Date.now(),
    explanation,
    relatedTopics: [topic],
  };
}

/**
 * Прогнозирует оптимальный уровень сложности для изучения темы
 * @param history Исторические данные пользователя
 * @param topic Тема
 * @returns Прогноз оптимального уровня сложности
 */
export function predictOptimalDifficulty(
  history: UserHistory,
  topic: string
): Prediction {
  // Получаем текущий уровень владения темой
  const topicProgress = history.topicProgress[topic];
  if (!topicProgress) {
    return {
      id: generatePredictionId(),
      type: PredictionType.DIFFICULTY_LEVEL,
      value: 0.5, // средний уровень сложности
      confidence: 0.3,
      timestamp: Date.now(),
      explanation: 'Недостаточно данных для точного прогноза. Рекомендуется начать со среднего уровня сложности.',
      relatedTopics: [topic],
    };
  }
  
  const currentLevel = topicProgress.currentLevel;
  
  // Анализируем ошибки пользователя
  const errors = history.commonErrors[topic] || [];
  const hasConceptualErrors = errors.includes(ErrorType.CONCEPTUAL);
  const hasApplicationErrors = errors.includes(ErrorType.APPLICATION);
  
  // Базовый уровень сложности: немного выше текущего уровня владения
  let optimalDifficulty = currentLevel + 0.1;
  
  // Корректируем с учетом типов ошибок
  if (hasConceptualErrors) {
    // Если есть концептуальные ошибки, снижаем сложность
    optimalDifficulty -= 0.1;
  }
  
  if (hasApplicationErrors && currentLevel > 0.6) {
    // Если есть ошибки в применении и высокий уровень владения,
    // увеличиваем сложность для практики
    optimalDifficulty += 0.1;
  }
  
  // Ограничиваем значение от 0.2 до 0.9
  optimalDifficulty = Math.max(0.2, Math.min(0.9, optimalDifficulty));
  
  // Вычисляем уверенность в прогнозе
  const timeSinceLastUpdate = (Date.now() - topicProgress.lastUpdated) / (1000 * 60 * 60 * 24); // в днях
  const recencyFactor = Math.max(0, 1 - (timeSinceLastUpdate / 30)); // уменьшается со временем
  
  const confidence = Math.min(0.4 + recencyFactor * 0.4 + (errors.length > 0 ? 0.2 : 0), 0.9);
  
  // Формируем объяснение
  let explanation = `Рекомендуемый уровень сложности основан на вашем текущем уровне владения темой (${Math.round(currentLevel * 100)}%). `;
  
  if (hasConceptualErrors) {
    explanation += 'Уровень сложности снижен, так как обнаружены концептуальные ошибки. ';
  }
  
  if (hasApplicationErrors && currentLevel > 0.6) {
    explanation += 'Уровень сложности повышен для лучшей практики применения знаний. ';
  }
  
  return {
    id: generatePredictionId(),
    type: PredictionType.DIFFICULTY_LEVEL,
    value: optimalDifficulty,
    confidence,
    timestamp: Date.now(),
    explanation,
    relatedTopics: [topic],
  };
}

/**
 * Прогнозирует вероятность достижения целевого уровня владения темой
 * @param history Исторические данные пользователя
 * @param topic Тема
 * @param targetLevel Целевой уровень владения (от 0 до 1)
 * @param timeframe Временной период в днях
 * @returns Прогноз вероятности достижения цели
 */
export function predictMasteryProbability(
  history: UserHistory,
  topic: string,
  targetLevel: number,
  timeframe: number
): Prediction {
  // Получаем текущий уровень владения темой
  const topicProgress = history.topicProgress[topic];
  if (!topicProgress) {
    return {
      id: generatePredictionId(),
      type: PredictionType.TOPIC_MASTERY,
      value: 0.2, // низкая вероятность
      confidence: 0.3,
      timestamp: Date.now(),
      explanation: 'Недостаточно данных для точного прогноза.',
      relatedTopics: [topic],
    };
  }
  
  const currentLevel = topicProgress.currentLevel;
  
  // Если целевой уровень уже достигнут
  if (currentLevel >= targetLevel) {
    return {
      id: generatePredictionId(),
      type: PredictionType.TOPIC_MASTERY,
      value: 1.0, // 100% вероятность
      confidence: 0.9,
      timestamp: Date.now(),
      explanation: 'Вы уже достигли целевого уровня владения этой темой.',
      relatedTopics: [topic],
    };
  }
  
  // Вычисляем скорость обучения (прирост уровня в день)
  const levelGain = topicProgress.currentLevel - topicProgress.startLevel;
  const studyTimeHours = topicProgress.studyTime / 60;
  
  // Если нет данных о времени обучения или прогрессе
  if (studyTimeHours <= 0 || levelGain <= 0) {
    // Используем средние значения
    return {
      id: generatePredictionId(),
      type: PredictionType.TOPIC_MASTERY,
      value: 0.5, // средняя вероятность
      confidence: 0.3,
      timestamp: Date.now(),
      explanation: 'Прогноз основан на средних значениях, так как недостаточно данных о вашем прогрессе.',
      relatedTopics: [topic],
    };
  }
  
  // Вычисляем скорость обучения в день
  const sessionsPerDay = history.learningPatterns.sessionsPerWeek / 7;
  const hoursPerDay = sessionsPerDay * (history.learningPatterns.averageSessionDuration / 60);
  const learningRatePerHour = levelGain / studyTimeHours;
  const learningRatePerDay = learningRatePerHour * hoursPerDay;
  
  // Прогнозируем достижимый уровень за указанный период
  const potentialGain = learningRatePerDay * timeframe;
  const projectedLevel = currentLevel + potentialGain;
  
  // Вычисляем вероятность достижения цели
  let probability = 0;
  
  if (projectedLevel >= targetLevel) {
    // Если прогнозируемый уровень выше целевого, вероятность высокая
    const buffer = (projectedLevel - targetLevel) / (targetLevel - currentLevel);
    probability = Math.min(0.7 + buffer * 0.3, 0.95);
  } else {
    // Если прогнозируемый уровень ниже целевого, вероятность зависит от близости
    probability = Math.max(0.05, (projectedLevel - currentLevel) / (targetLevel - currentLevel) * 0.7);
  }
  
  // Корректируем вероятность с учетом регулярности занятий
  probability *= history.learningPatterns.completionRate;
  
  // Вычисляем уверенность в прогнозе
  const timeSinceLastUpdate = (Date.now() - topicProgress.lastUpdated) / (1000 * 60 * 60 * 24); // в днях
  const recencyFactor = Math.max(0, 1 - (timeSinceLastUpdate / 30)); // уменьшается со временем
  const dataQualityFactor = Math.min(studyTimeHours / 10, 1); // увеличивается с количеством данных
  
  const confidence = Math.min(0.3 + recencyFactor * 0.4 + dataQualityFactor * 0.3, 0.9);
  
  // Формируем объяснение
  let explanation = `Прогноз основан на вашей текущей скорости обучения (${Math.round(learningRatePerDay * 100)}% в день) `;
  explanation += `и регулярности занятий (${Math.round(history.learningPatterns.completionRate * 100)}% выполнения). `;
  
  if (probability > 0.8) {
    explanation += 'Высокая вероятность достижения цели в указанный срок.';
  } else if (probability > 0.5) {
    explanation += 'Средняя вероятность достижения цели в указанный срок.';
  } else {
    explanation += 'Низкая вероятность достижения цели в указанный срок. Рекомендуется увеличить интенсивность обучения.';
  }
  
  return {
    id: generatePredictionId(),
    type: PredictionType.TOPIC_MASTERY,
    value: probability,
    confidence,
    timestamp: Date.now(),
    explanation,
    relatedTopics: [topic],
  };
}
