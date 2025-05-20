'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'planned' | 'in-progress' | 'completed';
  category: string;
  priority: 'low' | 'medium' | 'high';
  estimatedDelivery?: string;
  votes: number;
}

interface RoadmapProps {
  items: RoadmapItem[];
  onVote?: (itemId: string) => void;
}

export function Roadmap({ items, onVote }: RoadmapProps) {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'votes' | 'status'>('priority');

  // Фильтрация элементов по активной вкладке
  const filteredItems = activeTab === 'all'
    ? items
    : items.filter(item => 
        activeTab === 'planned' ? item.status === 'planned' :
        activeTab === 'in-progress' ? item.status === 'in-progress' :
        activeTab === 'completed' ? item.status === 'completed' :
        item.category === activeTab
      );

  // Сортировка элементов
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    } else if (sortBy === 'votes') {
      return b.votes - a.votes;
    } else {
      const statusOrder = { 'in-progress': 0, 'planned': 1, 'completed': 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    }
  });

  // Получение уникальных категорий
  const categories = Array.from(new Set(items.map(item => item.category)));

  // Обработчик голосования
  const handleVote = (itemId: string) => {
    if (onVote) {
      onVote(itemId);
    }
  };

  // Получение цвета для статуса
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Получение цвета для приоритета
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Дорожная карта развития</h2>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Сортировать по:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'priority' | 'votes' | 'status')}
            className="px-2 py-1 border rounded-md text-sm"
          >
            <option value="priority">Приоритету</option>
            <option value="votes">Голосам</option>
            <option value="status">Статусу</option>
          </select>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 flex flex-wrap">
          <TabsTrigger value="all">Все</TabsTrigger>
          <TabsTrigger value="planned">Запланировано</TabsTrigger>
          <TabsTrigger value="in-progress">В разработке</TabsTrigger>
          <TabsTrigger value="completed">Завершено</TabsTrigger>
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <div className="grid grid-cols-1 gap-4">
            {sortedItems.map(item => (
              <Card key={item.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(item.status)}>
                        {item.status === 'planned' ? 'Запланировано' :
                         item.status === 'in-progress' ? 'В разработке' : 'Завершено'}
                      </Badge>
                      <Badge className={getPriorityColor(item.priority)}>
                        {item.priority === 'high' ? 'Высокий' :
                         item.priority === 'medium' ? 'Средний' : 'Низкий'}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{item.category}</Badge>
                      {item.estimatedDelivery && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Ожидается: {item.estimatedDelivery}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{item.votes} голосов</span>
                      {item.status !== 'completed' && onVote && (
                        <button
                          onClick={() => handleVote(item.id)}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                        >
                          Голосовать
                        </button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
