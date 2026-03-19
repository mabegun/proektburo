# Проектное бюро - Система управления проектами

Полноценная система управления проектами для архитектурно-проектных организаций с рабочим бэкендом и API.

## 🏗️ Структура проекта

```
18.02-pb/
│
├── 📁 Статический прототип (захардкожен)
│   ├── 01-login.html              # Страницы для визуальной разработки
│   ├── 02-dashboard.html          # 41 HTML файл
│   ├── 03-projects-list.html      # Работают без сервера
│   └── ...                        # Захардкоженные данные
│
├── 📁 Js/                         # JS прототипа
│   ├── api.js                     # API методы
│   ├── api-client.js              # HTTP клиент
│   ├── pages/                     # 37 скриптов страниц
│   └── ...
│
└── app/                           # 🟢 Рабочая версия
    ├── pages/                     # HTML с API интеграцией
    ├── js/                        # API скрипты
    ├── backend/                   # FastAPI сервер
    │   ├── main.py                # 50+ endpoints
    │   ├── database.py            # SQLite (13 таблиц)
    │   ├── crud.py                # CRUD операции
    │   └── auth.py                # Авторизация
    ├── data/                      # База данных
    ├── run.sh                     # Запуск (Linux/macOS)
    └── run.bat                    # Запуск (Windows)
```

## 🚀 Быстрый старт

### Linux/macOS
```bash
cd app
chmod +x run.sh   # один раз
./run.sh
```

### Windows
```cmd
cd app
run.bat
```

Откроется: **http://localhost:8000**

## 📧 Тестовые пользователи

| Email | Роль | Права |
|-------|------|-------|
| `director@bureau.ru` | Директор | Полный доступ |
| `gip-ivanov@bureau.ru` | ГИП | Свои проекты |
| `executor-petrov@bureau.ru` | Исполнитель | Раздел АР |
| `executor-sidorov@bureau.ru` | Исполнитель | Раздел КР |
| `observer-kuznetsov@bureau.ru` | Наблюдатель | Только чтение |

> **Авторизация без пароля** — для разработки

## 📄 Страницы (41 файл)

### Основные
| № | Страница | Описание |
|---|----------|----------|
| 01 | login.html | Авторизация |
| 02 | dashboard.html | Дашборд |
| 03 | projects-list.html | Список проектов |
| 04 | project-detail.html | Карточка проекта |
| 05 | project-create.html | Создание проекта |

### Проект
| № | Страница | Описание |
|---|----------|----------|
| 04-1 | project-detail-employee.html | Проект (Исполнитель) |
| 04-1 | project-discussion.html | Обсуждение |
| 04-2 | project-expertise.html | Замечания экспертизы |
| 04-3 | project-history.html | История |
| 04-5 | project-finances.html | Финансы (ГИП/Директор) |
| 04-5 | project-finances-employee.html | Финансы (Исполнитель) |

### Разделы и изыскания
| № | Страница | Описание |
|---|----------|----------|
| 06 | section-detail.html | Карточка раздела |
| 06-1 | section-files.html | Файлы раздела |
| 06-2 | section-discussion.html | Обсуждение |
| 06-3 | section-finances.html | Финансы раздела |
| 06-4 | section-expertise.html | Экспертиза |
| 06-5 | section-history.html | История |
| 06-6 | section-observer.html | Раздел (Наблюдатель) |
| 14 | survey-detail.html | Изыскание |
| 14-1 | survey-detail-observer.html | Изыскание (Наблюдатель) |
| 14-2 | survey-finances.html | Финансы изыскания |
| 14-3 | survey-expertise.html | Экспертиза изыскания |
| 14-4 | expertise-create.html | Создание замечания |

### Задачи и сотрудники
| № | Страница | Описание |
|---|----------|----------|
| 07 | tasks-list.html | Задачи |
| 08 | task-create.html | Создание задачи |
| 09 | employees-list.html | Исполнители |
| 10 | employee-create.html | Добавление исполнителя |

### Система
| № | Страница | Описание |
|---|----------|----------|
| 11 | notifications.html | Уведомления |
| 12 | reports.html | Отчёты |
| 13 | settings.html | Настройки |
| 13-1 | settings-sections.html | Справочник разделов |
| 13-2 | settings-surveys.html | Справочник изысканий |
| 13-3 | settings-expenses.html | Категории расходов |
| 13-4 | settings-contractor-types.html | Типы контрагентов |
| 16 | expertise-comment.html | Карточка замечания |
| 18 | contract-detail.html | Договор |
| 19 | payment-detail.html | Выплата |
| 20 | calendar.html | Календарь |
| 21 | expertise-stats.html | Статистика экспертизы |

## 🛠 Технологии

**Frontend:**
- HTML5 + Tailwind CSS (CDN)
- Vanilla JavaScript (ES6+)
- Fetch API

**Backend:**
- FastAPI (Python 3.9+)
- SQLite
- Pydantic

## 📡 API Endpoints

### Авторизация
- `POST /api/auth/login` — Вход
- `GET /api/user/profile` — Профиль

### Проекты
- `GET /api/projects` — Список
- `POST /api/projects` — Создать
- `GET /api/projects/{id}` — Детали
- `PUT /api/projects/{id}` — Обновить

### Разделы и изыскания
- `POST /api/projects/{id}/sections` — Создать раздел
- `GET /api/sections/{id}` — Детали раздела
- `POST /api/projects/{id}/surveys` — Создать изыскание
- `GET /api/surveys/{id}` — Детали изыскания

### Справочники
- `GET /api/dictionaries/section-types` — Типы разделов
- `GET /api/dictionaries/survey-types` — Типы изысканий
- `GET /api/dashboard/stats` — Статистика

**Полная документация API:** http://localhost:8000/docs

## 🗄 База данных (13 таблиц)

| Таблица | Описание |
|---------|----------|
| users | Пользователи |
| projects | Проекты |
| sections | Разделы |
| surveys | Изыскания |
| files | Файлы |
| chat_messages | Чат |
| tasks | Задачи |
| history | История |
| project_members | Команда проекта |
| section_observers | Наблюдатели разделов |
| survey_observers | Наблюдатели изысканий |
| section_types | Справочник разделов |
| survey_types | Справочник изысканий |

## 🔧 Режимы работы

### С API (Production)
```javascript
// app/js/api-config.js
CONFIG.DEMO_MODE = false;
CONFIG.BASE_URL = 'http://localhost:8000/api';
```

### Demo Mode
```javascript
CONFIG.DEMO_MODE = true; // Возвращает mock-данные
```

## 📚 Документация

| Файл | Описание |
|------|----------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Архитектура данных |
| [ENTITIES-RELATIONS.md](ENTITIES-RELATIONS.md) | Сущности и связи |
| [app/docs/](app/docs/) | Документация бэкенда |
| [app/README.md](app/README.md) | Инструкция для app/ |

## 📊 Статус проекта

| Компонент | Статус |
|-----------|--------|
| Статический прототип | ✅ 41 страница |
| Backend | ✅ 50+ endpoints |
| База данных | ✅ 13 таблиц |
| API интеграция | 🔄 1/41 страница |

## 📝 Лицензия

Приватный репозиторий. Все права защищены.
