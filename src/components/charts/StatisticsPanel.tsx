'use client';

import { useState } from 'react';
import ProgressChart from './ProgressChart';

// Типы для данных статистики
interface StatisticsData {
  subjectProgress: {
    name: string;
    value: number;
    color?: string;
  }[];
  weeklyActivity: {
    name: string;
    value: number;
  }[];
  testResults: {
    name: string;
    value: number;
    color?: string;
  }[];
}

interface StatisticsPanelProps {
  data: StatisticsData;
}

export default function StatisticsPanel({ data }: StatisticsPanelProps) {
  const [activeTab, setActiveTab] = useState<'subjects' | 'activity' | 'tests'>('subjects');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex">
          <button
            onClick={() => setActiveTab('subjects')}
            className={`${
              activeTab === 'subjects'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex-1 text-center`}
          >
            Предметы
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`${
              activeTab === 'activity'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex-1 text-center`}
          >
            Активность
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`${
              activeTab === 'tests'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex-1 text-center`}
          >
            Тесты
          </button>
        </nav>
      </div>

      <div className="p-4">
        {activeTab === 'subjects' && (
          <ProgressChart
            data={data.subjectProgress}
            title="Прогресс по предметам"
            type="bar"
            height={300}
          />
        )}
        {activeTab === 'activity' && (
          <ProgressChart
            data={data.weeklyActivity}
            title="Активность по дням недели"
            type="line"
            height={300}
          />
        )}
        {activeTab === 'tests' && (
          <ProgressChart
            data={data.testResults}
            title="Результаты тестов"
            type="pie"
            height={300}
          />
        )}
      </div>
    </div>
  );
}
