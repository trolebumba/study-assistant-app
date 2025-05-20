'use client';

import { useState } from 'react';
import RecommendationCard from './RecommendationCard';

// Типы для рекомендаций
type RecommendationType = 'course' | 'test' | 'resource' | 'practice';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: RecommendationType;
  confidence: number;
  tags?: string[];
}

// Моковые данные для рекомендаций
const initialRecommendations: Recommendation[] = [
  {
    id: '1',
    title: 'Курс "Продвинутая алгебра"',
    description: 'Основываясь на вашем прогрессе в курсе "Основы алгебры" и высоких результатах тестов, мы рекомендуем вам перейти к более сложным темам. Этот курс охватывает системы уравнений, неравенства, функции и графики на продвинутом уровне.',
    type: 'course',
    confidence: 92,
    tags: ['алгебра', 'математика', 'продвинутый уровень'],
  },
  {
    id: '2',
    title: 'Тест "Проверка знаний по геометрии"',
    description: 'Мы заметили, что вы давно не проверяли свои знания по геометрии. Рекомендуем пройти этот тест, чтобы освежить знания и выявить возможные пробелы перед продолжением обучения.',
    type: 'test',
    confidence: 78,
    tags: ['геометрия', 'математика', 'проверка знаний'],
  },
  {
    id: '3',
    title: 'Дополнительные материалы по английской грамматике',
    description: 'Судя по вашим ответам в последних тестах, у вас возникают трудности с временами в английском языке. Эти дополнительные материалы помогут вам лучше понять и закрепить эту тему.',
    type: 'resource',
    confidence: 85,
    tags: ['английский язык', 'грамматика', 'времена'],
  },
  {
    id: '4',
    title: 'Практика решения задач по физике',
    description: 'Для закрепления недавно изученного материала по механике рекомендуем выполнить эти практические задания. Они помогут вам лучше понять применение формул в реальных ситуациях.',
    type: 'practice',
    confidence: 88,
    tags: ['физика', 'механика', 'практика'],
  },
];

export default function RecommendationList() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(initialRecommendations);
  const [filter, setFilter] = useState<RecommendationType | 'all'>('all');

  // Фильтрация рекомендаций по типу
  const filteredRecommendations = filter === 'all'
    ? recommendations
    : recommendations.filter(rec => rec.type === filter);

  // Обработчик принятия рекомендации
  const handleAccept = (id: string) => {
    console.log(`Рекомендация ${id} принята`);
    // В реальном приложении здесь будет логика для сохранения выбора пользователя
    setRecommendations(recommendations.filter(rec => rec.id !== id));
  };

  // Обработчик отклонения рекомендации
  const handleDismiss = (id: string) => {
    console.log(`Рекомендация ${id} отклонена`);
    // В реальном приложении здесь будет логика для обратной связи с системой рекомендаций
    setRecommendations(recommendations.filter(rec => rec.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Персональные рекомендации</h2>
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as RecommendationType | 'all')}
            className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white text-sm"
          >
            <option value="all">Все типы</option>
            <option value="course">Курсы</option>
            <option value="test">Тесты</option>
            <option value="resource">Материалы</option>
            <option value="practice">Практика</option>
          </select>
        </div>
      </div>

      {filteredRecommendations.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredRecommendations.map((recommendation) => (
            <RecommendationCard
              key={recommendation.id}
              title={recommendation.title}
              description={recommendation.description}
              type={recommendation.type}
              confidence={recommendation.confidence}
              tags={recommendation.tags}
              onAccept={() => handleAccept(recommendation.id)}
              onDismiss={() => handleDismiss(recommendation.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            {filter === 'all'
              ? 'Нет доступных рекомендаций. Продолжайте обучение, чтобы получить персонализированные рекомендации.'
              : `Нет рекомендаций типа "${filter}". Попробуйте выбрать другой тип или "Все типы".`}
          </p>
        </div>
      )}
    </div>
  );
}
