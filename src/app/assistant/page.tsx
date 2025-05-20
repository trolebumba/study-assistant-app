'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import MainNavigation from '@/components/MainNavigation';
import Footer from '@/components/Footer';

// Типы для сообщений
type MessageType = 'user' | 'assistant';

interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Привет! Я твой персональный ассистент для подготовки к экзаменам. Чем я могу помочь тебе сегодня?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Автоматическая прокрутка к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Функция для генерации уникального ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Состояние для хранения истории сообщений для API
  const [apiMessages, setApiMessages] = useState<{ role: 'system' | 'user' | 'assistant'; content: string }[]>([
    { role: 'system', content: 'Ты - ИИ-ассистент для подготовки к экзаменам, специализирующийся на помощи студентам в обучении.' },
  ]);

  // Обработка отправки сообщения
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Добавляем сообщение пользователя
    const userMessage: Message = {
      id: generateId(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    // Добавляем сообщение пользователя в историю для API
    const userApiMessage = { role: 'user' as const, content: inputValue };
    const updatedApiMessages = [...apiMessages, userApiMessage];

    setMessages((prev) => [...prev, userMessage]);
    setApiMessages(updatedApiMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      // Получаем ответ от OpenAI (в реальном приложении)
      const { callOpenAI } = await import('@/utils/openai');
      const assistantResponse = await callOpenAI(updatedApiMessages);

      // Добавляем ответ ассистента в историю сообщений
      const assistantMessage: Message = {
        id: generateId(),
        type: 'assistant',
        content: assistantResponse,
        timestamp: new Date(),
      };

      // Добавляем ответ ассистента в историю для API
      const assistantApiMessage = { role: 'assistant' as const, content: assistantResponse };

      setMessages((prev) => [...prev, assistantMessage]);
      setApiMessages([...updatedApiMessages, assistantApiMessage]);
    } catch (error) {
      console.error('Ошибка при получении ответа от ассистента:', error);

      // Добавляем сообщение об ошибке
      const errorMessage: Message = {
        id: generateId(),
        type: 'assistant',
        content: 'Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте еще раз.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <MainNavigation />

      {/* Основное содержимое */}
      <div className="py-10">
        <header>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">ИИ-ассистент</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Задай вопрос и получи персонализированную помощь в обучении
            </p>
          </div>
        </header>

        <main>
          <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden flex flex-col h-[70vh]">
              {/* Область сообщений */}
              <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 ${
                      message.type === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div
                      className={`inline-block p-3 rounded-lg max-w-[80%] ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      {message.content}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="text-left mb-4">
                    <div className="inline-block p-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Форма отправки сообщения */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Напиши свой вопрос..."
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Отправить
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
