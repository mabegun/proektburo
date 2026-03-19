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
└── app/                           # 🟢 Рабочая версия (100% готово)
    ├── pages/                     # 42 HTML с API интеграцией
    ├── js/                        # API скрипты + mock данные
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

### Demo-режим (без сервера)
Просто откройте любой HTML файл из `app/pages/` в браузере — все данные будут mock-овыми.

## 📧 Тестовые пользователи

| Email | Роль | Права |
|-------|------|-------|
| `director@bureau.ru` | Директор | Полный доступ |
| `gip-ivanov@bureau.ru` | ГИП | Свои проекты |
| `executor-petrov@bureau.ru` | Исполнитель | Раздел АР |
| `executor-sidorov@bureau.ru` | Исполнитель | Раздел КР |
| `observer-kuznetsov@bureau.ru` | Наблюдатель | Только чтение |

> **Пароль:** любой от 4 символов (авторизация по email)

## 📄 Страницы (42 файла, 100% готовы)

### Основные (14)
- 01-login.html — Авторизация
- 02-dashboard.html — Дашборд
- 03-projects-list.html — Список проектов
- 04-project-detail.html — Карточка проекта
- 05-project-create.html — Создание проекта
- 06-section-detail.html — Карточка раздела
- 07-tasks-list.html — Задачи
- 08-task-create.html — Создание задачи
- 09-employees-list.html — Сотрудники
- 10-employee-create.html — Добавление сотрудника
- 11-notifications.html — Уведомления
- 12-reports.html — Отчёты
- 13-settings.html — Настройки
- 20-calendar.html — Календарь

### Вкладки проекта (5)
- 04-1-project-discussion.html — Обсуждение
- 04-2-project-expertise.html — Экспертиза
- 04-3-project-history.html — История
- 04-5-project-finances.html — Финансы

### Вкладки раздела (6)
- 06-1-section-files.html — Файлы
- 06-2-section-discussion.html — Обсуждение
- 06-3-section-finances.html — Финансы
- 06-4-section-expertise.html — Экспертиза
- 06-5-section-history.html — История
- 06-6-section-observer.html — Для наблюдателя

### Настройки (4)
- 13-1-settings-sections.html — Разделы
- 13-2-settings-surveys.html — Изыскания
- 13-3-settings-expenses.html — Статьи расходов
- 13-4-settings-contractor-types.html — Типы контрагентов

### Изыскания (5)
- 14-survey-detail.html — Карточка изыскания
- 14-1-survey-detail-observer.html — Для наблюдателя
- 14-2-survey-finances.html — Финансы
- 14-3-survey-expertise.html — Экспертиза
- 15-survey-create.html — Создание изыскания

### Экспертиза (3)
- 14-4-expertise-create.html — Создание замечания
- 16-expertise-comment.html — Карточка замечания
- 21-expertise-stats.html — Статистика

### Контракты и платежи (2)
- 18-contract-detail.html — Договор
- 19-payment-detail.html — Выплата

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
- `GET /api/sections/{id}` — Детали раздела
- `GET /api/sections/{id}/files` — Файлы раздела
- `GET /api/sections/{id}/discussion` — Обсуждение
- `GET /api/sections/{id}/history` — История
- `GET /api/surveys/{id}` — Детали изыскания

### Справочники
- `GET /api/dictionaries/section-types` — Типы разделов
- `GET /api/dictionaries/survey-types` — Типы изысканий
- `GET /api/dictionaries/contractor-types` — Типы контрагентов

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

## 📊 Статус проекта

| Компонент | Статус |
|-----------|--------|
| Статический прототип | ✅ 41 страница |
| Backend | ✅ 50+ endpoints |
| База данных | ✅ 13 таблиц |
| API интеграция frontend | ✅ 100% (42/42) |
| Mock данные | ✅ Полные |

## 📚 Документация

| Файл | Описание |
|------|----------|
| [QUICK_START.md](QUICK_START.md) | Быстрый старт |
| [INTEGRATION_STATUS.md](INTEGRATION_STATUS.md) | Статус интеграции |
| [app/docs/](app/docs/) | Документация бэкенда |

## 🔗 GitHub

**Репозиторий:** https://github.com/mabegun/proektburo

```bash
# Клонирование
git clone https://github.com/mabegun/proektburo.git
cd proektburo/18.02-pb/app
./run.sh   # или run.bat на Windows
```

## 📝 Лицензия

Приватный репозиторий. Все права защищены.
