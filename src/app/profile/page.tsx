'use client';

import { useState } from 'react';
import MainNavigation from '@/components/MainNavigation';
import Footer from '@/components/Footer';

// Типы для профиля пользователя
type UserProfile = {
  name: string;
  email: string;
  avatar: string | null;
  bio: string;
  preferences: {
    emailNotifications: boolean;
    darkMode: boolean;
    language: 'ru' | 'en';
  };
};

export default function ProfilePage() {
  // Моковые данные профиля пользователя
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Иван Иванов',
    email: 'ivan@example.com',
    avatar: null,
    bio: 'Студент, готовлюсь к ЕГЭ по математике и физике.',
    preferences: {
      emailNotifications: true,
      darkMode: false,
      language: 'ru',
    },
  });
  
  // Состояния для редактирования
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
  
  // Обработчик изменения полей
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProfile({
      ...editedProfile,
      [name]: value,
    });
  };
  
  // Обработчик изменения настроек
  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setEditedProfile({
      ...editedProfile,
      preferences: {
        ...editedProfile.preferences,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      },
    });
  };
  
  // Обработчик сохранения изменений
  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };
  
  // Обработчик отмены изменений
  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <MainNavigation />
      
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Профиль пользователя</h1>
          </div>
        </header>
        
        <main>
          <div className="max-w-3xl mx-auto sm:px-6 lg:px-8 py-6">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              {/* Шапка профиля */}
              <div className="p-6 sm:p-8 bg-blue-600 text-white">
                <div className="flex items-center">
                  <div className="h-20 w-20 rounded-full bg-white text-blue-600 flex items-center justify-center text-2xl font-bold">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt={profile.name} className="h-full w-full rounded-full object-cover" />
                    ) : (
                      profile.name.charAt(0)
                    )}
                  </div>
                  <div className="ml-6">
                    <h2 className="text-2xl font-bold">{profile.name}</h2>
                    <p className="text-blue-100">{profile.email}</p>
                  </div>
                </div>
              </div>
              
              {/* Содержимое профиля */}
              <div className="p-6 sm:p-8">
                {isEditing ? (
                  // Форма редактирования
                  <form>
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Имя
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={editedProfile.name}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={editedProfile.email}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          О себе
                        </label>
                        <textarea
                          id="bio"
                          name="bio"
                          rows={3}
                          value={editedProfile.bio}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Настройки</h3>
                        <div className="mt-4 space-y-4">
                          <div className="flex items-center">
                            <input
                              id="emailNotifications"
                              name="emailNotifications"
                              type="checkbox"
                              checked={editedProfile.preferences.emailNotifications}
                              onChange={handlePreferenceChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                              Получать уведомления по email
                            </label>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              id="darkMode"
                              name="darkMode"
                              type="checkbox"
                              checked={editedProfile.preferences.darkMode}
                              onChange={handlePreferenceChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="darkMode" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                              Темная тема
                            </label>
                          </div>
                          
                          <div>
                            <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Язык
                            </label>
                            <select
                              id="language"
                              name="language"
                              value={editedProfile.preferences.language}
                              onChange={handlePreferenceChange}
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                            >
                              <option value="ru">Русский</option>
                              <option value="en">English</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          Отмена
                        </button>
                        <button
                          type="button"
                          onClick={handleSave}
                          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                          Сохранить
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  // Просмотр профиля
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">О себе</h3>
                      <p className="mt-1 text-gray-600 dark:text-gray-400">{profile.bio}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Настройки</h3>
                      <dl className="mt-2 divide-y divide-gray-200 dark:divide-gray-700">
                        <div className="py-3 flex justify-between">
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email уведомления</dt>
                          <dd className="text-sm text-gray-900 dark:text-white">{profile.preferences.emailNotifications ? 'Включены' : 'Выключены'}</dd>
                        </div>
                        <div className="py-3 flex justify-between">
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Темная тема</dt>
                          <dd className="text-sm text-gray-900 dark:text-white">{profile.preferences.darkMode ? 'Включена' : 'Выключена'}</dd>
                        </div>
                        <div className="py-3 flex justify-between">
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Язык</dt>
                          <dd className="text-sm text-gray-900 dark:text-white">{profile.preferences.language === 'ru' ? 'Русский' : 'English'}</dd>
                        </div>
                      </dl>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Редактировать профиль
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
