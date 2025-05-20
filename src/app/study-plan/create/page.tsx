'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainNavigation from '@/components/MainNavigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

// Типы для учебного плана
type LessonType = 'theory' | 'practice' | 'test';

type Lesson = {
  id: string;
  title: string;
  description: string;
  duration: number; // в минутах
  type: LessonType;
};

type Module = {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
};

type StudyPlan = {
  title: string;
  description: string;
  subject: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // в часах
  modules: Module[];
};

export default function CreateStudyPlanPage() {
  const router = useRouter();
  
  // Состояние для учебного плана
  const [studyPlan, setStudyPlan] = useState<StudyPlan>({
    title: '',
    description: '',
    subject: '',
    difficulty: 'intermediate',
    estimatedDuration: 0,
    modules: [],
  });
  
  // Состояние для текущего редактируемого модуля
  const [currentModule, setCurrentModule] = useState<Module>({
    id: Date.now().toString(),
    title: '',
    description: '',
    lessons: [],
  });
  
  // Состояние для текущего редактируемого урока
  const [currentLesson, setCurrentLesson] = useState<Lesson>({
    id: Date.now().toString(),
    title: '',
    description: '',
    duration: 30,
    type: 'theory',
  });
  
  // Состояние для отображения формы урока
  const [showLessonForm, setShowLessonForm] = useState(false);
  
  // Обработчик изменения основной информации о плане
  const handlePlanChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStudyPlan({
      ...studyPlan,
      [name]: name === 'estimatedDuration' ? parseInt(value) || 0 : value,
    });
  };
  
  // Обработчик изменения модуля
  const handleModuleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentModule({
      ...currentModule,
      [name]: value,
    });
  };
  
  // Обработчик изменения урока
  const handleLessonChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentLesson({
      ...currentLesson,
      [name]: name === 'duration' ? parseInt(value) || 0 : value,
    });
  };
  
  // Добавление урока в модуль
  const addLesson = () => {
    if (!currentLesson.title) {
      alert('Пожалуйста, введите название урока');
      return;
    }
    
    setCurrentModule({
      ...currentModule,
      lessons: [...currentModule.lessons, { ...currentLesson }],
    });
    
    // Сброс текущего урока
    setCurrentLesson({
      id: Date.now().toString(),
      title: '',
      description: '',
      duration: 30,
      type: 'theory',
    });
    
    setShowLessonForm(false);
  };
  
  // Добавление модуля в план
  const addModule = () => {
    if (!currentModule.title) {
      alert('Пожалуйста, введите название модуля');
      return;
    }
    
    if (currentModule.lessons.length === 0) {
      alert('Пожалуйста, добавьте хотя бы один урок в модуль');
      return;
    }
    
    setStudyPlan({
      ...studyPlan,
      modules: [...studyPlan.modules, { ...currentModule }],
    });
    
    // Сброс текущего модуля
    setCurrentModule({
      id: Date.now().toString(),
      title: '',
      description: '',
      lessons: [],
    });
  };
  
  // Удаление урока из текущего модуля
  const removeLesson = (lessonId: string) => {
    setCurrentModule({
      ...currentModule,
      lessons: currentModule.lessons.filter(lesson => lesson.id !== lessonId),
    });
  };
  
  // Удаление модуля из плана
  const removeModule = (moduleId: string) => {
    setStudyPlan({
      ...studyPlan,
      modules: studyPlan.modules.filter(module => module.id !== moduleId),
    });
  };
  
  // Расчет общей продолжительности плана
  const calculateTotalDuration = () => {
    let totalMinutes = 0;
    
    studyPlan.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        totalMinutes += lesson.duration;
      });
    });
    
    // Добавляем уроки из текущего модуля
    currentModule.lessons.forEach(lesson => {
      totalMinutes += lesson.duration;
    });
    
    // Конвертируем минуты в часы
    return Math.ceil(totalMinutes / 60);
  };
  
  // Обновление общей продолжительности при изменении плана
  const updateEstimatedDuration = () => {
    const totalHours = calculateTotalDuration();
    
    if (studyPlan.estimatedDuration !== totalHours) {
      setStudyPlan({
        ...studyPlan,
        estimatedDuration: totalHours,
      });
    }
  };
  
  // Сохранение учебного плана
  const saveStudyPlan = () => {
    if (!studyPlan.title || !studyPlan.subject || studyPlan.modules.length === 0) {
      alert('Пожалуйста, заполните все обязательные поля и добавьте хотя бы один модуль');
      return;
    }
    
    // Обновляем продолжительность перед сохранением
    const finalPlan = {
      ...studyPlan,
      estimatedDuration: calculateTotalDuration(),
    };
    
    // Здесь будет логика сохранения плана в базу данных
    console.log('Сохранение учебного плана:', finalPlan);
    
    // Перенаправление на страницу учебных планов
    alert('Учебный план успешно создан!');
    router.push('/study-plan');
  };
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <MainNavigation />
      
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Создание учебного плана</h1>
          </div>
        </header>
        
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Основная информация</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Название плана *
                      </label>
                      <input
                        id="title"
                        name="title"
                        type="text"
                        value={studyPlan.title}
                        onChange={handlePlanChange}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                        placeholder="Например: Подготовка к ЕГЭ по математике"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Описание плана
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={studyPlan.description}
                        onChange={handlePlanChange}
                        rows={3}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                        placeholder="Краткое описание учебного плана"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Предмет *
                      </label>
                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        value={studyPlan.subject}
                        onChange={handlePlanChange}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                        placeholder="Например: Математика"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Уровень сложности
                      </label>
                      <select
                        id="difficulty"
                        name="difficulty"
                        value={studyPlan.difficulty}
                        onChange={handlePlanChange}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                      >
                        <option value="beginner">Начальный</option>
                        <option value="intermediate">Средний</option>
                        <option value="advanced">Продвинутый</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="estimatedDuration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Примерная продолжительность (часов)
                      </label>
                      <input
                        id="estimatedDuration"
                        name="estimatedDuration"
                        type="number"
                        value={studyPlan.estimatedDuration}
                        onChange={handlePlanChange}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                        placeholder="Автоматически рассчитывается на основе уроков"
                        readOnly
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Добавление модуля</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="moduleTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Название модуля *
                      </label>
                      <input
                        id="moduleTitle"
                        name="title"
                        type="text"
                        value={currentModule.title}
                        onChange={handleModuleChange}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                        placeholder="Например: Основы алгебры"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="moduleDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Описание модуля
                      </label>
                      <textarea
                        id="moduleDescription"
                        name="description"
                        value={currentModule.description}
                        onChange={handleModuleChange}
                        rows={2}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                        placeholder="Краткое описание модуля"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Уроки в модуле ({currentModule.lessons.length})
                        </label>
                        <Button
                          variant="outline"
                          onClick={() => setShowLessonForm(true)}
                          className="text-sm"
                        >
                          Добавить урок
                        </Button>
                      </div>
                      
                      {currentModule.lessons.length > 0 ? (
                        <div className="space-y-2 mb-4">
                          {currentModule.lessons.map((lesson) => (
                            <div key={lesson.id} className="flex justify-between items-center p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                              <div>
                                <div className="flex items-center">
                                  <span className="mr-2">
                                    {lesson.type === 'theory' ? '📚' : lesson.type === 'practice' ? '✏️' : '📝'}
                                  </span>
                                  <span className="font-medium">{lesson.title}</span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{lesson.description}</p>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{lesson.duration} мин</span>
                              </div>
                              <button
                                onClick={() => removeLesson(lesson.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-md">
                          Нет добавленных уроков. Добавьте хотя бы один урок для создания модуля.
                        </p>
                      )}
                      
                      {showLessonForm && (
                        <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                          <h4 className="font-medium mb-3">Новый урок</h4>
                          <div className="space-y-3">
                            <div>
                              <label htmlFor="lessonTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Название урока *
                              </label>
                              <input
                                id="lessonTitle"
                                name="title"
                                type="text"
                                value={currentLesson.title}
                                onChange={handleLessonChange}
                                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                                placeholder="Название урока"
                                required
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="lessonDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Описание урока
                              </label>
                              <input
                                id="lessonDescription"
                                name="description"
                                type="text"
                                value={currentLesson.description}
                                onChange={handleLessonChange}
                                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                                placeholder="Краткое описание урока"
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label htmlFor="lessonType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Тип урока
                                </label>
                                <select
                                  id="lessonType"
                                  name="type"
                                  value={currentLesson.type}
                                  onChange={handleLessonChange}
                                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                                >
                                  <option value="theory">Теория</option>
                                  <option value="practice">Практика</option>
                                  <option value="test">Тест</option>
                                </select>
                              </div>
                              
                              <div>
                                <label htmlFor="lessonDuration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Длительность (мин)
                                </label>
                                <input
                                  id="lessonDuration"
                                  name="duration"
                                  type="number"
                                  value={currentLesson.duration}
                                  onChange={handleLessonChange}
                                  min="5"
                                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                                />
                              </div>
                            </div>
                            
                            <div className="flex justify-end space-x-2 mt-3">
                              <Button
                                variant="outline"
                                onClick={() => setShowLessonForm(false)}
                              >
                                Отмена
                              </Button>
                              <Button onClick={addLesson}>
                                Добавить урок
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={addModule}
                    disabled={!currentModule.title || currentModule.lessons.length === 0}
                    className="w-full"
                  >
                    Добавить модуль в план
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Добавленные модули ({studyPlan.modules.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {studyPlan.modules.length > 0 ? (
                    <div className="space-y-4">
                      {studyPlan.modules.map((module, index) => (
                        <div key={module.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">Модуль {index + 1}: {module.title}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{module.description}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Уроков: {module.lessons.length} | 
                                Общая длительность: {module.lessons.reduce((total, lesson) => total + lesson.duration, 0)} мин
                              </p>
                            </div>
                            <button
                              onClick={() => removeModule(module.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              &times;
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                      Нет добавленных модулей. Добавьте хотя бы один модуль для создания учебного плана.
                    </p>
                  )}
                </CardContent>
              </Card>
              
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => router.push('/study-plan')}
                >
                  Отмена
                </Button>
                <Button
                  onClick={saveStudyPlan}
                  disabled={!studyPlan.title || !studyPlan.subject || studyPlan.modules.length === 0}
                >
                  Сохранить учебный план
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
