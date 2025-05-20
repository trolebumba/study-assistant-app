'use client';

import React, { useState } from 'react';
import { 
  Achievement, 
  AchievementType, 
  AchievementRarity,
  getAllAchievements
} from '@/utils/gamification';

interface AchievementsProps {
  unlockedAchievements: Achievement[];
  className?: string;
}

export default function Achievements({ unlockedAchievements, className = '' }: AchievementsProps) {
  const [filter, setFilter] = useState<AchievementType | 'all'>('all');
  const [showHidden, setShowHidden] = useState(false);
  
  // Получаем все достижения
  const allAchievements = getAllAchievements();
  
  // Получаем ID разблокированных достижений
  const unlockedIds = unlockedAchievements.map(a => a.id);
  
  // Фильтруем достижения
  const filteredAchievements = allAchievements.filter(achievement => {
    // Фильтр по типу
    const typeMatch = filter === 'all' || achievement.type === filter;
    
    // Фильтр по скрытым достижениям
    const hiddenMatch = showHidden || !achievement.hidden || unlockedIds.includes(achievement.id);
    
    return typeMatch && hiddenMatch;
  });
  
  // Сортируем достижения: сначала разблокированные, затем по редкости
  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    // Сначала разблокированные
    const aUnlocked = unlockedIds.includes(a.id);
    const bUnlocked = unlockedIds.includes(b.id);
    
    if (aUnlocked && !bUnlocked) return -1;
    if (!aUnlocked && bUnlocked) return 1;
    
    // Затем по редкости (от легендарных к обычным)
    const rarityOrder = {
      [AchievementRarity.LEGENDARY]: 0,
      [AchievementRarity.EPIC]: 1,
      [AchievementRarity.RARE]: 2,
      [AchievementRarity.UNCOMMON]: 3,
      [AchievementRarity.COMMON]: 4,
    };
    
    return rarityOrder[a.rarity] - rarityOrder[b.rarity];
  });
  
  // Получаем цвет для редкости достижения
  const getRarityColor = (rarity: AchievementRarity): string => {
    switch (rarity) {
      case AchievementRarity.COMMON:
        return 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
      case AchievementRarity.UNCOMMON:
        return 'bg-green-200 dark:bg-green-900/30 text-green-800 dark:text-green-200';
      case AchievementRarity.RARE:
        return 'bg-blue-200 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200';
      case AchievementRarity.EPIC:
        return 'bg-purple-200 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200';
      case AchievementRarity.LEGENDARY:
        return 'bg-yellow-200 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200';
    }
  };
  
  // Получаем иконку для типа достижения
  const getTypeIcon = (type: AchievementType): JSX.Element => {
    switch (type) {
      case AchievementType.COMPLETION:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case AchievementType.STREAK:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case AchievementType.MASTERY:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      case AchievementType.SPEED:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case AchievementType.ACCURACY:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case AchievementType.EXPLORATION:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        );
      case AchievementType.SOCIAL:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case AchievementType.SPECIAL:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
    }
  };
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Достижения</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Разблокировано {unlockedAchievements.length} из {allAchievements.length} достижений
        </p>
      </div>
      
      <div className="p-6">
        {/* Фильтры */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'all'
                ? 'bg-beach-leaf text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            } transition-colors`}
          >
            Все
          </button>
          
          <button
            onClick={() => setFilter(AchievementType.COMPLETION)}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === AchievementType.COMPLETION
                ? 'bg-beach-leaf text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            } transition-colors`}
          >
            Завершение
          </button>
          
          <button
            onClick={() => setFilter(AchievementType.STREAK)}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === AchievementType.STREAK
                ? 'bg-beach-leaf text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            } transition-colors`}
          >
            Серии
          </button>
          
          <button
            onClick={() => setFilter(AchievementType.MASTERY)}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === AchievementType.MASTERY
                ? 'bg-beach-leaf text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            } transition-colors`}
          >
            Мастерство
          </button>
          
          <button
            onClick={() => setFilter(AchievementType.ACCURACY)}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === AchievementType.ACCURACY
                ? 'bg-beach-leaf text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            } transition-colors`}
          >
            Точность
          </button>
          
          <button
            onClick={() => setFilter(AchievementType.EXPLORATION)}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === AchievementType.EXPLORATION
                ? 'bg-beach-leaf text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            } transition-colors`}
          >
            Исследование
          </button>
          
          <button
            onClick={() => setShowHidden(!showHidden)}
            className={`px-3 py-1 text-sm rounded-full ${
              showHidden
                ? 'bg-beach-leaf text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            } transition-colors`}
          >
            {showHidden ? 'Скрыть секретные' : 'Показать секретные'}
          </button>
        </div>
        
        {/* Список достижений */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedAchievements.map((achievement) => {
            const isUnlocked = unlockedIds.includes(achievement.id);
            const isHidden = achievement.hidden && !isUnlocked;
            
            return (
              <div 
                key={achievement.id}
                className={`border rounded-lg overflow-hidden ${
                  isUnlocked
                    ? 'border-beach-leaf dark:border-beach-water'
                    : 'border-gray-200 dark:border-gray-700'
                } ${
                  isHidden ? 'bg-gray-100 dark:bg-gray-900/50' : 'bg-white dark:bg-gray-800'
                }`}
              >
                <div className="p-4 flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    isUnlocked
                      ? 'bg-beach-leaf text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}>
                    {getTypeIcon(achievement.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-medium ${
                        isHidden
                          ? 'text-gray-500 dark:text-gray-400'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {isHidden ? '???' : achievement.name}
                      </h3>
                      
                      <span className={`text-xs px-2 py-1 rounded-full ${getRarityColor(achievement.rarity)}`}>
                        {achievement.rarity === AchievementRarity.COMMON ? 'Обычное' :
                         achievement.rarity === AchievementRarity.UNCOMMON ? 'Необычное' :
                         achievement.rarity === AchievementRarity.RARE ? 'Редкое' :
                         achievement.rarity === AchievementRarity.EPIC ? 'Эпическое' :
                         'Легендарное'}
                      </span>
                    </div>
                    
                    <p className={`text-sm mt-1 ${
                      isHidden
                        ? 'text-gray-400 dark:text-gray-500'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {isHidden ? 'Секретное достижение' : achievement.description}
                    </p>
                    
                    <div className="mt-2 flex items-center justify-between">
                      <span className={`text-xs ${
                        isUnlocked
                          ? 'text-beach-leaf dark:text-beach-water'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {isUnlocked
                          ? `Получено ${new Date(achievement.unlockedAt!).toLocaleDateString()}`
                          : isHidden
                            ? '???'
                            : `${achievement.requirements.condition}: ${achievement.requirements.value}`
                        }
                      </span>
                      
                      <span className="text-xs font-medium text-beach-leaf dark:text-beach-water">
                        +{achievement.points} XP
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
