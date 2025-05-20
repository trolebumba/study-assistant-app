/**
 * Утилита для виртуального тьютора
 * 
 * Реализует интерактивное обучение с помощью виртуального тьютора,
 * который адаптируется к стилю обучения пользователя и предоставляет
 * персонализированную помощь.
 */

import { ErrorType } from './error-analysis';
import { LearningStyle } from './material-generator';

// Типы сообщений тьютора
export enum TutorMessageType {
  GREETING = 'greeting',
  EXPLANATION = 'explanation',
  QUESTION = 'question',
  HINT = 'hint',
  FEEDBACK = 'feedback',
  ENCOURAGEMENT = 'encouragement',
  SUMMARY = 'summary',
}

// Уровни сложности объяснений
export enum ExplanationLevel {
  BASIC = 'basic',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

// Структура сообщения тьютора
export interface TutorMessage {
  id: string;
  type: TutorMessageType;
  content: string;
  timestamp: number;
  relatedTopics?: string[];
  explanationLevel?: ExplanationLevel;
  requiresResponse?: boolean;
  options?: string[];
}

// Структура сообщения пользователя
export interface UserMessage {
  id: string;
  content: string;
  timestamp: number;
  relatedTopics?: string[];
}

// Структура диалога
export interface TutorDialog {
  id: string;
  messages: (TutorMessage | UserMessage)[];
  topic: string;
  subtopic?: string;
  startTime: number;
  endTime?: number;
  completed: boolean;
}

// Профиль тьютора
export interface TutorProfile {
  name: string;
  specialization: string[];
  teachingStyle: LearningStyle;
  responseTime: number; // в миллисекундах
  explanationLevel: ExplanationLevel;
  personality: {
    friendliness: number; // от 0 до 1
    patience: number; // от 0 до 1
    humor: number; // от 0 до 1
    formality: number; // от 0 до 1
  };
}

// Профиль обучения пользователя для тьютора
export interface TutorLearningProfile {
  userId: string;
  preferredStyle: LearningStyle;
  preferredExplanationLevel: ExplanationLevel;
  topicProficiency: Record<string, number>; // от 0 до 1 для каждой темы
  commonErrors: Record<string, ErrorType[]>; // типы ошибок по темам
  interactionHistory: {
    totalSessions: number;
    averageSessionDuration: number; // в минутах
    completedDialogs: number;
    abandonedDialogs: number;
    averageResponseTime: number; // в секундах
  };
  feedback: {
    helpfulness: number; // от 0 до 1
    clarity: number; // от 0 до 1
    engagement: number; // от 0 до 1
  };
}

/**
 * Генерирует ID для сообщения или диалога
 * @returns Уникальный ID
 */
function generateId(): string {
  return `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

/**
 * Создает профиль тьютора на основе профиля обучения пользователя
 * @param learningProfile Профиль обучения пользователя
 * @returns Профиль тьютора
 */
export function createTutorProfile(learningProfile: TutorLearningProfile): TutorProfile {
  // Адаптируем стиль обучения тьютора к предпочтениям пользователя
  const teachingStyle = learningProfile.preferredStyle;
  
  // Определяем уровень объяснений на основе общего уровня знаний пользователя
  const averageProficiency = Object.values(learningProfile.topicProficiency).reduce((sum, val) => sum + val, 0) / 
    Math.max(1, Object.values(learningProfile.topicProficiency).length);
  
  let explanationLevel = ExplanationLevel.INTERMEDIATE;
  if (averageProficiency < 0.3) {
    explanationLevel = ExplanationLevel.BASIC;
  } else if (averageProficiency > 0.7) {
    explanationLevel = ExplanationLevel.ADVANCED;
  }
  
  // Создаем профиль тьютора
  return {
    name: "Алекс",
    specialization: Object.keys(learningProfile.topicProficiency),
    teachingStyle,
    responseTime: 1000, // 1 секунда
    explanationLevel,
    personality: {
      friendliness: 0.8,
      patience: 0.9,
      humor: 0.5,
      formality: 0.4,
    },
  };
}

/**
 * Создает новый диалог с тьютором
 * @param topic Тема диалога
 * @param subtopic Подтема диалога (опционально)
 * @param tutorProfile Профиль тьютора
 * @returns Новый диалог
 */
export function createDialog(
  topic: string,
  subtopic: string | undefined,
  tutorProfile: TutorProfile
): TutorDialog {
  const now = Date.now();
  
  // Создаем приветственное сообщение от тьютора
  const greeting: TutorMessage = {
    id: generateId(),
    type: TutorMessageType.GREETING,
    content: generateGreeting(topic, subtopic, tutorProfile),
    timestamp: now,
    relatedTopics: [topic],
    requiresResponse: false,
  };
  
  // Создаем первый вопрос от тьютора
  const firstQuestion: TutorMessage = {
    id: generateId(),
    type: TutorMessageType.QUESTION,
    content: generateInitialQuestion(topic, subtopic, tutorProfile),
    timestamp: now + 1000,
    relatedTopics: [topic],
    requiresResponse: true,
    options: generateQuestionOptions(topic, subtopic),
  };
  
  // Создаем диалог
  return {
    id: generateId(),
    messages: [greeting, firstQuestion],
    topic,
    subtopic,
    startTime: now,
    completed: false,
  };
}

/**
 * Генерирует приветственное сообщение от тьютора
 * @param topic Тема диалога
 * @param subtopic Подтема диалога (опционально)
 * @param tutorProfile Профиль тьютора
 * @returns Приветственное сообщение
 */
function generateGreeting(
  topic: string,
  subtopic: string | undefined,
  tutorProfile: TutorProfile
): string {
  const topicName = 
    topic === 'calculus' ? 'математический анализ' :
    topic === 'algebra' ? 'алгебра' :
    topic === 'set_theory' ? 'теория множеств' :
    topic === 'analysis' ? 'анализ' : topic;
  
  const subtopicText = subtopic ? ` (${subtopic})` : '';
  
  const greetings = [
    `Привет! Я ${tutorProfile.name}, ваш виртуальный тьютор по теме "${topicName}"${subtopicText}.`,
    `Добро пожаловать на занятие по теме "${topicName}"${subtopicText}! Меня зовут ${tutorProfile.name}, и я буду вашим тьютором.`,
    `Здравствуйте! Я ${tutorProfile.name}, и сегодня мы будем изучать "${topicName}"${subtopicText}.`,
  ];
  
  const randomIndex = Math.floor(Math.random() * greetings.length);
  return greetings[randomIndex];
}

/**
 * Генерирует начальный вопрос от тьютора
 * @param topic Тема диалога
 * @param subtopic Подтема диалога (опционально)
 * @param tutorProfile Профиль тьютора
 * @returns Начальный вопрос
 */
function generateInitialQuestion(
  topic: string,
  subtopic: string | undefined,
  tutorProfile: TutorProfile
): string {
  const topicName = 
    topic === 'calculus' ? 'математический анализ' :
    topic === 'algebra' ? 'алгебра' :
    topic === 'set_theory' ? 'теория множеств' :
    topic === 'analysis' ? 'анализ' : topic;
  
  const questions = [
    `Что вы уже знаете о теме "${topicName}"?`,
    `Какие аспекты темы "${topicName}" вам наиболее интересны?`,
    `С чего бы вы хотели начать изучение темы "${topicName}"?`,
    `Какие у вас есть вопросы по теме "${topicName}"?`,
  ];
  
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
}

/**
 * Генерирует варианты ответов на вопрос
 * @param topic Тема диалога
 * @param subtopic Подтема диалога (опционально)
 * @returns Массив вариантов ответов
 */
function generateQuestionOptions(
  topic: string,
  subtopic: string | undefined
): string[] {
  if (topic === 'calculus') {
    return [
      'Я знаком с основами дифференцирования',
      'Я хотел бы узнать больше об интегрировании',
      'Мне интересны приложения математического анализа',
      'Я новичок в этой теме',
    ];
  } else if (topic === 'algebra') {
    return [
      'Я знаком с линейными уравнениями',
      'Мне интересны матрицы и определители',
      'Я хотел бы узнать больше о полиномах',
      'Я новичок в этой теме',
    ];
  } else if (topic === 'set_theory') {
    return [
      'Я знаком с основными операциями над множествами',
      'Мне интересны отношения и функции',
      'Я хотел бы узнать больше о кардинальных числах',
      'Я новичок в этой теме',
    ];
  } else {
    return [
      'Я уже имею некоторые знания по этой теме',
      'Мне интересны практические применения',
      'Я хотел бы начать с базовых концепций',
      'Я новичок в этой теме',
    ];
  }
}

/**
 * Обрабатывает сообщение пользователя и генерирует ответ тьютора
 * @param dialog Текущий диалог
 * @param userMessage Сообщение пользователя
 * @param tutorProfile Профиль тьютора
 * @param learningProfile Профиль обучения пользователя
 * @returns Обновленный диалог с ответом тьютора
 */
export function processUserMessage(
  dialog: TutorDialog,
  userMessage: UserMessage,
  tutorProfile: TutorProfile,
  learningProfile: TutorLearningProfile
): TutorDialog {
  // Добавляем сообщение пользователя в диалог
  const updatedDialog = {
    ...dialog,
    messages: [...dialog.messages, userMessage],
  };
  
  // Анализируем сообщение пользователя и генерируем ответ тьютора
  const tutorResponse = generateTutorResponse(
    updatedDialog,
    userMessage,
    tutorProfile,
    learningProfile
  );
  
  // Добавляем ответ тьютора в диалог
  return {
    ...updatedDialog,
    messages: [...updatedDialog.messages, tutorResponse],
  };
}

/**
 * Генерирует ответ тьютора на сообщение пользователя
 * @param dialog Текущий диалог
 * @param userMessage Сообщение пользователя
 * @param tutorProfile Профиль тьютора
 * @param learningProfile Профиль обучения пользователя
 * @returns Ответ тьютора
 */
function generateTutorResponse(
  dialog: TutorDialog,
  userMessage: UserMessage,
  tutorProfile: TutorProfile,
  learningProfile: TutorLearningProfile
): TutorMessage {
  // Определяем тип последнего сообщения тьютора
  const lastTutorMessage = dialog.messages
    .filter(msg => 'type' in msg)
    .pop() as TutorMessage | undefined;
  
  const lastMessageType = lastTutorMessage?.type || TutorMessageType.GREETING;
  
  // Генерируем ответ в зависимости от типа последнего сообщения
  if (lastMessageType === TutorMessageType.QUESTION) {
    // Если последнее сообщение было вопросом, генерируем объяснение
    return {
      id: generateId(),
      type: TutorMessageType.EXPLANATION,
      content: generateExplanation(dialog.topic, userMessage.content, tutorProfile),
      timestamp: Date.now(),
      relatedTopics: [dialog.topic],
      explanationLevel: tutorProfile.explanationLevel,
      requiresResponse: false,
    };
  } else if (lastMessageType === TutorMessageType.EXPLANATION) {
    // Если последнее сообщение было объяснением, задаем вопрос для проверки понимания
    return {
      id: generateId(),
      type: TutorMessageType.QUESTION,
      content: generateFollowUpQuestion(dialog.topic, dialog.messages, tutorProfile),
      timestamp: Date.now(),
      relatedTopics: [dialog.topic],
      requiresResponse: true,
    };
  } else {
    // В других случаях даем обратную связь и продолжаем диалог
    return {
      id: generateId(),
      type: TutorMessageType.FEEDBACK,
      content: generateFeedback(userMessage.content, dialog.topic, tutorProfile),
      timestamp: Date.now(),
      relatedTopics: [dialog.topic],
      requiresResponse: false,
    };
  }
}

/**
 * Генерирует объяснение по теме
 * @param topic Тема
 * @param userInput Ввод пользователя
 * @param tutorProfile Профиль тьютора
 * @returns Объяснение
 */
function generateExplanation(
  topic: string,
  userInput: string,
  tutorProfile: TutorProfile
): string {
  // В реальном приложении здесь был бы запрос к API генерации текста
  // Для демонстрации используем заглушки
  
  const topicName = 
    topic === 'calculus' ? 'математический анализ' :
    topic === 'algebra' ? 'алгебра' :
    topic === 'set_theory' ? 'теория множеств' :
    topic === 'analysis' ? 'анализ' : topic;
  
  if (userInput.includes('новичок')) {
    return `Давайте начнем с основ ${topicName}. Это раздел математики, который изучает... [подробное объяснение для начинающих]`;
  } else if (userInput.includes('интерес')) {
    return `Отлично! ${topicName} имеет множество интересных аспектов. Особенно увлекательно... [объяснение интересных аспектов]`;
  } else if (userInput.includes('практич')) {
    return `${topicName} имеет множество практических применений. Например... [примеры практического применения]`;
  } else {
    return `${topicName} - это важный раздел математики. Ключевые концепции включают... [общее объяснение]`;
  }
}

/**
 * Генерирует дополнительный вопрос для продолжения диалога
 * @param topic Тема
 * @param messages История сообщений
 * @param tutorProfile Профиль тьютора
 * @returns Дополнительный вопрос
 */
function generateFollowUpQuestion(
  topic: string,
  messages: (TutorMessage | UserMessage)[],
  tutorProfile: TutorProfile
): string {
  // В реальном приложении здесь был бы анализ истории сообщений
  // и генерация релевантного вопроса
  
  const topicName = 
    topic === 'calculus' ? 'математический анализ' :
    topic === 'algebra' ? 'алгебра' :
    topic === 'set_theory' ? 'теория множеств' :
    topic === 'analysis' ? 'анализ' : topic;
  
  const questions = [
    `Понятно ли вам объяснение? Есть ли вопросы по теме "${topicName}"?`,
    `Хотели бы вы узнать больше о каком-то конкретном аспекте темы "${topicName}"?`,
    `Как вы думаете, где можно применить эти знания о теме "${topicName}" на практике?`,
    `Какие еще вопросы у вас есть по теме "${topicName}"?`,
  ];
  
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
}

/**
 * Генерирует обратную связь на ввод пользователя
 * @param userInput Ввод пользователя
 * @param topic Тема
 * @param tutorProfile Профиль тьютора
 * @returns Обратная связь
 */
function generateFeedback(
  userInput: string,
  topic: string,
  tutorProfile: TutorProfile
): string {
  // В реальном приложении здесь был бы анализ ввода пользователя
  // и генерация персонализированной обратной связи
  
  if (userInput.length < 10) {
    return "Не могли бы вы рассказать подробнее? Это поможет мне лучше понять ваши потребности.";
  } else if (userInput.includes('не понимаю') || userInput.includes('сложно')) {
    return "Я понимаю, что эта тема может быть сложной. Давайте попробуем подойти к ней с другой стороны...";
  } else if (userInput.includes('спасибо') || userInput.includes('понятно')) {
    return "Рад, что смог помочь! Есть ли еще что-то, что вы хотели бы обсудить?";
  } else {
    return "Спасибо за ваш ответ. Давайте продолжим обсуждение этой темы...";
  }
}
