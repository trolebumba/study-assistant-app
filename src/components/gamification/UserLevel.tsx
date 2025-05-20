'use client';

import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface UserLevelProps {
  level: number;
  experience: number;
  experienceToNextLevel: number;
  rank: string;
  streak: number;
  totalPoints: number;
}

export default function UserLevel({
  level,
  experience,
  experienceToNextLevel,
  rank,
  streak,
  totalPoints,
}: UserLevelProps) {
  // Расчет процента до следующего уровня
  const progressPercentage = Math.min(
    Math.round((experience / experienceToNextLevel) * 100),
    100
  );
  
  // Определение цвета ранга
  const rankColors = {
    'Новичок': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    'Ученик': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'Студент': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'Исследователь': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'Мастер': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'Эксперт': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    'Гений': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  };
  
  const rankColor = rankColors[rank as keyof typeof rankColors] || rankColors['Новичок'];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Ваш прогресс</CardTitle>
          <Badge className={rankColor}>{rank}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 text-xl font-bold mr-3">
              {level}
            </div>
            <div>
              <p className="font-medium">Уровень {level}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {experience} / {experienceToNextLevel} XP
              </p>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center cursor-help">
                  <span className="text-orange-500 mr-1">🔥</span>
                  <span className="font-medium">{streak}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Серия дней обучения подряд</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <Progress value={progressPercentage} className="h-2 mb-4" />
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Всего очков</p>
            <p className="text-xl font-bold">{totalPoints}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">До уровня {level + 1}</p>
            <p className="text-xl font-bold">{experienceToNextLevel - experience} XP</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
