'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

// Типы графиков
type ChartType = 'bar' | 'line' | 'pie';

// Данные для графиков
const subjectProgressData = [
  { name: 'Математика', value: 65, color: '#0088FE' },
  { name: 'Физика', value: 48, color: '#00C49F' },
  { name: 'Русский язык', value: 82, color: '#FFBB28' },
  { name: 'История', value: 71, color: '#FF8042' },
  { name: 'Английский', value: 56, color: '#8884D8' },
];

const weeklyActivityData = [
  { name: 'Пн', value: 45 },
  { name: 'Вт', value: 60 },
  { name: 'Ср', value: 30 },
  { name: 'Чт', value: 75 },
  { name: 'Пт', value: 50 },
  { name: 'Сб', value: 90 },
  { name: 'Вс', value: 40 },
];

const testResultsData = [
  { name: 'Отлично', value: 12, color: '#00C49F' },
  { name: 'Хорошо', value: 8, color: '#0088FE' },
  { name: 'Удовлетворительно', value: 5, color: '#FFBB28' },
  { name: 'Неудовлетворительно', value: 2, color: '#FF8042' },
];

// Цвета для графиков
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function LearningStatistics() {
  const [activeTab, setActiveTab] = useState<'subjects' | 'activity' | 'tests'>('subjects');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Обработчик наведения на сектор в круговой диаграмме
  const handlePieEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
  };

  // Форматирование подписей для круговой диаграммы
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    index: number;
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

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
          <div>
            <h3 className="text-lg font-medium mb-4 text-center">Прогресс по предметам</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={subjectProgressData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Прогресс (%)">
                  {subjectProgressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === 'activity' && (
          <div>
            <h3 className="text-lg font-medium mb-4 text-center">Активность по дням недели</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={weeklyActivityData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Минуты обучения"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === 'tests' && (
          <div>
            <h3 className="text-lg font-medium mb-4 text-center">Результаты тестов</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={testResultsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={handlePieEnter}
                >
                  {testResultsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color || COLORS[index % COLORS.length]}
                      stroke={activeIndex === index ? '#fff' : 'none'}
                      strokeWidth={activeIndex === index ? 2 : 0}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
