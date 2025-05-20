# API Reference

## Введение

API Study Assistant предоставляет программный доступ к функциям приложения для подготовки к экзаменам. API использует REST-архитектуру и возвращает данные в формате JSON.

## Базовый URL

```
https://api.study-assistant-app.vercel.app/api/v1
```

## Аутентификация

Для доступа к API необходимо использовать JWT-токен. Токен можно получить, отправив запрос на эндпоинт `/auth/login`.

### Получение токена

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Ответ:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

### Использование токена

Для аутентифицированных запросов необходимо передавать токен в заголовке `Authorization`:

```http
GET /user/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Пользователи

### Получение профиля пользователя

```http
GET /user/profile
Authorization: Bearer {token}
```

Ответ:

```json
{
  "id": "123",
  "email": "user@example.com",
  "name": "User Name",
  "avatar": "https://example.com/avatar.jpg",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z"
}
```

### Обновление профиля пользователя

```http
PUT /user/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "New Name",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

Ответ:

```json
{
  "id": "123",
  "email": "user@example.com",
  "name": "New Name",
  "avatar": "https://example.com/new-avatar.jpg",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-02T00:00:00Z"
}
```

## Учебные планы

### Получение списка учебных планов

```http
GET /study-plans
Authorization: Bearer {token}
```

Ответ:

```json
{
  "study_plans": [
    {
      "id": "plan-1",
      "title": "Подготовка к экзамену по математике",
      "description": "План подготовки к ЕГЭ по математике",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z",
      "progress": 75
    },
    {
      "id": "plan-2",
      "title": "Подготовка к экзамену по физике",
      "description": "План подготовки к ЕГЭ по физике",
      "created_at": "2023-01-02T00:00:00Z",
      "updated_at": "2023-01-02T00:00:00Z",
      "progress": 50
    }
  ]
}
```

### Получение учебного плана по ID

```http
GET /study-plans/{plan_id}
Authorization: Bearer {token}
```

Ответ:

```json
{
  "id": "plan-1",
  "title": "Подготовка к экзамену по математике",
  "description": "План подготовки к ЕГЭ по математике",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z",
  "progress": 75,
  "modules": [
    {
      "id": "module-1",
      "title": "Алгебра",
      "description": "Основы алгебры",
      "progress": 80,
      "lessons": [
        {
          "id": "lesson-1",
          "title": "Уравнения",
          "description": "Линейные и квадратные уравнения",
          "completed": true
        },
        {
          "id": "lesson-2",
          "title": "Неравенства",
          "description": "Линейные и квадратные неравенства",
          "completed": false
        }
      ]
    }
  ]
}
```

### Создание учебного плана

```http
POST /study-plans
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Подготовка к экзамену по информатике",
  "description": "План подготовки к ЕГЭ по информатике",
  "modules": [
    {
      "title": "Алгоритмы",
      "description": "Основы алгоритмов",
      "lessons": [
        {
          "title": "Сортировка",
          "description": "Алгоритмы сортировки"
        },
        {
          "title": "Поиск",
          "description": "Алгоритмы поиска"
        }
      ]
    }
  ]
}
```

Ответ:

```json
{
  "id": "plan-3",
  "title": "Подготовка к экзамену по информатике",
  "description": "План подготовки к ЕГЭ по информатике",
  "created_at": "2023-01-03T00:00:00Z",
  "updated_at": "2023-01-03T00:00:00Z",
  "progress": 0,
  "modules": [
    {
      "id": "module-3",
      "title": "Алгоритмы",
      "description": "Основы алгоритмов",
      "progress": 0,
      "lessons": [
        {
          "id": "lesson-5",
          "title": "Сортировка",
          "description": "Алгоритмы сортировки",
          "completed": false
        },
        {
          "id": "lesson-6",
          "title": "Поиск",
          "description": "Алгоритмы поиска",
          "completed": false
        }
      ]
    }
  ]
}
```

## Тесты

### Получение списка тестов

```http
GET /tests
Authorization: Bearer {token}
```

Ответ:

```json
{
  "tests": [
    {
      "id": "test-1",
      "title": "Тест по алгебре",
      "description": "Проверка знаний по алгебре",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z",
      "questions_count": 10,
      "time_limit": 30
    },
    {
      "id": "test-2",
      "title": "Тест по геометрии",
      "description": "Проверка знаний по геометрии",
      "created_at": "2023-01-02T00:00:00Z",
      "updated_at": "2023-01-02T00:00:00Z",
      "questions_count": 15,
      "time_limit": 45
    }
  ]
}
```

### Получение теста по ID

```http
GET /tests/{test_id}
Authorization: Bearer {token}
```

Ответ:

```json
{
  "id": "test-1",
  "title": "Тест по алгебре",
  "description": "Проверка знаний по алгебре",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z",
  "questions_count": 10,
  "time_limit": 30,
  "questions": [
    {
      "id": "question-1",
      "text": "Решите уравнение: 2x + 3 = 7",
      "type": "short_answer",
      "options": null,
      "correct_answer": "2"
    },
    {
      "id": "question-2",
      "text": "Выберите правильный ответ: 2^3 = ?",
      "type": "multiple_choice",
      "options": ["4", "6", "8", "10"],
      "correct_answer": "8"
    }
  ]
}
```

### Создание теста

```http
POST /tests
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Тест по физике",
  "description": "Проверка знаний по физике",
  "time_limit": 60,
  "questions": [
    {
      "text": "Второй закон Ньютона: F = ?",
      "type": "short_answer",
      "correct_answer": "ma"
    },
    {
      "text": "Единица измерения силы в СИ:",
      "type": "multiple_choice",
      "options": ["Ньютон", "Джоуль", "Ватт", "Паскаль"],
      "correct_answer": "Ньютон"
    }
  ]
}
```

Ответ:

```json
{
  "id": "test-3",
  "title": "Тест по физике",
  "description": "Проверка знаний по физике",
  "created_at": "2023-01-03T00:00:00Z",
  "updated_at": "2023-01-03T00:00:00Z",
  "questions_count": 2,
  "time_limit": 60,
  "questions": [
    {
      "id": "question-5",
      "text": "Второй закон Ньютона: F = ?",
      "type": "short_answer",
      "options": null,
      "correct_answer": "ma"
    },
    {
      "id": "question-6",
      "text": "Единица измерения силы в СИ:",
      "type": "multiple_choice",
      "options": ["Ньютон", "Джоуль", "Ватт", "Паскаль"],
      "correct_answer": "Ньютон"
    }
  ]
}
```

## Результаты тестов

### Отправка результатов теста

```http
POST /tests/{test_id}/results
Authorization: Bearer {token}
Content-Type: application/json

{
  "answers": [
    {
      "question_id": "question-1",
      "answer": "2"
    },
    {
      "question_id": "question-2",
      "answer": "8"
    }
  ],
  "time_spent": 25
}
```

Ответ:

```json
{
  "id": "result-1",
  "test_id": "test-1",
  "user_id": "123",
  "score": 100,
  "max_score": 100,
  "time_spent": 25,
  "created_at": "2023-01-03T00:00:00Z",
  "answers": [
    {
      "question_id": "question-1",
      "user_answer": "2",
      "correct_answer": "2",
      "is_correct": true
    },
    {
      "question_id": "question-2",
      "user_answer": "8",
      "correct_answer": "8",
      "is_correct": true
    }
  ],
  "analysis": {
    "strengths": ["Уравнения", "Степени"],
    "weaknesses": [],
    "recommendations": [
      "Продолжайте практиковаться в решении уравнений",
      "Переходите к более сложным темам"
    ]
  }
}
```

### Получение истории результатов тестов

```http
GET /user/test-results
Authorization: Bearer {token}
```

Ответ:

```json
{
  "results": [
    {
      "id": "result-1",
      "test_id": "test-1",
      "test_title": "Тест по алгебре",
      "score": 100,
      "max_score": 100,
      "time_spent": 25,
      "created_at": "2023-01-03T00:00:00Z"
    },
    {
      "id": "result-2",
      "test_id": "test-2",
      "test_title": "Тест по геометрии",
      "score": 80,
      "max_score": 100,
      "time_spent": 40,
      "created_at": "2023-01-04T00:00:00Z"
    }
  ]
}
```

## Рекомендации

### Получение персонализированных рекомендаций

```http
GET /recommendations
Authorization: Bearer {token}
```

Ответ:

```json
{
  "recommendations": [
    {
      "id": "rec-1",
      "type": "material",
      "title": "Учебник по алгебре",
      "description": "Рекомендуется для улучшения навыков решения уравнений",
      "url": "https://example.com/algebra-book",
      "relevance_score": 0.95
    },
    {
      "id": "rec-2",
      "type": "test",
      "title": "Тест по тригонометрии",
      "description": "Рекомендуется для проверки знаний по тригонометрии",
      "test_id": "test-4",
      "relevance_score": 0.85
    }
  ]
}
```

## Ошибки

API возвращает стандартные HTTP-коды состояния для индикации успеха или неудачи запроса. В случае ошибки возвращается JSON-объект с описанием ошибки.

### Пример ошибки

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "error": {
    "code": "unauthorized",
    "message": "Invalid or expired token"
  }
}
```

### Коды ошибок

| Код | Описание |
|-----|----------|
| 400 | Bad Request - Неверный запрос |
| 401 | Unauthorized - Требуется аутентификация |
| 403 | Forbidden - Доступ запрещен |
| 404 | Not Found - Ресурс не найден |
| 422 | Unprocessable Entity - Невозможно обработать запрос |
| 429 | Too Many Requests - Слишком много запросов |
| 500 | Internal Server Error - Внутренняя ошибка сервера |

## Ограничения

- Максимальное количество запросов: 100 запросов в минуту
- Максимальный размер запроса: 10 МБ
- Максимальное количество элементов в массиве: 1000
