/**
 * Утилита для адаптивного тестирования
 * 
 * Реализует алгоритм адаптивного подбора вопросов на основе:
 * 1. Текущего уровня знаний пользователя
 * 2. Сложности вопросов
 * 3. Истории ответов пользователя
 * 4. Тематики вопросов
 */

// Типы для вопросов и ответов
export type Answer = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type Question = {
  id: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  answers: Answer[];
  explanation: string;
};

export type UserAnswer = {
  questionId: string;
  answerId: string;
  isCorrect: boolean;
  timeSpent: number; // в секундах
};

export type UserProfile = {
  skillLevel: number; // от 0 до 1
  topicProficiency: Record<string, number>; // от 0 до 1 для каждой темы
  answeredQuestions: string[]; // id уже отвеченных вопросов
};

/**
 * Вычисляет сложность вопроса в числовом формате
 * @param difficulty Сложность вопроса
 * @returns Числовое значение сложности от 0 до 1
 */
export function getDifficultyValue(difficulty: 'easy' | 'medium' | 'hard'): number {
  switch (difficulty) {
    case 'easy': return 0.3;
    case 'medium': return 0.6;
    case 'hard': return 0.9;
    default: return 0.5;
  }
}

/**
 * Обновляет профиль пользователя на основе его ответа
 * @param profile Текущий профиль пользователя
 * @param question Вопрос, на который ответил пользователь
 * @param userAnswer Ответ пользователя
 * @returns Обновленный профиль пользователя
 */
export function updateUserProfile(
  profile: UserProfile,
  question: Question,
  userAnswer: UserAnswer
): UserProfile {
  const difficultyValue = getDifficultyValue(question.difficulty);
  const topic = question.topic;
  
  // Коэффициент изменения уровня навыка (меньше для высоких уровней)
  const learningRate = 0.1 * (1 - profile.skillLevel);
  
  // Обновление общего уровня навыка
  let newSkillLevel = profile.skillLevel;
  if (userAnswer.isCorrect) {
    // Если ответ правильный, увеличиваем уровень (больше для сложных вопросов)
    newSkillLevel += learningRate * difficultyValue;
  } else {
    // Если ответ неправильный, уменьшаем уровень (больше для легких вопросов)
    newSkillLevel -= learningRate * (1 - difficultyValue);
  }
  
  // Ограничиваем значение от 0 до 1
  newSkillLevel = Math.max(0, Math.min(1, newSkillLevel));
  
  // Обновление уровня владения темой
  const topicProficiency = { ...profile.topicProficiency };
  if (!topicProficiency[topic]) {
    topicProficiency[topic] = 0.5; // Начальное значение, если тема новая
  }
  
  if (userAnswer.isCorrect) {
    topicProficiency[topic] += 0.1 * (1 - topicProficiency[topic]);
  } else {
    topicProficiency[topic] -= 0.1 * topicProficiency[topic];
  }
  
  // Ограничиваем значение от 0 до 1
  topicProficiency[topic] = Math.max(0, Math.min(1, topicProficiency[topic]));
  
  // Добавляем вопрос в список отвеченных
  const answeredQuestions = [...profile.answeredQuestions, question.id];
  
  return {
    skillLevel: newSkillLevel,
    topicProficiency,
    answeredQuestions,
  };
}

/**
 * Вычисляет оптимальность вопроса для пользователя
 * @param question Вопрос
 * @param profile Профиль пользователя
 * @returns Оценка оптимальности от 0 до 1
 */
export function calculateQuestionSuitability(
  question: Question,
  profile: UserProfile
): number {
  // Если вопрос уже был отвечен, он не подходит
  if (profile.answeredQuestions.includes(question.id)) {
    return 0;
  }
  
  const difficultyValue = getDifficultyValue(question.difficulty);
  const topic = question.topic;
  const topicProficiency = profile.topicProficiency[topic] || 0.5;
  
  // Вычисляем разницу между сложностью вопроса и уровнем навыка
  // Оптимальный вопрос должен быть немного сложнее текущего уровня
  const difficultyDifference = Math.abs(difficultyValue - (profile.skillLevel + 0.1));
  
  // Вычисляем разницу между сложностью вопроса и уровнем владения темой
  // Оптимальный вопрос должен быть немного сложнее текущего уровня владения темой
  const topicDifference = Math.abs(difficultyValue - (topicProficiency + 0.1));
  
  // Комбинируем факторы для получения итоговой оценки
  // Чем меньше разница, тем лучше подходит вопрос
  const suitability = 1 - (0.7 * difficultyDifference + 0.3 * topicDifference);
  
  return Math.max(0, Math.min(1, suitability));
}

/**
 * Выбирает следующий вопрос на основе профиля пользователя
 * @param questions Доступные вопросы
 * @param profile Профиль пользователя
 * @returns Следующий вопрос или null, если подходящих вопросов нет
 */
export function selectNextQuestion(
  questions: Question[],
  profile: UserProfile
): Question | null {
  // Фильтруем вопросы, которые пользователь уже отвечал
  const availableQuestions = questions.filter(
    q => !profile.answeredQuestions.includes(q.id)
  );
  
  if (availableQuestions.length === 0) {
    return null;
  }
  
  // Вычисляем оптимальность для каждого вопроса
  const questionSuitability = availableQuestions.map(question => ({
    question,
    suitability: calculateQuestionSuitability(question, profile),
  }));
  
  // Сортируем по оптимальности (от наиболее подходящего к наименее)
  questionSuitability.sort((a, b) => b.suitability - a.suitability);
  
  // Добавляем элемент случайности (выбираем из топ-3 вопросов)
  const topQuestions = questionSuitability.slice(0, Math.min(3, questionSuitability.length));
  const randomIndex = Math.floor(Math.random() * topQuestions.length);
  
  return topQuestions[randomIndex].question;
}

/**
 * Создает начальный профиль пользователя
 * @returns Начальный профиль пользователя
 */
export function createInitialUserProfile(): UserProfile {
  return {
    skillLevel: 0.5, // Средний начальный уровень
    topicProficiency: {}, // Пустой объект для профессионализма по темам
    answeredQuestions: [], // Пустой массив отвеченных вопросов
  };
}

/**
 * Анализирует результаты теста и возвращает рекомендации
 * @param questions Все вопросы теста
 * @param userAnswers Ответы пользователя
 * @returns Объект с рекомендациями
 */
export function analyzeTestResults(
  questions: Question[],
  userAnswers: Record<string, UserAnswer>
) {
  // Группируем вопросы по темам
  const topicQuestions: Record<string, Question[]> = {};
  questions.forEach(question => {
    if (!topicQuestions[question.topic]) {
      topicQuestions[question.topic] = [];
    }
    topicQuestions[question.topic].push(question);
  });
  
  // Анализируем результаты по темам
  const topicResults: Record<string, { total: number; correct: number; percentage: number }> = {};
  
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
  
  // Общий результат
  const totalQuestions = questions.length;
  const correctAnswers = Object.values(userAnswers).filter(a => a.isCorrect).length;
  const overallPercentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  
  return {
    overallResult: {
      total: totalQuestions,
      correct: correctAnswers,
      percentage: overallPercentage,
    },
    topicResults,
    strongTopics,
    weakTopics,
    needsImprovement: overallPercentage < 70,
  };
}
