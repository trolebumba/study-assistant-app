'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  TutorDialog, 
  TutorMessage, 
  UserMessage, 
  TutorProfile, 
  TutorLearningProfile,
  TutorMessageType,
  ExplanationLevel,
  createTutorProfile,
  createDialog,
  processUserMessage
} from '@/utils/virtual-tutor';
import { LearningStyle } from '@/utils/material-generator';
import { ErrorType } from '@/utils/error-analysis';

interface VirtualTutorProps {
  topic: string;
  subtopic?: string;
  onClose?: () => void;
}

export default function VirtualTutor({ topic, subtopic, onClose }: VirtualTutorProps) {
  // Создаем моковый профиль обучения пользователя
  const mockLearningProfile: TutorLearningProfile = {
    userId: 'user123',
    preferredStyle: LearningStyle.VISUAL,
    preferredExplanationLevel: ExplanationLevel.INTERMEDIATE,
    topicProficiency: {
      'calculus': 0.7,
      'algebra': 0.5,
      'set_theory': 0.3,
      'analysis': 0.6,
    },
    commonErrors: {
      'calculus': [ErrorType.APPLICATION],
      'algebra': [ErrorType.CALCULATION, ErrorType.MEMORY],
      'set_theory': [ErrorType.CONCEPTUAL],
      'analysis': [ErrorType.LOGICAL],
    },
    interactionHistory: {
      totalSessions: 5,
      averageSessionDuration: 15,
      completedDialogs: 4,
      abandonedDialogs: 1,
      averageResponseTime: 30,
    },
    feedback: {
      helpfulness: 0.8,
      clarity: 0.7,
      engagement: 0.9,
    },
  };

  // Создаем профиль тьютора на основе профиля обучения
  const [tutorProfile, setTutorProfile] = useState<TutorProfile>(
    createTutorProfile(mockLearningProfile)
  );

  // Создаем начальный диалог
  const [dialog, setDialog] = useState<TutorDialog>(
    createDialog(topic, subtopic, tutorProfile)
  );

  // Состояние для ввода пользователя
  const [userInput, setUserInput] = useState('');
  
  // Состояние для отображения индикатора печати
  const [isTyping, setIsTyping] = useState(false);
  
  // Ref для автоматической прокрутки к последнему сообщению
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Функция для отправки сообщения пользователя
  const sendMessage = () => {
    if (!userInput.trim()) return;

    // Создаем сообщение пользователя
    const userMessage: UserMessage = {
      id: `user_${Date.now()}`,
      content: userInput,
      timestamp: Date.now(),
      relatedTopics: [topic],
    };

    // Очищаем поле ввода
    setUserInput('');
    
    // Обновляем диалог с сообщением пользователя
    const updatedDialog = {
      ...dialog,
      messages: [...dialog.messages, userMessage],
    };
    
    setDialog(updatedDialog);
    
    // Имитируем задержку ответа тьютора
    setIsTyping(true);
    
    setTimeout(() => {
      // Обрабатываем сообщение пользователя и получаем ответ тьютора
      const dialogWithResponse = processUserMessage(
        updatedDialog,
        userMessage,
        tutorProfile,
        mockLearningProfile
      );
      
      setDialog(dialogWithResponse);
      setIsTyping(false);
    }, tutorProfile.responseTime + Math.random() * 1000);
  };

  // Автоматическая прокрутка к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dialog.messages]);

  // Функция для определения стиля сообщения в зависимости от его типа
  const getMessageStyle = (message: TutorMessage | UserMessage) => {
    if ('type' in message) {
      // Сообщение тьютора
      switch (message.type) {
        case TutorMessageType.GREETING:
          return 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700';
        case TutorMessageType.EXPLANATION:
          return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700';
        case TutorMessageType.QUESTION:
          return 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700';
        case TutorMessageType.HINT:
          return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700';
        case TutorMessageType.FEEDBACK:
          return 'bg-teal-100 dark:bg-teal-900/30 border-teal-300 dark:border-teal-700';
        case TutorMessageType.ENCOURAGEMENT:
          return 'bg-pink-100 dark:bg-pink-900/30 border-pink-300 dark:border-pink-700';
        case TutorMessageType.SUMMARY:
          return 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700';
        default:
          return 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700';
      }
    } else {
      // Сообщение пользователя
      return 'bg-beach-water/20 border-beach-water dark:bg-beach-water/30 dark:border-beach-water/70';
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[600px] bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      {/* Заголовок */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-beach-leaf/20 dark:bg-beach-leaf/10">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-beach-leaf text-white flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{tutorProfile.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {topic === 'calculus' ? 'Математический анализ' :
               topic === 'algebra' ? 'Алгебра' :
               topic === 'set_theory' ? 'Теория множеств' :
               topic === 'analysis' ? 'Анализ' : 
               topic}
              {subtopic && ` - ${subtopic}`}
            </p>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Сообщения */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {dialog.messages.map((message) => (
            <div 
              key={message.id} 
              className={`p-3 rounded-lg border ${getMessageStyle(message)} ${
                'type' in message ? 'mr-12' : 'ml-12'
              }`}
            >
              <div className="flex items-start">
                {'type' in message && (
                  <div className="w-8 h-8 rounded-full bg-beach-leaf text-white flex items-center justify-center mr-2 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-gray-800 dark:text-gray-200">{message.content}</p>
                  {'options' in message && message.options && (
                    <div className="mt-2 space-y-2">
                      {message.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setUserInput(option);
                            setTimeout(sendMessage, 100);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {/* Индикатор печати */}
          {isTyping && (
            <div className="p-3 rounded-lg border bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 mr-12">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-beach-leaf text-white flex items-center justify-center mr-2 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Ввод сообщения */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Введите ваше сообщение..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-beach-leaf"
          />
          <button
            onClick={sendMessage}
            disabled={!userInput.trim()}
            className="px-4 py-2 bg-beach-leaf text-white rounded-md hover:bg-beach-leafDark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
