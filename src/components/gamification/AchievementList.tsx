'use client';

import { useState } from 'react';
import AchievementCard, { Achievement } from './AchievementCard';
import { Button } from '@/components/ui/button';
import { trackEvent, AnalyticsEventType } from '@/utils/analytics';

// Моковые данные для достижений
const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'Первые шаги',
    description: 'Завершите свой первый урок и начните путь к знаниям.',
    icon: '🚀',
    progress: 1,
    maxProgress: 1,
    unlocked: true,
    category: 'learning',
    reward: {
      type: 'points',
      value: 50,
    },
    dateUnlocked: '15.05.2023',
  },
  {
    id: '2',
    title: 'Постоянство',
    description: 'Занимайтесь 7 дней подряд без перерыва. Регулярность - ключ к успеху!',
    icon: '📅',
    progress: 5,
    maxProgress: 7,
    unlocked: false,
    category: 'engagement',
    reward: {
      type: 'badge',
      value: 'Настойчивый ученик',
    },
  },
  {
    id: '3',
    title: 'Мастер тестов',
    description: 'Получите 100% в пяти различных тестах. Покажите свои знания!',
    icon: '🏆',
    progress: 3,
    maxProgress: 5,
    unlocked: false,
    category: 'testing',
    reward: {
      type: 'feature',
      value: 'Расширенная статистика',
    },
  },
  {
    id: '4',
    title: 'Исследователь',
    description: 'Изучите материалы по 10 различным темам. Расширяйте свои горизонты!',
    icon: '🔍',
    progress: 10,
    maxProgress: 10,
    unlocked: true,
    category: 'learning',
    reward: {
      type: 'points',
      value: 200,
    },
    dateUnlocked: '20.05.2023',
  },
  {
    id: '5',
    title: 'Ночной совенок',
    description: 'Занимайтесь после 22:00 пять раз. Учеба не знает времени!',
    icon: '🦉',
    progress: 2,
    maxProgress: 5,
    unlocked: false,
    category: 'special',
    reward: {
      type: 'badge',
      value: 'Ночной режим',
    },
  },
  {
    id: '6',
    title: 'Социальная бабочка',
    description: 'Поделитесь своими достижениями в социальных сетях 3 раза.',
    icon: '🦋',
    progress: 1,
    maxProgress: 3,
    unlocked: false,
    category: 'engagement',
    reward: {
      type: 'points',
      value: 100,
    },
  },
];

type FilterType = 'all' | 'unlocked' | 'in-progress' | 'learning' | 'testing' | 'engagement' | 'special';

export default function AchievementList() {
  const [achievements] = useState<Achievement[]>(mockAchievements);
  const [filter, setFilter] = useState<FilterType>('all');
  
  // Фильтрация достижений
  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'all') return true;
    if (filter === 'unlocked') return achievement.unlocked;
    if (filter === 'in-progress') return !achievement.unlocked && achievement.progress > 0;
    return achievement.category === filter;
  });
  
  // Обработчик для кнопки "Поделиться"
  const handleShare = (achievement: Achievement) => {
    // В реальном приложении здесь будет логика для шаринга в соцсети
    console.log(`Sharing achievement: ${achievement.title}`);
    
    // Отслеживание события в аналитике
    trackEvent(AnalyticsEventType.BUTTON_CLICK, {
      button_name: 'share_achievement',
      achievement_id: achievement.id,
      achievement_title: achievement.title,
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Достижения</h2>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('all')}
          >
            Все
          </Button>
          <Button 
            variant={filter === 'unlocked' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('unlocked')}
          >
            Разблокированные
          </Button>
          <Button 
            variant={filter === 'in-progress' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('in-progress')}
          >
            В процессе
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <Button 
          variant={filter === 'learning' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('learning')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Обучение
        </Button>
        <Button 
          variant={filter === 'testing' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('testing')}
          className="bg-green-600 hover:bg-green-700"
        >
          Тестирование
        </Button>
        <Button 
          variant={filter === 'engagement' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('engagement')}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Активность
        </Button>
        <Button 
          variant={filter === 'special' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('special')}
          className="bg-amber-600 hover:bg-amber-700"
        >
          Особые
        </Button>
      </div>
      
      {filteredAchievements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              onShare={handleShare}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            {filter === 'unlocked' 
              ? 'У вас пока нет разблокированных достижений. Продолжайте обучение!' 
              : filter === 'in-progress'
                ? 'У вас нет достижений в процессе выполнения.'
                : `Нет достижений в категории "${filter}".`}
          </p>
        </div>
      )}
    </div>
  );
}
