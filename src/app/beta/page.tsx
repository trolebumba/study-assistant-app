'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { monitoring, MonitoringEventType } from '@/utils/monitoring';
import Link from 'next/link';

export default function BetaPage() {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [isCodeValid, setIsCodeValid] = useState<boolean | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Имитация отправки данных на сервер
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Отправляем событие в систему мониторинга
      monitoring.trackEvent(MonitoringEventType.BETA_SIGNUP, {
        hasFeedback: !!feedback.trim(),
      });
      
      // Отмечаем форму как отправленную
      setIsSubmitted(true);
    } catch (error) {
      monitoring.captureError(error instanceof Error ? error : new Error('Failed to submit beta signup'), {});
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateInviteCode = () => {
    // В реальном приложении здесь был бы запрос к API для проверки кода
    // Для демонстрации используем простую проверку
    const validCodes = ['BETA2023', 'STUDYAPP', 'TESTCODE'];
    setIsCodeValid(validCodes.includes(inviteCode));
  };

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">
            Программа бета-тестирования Study Assistant
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Станьте одним из первых пользователей нашего приложения и помогите нам сделать его лучше
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Что такое бета-тестирование?</CardTitle>
              <CardDescription>
                Бета-тестирование — это этап разработки, на котором приложение тестируется ограниченной группой пользователей перед полным запуском.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Как бета-тестировщик, вы получите ранний доступ к нашему приложению и сможете:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>Опробовать все функции приложения до официального запуска</li>
                <li>Поделиться своим мнением и предложениями по улучшению</li>
                <li>Помочь нам выявить и исправить ошибки</li>
                <li>Повлиять на развитие приложения</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Преимущества участия</CardTitle>
              <CardDescription>
                Участие в программе бета-тестирования дает вам ряд преимуществ.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>Бесплатный доступ ко всем функциям приложения на период тестирования</li>
                <li>Скидка 50% на премиум-подписку после официального запуска</li>
                <li>Прямая связь с командой разработчиков</li>
                <li>Упоминание в списке бета-тестировщиков на нашем сайте</li>
                <li>Эксклюзивные достижения в приложении</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Как стать бета-тестировщиком</CardTitle>
            <CardDescription>
              Заполните форму ниже, чтобы присоединиться к программе бета-тестирования.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
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
                <h3 className="text-2xl font-bold mb-2">Спасибо за регистрацию!</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Мы отправили письмо с инструкциями на указанный вами email. Пожалуйста, проверьте вашу почту.
                </p>
                <Button asChild>
                  <Link href="/dashboard">Вернуться на главную</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="invite-code">Код приглашения</Label>
                  <div className="flex space-x-2">
                    <input
                      id="invite-code"
                      type="text"
                      placeholder="Введите код приглашения"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={validateInviteCode}
                      disabled={!inviteCode.trim()}
                    >
                      Проверить
                    </Button>
                  </div>
                  {isCodeValid !== null && (
                    <p className={`text-sm ${isCodeValid ? 'text-green-600' : 'text-red-600'}`}>
                      {isCodeValid ? 'Код действителен' : 'Недействительный код'}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Если у вас нет кода приглашения, вы можете запросить его в нашем сообществе или у администратора.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Ваш email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feedback">Почему вы хотите участвовать в бета-тестировании?</Label>
                  <Textarea
                    id="feedback"
                    placeholder="Расскажите, почему вы заинтересованы в нашем приложении и как планируете его использовать"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex items-start">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="mt-1"
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                    Я согласен с <Link href="/terms" className="text-blue-600 hover:underline">условиями использования</Link> и <Link href="/privacy" className="text-blue-600 hover:underline">политикой конфиденциальности</Link>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !email.trim() || !isCodeValid}
                  className="w-full"
                >
                  {isSubmitting ? 'Отправка...' : 'Присоединиться к бета-тестированию'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Остались вопросы?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Если у вас есть вопросы о программе бета-тестирования, свяжитесь с нами по адресу <a href="mailto:beta@study-assistant.app" className="text-blue-600 hover:underline">beta@study-assistant.app</a>
          </p>
        </div>
      </div>
    </div>
  );
}
