# 📡 API Endpoints

## Обзор

Все endpoints сгруппированы по функциональным областям.

**Base URL:** `http://localhost:8000/api`

**Auth:** Bearer token в заголовке `Authorization`

---

## 1. Авторизация

### POST /api/auth/login

Вход пользователя по email.

**Request:**
```json
{
  "email": "director@bureau.ru"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "email": "director@bureau.ru",
    "name": "Директоров Директор Д.",
    "role": "director"
  }
}
```

---

### GET /api/user/profile

Получить профиль текущего пользователя.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "email": "director@bureau.ru",
  "name": "Директоров Директор Д.",
  "role": "director",
  "created_at": "2026-03-18T10:00:00"
}
```

---

### POST /api/auth/logout

Выход из системы (опционально).

**Response (200):**
```json
{
  "success": true
}
```

---

## 2. Проекты

### GET /api/projects

Получить список проектов.

**Query params:**
- `search` (string) — Поиск по названию
- `status` (string) — Фильтр по статусу

**Response (200):**
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "Жилой дом на Ленина",
      "address": "г. Москва, ул. Ленина, д. 5",
      "status": "active",
      "gip_email": "gip-ivanov@bureau.ru",
      "created_at": "2026-03-18T10:00:00",
      "sections_count": 2,
      "surveys_count": 2
    }
  ],
  "total": 3
}
```

---

### POST /api/projects

Создать новый проект.

**Request:**
```json
{
  "name": "Новый проект",
  "address": "г. Москва, ...",
  "gip_email": "gip-ivanov@bureau.ru"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "name": "Новый проект",
  ...
}
```

---

### GET /api/projects/{id}

Получить детали проекта.

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Жилой дом на Ленина",
  "address": "г. Москва, ул. Ленина, д. 5",
  "status": "active",
  "gip_email": "gip-ivanov@bureau.ru",
  "created_at": "2026-03-18T10:00:00",
  "sections": [...],
  "surveys": [...],
  "members": ["email1", "email2"]
}
```

---

### PUT /api/projects/{id}

Обновить проект.

**Request:**
```json
{
  "name": "Обновлённое название",
  "status": "expertise"
}
```

---

### DELETE /api/projects/{id}

Удалить проект.

**Response (200):**
```json
{
  "success": true
}
```

---

### POST /api/projects/{id}/members/{email}

Добавить участника в команду проекта.

**Response (200):**
```json
{
  "success": true
}
```

---

### DELETE /api/projects/{id}/members/{email}

Удалить участника из команды.

---

## 3. Разделы

### POST /api/projects/{id}/sections

Создать раздел в проекте.

**Request:**
```json
{
  "code": "АР",
  "name": "Архитектурные решения",
  "cipher": "АР.12.34",
  "executor_email": "executor-petrov@bureau.ru"
}
```

---

### GET /api/sections/{id}

Получить детали раздела.

**Response (200):**
```json
{
  "id": "uuid",
  "project_id": "uuid",
  "code": "АР",
  "name": "Архитектурные решения",
  "cipher": "АР.12.34",
  "executor_email": "executor-petrov@bureau.ru",
  "status": "in_progress",
  "created_at": "2026-03-18T10:00:00",
  "files": [...],
  "messages": [...],
  "tasks": [...],
  "observers": ["email1", "email2"]
}
```

---

### PUT /api/sections/{id}

Обновить раздел.

---

### DELETE /api/sections/{id}

Удалить раздел.

---

### POST /api/sections/{id}/observers/{email}

Добавить наблюдателя раздела.

---

### DELETE /api/sections/{id}/observers/{email}

Удалить наблюдателя.

---

## 4. Изыскания

### POST /api/projects/{id}/surveys

Создать изыскание.

**Request:**
```json
{
  "type": "geology",
  "name": "Инженерно-геологические изыскания",
  "executor_email": "executor-petrov@bureau.ru"
}
```

---

### GET /api/surveys/{id}

Получить детали изыскания.

**Response (200):**
```json
{
  "id": "uuid",
  "project_id": "uuid",
  "type": "geology",
  "name": "Инженерно-геологические изыскания",
  "executor_email": "executor-petrov@bureau.ru",
  "status": "in_progress",
  "created_at": "2026-03-18T10:00:00",
  "files": [...],
  "messages": [...],
  "observers": ["email1", "email2"]
}
```

---

### PUT /api/surveys/{id}

Обновить изыскание.

---

### DELETE /api/surveys/{id}

Удалить изыскание.

---

### POST /api/surveys/{id}/observers/{email}

Добавить наблюдателя изыскания.

---

## 5. Файлы

### POST /api/upload

Загрузить файл.

**Content-Type:** `multipart/form-data`

**Form data:**
- `file` (File) — Файл
- `project_id` (string) — ID проекта
- `section_id` (string, opt) — ID раздела
- `survey_id` (string, opt) — ID изыскания

**Response (200):**
```json
{
  "id": 1,
  "project_id": "uuid",
  "section_id": "uuid",
  "filename": "a1b2c3d4-...",
  "original_name": "plan.pdf",
  "uploaded_at": "2026-03-18T10:00:00",
  "uploaded_by": "executor-petrov@bureau.ru",
  "checked": false,
  "errors_count": 0
}
```

---

### GET /api/files/{id}

Получить информацию о файле.

---

### GET /api/files/{id}/download

Скачать файл.

**Response:** File (binary)

---

### DELETE /api/files/{id}

Удалить файл.

---

### GET /api/files/{id}/check

Проверить штампы в PDF (опционально).

**Response (200):**
```json
{
  "checked": true,
  "errors_count": 2,
  "errors_details": [
    {"page": 5, "field": "cipher", "expected": "АР.12.34", "found": "АР.12.35"}
  ]
}
```

---

## 6. Чат

### POST /api/chat

Отправить сообщение в чат.

**Request:**
```json
{
  "project_id": "uuid",
  "section_id": "uuid",
  "text": "Прошу проверить чертежи"
}
```

**Response (201):**
```json
{
  "id": 1,
  "project_id": "uuid",
  "section_id": "uuid",
  "author_email": "executor-petrov@bureau.ru",
  "author_name": "Петров П.П.",
  "text": "Прошу проверить чертежи",
  "created_at": "2026-03-18T10:00:00"
}
```

---

### GET /api/projects/{id}/chat

Получить сообщения чата проекта.

**Response (200):**
```json
{
  "items": [...],
  "total": 10
}
```

---

### GET /api/sections/{id}/chat

Получить сообщения чата раздела.

---

### GET /api/surveys/{id}/chat

Получить сообщения чата изыскания.

---

## 7. Задачи

### POST /api/tasks

Создать задачу.

**Request:**
```json
{
  "project_id": "uuid",
  "section_id": "uuid",
  "title": "Исправить штамп",
  "description": "Неверный шифр",
  "assigned_to": "executor-petrov@bureau.ru",
  "deadline": "2026-03-25"
}
```

---

### GET /api/tasks

Получить список задач.

**Query params:**
- `project_id` (string)
- `assigned_to` (string)
- `status` (string)

**Response (200):**
```json
{
  "items": [...],
  "total": 10
}
```

---

### PUT /api/tasks/{id}

Обновить задачу.

---

### DELETE /api/tasks/{id}

Удалить задачу.

---

## 8. История

### GET /api/projects/{id}/history

Получить историю проекта.

**Query params:**
- `section_id` (string, opt)
- `survey_id` (string, opt)
- `limit` (int, default 50)

**Response (200):**
```json
{
  "items": [
    {
      "id": 1,
      "project_id": "uuid",
      "user_email": "director@bureau.ru",
      "user_name": "Директоров Д.Д.",
      "action": "project_created",
      "details": "Создан проект",
      "created_at": "2026-03-18T10:00:00"
    }
  ],
  "total": 30
}
```

---

### GET /api/sections/{id}/history

История раздела.

---

### GET /api/surveys/{id}/history

История изыскания.

---

## 9. Сотрудники

### GET /api/employees

Получить список сотрудников.

**Query params:**
- `search` (string)
- `role` (string)

**Response (200):**
```json
{
  "items": [
    {
      "email": "director@bureau.ru",
      "name": "Директоров Директор Д.",
      "role": "director",
      "created_at": "2026-03-18T10:00:00"
    }
  ],
  "total": 5
}
```

---

### POST /api/employees

Создать сотрудника.

**Request:**
```json
{
  "email": "new@bureau.ru",
  "name": "Новиков Н.Н.",
  "role": "executor"
}
```

---

### PUT /api/employees/{email}

Обновить сотрудника.

---

### DELETE /api/employees/{email}

Удалить сотрудника.

---

## 10. Справочники

### GET /api/dictionaries/sections

Получить типы разделов.

**Response (200):**
```json
[
  {
    "id": "1",
    "code": "АР",
    "name": "Архитектурные решения",
    "color": "#3b82f6",
    "is_active": true
  }
]
```

---

### GET /api/dictionaries/surveys

Получить типы изысканий.

---

## 11. Дашборд

### GET /api/dashboard/stats

Получить статистику для дашборда.

**Response (200):**
```json
{
  "projects": {
    "total": 3,
    "active": 2,
    "expertise": 1,
    "completed": 0
  },
  "sections": {
    "total": 5,
    "in_progress": 3,
    "done": 2
  },
  "tasks": {
    "total": 10,
    "open": 3,
    "overdue": 1
  }
}
```

---

## 12. Инициализация

### GET /api/init-test-data

Создать тестовые данные.

**Response (200):**
```json
{
  "success": true,
  "message": "Тестовые данные созданы"
}
```

---

## Коды ошибок

| Код | Описание |
|-----|----------|
| 200 | Успех |
| 201 | Создано |
| 400 | Неверный запрос |
| 401 | Не авторизован |
| 403 | Нет прав |
| 404 | Не найдено |
| 500 | Внутренняя ошибка |

---

**Версия:** 1.0  
**Дата:** 2026-03-18
