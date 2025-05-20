import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';

// Создаем метрики для отслеживания
const failedRequests = new Counter('failed_requests');

// Конфигурация теста
export const options = {
  // Базовая нагрузка: 10 виртуальных пользователей в течение 30 секунд
  vus: 10,
  duration: '30s',
  
  // Пороговые значения для успешного прохождения теста
  thresholds: {
    // 95% запросов должны завершаться менее чем за 500 мс
    http_req_duration: ['p(95)<500'],
    // Не более 1% запросов должны завершаться с ошибкой
    http_req_failed: ['rate<0.01'],
    // Пользовательская метрика: не более 5 неудачных запросов
    'failed_requests': ['count<5'],
  },
  
  // Сценарии нагрузки
  scenarios: {
    // Постоянная нагрузка
    constant_load: {
      executor: 'constant-vus',
      vus: 10,
      duration: '30s',
    },
    // Нарастающая нагрузка
    ramping_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 10 },
        { duration: '10s', target: 20 },
        { duration: '10s', target: 0 },
      ],
    },
  },
};

// Основная функция теста
export default function () {
  // Тестируем главную страницу
  let response = http.get('http://localhost:3000/');
  
  // Проверяем успешность запроса
  const success = check(response, {
    'status is 200': (r) => r.status === 200,
    'page contains StudyAssistant': (r) => r.body.includes('StudyAssistant'),
  });
  
  // Если проверка не прошла, увеличиваем счетчик неудачных запросов
  if (!success) {
    failedRequests.add(1);
  }
  
  // Небольшая пауза между запросами
  sleep(1);
  
  // Тестируем страницу дашборда
  response = http.get('http://localhost:3000/dashboard');
  
  check(response, {
    'dashboard status is 200': (r) => r.status === 200,
    'dashboard page contains title': (r) => r.body.includes('Дашборд'),
  });
  
  sleep(1);
  
  // Тестируем страницу тестов
  response = http.get('http://localhost:3000/tests');
  
  check(response, {
    'tests status is 200': (r) => r.status === 200,
    'tests page contains title': (r) => r.body.includes('Тесты'),
  });
  
  sleep(1);
  
  // Тестируем страницу учебного плана
  response = http.get('http://localhost:3000/study-plan');
  
  check(response, {
    'study plan status is 200': (r) => r.status === 200,
    'study plan page contains title': (r) => r.body.includes('Учебный план'),
  });
  
  sleep(1);
}
