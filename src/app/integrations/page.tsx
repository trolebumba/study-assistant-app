'use client';

import { useState, useEffect } from 'react';
import { 
  PlatformCourse, 
  PlatformType, 
  createPlatformIntegration 
} from '@/utils/platform-integrations';
import { PlatformIntegrationList } from '@/components/integrations/PlatformIntegrationList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export default function IntegrationsPage() {
  const [courses, setCourses] = useState<PlatformCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        // Создаем интеграции для разных платформ
        const courseraIntegration = createPlatformIntegration('coursera', {});
        const edxIntegration = createPlatformIntegration('edx', {});
        const udemyIntegration = createPlatformIntegration('udemy', {});
        
        // Получаем курсы с разных платформ
        const [courseraСourses, edxCourses, udemyCourses] = await Promise.all([
          courseraIntegration.getCourses(),
          edxIntegration.getCourses(),
          udemyIntegration.getCourses()
        ]);
        
        setCourses([...courseraСourses, ...edxCourses, ...udemyCourses]);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast({
          title: 'Ошибка загрузки курсов',
          description: 'Не удалось загрузить курсы с образовательных платформ',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [toast]);

  const handleImportCourse = async (courseId: string) => {
    try {
      const course = courses.find(c => c.id === courseId);
      if (!course) throw new Error('Курс не найден');
      
      const integration = createPlatformIntegration(course.platform, {});
      const result = await integration.importCourse(courseId);
      
      if (result.success) {
        toast({
          title: 'Курс импортирован',
          description: result.message,
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error importing course:', error);
      toast({
        title: 'Ошибка импорта',
        description: error instanceof Error ? error.message : 'Не удалось импортировать курс',
        variant: 'destructive',
      });
    }
  };

  const handleLoadMore = async (platform: PlatformType) => {
    const integration = createPlatformIntegration(platform, {});
    // Получаем дополнительные курсы, исключая уже загруженные
    const existingIds = courses.filter(c => c.platform === platform).map(c => c.id);
    const allCourses = await integration.getCourses();
    return allCourses.filter(c => !existingIds.includes(c.id));
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Интеграции с образовательными платформами</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Импорт курсов</CardTitle>
            <CardDescription>
              Импортируйте курсы с популярных образовательных платформ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Выберите курсы, которые хотите добавить в свой учебный план
            </p>
            <Button variant="outline" size="sm">
              Настроить интеграции
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Синхронизация прогресса</CardTitle>
            <CardDescription>
              Синхронизируйте свой прогресс между платформами
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Отслеживайте свой прогресс на всех платформах в одном месте
            </p>
            <Button variant="outline" size="sm">
              Настроить синхронизацию
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Экспорт данных</CardTitle>
            <CardDescription>
              Экспортируйте свои данные на другие платформы
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Поделитесь своими достижениями и прогрессом с другими платформами
            </p>
            <Button variant="outline" size="sm">
              Настроить экспорт
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <PlatformIntegrationList
          initialCourses={courses}
          onImport={handleImportCourse}
          onLoadMore={handleLoadMore}
        />
      )}
    </div>
  );
}
