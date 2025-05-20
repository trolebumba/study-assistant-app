'use client';

import React from 'react';
import { GamificationProfile, Level, getAllLevels } from '@/utils/gamification';

interface LevelProgressProps {
  profile: GamificationProfile;
  className?: string;
}

export default function LevelProgress({ profile, className = '' }: LevelProgressProps) {
  // Получаем все уровни
  const levels = getAllLevels();
  
  // Находим текущий уровень
  const currentLevel = levels.find(level => level.level === profile.level) || levels[0];
  
  // Находим следующий уровень
  const nextLevelIndex = levels.findIndex(level => level.level === profile.level) + 1;
  const nextLevel = nextLevelIndex < levels.length ? levels[nextLevelIndex] : null;
  
  // Вычисляем прогресс до следующего уровня
  let progress = 0;
  if (nextLevel) {
    const pointsForCurrentLevel = profile.points - currentLevel.minPoints;
    const pointsNeededForNextLevel = nextLevel.minPoints - currentLevel.minPoints;
    progress = Math.min(100, Math.round((pointsForCurrentLevel / pointsNeededForNextLevel) * 100));
  } else {
    progress = 100; // Максимальный уровень
  }
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Уровень и прогресс</h2>
      </div>
      
      <div className="p-6">
        <div className="flex items-center space-x-4">
          {/* Иконка уровня */}
          <div className="w-16 h-16 rounded-full bg-beach-leaf text-white flex items-center justify-center text-2xl font-bold">
            {profile.level}
          </div>
          
          <div className="flex-1">
            {/* Название уровня */}
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {currentLevel.name}
            </h3>
            
            {/* Очки опыта */}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {profile.points} XP
              {nextLevel && ` / ${nextLevel.minPoints} XP для следующего уровня`}
            </p>
            
            {/* Прогресс-бар */}
            <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-beach-leaf dark:bg-beach-water rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Информация о следующем уровне */}
        {nextLevel && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Следующий уровень: {nextLevel.name} (Уровень {nextLevel.level})
            </h4>
            
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Осталось {nextLevel.minPoints - profile.points} XP
            </p>
            
            {nextLevel.rewards.length > 0 && (
              <div className="mt-2">
                <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Награды за следующий уровень:
                </h5>
                
                <ul className="mt-1 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  {nextLevel.rewards.map(reward => (
                    <li key={reward.id} className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-beach-leaf dark:text-beach-water mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      {reward.name} - {reward.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {/* Последние достижения */}
        {profile.achievements.unlocked.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Последние достижения:
            </h4>
            
            <div className="space-y-2">
              {profile.achievements.unlocked
                .sort((a, b) => (b.unlockedAt || 0) - (a.unlockedAt || 0))
                .slice(0, 3)
                .map(achievement => (
                  <div key={achievement.id} className="flex items-center p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-beach-leaf text-white flex items-center justify-center mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {achievement.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        +{achievement.points} XP • {new Date(achievement.unlockedAt!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
