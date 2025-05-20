'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { trackEvent, AnalyticsEventType } from '@/utils/analytics';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  category: 'learning' | 'testing' | 'engagement' | 'special';
  reward?: {
    type: 'points' | 'badge' | 'level' | 'feature';
    value: number | string;
  };
  dateUnlocked?: string;
}

interface AchievementCardProps {
  achievement: Achievement;
  onShare?: (achievement: Achievement) => void;
}

export default function AchievementCard({ achievement, onShare }: AchievementCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const progressPercentage = Math.min(
    Math.round((achievement.progress / achievement.maxProgress) * 100),
    100
  );
  
  const categoryColors = {
    learning: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    testing: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    engagement: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    special: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  };
  
  const handleShare = () => {
    if (onShare) {
      onShare(achievement);
    }
    
    // Отслеживание события в аналитике
    trackEvent(AnalyticsEventType.BUTTON_CLICK, {
      button_name: 'share_achievement',
      achievement_id: achievement.id,
      achievement_title: achievement.title,
    });
  };
  
  return (
    <Card className={`overflow-hidden transition-all duration-300 ${achievement.unlocked ? 'border-2 border-yellow-400 dark:border-yellow-600' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="mr-3 text-2xl" aria-hidden="true">
              {achievement.icon}
            </div>
            <div>
              <CardTitle className="text-lg">{achievement.title}</CardTitle>
              <Badge className={`mt-1 ${categoryColors[achievement.category]}`}>
                {achievement.category === 'learning' && 'Обучение'}
                {achievement.category === 'testing' && 'Тестирование'}
                {achievement.category === 'engagement' && 'Активность'}
                {achievement.category === 'special' && 'Особое'}
              </Badge>
            </div>
          </div>
          {achievement.unlocked && (
            <div className="flex items-center">
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-300">
                Разблокировано
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-2">
        <CardDescription className={`${isExpanded ? '' : 'line-clamp-2'}`}>
          {achievement.description}
        </CardDescription>
        
        {achievement.description.length > 100 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-500 hover:text-blue-700 text-xs mt-1"
          >
            {isExpanded ? 'Свернуть' : 'Развернуть'}
          </button>
        )}
        
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Прогресс</span>
            <span>{achievement.progress} / {achievement.maxProgress}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        {achievement.reward && (
          <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
            <p className="text-sm font-medium">Награда:</p>
            <p className="text-sm">
              {achievement.reward.type === 'points' && `${achievement.reward.value} очков`}
              {achievement.reward.type === 'badge' && `Значок "${achievement.reward.value}"`}
              {achievement.reward.type === 'level' && `Уровень ${achievement.reward.value}`}
              {achievement.reward.type === 'feature' && `Доступ к "${achievement.reward.value}"`}
            </p>
          </div>
        )}
        
        {achievement.unlocked && achievement.dateUnlocked && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Получено: {achievement.dateUnlocked}
          </p>
        )}
      </CardContent>
      
      {achievement.unlocked && (
        <CardFooter className="pt-0">
          <Button variant="outline" size="sm" onClick={handleShare} className="w-full">
            Поделиться
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
