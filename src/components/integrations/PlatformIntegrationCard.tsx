'use client';

import { useState } from 'react';
import { PlatformCourse } from '@/utils/platform-integrations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PlatformIntegrationCardProps {
  course: PlatformCourse;
  onImport: (courseId: string) => Promise<void>;
}

export function PlatformIntegrationCard({ course, onImport }: PlatformIntegrationCardProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleImport = async () => {
    setIsImporting(true);
    try {
      await onImport(course.id);
      setImportStatus('success');
    } catch (error) {
      console.error('Error importing course:', error);
      setImportStatus('error');
    } finally {
      setIsImporting(false);
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'coursera':
        return 'bg-blue-100 text-blue-800';
      case 'edx':
        return 'bg-red-100 text-red-800';
      case 'udemy':
        return 'bg-purple-100 text-purple-800';
      case 'khan-academy':
        return 'bg-green-100 text-green-800';
      case 'moodle':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      {course.imageUrl && (
        <div className="h-48 overflow-hidden">
          <img 
            src={course.imageUrl} 
            alt={course.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{course.title}</CardTitle>
          <Badge className={`${getPlatformColor(course.platform)}`}>
            {course.platform}
          </Badge>
        </div>
        <CardDescription>{course.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {course.instructors && course.instructors.length > 0 && (
            <div className="text-sm">
              <span className="font-medium">Преподаватели:</span> {course.instructors.join(', ')}
            </div>
          )}
          {course.duration && (
            <div className="text-sm">
              <span className="font-medium">Продолжительность:</span> {course.duration}
            </div>
          )}
          {course.level && (
            <div className="text-sm">
              <span className="font-medium">Уровень:</span> {course.level}
            </div>
          )}
          {course.topics && course.topics.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {course.topics.map((topic) => (
                <Badge key={topic} variant="outline" className="text-xs">
                  {topic}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(course.url, '_blank')}
        >
          Открыть на платформе
        </Button>
        <Button
          onClick={handleImport}
          disabled={isImporting || importStatus === 'success'}
          size="sm"
          className={
            importStatus === 'success'
              ? 'bg-green-600 hover:bg-green-700'
              : importStatus === 'error'
              ? 'bg-red-600 hover:bg-red-700'
              : ''
          }
        >
          {isImporting
            ? 'Импортирование...'
            : importStatus === 'success'
            ? 'Импортировано'
            : importStatus === 'error'
            ? 'Ошибка импорта'
            : 'Импортировать'}
        </Button>
      </CardFooter>
    </Card>
  );
}
