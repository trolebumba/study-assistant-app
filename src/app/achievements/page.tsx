'use client';

import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Achievements from '@/components/Achievements';
import LevelProgress from '@/components/LevelProgress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  GamificationProfile,
  Achievement,
  createGamificationProfile,
  getAllAchievements,
  checkAchievements
} from '@/utils/gamification';

// Моковые данные для рейтинга
const leaderboardData = [
  { id: 1, name: 'Александр К.', points: 2450, level: 8, rank: 'Мастер' },
  { id: 2, name: 'Мария С.', points: 2100, level: 7, rank: 'Исследователь' },
  { id: 3, name: 'Дмитрий В.', points: 1800, level: 6, rank: 'Исследователь' },
  { id: 4, name: 'Анна П.', points: 1500, level: 6, rank: 'Студент' },
  { id: 5, name: 'Текущий пользователь', points: 1250, level: 5, rank: 'Студент', isCurrentUser: true },
  { id: 6, name: 'Иван М.', points: 1100, level: 4, rank: 'Студент' },
  { id: 7, name: 'Елена Т.', points: 950, level: 4, rank: 'Ученик' },
  { id: 8, name: 'Сергей К.', points: 800, level: 3, rank: 'Ученик' },
  { id: 9, name: 'Ольга Н.', points: 650, level: 3, rank: 'Ученик' },
  { id: 10, name: 'Павел Р.', points: 500, level: 2, rank: 'Новичок' },
];

export default function AchievementsPage() {
  // Создаем моковый профиль геймификации
  const [profile, setProfile] = useState<GamificationProfile | null>(null);

  // Инициализируем профиль при загрузке страницы
  useEffect(() => {
    // Создаем базовый профиль
    let mockProfile = createGamificationProfile('user123');

    // Добавляем некоторые достижения для демонстрации
    const allAchievements = getAllAchievements();
    const unlockedAchievements: Achievement[] = [
      { ...allAchievements.find(a => a.id === 'complete_first_test')!, unlockedAt: Date.now() - 1000 * 60 * 60 * 24 * 7 },
      { ...allAchievements.find(a => a.id === 'streak_3_days')!, unlockedAt: Date.now() - 1000 * 60 * 60 * 24 * 5 },
      { ...allAchievements.find(a => a.id === 'mastery_50')!, unlockedAt: Date.now() - 1000 * 60 * 60 * 24 * 3 },
      { ...allAchievements.find(a => a.id === 'explore_3_topics')!, unlockedAt: Date.now() - 1000 * 60 * 60 * 24 * 1 },
    ].filter(Boolean) as Achievement[];

    // Обновляем профиль
    mockProfile.achievements.unlocked = unlockedAchievements;
    mockProfile.points = unlockedAchievements.reduce((sum, achievement) => sum + achievement.points, 0);

    // Обновляем статистику
    mockProfile.stats = {
      testsCompleted: 5,
      questionsAnswered: 87,
      correctAnswers: 65,
      topicsExplored: ['calculus', 'algebra', 'set_theory'],
      totalStudyTime: 480, // 8 часов
    };

    // Обновляем серии
    mockProfile.streaks = {
      current: 3,
      longest: 5,
      lastActivity: Date.now(),
    };

    // Обновляем уровень
    const { profile: updatedProfile } = checkAchievements(mockProfile, 'test_completed', { accuracy: 0.85 });
    setProfile(updatedProfile);
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-beach-leaf border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navigation />

      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Достижения и прогресс</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Отслеживайте свой прогресс, разблокируйте достижения и поднимайтесь в рейтинге
            </p>
          </div>
        </header>

        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <Tabs defaultValue="achievements" className="mb-8">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="achievements">Достижения</TabsTrigger>
                  <TabsTrigger value="leaderboard">Рейтинг</TabsTrigger>
                </TabsList>

                <TabsContent value="achievements" className="mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Прогресс уровня */}
                    <div className="lg:col-span-1">
                      <LevelProgress profile={profile} />

                      {/* Статистика */}
                      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Статистика</h2>
                        </div>

                        <div className="p-6">
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Завершено тестов</span>
                              <span className="font-medium text-gray-900 dark:text-white">{profile.stats.testsCompleted}</span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Отвечено на вопросов</span>
                              <span className="font-medium text-gray-900 dark:text-white">{profile.stats.questionsAnswered}</span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Правильных ответов</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {profile.stats.correctAnswers} ({Math.round((profile.stats.correctAnswers / profile.stats.questionsAnswered) * 100)}%)
                              </span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Изучено тем</span>
                              <span className="font-medium text-gray-900 dark:text-white">{profile.stats.topicsExplored.length}</span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Общее время обучения</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {Math.floor(profile.stats.totalStudyTime / 60)} ч {profile.stats.totalStudyTime % 60} мин
                              </span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Текущая серия</span>
                              <span className="font-medium text-gray-900 dark:text-white">{profile.streaks.current} дней</span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Самая длинная серия</span>
                              <span className="font-medium text-gray-900 dark:text-white">{profile.streaks.longest} дней</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Достижения */}
                    <div className="lg:col-span-2">
                      <Achievements unlockedAchievements={profile.achievements.unlocked} />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="leaderboard" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Рейтинг пользователей</CardTitle>
                      <CardDescription>Соревнуйтесь с другими учениками</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="py-3 text-left">Место</th>
                              <th className="py-3 text-left">Пользователь</th>
                              <th className="py-3 text-right">Уровень</th>
                              <th className="py-3 text-right">Очки</th>
                              <th className="py-3 text-right">Ранг</th>
                            </tr>
                          </thead>
                          <tbody>
                            {leaderboardData.map((user, index) => (
                              <tr
                                key={user.id}
                                className={`border-b ${user.isCurrentUser ? 'bg-beach-leaf/10 dark:bg-beach-water/10' : ''}`}
                              >
                                <td className="py-3 font-medium">{index + 1}</td>
                                <td className="py-3">
                                  <div className="flex items-center">
                                    {user.isCurrentUser && (
                                      <span className="mr-2 text-beach-leaf dark:text-beach-water">👤</span>
                                    )}
                                    {user.name}
                                  </div>
                                </td>
                                <td className="py-3 text-right">{user.level}</td>
                                <td className="py-3 text-right font-medium">{user.points}</td>
                                <td className="py-3 text-right">{user.rank}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
