/**
 * Утилита для генерации индивидуальных учебных материалов
 * 
 * Генерирует персонализированные учебные материалы на основе:
 * 1. Уровня знаний пользователя
 * 2. Предпочтительного стиля обучения
 * 3. Истории ошибок и прогресса
 * 4. Целей обучения
 */

import { ErrorType } from './error-analysis';

// Типы стилей обучения
export enum LearningStyle {
  VISUAL = 'visual', // Визуальный стиль (изображения, диаграммы)
  AUDITORY = 'auditory', // Аудиальный стиль (аудио, обсуждения)
  READING = 'reading', // Чтение/письмо (текст, заметки)
  KINESTHETIC = 'kinesthetic', // Кинестетический стиль (практика, эксперименты)
}

// Типы учебных материалов
export enum MaterialType {
  THEORY = 'theory', // Теоретический материал
  PRACTICE = 'practice', // Практические задания
  EXAMPLE = 'example', // Примеры с решениями
  QUIZ = 'quiz', // Тесты для самопроверки
  VISUALIZATION = 'visualization', // Визуализации и диаграммы
  INTERACTIVE = 'interactive', // Интерактивные материалы
}

// Уровни сложности материалов
export enum DifficultyLevel {
  BEGINNER = 'beginner',
  ELEMENTARY = 'elementary',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

// Структура учебного материала
export interface LearningMaterial {
  id: string;
  title: string;
  description: string;
  type: MaterialType;
  topic: string;
  subtopic?: string;
  difficulty: DifficultyLevel;
  content: string;
  examples?: string[];
  exercises?: string[];
  visualAids?: string[];
  estimatedTime: number; // в минутах
  prerequisites?: string[];
  relatedMaterials?: string[];
}

// Профиль обучения пользователя
export interface LearningProfile {
  userId: string;
  preferredStyle: LearningStyle;
  topicProficiency: Record<string, number>; // от 0 до 1 для каждой темы
  commonErrors: Record<string, ErrorType[]>; // типы ошибок по темам
  learningGoals: string[];
  completedMaterials: string[]; // id уже изученных материалов
  averageStudyTime: number; // среднее время изучения в минутах
}

/**
 * Генерирует ID для учебного материала
 * @returns Уникальный ID
 */
function generateMaterialId(): string {
  return `material_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

/**
 * Определяет оптимальный уровень сложности для пользователя по теме
 * @param topic Тема
 * @param profile Профиль обучения пользователя
 * @returns Уровень сложности
 */
export function determineDifficultyLevel(
  topic: string,
  profile: LearningProfile
): DifficultyLevel {
  const proficiency = profile.topicProficiency[topic] || 0;
  
  if (proficiency < 0.2) {
    return DifficultyLevel.BEGINNER;
  } else if (proficiency < 0.4) {
    return DifficultyLevel.ELEMENTARY;
  } else if (proficiency < 0.6) {
    return DifficultyLevel.INTERMEDIATE;
  } else if (proficiency < 0.8) {
    return DifficultyLevel.ADVANCED;
  } else {
    return DifficultyLevel.EXPERT;
  }
}

/**
 * Определяет оптимальные типы материалов для пользователя
 * @param profile Профиль обучения пользователя
 * @returns Массив типов материалов
 */
export function determineOptimalMaterialTypes(
  profile: LearningProfile
): MaterialType[] {
  const types: MaterialType[] = [];
  
  // Всегда включаем теорию и примеры
  types.push(MaterialType.THEORY);
  types.push(MaterialType.EXAMPLE);
  
  // Добавляем типы в зависимости от предпочтительного стиля обучения
  switch (profile.preferredStyle) {
    case LearningStyle.VISUAL:
      types.push(MaterialType.VISUALIZATION);
      break;
    case LearningStyle.AUDITORY:
      // Для аудиального стиля в текстовом формате подойдут диалоги и обсуждения
      types.push(MaterialType.THEORY); // Дополнительная теория в формате диалога
      break;
    case LearningStyle.READING:
      // Для стиля чтение/письмо подойдут дополнительные теоретические материалы
      types.push(MaterialType.THEORY);
      break;
    case LearningStyle.KINESTHETIC:
      types.push(MaterialType.PRACTICE);
      types.push(MaterialType.INTERACTIVE);
      break;
  }
  
  // Добавляем практику, если у пользователя есть ошибки в применении
  const hasApplicationErrors = Object.values(profile.commonErrors).some(
    errors => errors.includes(ErrorType.APPLICATION)
  );
  
  if (hasApplicationErrors && !types.includes(MaterialType.PRACTICE)) {
    types.push(MaterialType.PRACTICE);
  }
  
  // Добавляем тесты для самопроверки
  types.push(MaterialType.QUIZ);
  
  return types;
}

/**
 * Генерирует содержимое учебного материала
 * @param topic Тема
 * @param type Тип материала
 * @param difficulty Уровень сложности
 * @returns Содержимое материала
 */
function generateMaterialContent(
  topic: string,
  type: MaterialType,
  difficulty: DifficultyLevel
): string {
  // В реальном приложении здесь был бы запрос к API генерации текста (например, OpenAI)
  // Для демонстрации используем заглушки
  
  const topicName = 
    topic === 'calculus' ? 'математический анализ' :
    topic === 'algebra' ? 'алгебра' :
    topic === 'set_theory' ? 'теория множеств' :
    topic === 'analysis' ? 'анализ' : topic;
  
  const difficultyText = 
    difficulty === DifficultyLevel.BEGINNER ? 'начального' :
    difficulty === DifficultyLevel.ELEMENTARY ? 'элементарного' :
    difficulty === DifficultyLevel.INTERMEDIATE ? 'среднего' :
    difficulty === DifficultyLevel.ADVANCED ? 'продвинутого' :
    'экспертного';
  
  switch (type) {
    case MaterialType.THEORY:
      return `# Теоретический материал по теме "${topicName}" (${difficultyText} уровня)

## Введение

Этот материал содержит теоретические основы по теме "${topicName}" для студентов ${difficultyText} уровня подготовки.

## Основные понятия

...

## Ключевые теоремы и свойства

...

## Выводы

...`;
    
    case MaterialType.PRACTICE:
      return `# Практические задания по теме "${topicName}" (${difficultyText} уровня)

## Задание 1
...

## Задание 2
...

## Задание 3
...`;
    
    case MaterialType.EXAMPLE:
      return `# Примеры с решениями по теме "${topicName}" (${difficultyText} уровня)

## Пример 1
...

## Пример 2
...

## Пример 3
...`;
    
    case MaterialType.QUIZ:
      return `# Тест для самопроверки по теме "${topicName}" (${difficultyText} уровня)

## Вопрос 1
...

## Вопрос 2
...

## Вопрос 3
...`;
    
    case MaterialType.VISUALIZATION:
      return `# Визуализации по теме "${topicName}" (${difficultyText} уровня)

## Диаграмма 1
...

## Диаграмма 2
...

## Диаграмма 3
...`;
    
    case MaterialType.INTERACTIVE:
      return `# Интерактивные материалы по теме "${topicName}" (${difficultyText} уровня)

## Интерактивное задание 1
...

## Интерактивное задание 2
...

## Интерактивное задание 3
...`;
    
    default:
      return `# Материал по теме "${topicName}" (${difficultyText} уровня)`;
  }
}

/**
 * Генерирует учебный материал для пользователя
 * @param topic Тема
 * @param type Тип материала
 * @param profile Профиль обучения пользователя
 * @returns Учебный материал
 */
export function generateMaterial(
  topic: string,
  type: MaterialType,
  profile: LearningProfile
): LearningMaterial {
  const difficulty = determineDifficultyLevel(topic, profile);
  const content = generateMaterialContent(topic, type, difficulty);
  
  const topicName = 
    topic === 'calculus' ? 'Математический анализ' :
    topic === 'algebra' ? 'Алгебра' :
    topic === 'set_theory' ? 'Теория множеств' :
    topic === 'analysis' ? 'Анализ' : topic;
  
  const typeTitle = 
    type === MaterialType.THEORY ? 'Теория' :
    type === MaterialType.PRACTICE ? 'Практика' :
    type === MaterialType.EXAMPLE ? 'Примеры' :
    type === MaterialType.QUIZ ? 'Тест' :
    type === MaterialType.VISUALIZATION ? 'Визуализация' :
    'Интерактивный материал';
  
  return {
    id: generateMaterialId(),
    title: `${typeTitle}: ${topicName}`,
    description: `${typeTitle} по теме "${topicName}" для ${difficulty} уровня`,
    type,
    topic,
    difficulty,
    content,
    estimatedTime: 15, // Примерное время изучения в минутах
    examples: type === MaterialType.EXAMPLE ? ['Пример 1', 'Пример 2', 'Пример 3'] : undefined,
    exercises: type === MaterialType.PRACTICE ? ['Задание 1', 'Задание 2', 'Задание 3'] : undefined,
    visualAids: type === MaterialType.VISUALIZATION ? ['Диаграмма 1', 'Диаграмма 2', 'Диаграмма 3'] : undefined,
  };
}

/**
 * Генерирует набор учебных материалов для пользователя по теме
 * @param topic Тема
 * @param profile Профиль обучения пользователя
 * @returns Массив учебных материалов
 */
export function generateMaterialsForTopic(
  topic: string,
  profile: LearningProfile
): LearningMaterial[] {
  const optimalTypes = determineOptimalMaterialTypes(profile);
  
  return optimalTypes.map(type => generateMaterial(topic, type, profile));
}

/**
 * Генерирует индивидуальный учебный план для пользователя
 * @param topics Массив тем
 * @param profile Профиль обучения пользователя
 * @returns Объект с учебными материалами по темам
 */
export function generateLearningPlan(
  topics: string[],
  profile: LearningProfile
): Record<string, LearningMaterial[]> {
  const plan: Record<string, LearningMaterial[]> = {};
  
  topics.forEach(topic => {
    plan[topic] = generateMaterialsForTopic(topic, profile);
  });
  
  return plan;
}
