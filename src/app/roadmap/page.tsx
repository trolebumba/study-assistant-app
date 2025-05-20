'use client';

import { useState } from 'react';
import { Roadmap } from '@/components/roadmap/Roadmap';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import { analytics, AnalyticsEventType } from '@/utils/analytics';

// Моковые данные для дорожной карты
const initialRoadmapItems = [
  {
    id: '1',
    title: 'Интеграция с Google Classroom',
    description: 'Добавление возможности импорта и экспорта данных из Google Classroom',
    status: 'in-progress' as const,
    category: 'Интеграции',
    priority: 'high' as const,
    estimatedDelivery: 'Q3 2023',
    votes: 156
  },
  {
    id: '2',
    title: 'Мобильное приложение',
    description: 'Разработка нативных мобильных приложений для iOS и Android',
    status: 'planned' as const,
    category: 'Платформы',
    priority: 'medium' as const,
    estimatedDelivery: 'Q4 2023',
    votes: 243
  },
  {
    id: '3',
    title: 'Улучшенная аналитика обучения',
    description: 'Расширенные отчеты и визуализации для отслеживания прогресса обучения',
    status: 'planned' as const,
    category: 'Аналитика',
    priority: 'medium' as const,
    estimatedDelivery: 'Q3 2023',
    votes: 98
  },
  {
    id: '4',
    title: 'Интеграция с Moodle',
    description: 'Добавление возможности импорта и экспорта данных из Moodle',
    status: 'planned' as const,
    category: 'Интеграции',
    priority: 'low' as const,
    estimatedDelivery: 'Q1 2024',
    votes: 67
  },
  {
    id: '5',
    title: 'Темная тема',
    description: 'Добавление темной темы для всего приложения',
    status: 'completed' as const,
    category: 'UI/UX',
    priority: 'low' as const,
    votes: 189
  },
  {
    id: '6',
    title: 'Улучшенный ИИ-ассистент',
    description: 'Обновление ИИ-ассистента с использованием более продвинутых моделей машинного обучения',
    status: 'in-progress' as const,
    category: 'ИИ',
    priority: 'high' as const,
    estimatedDelivery: 'Q3 2023',
    votes: 215
  },
  {
    id: '7',
    title: 'Групповое обучение',
    description: 'Возможность создания групп для совместного обучения и решения задач',
    status: 'planned' as const,
    category: 'Социальные функции',
    priority: 'medium' as const,
    estimatedDelivery: 'Q1 2024',
    votes: 132
  },
  {
    id: '8',
    title: 'Оффлайн-режим',
    description: 'Возможность использования приложения без подключения к интернету',
    status: 'planned' as const,
    category: 'Функциональность',
    priority: 'low' as const,
    estimatedDelivery: 'Q2 2024',
    votes: 87
  },
  {
    id: '9',
    title: 'Интеграция с календарем',
    description: 'Синхронизация с Google Calendar, Apple Calendar и другими календарями',
    status: 'completed' as const,
    category: 'Интеграции',
    priority: 'medium' as const,
    votes: 145
  },
  {
    id: '10',
    title: 'Расширенные настройки приватности',
    description: 'Дополнительные опции для контроля доступа к данным пользователя',
    status: 'in-progress' as const,
    category: 'Безопасность',
    priority: 'high' as const,
    estimatedDelivery: 'Q3 2023',
    votes: 178
  }
];

export default function RoadmapPage() {
  const [roadmapItems, setRoadmapItems] = useState(initialRoadmapItems);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [category, setCategory] = useState('Функциональность');
  const { toast } = useToast();

  // Обработчик голосования
  const handleVote = (itemId: string) => {
    setRoadmapItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, votes: item.votes + 1 }
          : item
      )
    );

    // Отслеживаем событие голосования
    analytics.trackEvent(AnalyticsEventType.BUTTON_CLICK, {
      button_name: 'roadmap_vote',
      item_id: itemId
    });

    toast({
      title: 'Голос учтен',
      description: 'Спасибо за ваш голос!',
    });
  };

  // Обработчик отправки предложения
  const handleSubmitSuggestion = () => {
    if (!suggestion.trim()) return;

    // Отслеживаем событие отправки предложения
    analytics.trackEvent(AnalyticsEventType.ROADMAP_SUGGESTION, {
      category,
      suggestion_length: suggestion.length
    });

    toast({
      title: 'Предложение отправлено',
      description: 'Спасибо за ваше предложение! Мы рассмотрим его в ближайшее время.',
    });

    setSuggestion('');
    setCategory('Функциональность');
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Дорожная карта развития</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Следите за развитием приложения и голосуйте за функции, которые вы хотели бы видеть в будущих обновлениях.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Предложить функцию</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Предложить новую функцию</DialogTitle>
              <DialogDescription>
                Опишите функцию, которую вы хотели бы видеть в приложении. Мы рассмотрим ваше предложение и, возможно, добавим его в дорожную карту.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="suggestion">Описание функции</Label>
                <Textarea
                  id="suggestion"
                  placeholder="Опишите функцию, которую вы хотели бы видеть в приложении..."
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label>Категория</Label>
                <RadioGroup
                  value={category}
                  onValueChange={setCategory}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Функциональность" id="functionality" />
                    <Label htmlFor="functionality">Функциональность</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="UI/UX" id="ui-ux" />
                    <Label htmlFor="ui-ux">UI/UX</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Интеграции" id="integrations" />
                    <Label htmlFor="integrations">Интеграции</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ИИ" id="ai" />
                    <Label htmlFor="ai">ИИ</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Другое" id="other" />
                    <Label htmlFor="other">Другое</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                onClick={handleSubmitSuggestion}
                disabled={!suggestion.trim()}
              >
                Отправить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Roadmap items={roadmapItems} onVote={handleVote} />
    </div>
  );
}
