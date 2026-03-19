# АНАЛИЗ РЕПОЗИТОРИЯ: Портал проектного бюро

**Репозиторий:** https://github.com/mabegun/18.02-pb  
**Дата анализа:** 2025-01-18  
**Статус:** Frontend готов (36 HTML-страниц), JS API-клиент готов, Backend требуется разработка

---

## 1. ОБЗОР ПРОЕКТА

### 1.1 Что уже есть

| Компонент | Статус | Описание |
|-----------|--------|----------|
| HTML-страницы | ✅ 100% | 36 готовых страниц прототипа |
| CSS-стили | ✅ Встроены | Tailwind CSS через CDN |
| JS API-клиент | ✅ Готов | `Js/api.js`, `Js/api-client.js`, `Js/api-config.js` |
| JS для страниц | ✅ 100% | 36 скриптов в `Js/pages/` |
| Документация MD | ✅ Полная | ARCHITECTURE.md, ENTITIES-RELATIONS.md, API_DOCUMENTATION.md |
| Backend | ❌ Отсутствует | Требуется разработка на FastAPI |

### 1.2 Технологии

| Слой | Технология | Комментарий |
|------|------------|-------------|
| Frontend | HTML5 + Tailwind CSS | CDN, без сборки |
| JS Framework | Vanilla JS (ES6+) | Без фреймворков |
| Backend (план) | FastAPI (Python) | Лёгкий REST API |
| База данных (план) | SQLite | Файл-based, для простоты |
| Хранение файлов | Файловая система | `data/files/{project_id}/{section_id}/` |

---

## 2. СТРУКТУРА РЕПОЗИТОРИЯ

```
18.02-pb/
├── 01-login.html                    # Вход в систему
├── 02-dashboard.html                # Дашборд (главная)
├── 03-projects-list.html            # Список проектов
├── 04-project-detail.html           # Детали проекта (ГИП/Директор)
├── 04-1-project-detail-employee.html # Детали проекта (Исполнитель)
├── 04-1-project-discussion.html     # Обсуждение проекта
├── 04-2-project-expertise.html      # Замечания проекта
├── 04-3-project-history.html        # История изменений
├── 04-5-project-finances.html       # Финансы (ГИП/Директор)
├── 04-5-project-finances-employee.html # Финансы (Исполнитель)
├── 05-project-create.html           # Создание проекта
├── 06-section-detail.html           # Детали раздела (ГИП/Ответственный)
├── 06-1-section-expertise.html      # Замечания раздела
├── 06-2-section-observer.html       # Раздел (Наблюдатель)
├── 07-tasks-list.html               # Список задач
├── 08-task-create.html              # Создание задачи
├── 09-employees-list.html           # Список исполнителей
├── 10-employee-create.html          # Добавление исполнителя
├── 11-notifications.html            # Уведомления
├── 12-reports.html                  # Отчёты
├── 13-settings.html                 # Настройки
├── 13-1-settings-sections.html      # Справочник разделов
├── 13-2-settings-surveys.html       # Справочник изысканий
├── 13-3-settings-expenses.html      # Категории расходов
├── 13-4-settings-contractor-types.html # Типы контрагентов
├── 14-survey-detail.html            # Детали изыскания (ГИП/Директор)
├── 14-1-survey-detail-observer.html # Изыскание (Наблюдатель)
├── 14-2-survey-finances.html        # Финансы изыскания
├── 14-3-survey-expertise.html       # Замечания изыскания
├── 14-4-expertise-create.html       # Создание замечания
├── 15-survey-create.html            # Создание изыскания
├── 16-expertise-comment.html        # Карточка замечания
├── 18-contract-detail.html          # Детали договора
├── 19-payment-detail.html           # Детали выплаты
├── 20-calendar.html                 # Календарь дедлайнов
├── 21-expertise-stats.html          # Статистика экспертизы
│
├── Js/                              # JavaScript модули
│   ├── api-config.js               # Конфигурация API (BASE_URL)
│   ├── api-client.js               # HTTP-клиент (fetch wrapper)
│   ├── api.js                      # Методы API (50+ endpoints)
│   ├── ui-helpers.js               # UI-хелперы (форматирование, toast)
│   ├── components/                 # Переиспользуемые компоненты
│   │   ├── modal-ui.js             # Универсальные модальные окна
│   │   └── dictionary-ui.js        # Универсальный справочник
│   └── pages/                      # Скрипты для каждой страницы (36 файлов)
│
├── ARCHITECTURE.md                  # Архитектура данных (сущности, связи)
├── ENTITIES-RELATIONS.md            # Полный справочник сущностей
├── API_DOCUMENTATION.md             # Документация API (ожидаемые endpoints)
├── IDEAS.md                         # Идеи развития и статусы реализации
├── PAGES-STATUS.md                  # Статус страниц (все ✅)
└── INTEGRATION_STATUS.md            # Статус интеграции API
```

---

## 3. СУЩНОСТИ И ИХ ПОЛЯ

### 3.1 Основные сущности

| Сущность | Ключевые поля | Страницы |
|----------|---------------|----------|
| **Project** | id, code, name, status, address, gip_email, deadline | 03, 04, 05 |
| **Section** | id, project_id, type_id, status, responsible_id, coExecutors[], observers[] | 04, 06 |
| **Survey** | id, project_id, type_id, status, responsible_id, contractor_id | 04, 14 |
| **Employee** | id, name, email, role, position, competencies[] | 09, 10 |
| **File** | id, entity_type, entity_id, name, version, is_approved | Все |
| **Comment** | id, entity_type, entity_id, text, author_id | 04, 06, 14 |
| **Task** | id, title, status, priority, assignee_id, project_id | 07, 08 |
| **ExpertiseComment** | id, section_id, number, text, status, assignee_id | 06-1, 16 |
| **FinanceOperation** | id, project_id, type, amount, status, employee_id | 04-5, 19 |
| **Contract** | id, number, date, contractor_id, amount, status | 18 |

### 3.2 Справочники

| Справочник | Значения | Страница |
|------------|----------|----------|
| SectionType | АР, ГП, КР, ОВ, ВК, ЭОМ, ПОС, ПБ | 13-1 |
| SurveyType | ИГД, ИГИ, ИЭИ, ИАДИ | 13-2 |
| ExpenseCategory | Командировки, Материалы, Подрядчики... | 13-3 |
| ContractorType | ООО, ИП, Самозанятый, Физлицо, Сотрудник | 13-4 |

### 3.3 Статусы

**Project:**
- `draft` → `in_progress` → `on_approval` → `completed` → `archived`

**Section/Survey:**
- `not_started` → `in_progress` → `on_approval` → `approved` → `on_expertise`

**ExpertiseComment:**
- `created` → `in_progress` → `on_review` → `approved` → `sent_to_expertise` → `closed`

**FinanceOperation:**
- `created` → `approved` → `paid` → `closed`

---

## 4. ТАБЛИЦА СОПОСТАВЛЕНИЯ: HTML → API

| Страница | Назначение | Хардкод данные | Живые элементы | Нужный API Endpoint |
|----------|------------|----------------|----------------|---------------------|
| **01-login.html** | Вход | Email/пароль | Форма авторизации | `POST /api/auth/login` |
| **02-dashboard.html** | Дашборд | Карточки статистики | Счётчики, списки | `GET /api/dashboard/stats` |
| **03-projects-list.html** | Проекты | 3 карточки проектов | Список, фильтры, индикаторы | `GET /api/projects` |
| **04-project-detail.html** | Проект (ГИП) | Разделы, изыскания, команда | Вкладки, файлы, чат | `GET /api/projects/{id}` |
| **04-1-project-detail-employee.html** | Проект (Исп.) | Мои/наблюдаемые разделы | Фильтрация по ролям | `GET /api/projects/{id}` |
| **05-project-create.html** | Создание | Форма, чекбоксы разделов | Создание проекта | `POST /api/projects` |
| **06-section-detail.html** | Раздел | Файлы, чат, комплектность | Загрузка, согласование | `GET /api/sections/{id}` |
| **06-1-section-expertise.html** | Замечания | Список замечаний | Статусы, фильтры | `GET /api/sections/{id}/expertise` |
| **07-tasks-list.html** | Задачи | Карточки задач | Список, фильтры | `GET /api/tasks` |
| **09-employees-list.html** | Исполнители | Карточки с выплатами | Статистика, период | `GET /api/employees` |
| **11-notifications.html** | Уведомления | Список уведомлений | Прочтение | `GET /api/notifications` |
| **13-1-settings-sections.html** | Разделы спр. | Таблица разделов | CRUD | `GET/POST /api/dictionaries/sections` |
| **14-survey-detail.html** | Изыскание | Файлы, договор, observers | Загрузка, чат | `GET /api/surveys/{id}` |
| **16-expertise-comment.html** | Замечание | История статусов | Изменение статуса | `GET/PUT /api/expertise/{id}` |
| **19-payment-detail.html** | Выплата | Документы, история | Загрузка документов | `GET /api/payments/{id}` |

---

## 5. ИНТЕРАКТИВНЫЕ ЭЛЕМЕНТЫ

### 5.1 Кнопки и действия

| Кнопка | Страница | Действие | API |
|--------|----------|----------|-----|
| "Новый проект" | 03-projects-list | Открыть форму создания | `POST /api/projects` |
| "Создать проект" | 05-project-create | Создать проект → редирект | `POST /api/projects` |
| "Добавить раздел" | 04-project-detail | Модалка создания раздела | `POST /api/projects/{id}/sections` |
| "Добавить изыскание" | 04-project-detail | Модалка создания изыскания | `POST /api/projects/{id}/surveys` |
| "Загрузить файл" | 06-section-detail | Drag-and-drop / input | `POST /api/files/upload` |
| "Согласовать" | 06-section-detail | Утвердить файл | `PUT /api/files/{id}/approve` |
| "Отправить сообщение" | 06-section-detail | Добавить в чат | `POST /api/comments` |
| "Создать задачу" | 08-task-create | Создать задачу | `POST /api/tasks` |

### 5.2 Формы ввода

| Форма | Поля | Валидация |
|-------|------|-----------|
| Логин | email, password | Обязательные |
| Создание проекта | code*, name*, address*, type, customer, deadline, sections[], gip_id | * обязательные |
| Создание раздела | section_type_id, responsible_id, deadline | Выбор из справочников |
| Создание изыскания | survey_type_id, responsible_id, contractor, contract | |
| Создание замечания | section_id, number, text, assignee_id, deadline | |

### 5.3 Таблицы и списки

| Таблица | Страница | Колонки | Фильтры |
|---------|----------|---------|---------|
| Проекты | 03 | Шифр, название, статус, прогресс, разделы | Статус, тип, поиск |
| Задачи | 07 | Название, проект, статус, приоритет, срок | Статус, приоритет, исполнитель |
| Замечания | 04-2, 06-1 | Номер, раздел, текст, статус, исполнитель | Статус, раздел |
| Финансы | 04-5 | Дата, тип, сумма, статус, документы | Тип, статус |
| Исполнители | 09 | Имя, должность, email, выплаты | Роль, период |

### 5.4 Индикаторы и бейджи

| Индикатор | CSS-класс | Статусы | Цвета |
|-----------|-----------|---------|-------|
| Раздел проекта | `.section-indicator` | done, in-progress, review, not-started, overdue | зелёный, синий, жёлтый, серый, красный |
| Изыскание | `.survey-indicator` | done, in-progress, not-started | зелёный, синий, серый |
| Статус проекта | `.badge` | in-progress, review, completed, archived | синий, жёлтый, зелёный, серый |
| Статус замечания | `.badge-small` | in-work, review, closed | красный, жёлтый, зелёный |
| Комплектность | `.completeness-badge` | high, medium, low | зелёный, жёлтый, красный |

---

## 6. СХЕМА БАЗЫ ДАННЫХ (РЕКОМЕНДУЕМАЯ)

```sql
-- Таблица пользователей
CREATE TABLE users (
    id TEXT PRIMARY KEY,                    -- UUID
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    short_name TEXT,                        -- "Иванов П.С."
    role TEXT NOT NULL,                     -- director, gip, executor, observer
    position TEXT,
    phone TEXT,
    avatar_color TEXT,
    contractor_type TEXT,                   -- ООО, ИП, Самозанятый...
    is_active BOOLEAN DEFAULT TRUE,
    password_hash TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Таблица проектов
CREATE TABLE projects (
    id TEXT PRIMARY KEY,                    -- UUID
    code TEXT UNIQUE NOT NULL,              -- "2025-001"
    name TEXT NOT NULL,
    status TEXT DEFAULT 'draft',            -- draft, in_progress, on_approval, completed, archived
    address TEXT,
    type TEXT,                              -- Новое строительство, Реконструкция...
    customer TEXT,
    start_date TEXT,
    deadline TEXT,
    area REAL,
    floors INTEGER,
    gip_email TEXT,                         -- Email ГИПа
    input_text TEXT,                        -- ТЗ от заказчика
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT,
    FOREIGN KEY (gip_email) REFERENCES users(email)
);

-- Таблица разделов проекта
CREATE TABLE sections (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    type_code TEXT NOT NULL,                -- АР, ГП, КР...
    cipher TEXT,                            -- АР.12.34
    status TEXT DEFAULT 'not_started',
    responsible_email TEXT,
    deadline TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (responsible_email) REFERENCES users(email)
);

-- Таблица соисполнителей раздела
CREATE TABLE section_coexecutors (
    section_id TEXT,
    user_email TEXT,
    PRIMARY KEY (section_id, user_email),
    FOREIGN KEY (section_id) REFERENCES sections(id),
    FOREIGN KEY (user_email) REFERENCES users(email)
);

-- Таблица наблюдателей раздела
CREATE TABLE section_observers (
    section_id TEXT,
    user_email TEXT,
    PRIMARY KEY (section_id, user_email),
    FOREIGN KEY (section_id) REFERENCES sections(id),
    FOREIGN KEY (user_email) REFERENCES users(email)
);

-- Таблица изысканий
CREATE TABLE surveys (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    type_code TEXT NOT NULL,                -- ИГД, ИГИ, ИЭИ...
    status TEXT DEFAULT 'not_started',
    responsible_email TEXT,
    contractor_name TEXT,                   -- Внешняя организация
    contractor_inn TEXT,
    contractor_kpp TEXT,
    contractor_address TEXT,
    contractor_phone TEXT,
    contract_number TEXT,
    contract_date TEXT,
    contract_file_id INTEGER,
    deadline TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (responsible_email) REFERENCES users(email)
);

-- Таблица наблюдателей изыскания
CREATE TABLE survey_observers (
    survey_id TEXT,
    user_email TEXT,
    PRIMARY KEY (survey_id, user_email),
    FOREIGN KEY (survey_id) REFERENCES surveys(id),
    FOREIGN KEY (user_email) REFERENCES users(email)
);

-- Таблица файлов
CREATE TABLE files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_type TEXT NOT NULL,              -- project, section, survey, expertise
    entity_id TEXT NOT NULL,
    filename TEXT NOT NULL,                 -- Физическое имя на диске
    original_name TEXT NOT NULL,            -- Оригинальное имя
    size INTEGER,
    mime_type TEXT,
    version INTEGER DEFAULT 1,
    parent_file_id INTEGER,                 -- Предыдущая версия
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by TEXT,
    approved_at TEXT,
    uploaded_by TEXT NOT NULL,
    uploaded_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_file_id) REFERENCES files(id),
    FOREIGN KEY (uploaded_by) REFERENCES users(email)
);

-- Таблица комментариев (чат)
CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_type TEXT NOT NULL,              -- project, section, survey, task
    entity_id TEXT NOT NULL,
    parent_id INTEGER,                      -- Для ответов
    text TEXT NOT NULL,
    author_email TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT,
    FOREIGN KEY (author_email) REFERENCES users(email)
);

-- Таблица задач
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'open',             -- open, in_progress, done, cancelled
    priority TEXT DEFAULT 'medium',         -- low, medium, high, urgent
    project_id TEXT,
    section_id TEXT,
    survey_id TEXT,
    assignee_email TEXT NOT NULL,
    created_by TEXT NOT NULL,
    deadline TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (assignee_email) REFERENCES users(email)
);

-- Таблица замечаний экспертизы
CREATE TABLE expertise_comments (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    section_id TEXT,
    survey_id TEXT,
    number TEXT NOT NULL,                   -- Номер от экспертизы
    text TEXT NOT NULL,
    status TEXT DEFAULT 'created',
    priority TEXT DEFAULT 'medium',
    assignee_email TEXT NOT NULL,
    deadline TEXT,
    expertise_file_id INTEGER,              -- Файл от экспертизы
    response_file_id INTEGER,               -- Файл с ответом
    response_text TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (section_id) REFERENCES sections(id),
    FOREIGN KEY (survey_id) REFERENCES surveys(id),
    FOREIGN KEY (assignee_email) REFERENCES users(email)
);

-- Таблица финансовых операций
CREATE TABLE finance_operations (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    section_id TEXT,
    survey_id TEXT,
    operation_type TEXT NOT NULL,           -- income, expense, payout
    payout_type TEXT,                       -- work_invoice, advance_invoice, gph_payment
    category_id TEXT,
    employee_email TEXT,
    amount REAL NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    paid_date TEXT,
    status TEXT DEFAULT 'created',
    created_by TEXT NOT NULL,
    approved_by TEXT,
    approved_at TEXT,
    paid_by TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (employee_email) REFERENCES users(email)
);

-- Таблица договоров
CREATE TABLE contracts (
    id TEXT PRIMARY KEY,
    number TEXT NOT NULL,
    date TEXT NOT NULL,
    contractor_type TEXT,
    contractor_name TEXT,
    amount REAL,
    status TEXT DEFAULT 'active',
    file_id INTEGER,
    project_id TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Таблица истории изменений
CREATE TABLE history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id TEXT,
    section_id TEXT,
    survey_id TEXT,
    user_email TEXT NOT NULL,
    action TEXT NOT NULL,                   -- create_project, upload_file, change_status...
    field_name TEXT,
    old_value TEXT,
    new_value TEXT,
    details TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES users(email)
);

-- Таблица уведомлений
CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT,
    link TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES users(email)
);

-- Таблица команды проекта
CREATE TABLE project_members (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    user_email TEXT NOT NULL,
    role_in_project TEXT,
    added_by TEXT,
    added_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (user_email) REFERENCES users(email),
    UNIQUE(project_id, user_email)
);

-- Справочник типов разделов
CREATE TABLE section_types (
    code TEXT PRIMARY KEY,                  -- АР, ГП, КР...
    name TEXT NOT NULL,                     -- Архитектурные решения
    color TEXT DEFAULT '#3b82f6',
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER
);

-- Справочник типов изысканий
CREATE TABLE survey_types (
    code TEXT PRIMARY KEY,                  -- ИГД, ИГИ, ИЭИ...
    name TEXT NOT NULL,
    color TEXT DEFAULT '#22c55e',
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER
);

-- Справочник категорий расходов
CREATE TABLE expense_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Справочник типов контрагентов
CREATE TABLE contractor_types (
    code TEXT PRIMARY KEY,                  -- ooo, ip, self_employed, individual, employee
    name TEXT NOT NULL,
    required_docs TEXT,                     -- JSON массив
    optional_docs TEXT                      -- JSON массив
);
```

---

## 7. СТРУКТУРА ПАПОК ДЛЯ ФАЙЛОВ

```
data/
├── database.sqlite              # База данных SQLite
└── files/                       # Загруженные файлы
    ├── {project_id}/
    │   ├── input/               # Вводные данные проекта
    │   │   └── TZ_zakazchika.pdf
    │   ├── {section_id}/        # Файлы раздела
    │   │   ├── AR_Plan_etazhey_v1.pdf
    │   │   └── AR_Plan_etazhey_v2.pdf  # Версионность
    │   ├── {survey_id}/         # Файлы изыскания
    │   │   └── IGD_otchet.pdf
    │   └── expertise/           # Файлы экспертизы
    │       ├── comment_001.pdf
    │       └── response_001.pdf
    └── temp/                    # Временные файлы при загрузке
```

---

## 8. API ENDPOINTS (ПОЛНЫЙ СПИСОК)

### Аутентификация
```
POST   /api/auth/login              # Вход
POST   /api/auth/logout             # Выход
GET    /api/user/profile            # Профиль текущего пользователя
```

### Проекты
```
GET    /api/projects                # Список проектов (?status=&search=)
POST   /api/projects                # Создать проект
GET    /api/projects/{id}           # Детали проекта
PUT    /api/projects/{id}           # Обновить проект
DELETE /api/projects/{id}           # Удалить проект

GET    /api/projects/{id}/sections      # Разделы проекта
POST   /api/projects/{id}/sections      # Создать раздел
GET    /api/projects/{id}/surveys       # Изыскания проекта
POST   /api/projects/{id}/surveys       # Создать изыскание
GET    /api/projects/{id}/members       # Команда проекта
POST   /api/projects/{id}/members       # Добавить участника
DELETE /api/projects/{id}/members/{email} # Удалить участника

GET    /api/projects/{id}/discussions   # Обсуждение
POST   /api/projects/{id}/discussions   # Добавить комментарий
GET    /api/projects/{id}/expertise     # Замечания проекта
GET    /api/projects/{id}/history       # История изменений
GET    /api/projects/{id}/finances      # Финансы проекта
```

### Разделы
```
GET    /api/sections/{id}           # Детали раздела
PUT    /api/sections/{id}           # Обновить раздел
GET    /api/sections/{id}/files     # Файлы раздела
POST   /api/sections/{id}/files     # Загрузить файл
GET    /api/sections/{id}/comments  # Чат раздела
POST   /api/sections/{id}/comments  # Добавить сообщение
GET    /api/sections/{id}/expertise # Замечания раздела
GET    /api/sections/{id}/payments  # Выплаты по разделу
```

### Изыскания
```
GET    /api/surveys/{id}            # Детали изыскания
PUT    /api/surveys/{id}            # Обновить изыскание
GET    /api/surveys/{id}/files      # Файлы изыскания
POST   /api/surveys/{id}/files      # Загрузить файл
GET    /api/surveys/{id}/comments   # Обсуждение
GET    /api/surveys/{id}/finances   # Финансы изыскания
GET    /api/surveys/{id}/expertise  # Замечания изыскания
```

### Замечания экспертизы
```
GET    /api/expertise               # Список замечаний (?project_id=&section_id=&status=)
POST   /api/expertise               # Создать замечание
GET    /api/expertise/{id}          # Детали замечания
PUT    /api/expertise/{id}          # Обновить статус
POST   /api/expertise/{id}/replies  # Ответ на замечание
GET    /api/expertise/{id}/history  # История замечания
```

### Задачи
```
GET    /api/tasks                   # Список задач (?assignee_id=&project_id=&status=)
POST   /api/tasks                   # Создать задачу
GET    /api/tasks/{id}              # Детали задачи
PUT    /api/tasks/{id}              # Обновить задачу
DELETE /api/tasks/{id}              # Удалить задачу
POST   /api/tasks/{id}/subtasks     # Добавить подзадачу
PATCH  /api/tasks/{id}/subtasks/{sid}/toggle # Переключить подзадачу
```

### Исполнители
```
GET    /api/employees               # Список (?search=&role=)
POST   /api/employees               # Создать
GET    /api/employees/{id}          # Профиль
PUT    /api/employees/{id}          # Обновить
DELETE /api/employees/{id}          # Удалить
GET    /api/employees/{id}/payments # Выплаты исполнителя
```

### Финансы
```
GET    /api/finance-operations      # Список операций
POST   /api/finance-operations      # Создать операцию
GET    /api/finance-operations/{id} # Детали операции
PUT    /api/finance-operations/{id} # Обновить статус

GET    /api/contracts/{id}          # Детали договора
GET    /api/payments/{id}           # Детали выплаты
```

### Файлы
```
POST   /api/files/upload            # Загрузить файл (multipart/form-data)
GET    /api/files/{id}              # Скачать файл
GET    /api/files/{id}/check        # Проверить штампы (PyMuPDF)
PUT    /api/files/{id}/approve      # Согласовать файл
DELETE /api/files/{id}              # Удалить файл
```

### Справочники
```
GET    /api/dictionaries/sections       # Типы разделов
POST   /api/dictionaries/sections       # Создать тип
PUT    /api/dictionaries/sections/{id}  # Обновить тип

GET    /api/dictionaries/surveys        # Типы изысканий
POST   /api/dictionaries/surveys
PUT    /api/dictionaries/surveys/{id}

GET    /api/dictionaries/expenses       # Категории расходов
POST   /api/dictionaries/expenses
PUT    /api/dictionaries/expenses/{id}

GET    /api/dictionaries/contractor-types # Типы контрагентов
```

### Уведомления
```
GET    /api/notifications            # Список уведомлений
PUT    /api/notifications/{id}/read  # Прочитать
PUT    /api/notifications/read-all   # Прочитать все
GET    /api/notifications/unread-count # Количество непрочитанных
```

### Дашборд
```
GET    /api/dashboard/stats          # Статистика
GET    /api/dashboard/attention      # Требующие внимания
GET    /api/dashboard/recent-projects # Недавние проекты
GET    /api/dashboard/my-tasks       # Мои задачи
```

### Календарь
```
GET    /api/calendar/events          # События
GET    /api/calendar/deadlines       # Дедлайны
```

### Отчёты
```
GET    /api/reports/projects         # Статистика по проектам
GET    /api/reports/employees        # Статистика по исполнителям
GET    /api/expertise/stats/summary  # Статистика замечаний
GET    /api/expertise/stats/by-employee # По исполнителям
GET    /api/expertise/stats/by-section # По разделам
```

### Инициализация
```
POST   /api/init-test-data           # Создать тестовые данные
```

---

## 9. ТЕСТОВЫЕ ДАННЫЕ (ДЛЯ ИНИЦИАЛИЗАЦИИ)

### Пользователи
| Email | Имя | Роль | Должность |
|-------|-----|------|-----------|
| director@bureau.ru | Иванов П.С. | director | Директор |
| gip@bureau.ru | Петров А.И. | gip | ГИП |
| executor-ar@bureau.ru | Сидоров К.М. | executor | Архитектор |
| executor-kr@bureau.ru | Козлов Д.В. | executor | Конструктор |
| observer@bureau.ru | Кузнецов И.И. | observer | Наблюдатель |

### Проект 1: "ЖК Северное сияние" (in_progress)
- **Шифр:** 2025-001
- **Адрес:** г. Москва, ул. Ленина, д. 45
- **ГИП:** gip@bureau.ru
- **Разделы:**
  - АР (Завершён) — executor-ar@bureau.ru
  - ГП (Завершён) — executor-ar@bureau.ru
  - КР (В работе) — executor-kr@bureau.ru
  - ОВ (Не начат)
  - ВК (Не начат)
- **Изыскания:**
  - ИГД (Завершено)
  - ИГИ (В работе)
- **Файлы:** 3 файла в разделе АР
- **Чат:** 4 сообщения
- **Замечания:** 2 замечания (1 закрыто, 1 в работе)
- **Выплаты:** 80 000 ₽ из 100 000 ₽

### Проект 2: "Реконструкция здания" (on_approval)
- **Шифр:** 2025-002
- **ГИП:** gip@bureau.ru
- **Разделы:** АР, ГП, КР

### Проект 3: "Склад в Казани" (completed)
- **Шифр:** 2025-003
- **Все разделы:** Завершены

---

## 10. РЕКОМЕНДАЦИИ ПО РЕАЛИЗАЦИИ

### 10.1 Порядок разработки

**Этап 1: Базовый backend (2-3 дня)**
1. Создать структуру папок `project-bureau/`
2. Реализовать `database.py` с созданием таблиц
3. Реализовать `models.py` с Pydantic-моделями
4. Реализовать `crud.py` с базовыми операциями
5. Реализовать `auth.py` с простой авторизацией

**Этап 2: API endpoints (3-4 дня)**
1. Реализовать `main.py` с роутами
2. Подключить HTML-файлы как статический контент
3. Реализовать маппинг маршрутов (HTML → API)
4. Протестировать каждый endpoint через Postman

**Этап 3: Интеграция (2-3 дня)**
1. Обновить `api-config.js` с реальным BASE_URL
2. Протестировать загрузку данных на каждой странице
3. Реализовать загрузку файлов
4. Протестировать чат и уведомления

**Этап 4: Тестовые данные (1 день)**
1. Создать `init_test_data.py`
2. Заполнить базу тестовыми сущностями
3. Протестировать все сценарии

### 10.2 Файловая структура проекта

```
project-bureau/
├── backend/
│   ├── main.py              # FastAPI приложение
│   ├── database.py          # SQLite + создание таблиц
│   ├── models.py            # Pydantic модели
│   ├── crud.py              # CRUD операции
│   ├── auth.py              # Авторизация
│   ├── stamp_checker.py     # Проверка штампов (опционально)
│   └── test_data.py         # Тестовые данные
│
├── frontend/                # HTML из репозитория
│   ├── 01-login.html
│   ├── 02-dashboard.html
│   ├── ... (все 36 файлов)
│   └── Js/
│       ├── api-config.js    # ИЗМЕНИТЬ BASE_URL!
│       ├── api-client.js
│       ├── api.js
│       ├── ui-helpers.js
│       └── pages/
│
├── data/
│   ├── database.sqlite      # Создаётся автоматически
│   └── files/               # Создаётся автоматически
│
├── docs/
│   ├── ANALYSIS.md          # Этот документ
│   ├── MAPPING.md           # Сопоставление сущностей
│   └── OLD_VS_NEW.md        # Изменения
│
├── run.bat                  # Запуск Windows
├── run.sh                   # Запуск Linux/Mac
├── init_test_data.py        # Создание тестовых данных
└── requirements.txt
```

### 10.3 Запуск проекта

**requirements.txt:**
```
fastapi>=0.100.0
uvicorn>=0.22.0
pydantic>=2.0.0
python-multipart>=0.0.6
aiofiles>=23.0.0
PyMuPDF>=1.22.0
```

**run.bat:**
```batch
@echo off
cd backend
pip install -r ../requirements.txt
python -c "from database import init_db; init_db()"
python ../init_test_data.py
python main.py
```

**main.py (базовая структура):**
```python
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI()

# Статические файлы (JS, CSS)
app.mount("/Js", StaticFiles(directory="frontend/Js"), name="js")

# Маршруты HTML
@app.get("/")
async def root():
    return FileResponse("frontend/02-dashboard.html")

@app.get("/{filename:path}")
async def serve_html(filename: str):
    if filename.endswith(".html"):
        return FileResponse(f"frontend/{filename}")
    return FileResponse(f"frontend/{filename}.html")

# API роуты
# ...
```

---

## 11. ВЫВОДЫ

### Что работает в текущем прототипе:
- ✅ Все 36 HTML-страниц с готовым UI
- ✅ JS API-клиент для связи с backend
- ✅ Полная документация по сущностям и API
- ✅ Индикаторы статусов и прогресс-бары
- ✅ Вкладки, модальные окна, фильтры

### Что требует реализации:
- ❌ Backend на FastAPI
- ❌ База данных SQLite
- ❌ Загрузка и хранение файлов
- ❌ Авторизация по email
- ❌ Проверка штампов в PDF (опционально)

### Рекомендации:
1. **Начать с минимального backend** — авторизация + проекты + разделы
2. **Постепенно подключать страницы** — от простых к сложным
3. **Использовать тестовые данные** — для проверки UI
4. **Не реализовывать проверку штампов сразу** — это опциональная функция

---

*Документ подготовлен на основе анализа репозитория https://github.com/mabegun/18.02-pb*
