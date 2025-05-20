'use client';

import { useState, useEffect } from 'react';
import { PlatformCourse, PlatformType } from '@/utils/platform-integrations';
import { PlatformIntegrationCard } from './PlatformIntegrationCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

interface PlatformIntegrationListProps {
  initialCourses?: PlatformCourse[];
  onImport: (courseId: string) => Promise<void>;
  onLoadMore?: (platform: PlatformType) => Promise<PlatformCourse[]>;
}

export function PlatformIntegrationList({
  initialCourses = [],
  onImport,
  onLoadMore,
}: PlatformIntegrationListProps) {
  const [courses, setCourses] = useState<PlatformCourse[]>(initialCourses);
  const [activePlatform, setActivePlatform] = useState<PlatformType>('coursera');
  const [isLoading, setIsLoading] = useState(false);

  // Группировка курсов по платформам
  const coursesByPlatform = courses.reduce<Record<string, PlatformCourse[]>>((acc, course) => {
    if (!acc[course.platform]) {
      acc[course.platform] = [];
    }
    acc[course.platform].push(course);
    return acc;
  }, {});

  // Получение уникальных платформ
  const platforms = Object.keys(coursesByPlatform) as PlatformType[];

  const handleLoadMore = async () => {
    if (!onLoadMore) return;
    
    setIsLoading(true);
    try {
      const newCourses = await onLoadMore(activePlatform);
      setCourses((prev) => [...prev, ...newCourses]);
    } catch (error) {
      console.error('Error loading more courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue={platforms[0] || 'coursera'} onValueChange={(value) => setActivePlatform(value as PlatformType)}>
        <TabsList className="mb-4">
          {platforms.map((platform) => (
            <TabsTrigger key={platform} value={platform} className="capitalize">
              {platform.replace('-', ' ')}
            </TabsTrigger>
          ))}
        </TabsList>

        {platforms.map((platform) => (
          <TabsContent key={platform} value={platform}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesByPlatform[platform]?.map((course) => (
                <PlatformIntegrationCard
                  key={course.id}
                  course={course}
                  onImport={onImport}
                />
              ))}
            </div>
            
            {onLoadMore && (
              <div className="mt-8 text-center">
                <Button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  variant="outline"
                >
                  {isLoading ? 'Загрузка...' : 'Загрузить еще'}
                </Button>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
