'use client';

import { useState } from 'react';
import MainNavigation from '@/components/MainNavigation';
import Footer from '@/components/Footer';

// Типы для настроек
type NotificationSettings = {
  email: boolean;
  browser: boolean;
  mobile: boolean;
};

type PrivacySettings = {
  profileVisibility: 'public' | 'private' | 'friends';
  activityVisibility: 'public' | 'private' | 'friends';
};

type AppearanceSettings = {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
};

type Settings = {
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  appearance: AppearanceSettings;
};

export default function SettingsPage() {
  // Моковые данные настроек
  const [settings, setSettings] = useState<Settings>({
    notifications: {
      email: true,
      browser: true,
      mobile: false,
    },
    privacy: {
      profileVisibility: 'public',
      activityVisibility: 'friends',
    },
    appearance: {
      theme: 'system',
      fontSize: 'medium',
    },
  });
  
  // Состояние для активной вкладки
  const [activeTab, setActiveTab] = useState<'notifications' | 'privacy' | 'appearance'>('notifications');
  
  // Обработчик изменения настроек уведомлений
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [name]: checked,
      },
    });
  };
  
  // Обработчик изменения настроек приватности
  const handlePrivacyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setSettings({
      ...settings,
      privacy: {
        ...settings.privacy,
        [name]: value,
      },
    });
  };
  
  // Обработчик изменения настроек внешнего вида
  const handleAppearanceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setSettings({
      ...settings,
      appearance: {
        ...settings.appearance,
        [name]: value,
      },
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <MainNavigation />
      
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Настройки</h1>
          </div>
        </header>
        
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="sm:flex">
                {/* Боковая панель с вкладками */}
                <div className="sm:w-64 bg-gray-50 dark:bg-gray-900 p-6">
                  <nav className="space-y-1">
                    <button
                      onClick={() => setActiveTab('notifications')}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        activeTab === 'notifications'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                      }`}
                    >
                      <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      Уведомления
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('privacy')}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        activeTab === 'privacy'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                      }`}
                    >
                      <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Приватность
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('appearance')}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        activeTab === 'appearance'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                      }`}
                    >
                      <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                      Внешний вид
                    </button>
                  </nav>
                </div>
                
                {/* Содержимое вкладок */}
                <div className="p-6 sm:p-8 flex-1">
                  {activeTab === 'notifications' && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Настройки уведомлений</h2>
                      
                      <div className="space-y-6">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="email"
                              name="email"
                              type="checkbox"
                              checked={settings.notifications.email}
                              onChange={handleNotificationChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="email" className="font-medium text-gray-700 dark:text-gray-300">Email уведомления</label>
                            <p className="text-gray-500 dark:text-gray-400">Получать уведомления на email о новых материалах и результатах тестов.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="browser"
                              name="browser"
                              type="checkbox"
                              checked={settings.notifications.browser}
                              onChange={handleNotificationChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="browser" className="font-medium text-gray-700 dark:text-gray-300">Браузерные уведомления</label>
                            <p className="text-gray-500 dark:text-gray-400">Получать уведомления в браузере о новых сообщениях и событиях.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="mobile"
                              name="mobile"
                              type="checkbox"
                              checked={settings.notifications.mobile}
                              onChange={handleNotificationChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="mobile" className="font-medium text-gray-700 dark:text-gray-300">Мобильные уведомления</label>
                            <p className="text-gray-500 dark:text-gray-400">Получать push-уведомления на мобильное устройство.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'privacy' && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Настройки приватности</h2>
                      
                      <div className="space-y-6">
                        <div>
                          <label htmlFor="profileVisibility" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Видимость профиля
                          </label>
                          <select
                            id="profileVisibility"
                            name="profileVisibility"
                            value={settings.privacy.profileVisibility}
                            onChange={handlePrivacyChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                          >
                            <option value="public">Публичный</option>
                            <option value="friends">Только друзья</option>
                            <option value="private">Приватный</option>
                          </select>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Определяет, кто может видеть ваш профиль.
                          </p>
                        </div>
                        
                        <div>
                          <label htmlFor="activityVisibility" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Видимость активности
                          </label>
                          <select
                            id="activityVisibility"
                            name="activityVisibility"
                            value={settings.privacy.activityVisibility}
                            onChange={handlePrivacyChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                          >
                            <option value="public">Публичная</option>
                            <option value="friends">Только друзья</option>
                            <option value="private">Приватная</option>
                          </select>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Определяет, кто может видеть вашу активность в системе.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'appearance' && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Настройки внешнего вида</h2>
                      
                      <div className="space-y-6">
                        <div>
                          <label htmlFor="theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Тема
                          </label>
                          <select
                            id="theme"
                            name="theme"
                            value={settings.appearance.theme}
                            onChange={handleAppearanceChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                          >
                            <option value="light">Светлая</option>
                            <option value="dark">Темная</option>
                            <option value="system">Системная</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Размер шрифта
                          </label>
                          <select
                            id="fontSize"
                            name="fontSize"
                            value={settings.appearance.fontSize}
                            onChange={handleAppearanceChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                          >
                            <option value="small">Маленький</option>
                            <option value="medium">Средний</option>
                            <option value="large">Большой</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Сохранить настройки
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
