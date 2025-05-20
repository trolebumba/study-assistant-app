'use client';

import MainNavigation from '@/components/MainNavigation';
import Footer from '@/components/Footer';
import AchievementList from '@/components/gamification/AchievementList';
import UserLevel from '@/components/gamification/UserLevel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Моковые данные для уровня пользователя
const userLevelData = {
  level: 5,
  experience: 350,
  experienceToNextLevel: 500,
  rank: 'Студент',
  streak: 7,
  totalPoints: 1250,
};

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
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <MainNavigation />
      
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                  <UserLevel {...userLevelData} />
                </div>
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Ваши награды</CardTitle>
                      <CardDescription>Разблокированные значки и награды</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-2xl" title="Первые шаги">🚀</div>
                        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-2xl" title="Исследователь">🔍</div>
                        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl opacity-40" title="Заблокировано">🏆</div>
                        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl opacity-40" title="Заблокировано">📅</div>
                        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl opacity-40" title="Заблокировано">🦉</div>
                        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl opacity-40" title="Заблокировано">🦋</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <Tabs defaultValue="achievements" className="mb-8">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="achievements">Достижения</TabsTrigger>
                  <TabsTrigger value="leaderboard">Рейтинг</TabsTrigger>
                </TabsList>
                <TabsContent value="achievements" className="mt-6">
                  <AchievementList />
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
                                className={`border-b ${user.isCurrentUser ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                              >
                                <td className="py-3 font-medium">{index + 1}</td>
                                <td className="py-3">
                                  <div className="flex items-center">
                                    {user.isCurrentUser && (
                                      <span className="mr-2 text-blue-500">👤</span>
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
