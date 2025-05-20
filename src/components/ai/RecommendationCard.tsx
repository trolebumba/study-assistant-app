'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

interface RecommendationCardProps {
  title: string;
  description: string;
  type: 'course' | 'test' | 'resource' | 'practice';
  confidence: number; // 0-100
  tags?: string[];
  onAccept?: () => void;
  onDismiss?: () => void;
}

export default function RecommendationCard({
  title,
  description,
  type,
  confidence,
  tags = [],
  onAccept,
  onDismiss,
}: RecommendationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return null;
  }

  // Иконки для разных типов рекомендаций
  const typeIcons = {
    course: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    test: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    resource: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
    practice: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
  };

  // Цвета для разных типов рекомендаций
  const typeColors = {
    course: 'text-blue-500 dark:text-blue-400',
    test: 'text-green-500 dark:text-green-400',
    resource: 'text-purple-500 dark:text-purple-400',
    practice: 'text-orange-500 dark:text-orange-400',
  };

  // Определение цвета индикатора уверенности
  const getConfidenceColor = () => {
    if (confidence >= 80) return 'bg-green-500';
    if (confidence >= 60) return 'bg-blue-500';
    if (confidence >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleAccept = () => {
    if (onAccept) onAccept();
    setIsDismissed(true);
  };

  const handleDismiss = () => {
    if (onDismiss) onDismiss();
    setIsDismissed(true);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className={`mr-3 ${typeColors[type]}`}>{typeIcons[type]}</div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <div className="flex items-center">
            <div className="text-xs text-gray-500 dark:text-gray-400 mr-2">ИИ-уверенность:</div>
            <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${getConfidenceColor()}`}
                style={{ width: `${confidence}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <p className={`text-gray-600 dark:text-gray-400 text-sm ${isExpanded ? '' : 'line-clamp-2'}`}>
          {description}
        </p>
        {description.length > 150 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-500 hover:text-blue-700 text-xs mt-1"
          >
            {isExpanded ? 'Свернуть' : 'Развернуть'}
          </button>
        )}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" size="sm" onClick={handleDismiss}>
          Пропустить
        </Button>
        <Button size="sm" onClick={handleAccept}>
          Принять рекомендацию
        </Button>
      </CardFooter>
    </Card>
  );
}
