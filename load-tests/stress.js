import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter, Rate } from 'k6/metrics';

// Создаем метрики для отслеживания
const failedRequests = new Counter('failed_requests');
const successRate = new Rate('success_rate');

// Конфигурация стресс-теста
export const options = {
  // Стресс-тест: начинаем с 0 и увеличиваем до 100 пользователей
  stages: [
    { duration: '1m', target: 20 },  // Разогрев
    { duration: '2m', target: 50 },  // Средняя нагрузка
    { duration: '1m', target: 100 }, // Пиковая нагрузка
    { duration: '2m', target: 50 },  // Стабилизация
    { duration: '1m', target: 0 },   // Остывание
  ],
  
  // Пороговые значения для успешного прохождения теста
  thresholds: {
    // 90% запросов должны завершаться менее чем за 1 секунду
    http_req_duration: ['p(90)<1000'],
    // Не более 5% запросов должны завершаться с ошибкой
    http_req_failed: ['rate<0.05'],
    // Пользовательская метрика: успешность запросов должна быть не менее 95%
    'success_rate': ['rate>0.95'],
  },
};

// Основная функция теста
export default function () {
  // Тестируем главную страницу
  let response = http.get('http://localhost:3000/');
  
  // Проверяем успешность запроса
  let success = check(response, {
    'home status is 200': (r) => r.status === 200,
  });
  
  // Обновляем метрики
  successRate.add(success);
  if (!success) {
    failedRequests.add(1);
  }
  
  // Небольшая пауза между запросами
  sleep(Math.random() * 3);
  
  // Тестируем страницу дашборда
  response = http.get('http://localhost:3000/dashboard');
  
  success = check(response, {
    'dashboard status is 200': (r) => r.status === 200,
  });
  
  successRate.add(success);
  if (!success) {
    failedRequests.add(1);
  }
  
  sleep(Math.random() * 3);
  
  // Тестируем страницу тестов
  response = http.get('http://localhost:3000/tests');
  
  success = check(response, {
    'tests status is 200': (r) => r.status === 200,
  });
  
  successRate.add(success);
  if (!success) {
    failedRequests.add(1);
  }
  
  sleep(Math.random() * 3);
  
  // Тестируем страницу учебного плана
  response = http.get('http://localhost:3000/study-plan');
  
  success = check(response, {
    'study plan status is 200': (r) => r.status === 200,
  });
  
  successRate.add(success);
  if (!success) {
    failedRequests.add(1);
  }
  
  sleep(Math.random() * 3);
  
  // Тестируем страницу ассистента
  response = http.get('http://localhost:3000/assistant');
  
  success = check(response, {
    'assistant status is 200': (r) => r.status === 200,
  });
  
  successRate.add(success);
  if (!success) {
    failedRequests.add(1);
  }
  
  sleep(Math.random() * 3);
}
