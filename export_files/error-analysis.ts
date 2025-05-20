/**
 * Утилита для анализа ошибок и предоставления персонализированной обратной связи
 * 
 * Анализирует ошибки пользователя при прохождении тестов и генерирует
 * персонализированные рекомендации и обратную связь.
 */

import { Question, UserAnswer } from './adaptive-testing';

// Типы ошибок
export enum ErrorType {
  CONCEPTUAL = 'conceptual', // Ошибки в понимании концепций
  CALCULATION = 'calculation', // Ошибки в вычислениях
  LOGICAL = 'logical', // Логические ошибки
  MEMORY = 'memory', // Ошибки запоминания
  APPLICATION = 'application', // Ошибки в применении знаний
}

// Шаблоны ошибок для разных тем
export const errorPatterns: Record<string, Record<string, ErrorType>> = {
  calculus: {
    'Неправильное применение правила дифференцирования': ErrorType.APPLICATION,
    'Ошибка в знаке производной': ErrorType.CALCULATION,
    'Непонимание правила произведения': ErrorType.CONCEPTUAL,
    'Непонимание правила частного': ErrorType.CONCEPTUAL,
    'Ошибка в применении цепного правила': ErrorType.APPLICATION,
  },
  algebra: {
    'Ошибка в решении квадратного уравнения': ErrorType.CALCULATION,
    'Неправильное применение формулы': ErrorType.APPLICATION,
    'Ошибка в раскрытии скобок': ErrorType.CALCULATION,
    'Ошибка в работе со знаками': ErrorType.CALCULATION,
    'Непонимание свойств логарифмов': ErrorType.CONCEPTUAL,
  },
  set_theory: {
    'Непонимание определения подмножества': ErrorType.CONCEPTUAL,
    'Ошибка в операциях над множествами': ErrorType.APPLICATION,
    'Неправильное применение законов де Моргана': ErrorType.APPLICATION,
    'Непонимание понятия мощности множества': ErrorType.CONCEPTUAL,
  },
  analysis: {
    'Непонимание понятия непрерывности': ErrorType.CONCEPTUAL,
    'Ошибка в применении теорем анализа': ErrorType.APPLICATION,
    'Непонимание понятия предела': ErrorType.CONCEPTUAL,
    'Ошибка в работе с рядами': ErrorType.APPLICATION,
  },
};

// Шаблоны рекомендаций для разных типов ошибок
export const recommendationTemplates: Record<ErrorType, string[]> = {
  [ErrorType.CONCEPTUAL]: [
    'Рекомендуется повторить основные определения и теоремы по теме "{topic}".',
    'Обратите внимание на концептуальное понимание темы "{topic}". Попробуйте изучить ее с другой точки зрения.',
    'Для лучшего понимания концепций в теме "{topic}" рекомендуется использовать визуализации и примеры.',
  ],
  [ErrorType.CALCULATION]: [
    'Обратите внимание на точность вычислений в задачах по теме "{topic}".',
    'Рекомендуется больше практиковаться в решении задач по теме "{topic}", уделяя внимание деталям вычислений.',
    'Попробуйте использовать пошаговый подход к решению задач по теме "{topic}", проверяя каждый шаг.',
  ],
  [ErrorType.LOGICAL]: [
    'Обратите внимание на логическую структуру рассуждений в теме "{topic}".',
    'Рекомендуется тренировать логическое мышление, решая задачи по теме "{topic}" разными способами.',
    'Попробуйте составлять схемы или диаграммы для визуализации логических связей в теме "{topic}".',
  ],
  [ErrorType.MEMORY]: [
    'Для лучшего запоминания формул и определений по теме "{topic}" используйте мнемонические техники.',
    'Рекомендуется создать карточки с ключевыми формулами и определениями по теме "{topic}".',
    'Регулярное повторение материала по теме "{topic}" поможет улучшить запоминание.',
  ],
  [ErrorType.APPLICATION]: [
    'Рекомендуется больше практиковаться в применении теории к практическим задачам по теме "{topic}".',
    'Обратите внимание на условия применимости методов и формул в теме "{topic}".',
    'Попробуйте решать разнообразные задачи по теме "{topic}", чтобы лучше понять, когда и как применять различные методы.',
  ],
};

/**
 * Анализирует ошибки пользователя и определяет их типы
 * @param questions Вопросы теста
 * @param userAnswers Ответы пользователя
 * @returns Объект с типами ошибок по темам
 */
export function analyzeErrors(
  questions: Question[],
  userAnswers: Record<string, UserAnswer>
): Record<string, ErrorType[]> {
  const errorsByTopic: Record<string, ErrorType[]> = {};
  
  // Анализируем каждый вопрос, на который пользователь ответил неправильно
  questions.forEach(question => {
    const userAnswer = userAnswers[question.id];
    
    // Если пользователь ответил неправильно
    if (userAnswer && !userAnswer.isCorrect) {
      const topic = question.topic;
      
      if (!errorsByTopic[topic]) {
        errorsByTopic[topic] = [];
      }
      
      // Определяем тип ошибки на основе темы и сложности вопроса
      let errorType: ErrorType;
      
      // Простая эвристика для определения типа ошибки
      // В реальном приложении здесь был бы более сложный алгоритм
      if (question.difficulty === 'easy') {
        // Для легких вопросов ошибки чаще связаны с памятью или концепциями
        errorType = Math.random() > 0.5 ? ErrorType.MEMORY : ErrorType.CONCEPTUAL;
      } else if (question.difficulty === 'medium') {
        // Для средних вопросов ошибки чаще связаны с вычислениями или применением
        errorType = Math.random() > 0.5 ? ErrorType.CALCULATION : ErrorType.APPLICATION;
      } else {
        // Для сложных вопросов ошибки чаще связаны с логикой или применением
        errorType = Math.random() > 0.5 ? ErrorType.LOGICAL : ErrorType.APPLICATION;
      }
      
      // Добавляем тип ошибки в список
      if (!errorsByTopic[topic].includes(errorType)) {
        errorsByTopic[topic].push(errorType);
      }
    }
  });
  
  return errorsByTopic;
}

/**
 * Генерирует персонализированные рекомендации на основе анализа ошибок
 * @param errorsByTopic Типы ошибок по темам
 * @returns Объект с рекомендациями по темам
 */
export function generateRecommendations(
  errorsByTopic: Record<string, ErrorType[]>
): Record<string, string[]> {
  const recommendationsByTopic: Record<string, string[]> = {};
  
  Object.entries(errorsByTopic).forEach(([topic, errorTypes]) => {
    recommendationsByTopic[topic] = [];
    
    errorTypes.forEach(errorType => {
      // Выбираем случайную рекомендацию из шаблонов для данного типа ошибки
      const templates = recommendationTemplates[errorType];
      const randomIndex = Math.floor(Math.random() * templates.length);
      const template = templates[randomIndex];
      
      // Заменяем плейсхолдер {topic} на название темы
      const topicName = 
        topic === 'calculus' ? 'математический анализ' :
        topic === 'algebra' ? 'алгебра' :
        topic === 'set_theory' ? 'теория множеств' :
        topic === 'analysis' ? 'анализ' : topic;
      
      const recommendation = template.replace('{topic}', topicName);
      
      // Добавляем рекомендацию в список
      recommendationsByTopic[topic].push(recommendation);
    });
  });
  
  return recommendationsByTopic;
}

/**
 * Анализирует ошибки и генерирует персонализированную обратную связь
 * @param questions Вопросы теста
 * @param userAnswers Ответы пользователя
 * @returns Объект с персонализированной обратной связью
 */
export function generatePersonalizedFeedback(
  questions: Question[],
  userAnswers: Record<string, UserAnswer>
) {
  // Анализируем ошибки
  const errorsByTopic = analyzeErrors(questions, userAnswers);
  
  // Генерируем рекомендации
  const recommendationsByTopic = generateRecommendations(errorsByTopic);
  
  // Определяем сильные и слабые стороны
  const topicResults: Record<string, { total: number; correct: number; percentage: number }> = {};
  
  // Группируем вопросы по темам
  const topicQuestions: Record<string, Question[]> = {};
  questions.forEach(question => {
    if (!topicQuestions[question.topic]) {
      topicQuestions[question.topic] = [];
    }
    topicQuestions[question.topic].push(question);
  });
  
  // Анализируем результаты по темам
  Object.entries(topicQuestions).forEach(([topic, questions]) => {
    const total = questions.length;
    let correct = 0;
    
    questions.forEach(question => {
      const answer = userAnswers[question.id];
      if (answer && answer.isCorrect) {
        correct++;
      }
    });
    
    const percentage = total > 0 ? (correct / total) * 100 : 0;
    
    topicResults[topic] = {
      total,
      correct,
      percentage,
    };
  });
  
  // Определяем сильные и слабые темы
  const strongTopics = Object.entries(topicResults)
    .filter(([_, result]) => result.percentage >= 70)
    .map(([topic]) => topic);
    
  const weakTopics = Object.entries(topicResults)
    .filter(([_, result]) => result.percentage < 50)
    .map(([topic]) => topic);
  
  return {
    errorsByTopic,
    recommendationsByTopic,
    topicResults,
    strongTopics,
    weakTopics,
  };
}
