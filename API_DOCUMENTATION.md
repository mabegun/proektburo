# 📡 API Documentation для backend-разработчиков

**Проект:** Система управления проектным бюро  
**Версия:** 1.0  
**Дата:** 16.03.2026  
**Статус:** Frontend готов к интеграции (100% покрытие)

---

## 🎯 Общая информация

Frontend полностью готов к интеграции с backend. Все 36 страниц прототипа имеют JavaScript-скрипты для работы с API.

**Технологии frontend:**
- HTML5 + Tailwind CSS
- Vanilla JavaScript (ES6+)
- Fetch API для HTTP-запросов

**Ожидаемый формат данных:** JSON

---

## 🔐 Аутентификация

### POST /api/auth/login

**Вход:**
```json
{
  "email": "user@prokb.ru",
  "password": "password123"
}
```

**Ответ:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "name": "Иванов П.С.",
    "email": "user@prokb.ru",
    "role": "director"
  }
}
```

**Используется в:** `js/pages/login.js`

---

### GET /api/user/profile

**Ответ:**
```json
{
  "id": "uuid",
  "name": "Иванов П.С.",
  "email": "user@prokb.ru",
  "role": "director",
  "avatar": "url"
}
```

**Используется в:** Все страницы (обновление профиля в сайдбаре)

---

## 🏗️ Проекты

### GET /api/projects

**Query params:**
- `search` (string) — поиск по названию
- `status` (string) — фильтр по статусу
- `type` (string) — фильтр по типу
- `limit` (number) — лимит записей
- `offset` (number) — смещение

**Ответ:**
```json
{
  "items": [
    {
      "id": "uuid",
      "code": "2025-001",
      "name": "ЖК \"Северное сияние\"",
      "status": "in_progress",
      "type": "new_construction",
      "address": "г. Москва, ул. Ленина, д. 45",
      "progress": 33,
      "deadline": "2025-06-30",
      "sections": [...],
      "surveys": [...]
    }
  ],
  "total": 50
}
```

**Используется в:** `js/pages/projects-list.js`, `js/pages/dashboard.js`

---

### GET /api/projects/:id

**Ответ:**
```json
{
  "id": "uuid",
  "code": "2025-001",
  "name": "ЖК \"Северное сияние\"",
  "status": "in_progress",
  "type": "new_construction",
  "address": "г. Москва, ул. Ленина, д. 45",
  "customer": "ООО \"СтройИнвест\"",
  "startDate": "2024-01-15",
  "deadline": "2025-06-30",
  "area": 45000,
  "floors": 25,
  "description": "Техническое задание...",
  "inputFiles": [...],
  "sections": [...],
  "surveys": [...],
  "files": [...],
  "team": [...]
}
```

**Используется в:** `js/pages/project-detail.js`, `js/pages/project-detail-employee.js`

---

### POST /api/projects

**Вход:**
```json
{
  "code": "2025-002",
  "name": "Реконструкция здания",
  "type": "reconstruction",
  "address": "г. Москва, ул. Мира, д. 12",
  "customer": "ООО \"Заказчик\"",
  "startDate": "2025-01-01",
  "deadline": "2025-12-31",
  "gipId": "uuid",
  "sectionIds": ["uuid1", "uuid2"],
  "surveyIds": ["uuid3"]
}
```

**Используется в:** `js/pages/project-create.js`

---

### GET /api/projects/:id/discussions

**Ответ:**
```json
[
  {
    "id": "uuid",
    "text": "Комментарий",
    "author": {"id": "uuid", "name": "Петров А.И."},
    "createdAt": "2025-03-16T10:00:00Z",
    "file": {...},
    "replies": [...]
  }
]
```

**Используется в:** `js/pages/project-discussion.js`

---

### POST /api/projects/:id/discussions

**Вход:**
```json
{
  "text": "Текст комментария",
  "parentId": "uuid"
}
```

**Используется в:** `js/pages/project-discussion.js`

---

### GET /api/projects/:id/expertise

**Ответ:**
```json
[
  {
    "id": "uuid",
    "number": "127",
    "text": "Замечание",
    "status": "in_progress",
    "priority": "high",
    "assignee": {"id": "uuid", "name": "Петров А.И."},
    "deadline": "2025-03-20",
    "sectionCode": "АР",
    "repliesCount": 2
  }
]
```

**Используется в:** `js/pages/project-expertise.js`

---

### GET /api/projects/:id/history

**Ответ:**
```json
[
  {
    "id": "uuid",
    "type": "file.uploaded",
    "title": "Файл загружен",
    "description": "Петров А.И. загрузил файл",
    "author": {"id": "uuid", "name": "Петров А.И."},
    "createdAt": "2025-03-16T10:00:00Z",
    "metadata": {"fileName": "АР_План.pdf"}
  }
]
```

**Используется в:** `js/pages/project-history.js`

---

### GET /api/projects/:id/finances

**Ответ:**
```json
{
  "totalIncome": 1200000,
  "totalExpenses": 850000,
  "incomes": [...],
  "expenses": [...],
  "missingDocuments": [...]
}
```

**Используется в:** `js/pages/project-finances.js`

---

## 📁 Разделы

### GET /api/sections

**Query params:**
- `projectId` (uuid) — фильтр по проекту
- `status` (string) — фильтр по статусу

**Ответ:**
```json
[
  {
    "id": "uuid",
    "projectId": "uuid",
    "code": "АР",
    "name": "Архитектурные решения",
    "status": "in_progress",
    "responsible": {"id": "uuid", "name": "Петров А.И."},
    "deadline": "2025-04-15",
    "progress": 67,
    "color": "#3b82f6"
  }
]
```

**Используется в:** `js/pages/section-detail.js`, `js/pages/project-detail.js`

---

### GET /api/sections/:id

**Ответ:**
```json
{
  "id": "uuid",
  "projectId": "uuid",
  "projectCode": "2025-001",
  "projectName": "ЖК \"Северное сияние\"",
  "sectionType": {
    "id": "uuid",
    "code": "АР",
    "name": "Архитектурные решения",
    "color": "#3b82f6"
  },
  "status": "completed",
  "responsible": {
    "id": "uuid",
    "name": "Петров А.И.",
    "position": "Архитектор"
  },
  "coExecutors": [
    {"id": "uuid", "name": "Сидоров К.М.", "position": "Инженер ГП"},
    {"id": "uuid", "name": "Кузнецов Д.В.", "position": "Инженер ОВ"}
  ],
  "observers": [
    {"id": "uuid", "name": "Васильев П.П.", "position": "Инженер ВК"}
  ],
  "deadline": "2025-02-28",
  "startDate": "2025-01-15",
  "completedDate": "2025-02-16",
  "inputData": {
    "text": "Дополнительные указания по разделу АР...",
    "files": [
      {
        "id": "uuid",
        "name": "Доп_указания_АР.pdf",
        "size": 1200000,
        "uploadedAt": "2025-01-16T10:00:00Z",
        "uploadedBy": {"id": "uuid", "name": "Иванов П.С."}
      }
    ]
  },
  "contract": {
    "id": "uuid",
    "number": "2025-03-15",
    "date": "2025-03-15",
    "contractorType": "ip",
    "amount": 100000,
    "status": "active",
    "paidAmount": 80000
  },
  "stats": {
    "filesCount": 3,
    "filesSize": 14400000,
    "commentsCount": 4,
    "expertiseCount": 2
  },
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-02-16T14:00:00Z"
}
```

**Используется в:** `js/pages/section-detail.js` (страница Обзор)

---

### GET /api/sections/:id/files

**Query params:**
- `status` (string) — фильтр по статусу (approved, pending, rejected)
- `search` (string) — поиск по названию

**Ответ:**
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "АР_План_этажей.pdf",
      "size": 2400000,
      "mimeType": "application/pdf",
      "status": "approved",
      "version": 2,
      "uploadedBy": {"id": "uuid", "name": "Петров А.И."},
      "uploadedAt": "2025-02-16T14:30:00Z",
      "approvedBy": {"id": "uuid", "name": "Иванов П.С."},
      "approvedAt": "2025-02-16T16:00:00Z"
    }
  ],
  "total": 4,
  "approved": 3,
  "pending": 1,
  "rejected": 0
}
```

**Используется в:** `js/pages/section-files.js` (страница Файлы)

---

### POST /api/sections/:id/files

**Content-Type:** `multipart/form-data`

**Вход:**
- `file` (File) — файл
- `description` (string) — описание (опционально)

**Ответ:**
```json
{
  "id": "uuid",
  "name": "АР_План_этажей.pdf",
  "size": 2400000,
  "status": "pending"
}
```

**Используется в:** `js/pages/section-files.js`

---

### PUT /api/sections/:id/files/:fileId/approve

**Вход:**
```json
{
  "approved": true
}
```

**Ответ:**
```json
{
  "id": "uuid",
  "status": "approved",
  "approvedBy": {"id": "uuid", "name": "Иванов П.С."},
  "approvedAt": "2025-02-16T16:00:00Z"
}
```

**Используется в:** `js/pages/section-files.js`

---

### GET /api/sections/:id/discussion

**Ответ:**
```json
{
  "items": [
    {
      "id": "uuid",
      "text": "Загрузил первые чертежи планов этажей. Прошу проверить.",
      "author": {"id": "uuid", "name": "Петров А.И.", "avatarColor": "#3b82f6"},
      "createdAt": "2025-02-15T14:30:00Z",
      "attachments": [
        {
          "id": "uuid",
          "name": "АР_План_этажей.pdf",
          "size": 2400000
        }
      ]
    }
  ],
  "total": 7,
  "participants": [
    {"id": "uuid", "name": "Иванов П.С."},
    {"id": "uuid", "name": "Петров А.И."},
    {"id": "uuid", "name": "Сидоров К.М."}
  ]
}
```

**Используется в:** `js/pages/section-discussion.js` (страница Обсуждение)

---

### POST /api/sections/:id/discussion

**Вход:**
```json
{
  "text": "Текст сообщения",
  "attachments": ["fileId1", "fileId2"]
}
```

**Ответ:**
```json
{
  "id": "uuid",
  "text": "Текст сообщения",
  "author": {"id": "uuid", "name": "Иванов П.С."},
  "createdAt": "2025-02-16T10:00:00Z",
  "attachments": [...]
}
```

**Используется в:** `js/pages/section-discussion.js`

---

### GET /api/sections/:id/finances

**Ответ:**
```json
{
  "contract": {
    "id": "uuid",
    "number": "2025-03-15",
    "date": "2025-03-15",
    "contractorType": "ip",
    "contractorName": "Петров А.И.",
    "amount": 100000,
    "status": "active",
    "file": {
      "id": "uuid",
      "name": "Договор_АР_Петров.pdf",
      "size": 1500000
    }
  },
  "payments": [
    {
      "id": "uuid",
      "type": "Аванс",
      "amount": 30000,
      "date": "2025-03-15",
      "status": "paid",
      "invoiceNumber": "123"
    },
    {
      "id": "uuid",
      "type": "Основная часть",
      "amount": 50000,
      "date": "2025-03-18",
      "status": "paid",
      "invoiceNumber": "156"
    },
    {
      "id": "uuid",
      "type": "Остаток",
      "amount": 20000,
      "status": "pending"
    }
  ],
  "summary": {
    "total": 100000,
    "paid": 80000,
    "pending": 20000,
    "progress": 80
  },
  "employee": {
    "id": "uuid",
    "name": "Петров А.И.",
    "position": "Архитектор",
    "email": "petrov@company.ru",
    "phone": "+7 (999) 123-45-67"
  }
}
```

**Используется в:** `js/pages/section-finances.js` (страница Финансы)

---

### GET /api/sections/:id/expertise

**Ответ:**
```json
[
  {
    "id": "uuid",
    "number": "126",
    "text": "Доработать узлы примыкания кровли к парапету",
    "status": "review",
    "priority": "high",
    "assignee": {"id": "uuid", "name": "Петров А.И."},
    "createdAt": "2025-03-20T10:00:00Z",
    "deadline": "2025-03-25"
  }
]
```

**Используется в:** `js/pages/section-expertise.js` (страница Замечания)

---

### GET /api/sections/:id/history

**Query params:**
- `type` (string) — фильтр по типу события (files, comments, status, participants, finances)
- `userId` (uuid) — фильтр по участнику
- `from` (date) — с даты
- `to` (date) — по дату

**Ответ:**
```json
{
  "items": [
    {
      "id": "uuid",
      "type": "status_changed",
      "title": "Раздел утверждён",
      "description": "Раздел переведён в статус «Завершён»",
      "user": {"id": "uuid", "name": "Иванов П.С."},
      "createdAt": "2025-02-16T14:00:00Z",
      "metadata": {
        "oldStatus": "on_approval",
        "newStatus": "completed"
      }
    },
    {
      "id": "uuid",
      "type": "file_uploaded",
      "title": "Файл загружен",
      "description": "Петров А.И. загрузил файл",
      "user": {"id": "uuid", "name": "Петров А.И."},
      "createdAt": "2025-02-16T11:30:00Z",
      "metadata": {
        "fileName": "АР_План_этажей.pdf",
        "fileSize": 2600000
      }
    }
  ],
  "total": 15,
  "stats": {
    "filesUploaded": 8,
    "commentsAdded": 4,
    "participantsChanged": 3
  }
}
```

**Используется в:** `js/pages/section-history.js` (страница История)

---

### PUT /api/sections/:id/input-data

**Вход:**
```json
{
  "text": "Обновлённые вводные данные...",
  "filesToAdd": ["fileId1"],
  "filesToRemove": ["fileId2"]
}
```

**Используется в:** `js/pages/section-detail.js` (редактирование вводных данных)

---

### PUT /api/sections/:id/participants

**Вход:**
```json
{
  "responsibleId": "uuid",
  "coExecutorIds": ["uuid1", "uuid2"],
  "observerIds": ["uuid3"]
}
```

**Используется в:** `js/pages/section-detail.js` (управление участниками)

---

## 🔬 Изыскания

### GET /api/surveys

**Query params:**
- `projectId` (uuid)

**Ответ:**
```json
[
  {
    "id": "uuid",
    "code": "ИГД",
    "name": "Инженерно-геодезические изыскания",
    "status": "completed",
    "responsible": {...},
    "progress": 100,
    "deadline": "2025-03-01"
  }
]
```

**Используется в:** `js/pages/survey-detail.js`

---

### GET /api/surveys/:id

**Ответ:**
```json
{
  "id": "uuid",
  "code": "ИГД",
  "name": "Инженерно-геодезические изыскания",
  "status": "completed",
  "typeName": "ИГД",
  "responsible": {...},
  "contractor": {...},
  "contract": {...},
  "files": [...],
  "comments": [...],
  "progress": 100,
  "deadline": "2025-03-01"
}
```

**Используется в:** `js/pages/survey-detail.js`, `js/pages/survey-detail-observer.js`

---

### GET /api/surveys/:id/finances

**Ответ:**
```json
{
  "totalPayments": 5,
  "paid": 350000,
  "pending": 50000,
  "payments": [...]
}
```

**Используется в:** `js/pages/survey-finances.js`

---

### GET /api/surveys/:id/expertise

**Ответ:**
```json
[
  {
    "id": "uuid",
    "number": "12",
    "text": "Замечание по изысканию",
    "status": "in_progress",
    "priority": "high"
  }
]
```

**Используется в:** `js/pages/survey-expertise.js`

---

## 📋 Задачи

### GET /api/tasks

**Query params:**
- `assignee_id` (uuid)
- `project_id` (uuid)
- `status` (string)
- `priority` (string)

**Ответ:**
```json
{
  "items": [
    {
      "id": "uuid",
      "title": "Проверить чертежи",
      "description": "Текст задачи",
      "status": "in_progress",
      "priority": "high",
      "projectId": "uuid",
      "projectName": "ЖК Северное сияние",
      "assignees": [...],
      "dueDate": "2025-03-20",
      "subtasks": [...]
    }
  ]
}
```

**Используется в:** `js/pages/tasks-list.js`

---

### POST /api/tasks

**Вход:**
```json
{
  "title": "Название задачи",
  "description": "Описание",
  "projectId": "uuid",
  "sectionId": "uuid",
  "assigneeId": "uuid",
  "dueDate": "2025-03-20",
  "priority": "high",
  "subtasks": [{"title": "Подзадача 1"}]
}
```

**Используется в:** `js/pages/task-create.js`

---

## 👥 Сотрудники

### GET /api/employees

**Query params:**
- `search` (string)
- `department` (string)
- `role` (string)
- `contractor_type` (string)

**Ответ:**
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "Иванов П.С.",
      "position": "ГИП",
      "email": "ivanov@prokb.ru",
      "phone": "+7 999 123-45-67",
      "department": "Архитектурный",
      "role": "gip",
      "contractorType": "employee",
      "projectsCount": 5,
      "payments": {"paid": 150000, "total": 200000, "progress": 75}
    }
  ]
}
```

**Используется в:** `js/pages/employees-list.js`

---

### POST /api/employees

**Вход:**
```json
{
  "name": "Петров А.И.",
  "position": "Архитектор",
  "email": "petrov@prokb.ru",
  "phone": "+7 999 123-45-67",
  "department": "Архитектурный",
  "role": "employee",
  "contractorType": "employee"
}
```

**Используется в:** `js/pages/employee-create.js`

---

## 💰 Финансы

### GET /api/finance-operations

**Query params:**
- `projectId` (uuid)
- `type` (income/expense)

**Ответ:**
```json
[
  {
    "id": "uuid",
    "name": "Выплата Петрову А.И.",
    "type": "expense",
    "amount": 50000,
    "date": "2025-03-15",
    "status": "paid",
    "employeeName": "Петров А.И.",
    "contractorType": "employee",
    "sectionName": "АР",
    "documentsMissing": 0
  }
]
```

**Используется в:** `js/pages/project-finances.js`, `js/pages/project-finances-employee.js`

---

### GET /api/contracts/:id

**Ответ:**
```json
{
  "id": "uuid",
  "code": "Д-2025-001",
  "date": "2025-01-15",
  "contractor": {"name": "ООО \"Подрядчик\""},
  "type": "section",
  "amount": 100000,
  "status": "active",
  "sections": [...],
  "surveys": [...],
  "payments": [...],
  "documents": [...]
}
```

**Используется в:** `js/pages/contract-detail.js`

---

### GET /api/payments/:id

**Ответ:**
```json
{
  "id": "uuid",
  "number": "15",
  "name": "Выплата за март",
  "amount": 50000,
  "date": "2025-03-15",
  "status": "paid",
  "employeeName": "Петров А.И.",
  "contractorType": "employee",
  "documentsTotal": 4,
  "documentsUploaded": 4,
  "documents": [...],
  "history": [...]
}
```

**Используется в:** `js/pages/payment-detail.js`

---

## ⚠️ Экспертиза

### GET /api/expertise

**Query params:**
- `projectId` (uuid)
- `sectionId` (uuid)
- `surveyId` (uuid)
- `status` (string)

**Ответ:**
```json
[
  {
    "id": "uuid",
    "number": "127",
    "text": "Замечание",
    "status": "in_progress",
    "priority": "high",
    "assignee": {...},
    "deadline": "2025-03-20",
    "repliesCount": 2
  }
]
```

**Используется в:** `js/pages/project-expertise.js`, `js/pages/section-expertise.js`, `js/pages/survey-expertise.js`

---

### POST /api/expertise

**Вход:**
```json
{
  "number": "127",
  "sectionId": "uuid",
  "surveyId": "uuid",
  "assigneeId": "uuid",
  "deadline": "2025-03-20",
  "priority": "high",
  "text": "Текст замечания"
}
```

**Используется в:** `js/pages/expertise-create.js`

---

### PUT /api/expertise/:id

**Вход:**
```json
{
  "status": "review",
  "replyText": "Ответ на замечание"
}
```

**Используется в:** `js/pages/expertise-comment.js`

---

### POST /api/expertise/:id/replies

**Вход:**
```json
{
  "text": "Ответ на замечание"
}
```

**Используется в:** `js/pages/expertise-comment.js`

---

## 📚 Справочники

### GET /api/dictionaries/sections

**Ответ:**
```json
[
  {
    "id": "uuid",
    "code": "АР",
    "name": "Архитектурные решения",
    "color": "#3b82f6",
    "active": true
  }
]
```

**Используется в:** `js/pages/settings-sections.js`, `js/pages/project-create.js`

---

### GET /api/dictionaries/surveys

**Ответ:**
```json
[
  {
    "id": "uuid",
    "code": "ИГД",
    "name": "Инженерно-геодезические изыскания",
    "color": "#10b981",
    "active": true
  }
]
```

**Используется в:** `js/pages/settings-surveys.js`, `js/pages/survey-create.js`

---

### GET /api/dictionaries/expenses

**Ответ:**
```json
[
  {
    "id": "uuid",
    "code": "TRAVEL",
    "name": "Командировки",
    "parentId": null,
    "active": true
  }
]
```

**Используется в:** `js/pages/settings-expenses.js`

---

### GET /api/dictionaries/contractor-types

**Ответ:**
```json
[
  {
    "id": "uuid",
    "code": "ooo",
    "name": "ООО",
    "requiredDocuments": ["Устав", "ИНН", "Договор"],
    "active": true
  }
]
```

**Используется в:** `js/pages/settings-contractor-types.js`, `js/pages/employee-create.js`

---

## 🔔 Уведомления

### GET /api/notifications

**Query params:**
- `type` (string)
- `unread` (boolean)
- `limit` (number)

**Ответ:**
```json
{
  "items": [
    {
      "id": "uuid",
      "type": "task",
      "title": "Новая задача",
      "description": "Вам назначена задача",
      "read": false,
      "createdAt": "2025-03-16T10:00:00Z",
      "link": "/07-tasks-list.html?id=uuid"
    }
  ]
}
```

**Используется в:** `js/pages/notifications.js`, `js/pages/dashboard.js`

---

### PUT /api/notifications/:id/read

**Используется в:** `js/pages/notifications.js`

---

## 📊 Дашборд

### GET /api/dashboard/stats

**Ответ:**
```json
{
  "projects": {
    "total": 35,
    "inProgress": 12,
    "completed": 18,
    "overdue": 5
  },
  "tasks": {
    "total": 42,
    "my": 15,
    "overdue": 3
  },
  "sections": {
    "inProgress": 8,
    "review": 5
  },
  "finances": {
    "month": 450000
  }
}
```

**Используется в:** `js/pages/dashboard.js`

---

### GET /api/dashboard/attention

**Ответ:**
```json
[
  {
    "type": "overdue-project",
    "priority": "critical",
    "title": "Просрочен дедлайн проекта",
    "description": "Кап. ремонт школы №15",
    "badge": "📅 14 дней просрочки",
    "link": "/04-project-detail.html?id=uuid"
  }
]
```

**Используется в:** `js/pages/dashboard.js`

---

## 📁 Файлы

### POST /api/files/upload

**Content-Type:** `multipart/form-data`

**Вход:**
- `file` (File) — файл
- `entityType` (string) — тип сущности
- `entityId` (uuid) — ID сущности

**Ответ:**
```json
{
  "id": "uuid",
  "name": "file.pdf",
  "url": "/files/file.pdf",
  "size": 1024000
}
```

**Используется в:** `js/pages/project-create.js`, `js/pages/section-detail.js`

---

## 📈 Статистика

### GET /api/expertise/stats/summary

**Ответ:**
```json
{
  "total": 150,
  "created": 25,
  "inProgress": 45,
  "review": 30,
  "closed": 50
}
```

**Используется в:** `js/pages/expertise-stats.js`

---

### GET /api/expertise/stats/by-employee

**Ответ:**
```json
[
  {
    "id": "uuid",
    "name": "Петров А.И.",
    "total": 25,
    "inProgress": 5,
    "closed": 20
  }
]
```

**Используется в:** `js/pages/expertise-stats.js`

---

### GET /api/expertise/stats/by-section

**Ответ:**
```json
[
  {
    "code": "АР",
    "name": "Архитектурные решения",
    "color": "#3b82f6",
    "total": 35,
    "closed": 25
  }
]
```

**Используется в:** `js/pages/expertise-stats.js`

---

### GET /api/expertise/stats/top-speed

**Ответ:**
```json
[
  {
    "id": "uuid",
    "name": "Петров А.И.",
    "avgDays": 3.5
  }
]
```

**Используется в:** `js/pages/expertise-stats.js`

---

## 📅 Календарь

### GET /api/calendar/events

**Ответ:**
```json
[
  {
    "id": "uuid",
    "type": "project",
    "name": "ЖК Северное сияние",
    "date": "2025-06-30",
    "projectName": "ЖК Северное сияние"
  }
]
```

**Используется в:** `js/pages/calendar.js`

---

### GET /api/calendar/deadlines

**Ответ:**
```json
[
  {
    "id": "uuid",
    "type": "section",
    "name": "АР",
    "date": "2025-04-15",
    "projectName": "ЖК Северное сияние",
    "daysLeft": 30
  }
]
```

**Используется в:** `js/pages/calendar.js`

---

## 📝 Отчёты

### GET /api/reports/projects

**Ответ:**
```json
{
  "total": 35,
  "inProgress": 12,
  "completed": 18,
  "byType": {...},
  "byStatus": {...}
}
```

**Используется в:** `js/pages/reports.js`

---

### GET /api/reports/employees

**Ответ:**
```json
{
  "total": 50,
  "byDepartment": {...},
  "byRole": {...}
}
```

**Используется в:** `js/pages/reports.js`

---

## 📋 Статусы и типы

### ProjectStatus
- `draft` — Черновик
- `in_progress` — В работе
- `on_approval` — На согласовании
- `completed` — Завершён
- `archived` — В архиве

### SectionStatus / SurveyStatus
- `not_started` — Не начат
- `in_progress` — В работе
- `on_approval` — На согласовании
- `approved` — Согласован
- `on_expertise` — На экспертизе

### ExpertiseStatus
- `created` — Создано
- `in_progress` — В работе
- `review` — На проверке
- `closed` — Закрыто
- `rejected` — Отклонено

### PaymentStatus
- `created` — Создано
- `approved` — Утверждено
- `paid` — Выплачено
- `awaiting_docs` — Ожидает документов
- `overdue` — Просрочено

### Priority
- `critical` — Критичный
- `high` — Высокий
- `medium` — Средний
- `low` — Низкий

---

## 🔧 Технические требования

### Заголовки запросов
```
Authorization: Bearer <token>
Content-Type: application/json
```

### Коды ответов
- `200` — Успех
- `201` — Создано
- `400` — Ошибка валидации
- `401` — Не авторизован
- `403` — Нет доступа
- `404` — Не найдено
- `500` — Ошибка сервера

### Формат ошибок
```json
{
  "message": "Текст ошибки",
  "errors": [
    {"field": "name", "message": "Обязательное поле"}
  ]
}
```

---

## ✅ Frontend готов к интеграции

Все 36 страниц прототипа имеют JavaScript-скрипты для работы с API. Для начала интеграции необходимо:

1. Настроить `BASE_URL` в `js/api-config.js`
2. Реализовать указанные endpoints на backend
3. Протестировать работу frontend с реальными данными

**Контакты для вопросов:** см. `js/README.md`
