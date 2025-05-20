'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainNavigation from '@/components/MainNavigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

// Типы для вопросов и тестов
type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'matching';

type Answer = {
  id: string;
  text: string;
  isCorrect: boolean;
};

type Question = {
  id: string;
  text: string;
  type: QuestionType;
  answers: Answer[];
  explanation: string;
};

type Test = {
  title: string;
  description: string;
  timeLimit: number | null;
  questions: Question[];
  tags: string[];
};

export default function CreateTestPage() {
  const router = useRouter();
  
  // Состояние для теста
  const [test, setTest] = useState<Test>({
    title: '',
    description: '',
    timeLimit: 30,
    questions: [],
    tags: [],
  });
  
  // Состояние для текущего редактируемого вопроса
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: Date.now().toString(),
    text: '',
    type: 'multiple_choice',
    answers: [
      { id: '1', text: '', isCorrect: false },
      { id: '2', text: '', isCorrect: false },
      { id: '3', text: '', isCorrect: false },
      { id: '4', text: '', isCorrect: false },
    ],
    explanation: '',
  });
  
  // Состояние для текущего тега
  const [currentTag, setCurrentTag] = useState('');
  
  // Обработчик изменения основной информации о тесте
  const handleTestChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTest({
      ...test,
      [name]: name === 'timeLimit' ? (value ? parseInt(value) : null) : value,
    });
  };
  
  // Обработчик изменения вопроса
  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentQuestion({
      ...currentQuestion,
      [name]: value,
    });
  };
  
  // Обработчик изменения ответа
  const handleAnswerChange = (id: string, field: 'text' | 'isCorrect', value: string | boolean) => {
    setCurrentQuestion({
      ...currentQuestion,
      answers: currentQuestion.answers.map(answer => 
        answer.id === id ? { ...answer, [field]: value } : answer
      ),
    });
  };
  
  // Добавление вопроса в тест
  const addQuestion = () => {
    // Проверка на заполненность полей
    if (!currentQuestion.text || currentQuestion.answers.some(a => !a.text) || !currentQuestion.answers.some(a => a.isCorrect)) {
      alert('Пожалуйста, заполните все поля вопроса и отметьте хотя бы один правильный ответ');
      return;
    }
    
    setTest({
      ...test,
      questions: [...test.questions, { ...currentQuestion }],
    });
    
    // Сброс текущего вопроса
    setCurrentQuestion({
      id: Date.now().toString(),
      text: '',
      type: 'multiple_choice',
      answers: [
        { id: '1', text: '', isCorrect: false },
        { id: '2', text: '', isCorrect: false },
        { id: '3', text: '', isCorrect: false },
        { id: '4', text: '', isCorrect: false },
      ],
      explanation: '',
    });
  };
  
  // Добавление тега
  const addTag = () => {
    if (currentTag && !test.tags.includes(currentTag)) {
      setTest({
        ...test,
        tags: [...test.tags, currentTag],
      });
      setCurrentTag('');
    }
  };
  
  // Удаление тега
  const removeTag = (tag: string) => {
    setTest({
      ...test,
      tags: test.tags.filter(t => t !== tag),
    });
  };
  
  // Сохранение теста
  const saveTest = () => {
    // Проверка на заполненность полей
    if (!test.title || !test.description || test.questions.length === 0) {
      alert('Пожалуйста, заполните все обязательные поля и добавьте хотя бы один вопрос');
      return;
    }
    
    // Здесь будет логика сохранения теста в базу данных
    console.log('Сохранение теста:', test);
    
    // Перенаправление на страницу тестов
    alert('Тест успешно создан!');
    router.push('/tests');
  };
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <MainNavigation />
      
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Создание теста</h1>
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
                        Название теста *
                      </label>
                      <input
                        id="title"
                        name="title"
                        type="text"
                        value={test.title}
                        onChange={handleTestChange}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                        placeholder="Например: Основы алгебры"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Описание теста *
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={test.description}
                        onChange={handleTestChange}
                        rows={3}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                        placeholder="Краткое описание теста"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Ограничение по времени (минуты)
                      </label>
                      <input
                        id="timeLimit"
                        name="timeLimit"
                        type="number"
                        value={test.timeLimit || ''}
                        onChange={handleTestChange}
                        min="0"
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                        placeholder="Оставьте пустым, если нет ограничения"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Теги
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          value={currentTag}
                          onChange={(e) => setCurrentTag(e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                          placeholder="Добавить тег"
                        />
                        <button
                          type="button"
                          onClick={addTag}
                          className="px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                          Добавить
                        </button>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {test.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-100"
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Добавление вопроса</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="questionText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Текст вопроса *
                      </label>
                      <textarea
                        id="questionText"
                        name="text"
                        value={currentQuestion.text}
                        onChange={handleQuestionChange}
                        rows={2}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                        placeholder="Введите вопрос"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="questionType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Тип вопроса *
                      </label>
                      <select
                        id="questionType"
                        name="type"
                        value={currentQuestion.type}
                        onChange={handleQuestionChange}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                        required
                      >
                        <option value="multiple_choice">Множественный выбор</option>
                        <option value="true_false">Верно/Неверно</option>
                        <option value="short_answer">Короткий ответ</option>
                        <option value="matching">Сопоставление</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Варианты ответов *
                      </label>
                      <div className="space-y-2">
                        {currentQuestion.answers.map((answer) => (
                          <div key={answer.id} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={answer.text}
                              onChange={(e) => handleAnswerChange(answer.id, 'text', e.target.value)}
                              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                              placeholder={`Вариант ${answer.id}`}
                              required
                            />
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id={`correct-${answer.id}`}
                                name="correctAnswer"
                                checked={answer.isCorrect}
                                onChange={() => {
                                  // Сбрасываем все ответы и устанавливаем текущий как правильный
                                  setCurrentQuestion({
                                    ...currentQuestion,
                                    answers: currentQuestion.answers.map(a => ({
                                      ...a,
                                      isCorrect: a.id === answer.id
                                    }))
                                  });
                                }}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700"
                              />
                              <label htmlFor={`correct-${answer.id}`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                Правильный
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="explanation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Объяснение
                      </label>
                      <textarea
                        id="explanation"
                        name="explanation"
                        value={currentQuestion.explanation}
                        onChange={handleQuestionChange}
                        rows={2}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                        placeholder="Объяснение правильного ответа (необязательно)"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={addQuestion} className="w-full">
                    Добавить вопрос
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Добавленные вопросы ({test.questions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {test.questions.length > 0 ? (
                    <div className="space-y-4">
                      {test.questions.map((question, index) => (
                        <div key={question.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium">Вопрос {index + 1}: {question.text}</h3>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {question.type === 'multiple_choice' ? 'Множественный выбор' :
                               question.type === 'true_false' ? 'Верно/Неверно' :
                               question.type === 'short_answer' ? 'Короткий ответ' : 'Сопоставление'}
                            </span>
                          </div>
                          <div className="mt-2 space-y-1">
                            {question.answers.map((answer) => (
                              <div key={answer.id} className="flex items-center">
                                <span className={`w-4 h-4 mr-2 inline-block rounded-full ${answer.isCorrect ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
                                <span className={answer.isCorrect ? 'font-medium' : ''}>{answer.text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                      Нет добавленных вопросов. Добавьте хотя бы один вопрос для создания теста.
                    </p>
                  )}
                </CardContent>
              </Card>
              
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => router.push('/tests')}
                >
                  Отмена
                </Button>
                <Button
                  onClick={saveTest}
                  disabled={!test.title || !test.description || test.questions.length === 0}
                >
                  Сохранить тест
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
