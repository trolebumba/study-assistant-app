'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { monitoring, MonitoringEventType } from '@/utils/monitoring';

export type FeedbackType = 'bug' | 'feature' | 'improvement' | 'other';

interface FeedbackFormProps {
  onClose?: () => void;
  onSubmit?: (feedback: {
    type: FeedbackType;
    message: string;
    email?: string;
    page: string;
  }) => void;
}

export function FeedbackForm({ onClose, onSubmit }: FeedbackFormProps) {
  const [type, setType] = useState<FeedbackType>('improvement');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Получаем текущий URL страницы
      const page = typeof window !== 'undefined' ? window.location.pathname : '';
      
      // Формируем данные обратной связи
      const feedbackData = {
        type,
        message,
        email: email || undefined,
        page,
      };
      
      // Отправляем данные в систему мониторинга
      monitoring.trackEvent(MonitoringEventType.USER_FEEDBACK, {
        feedbackType: type,
        page,
        hasEmail: !!email,
      });
      
      // Вызываем колбэк onSubmit, если он предоставлен
      if (onSubmit) {
        await onSubmit(feedbackData);
      } else {
        // Имитируем отправку данных на сервер
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Отмечаем форму как отправленную
      setIsSubmitted(true);
      
      // Сбрасываем форму через 3 секунды
      setTimeout(() => {
        if (onClose) {
          onClose();
        } else {
          setIsSubmitted(false);
          setMessage('');
          setEmail('');
          setType('improvement');
        }
      }, 3000);
    } catch (error) {
      monitoring.captureError(error instanceof Error ? error : new Error('Failed to submit feedback'), {
        feedbackType: type,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Обратная связь</CardTitle>
        <CardDescription>
          Поделитесь своим мнением о приложении. Ваш отзыв поможет нам улучшить его.
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="rounded-full bg-green-100 p-3 text-green-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3 className="text-lg font-medium">Спасибо за ваш отзыв!</h3>
              <p className="text-sm text-gray-500 mt-2">
                Мы ценим ваше мнение и используем его для улучшения приложения.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Тип обратной связи</Label>
                <RadioGroup
                  value={type}
                  onValueChange={(value) => setType(value as FeedbackType)}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="improvement" id="improvement" />
                    <Label htmlFor="improvement">Предложение по улучшению</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bug" id="bug" />
                    <Label htmlFor="bug">Сообщение об ошибке</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="feature" id="feature" />
                    <Label htmlFor="feature">Запрос новой функции</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Другое</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Сообщение</Label>
                <Textarea
                  id="message"
                  placeholder="Опишите ваше предложение или проблему..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email (необязательно)</Label>
                <input
                  id="email"
                  type="email"
                  placeholder="Для получения ответа"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <p className="text-xs text-gray-500">
                  Мы используем ваш email только для ответа на ваш отзыв.
                </p>
              </div>
            </>
          )}
        </CardContent>
        
        {!isSubmitted && (
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !message.trim()}
            >
              {isSubmitting ? 'Отправка...' : 'Отправить'}
            </Button>
          </CardFooter>
        )}
      </form>
    </Card>
  );
}
