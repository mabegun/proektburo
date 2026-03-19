# 📊 Статус интеграции API с фронтендом

**Дата:** 20.03.2026
**Проект:** Система управления проектным бюро
**Репозиторий:** https://github.com/mabegun/proektburo

---

## 📁 Структура проекта

```
/home/z/my-project/
├── [Прототип] 42 HTML файлов в корне — статический прототип для дизайна
│
└── app/ — Рабочая версия с API интеграцией
    ├── pages/           # 41 HTML страница
    ├── js/
    │   ├── api-config.js    # Конфигурация API + DEMO_MODE
    │   ├── api-client.js    # HTTP клиент
    │   ├── api.js           # Методы API
    │   ├── ui-helpers.js    # UI утилиты
    │   ├── mock-data.js     # Моковые данные
    │   ├── shared.js        # Общие функции
    │   ├── components/      # UI компоненты (modal, dictionary)
    │   └── pages/           # 39 скриптов страниц
    ├── backend/          # FastAPI бэкенд
    ├── data/             # SQLite база данных
    ├── docs/             # Документация
    ├── run.bat           # Запуск (Windows)
    ├── run.sh            # Запуск (Linux/macOS)
    └── requirements.txt  # Python зависимости
```

---

## ✅ Готово (100%)

### 1. Базовая инфраструктура
| Файл | Назначение | Статус |
|------|-----------|--------|
| `app/js/api-config.js` | Конфигурация API, DEMO_MODE | ✅ Готово |
| `app/js/api-client.js` | HTTP-клиент с обработкой ошибок | ✅ Готово |
| `app/js/api.js` | Методы API для всех сущностей | ✅ Готово |
| `app/js/ui-helpers.js` | UI-хелперы (форматирование, toast) | ✅ Готово |
| `app/js/mock-data.js` | Моковые данные для DEMO_MODE | ✅ Готово |
| `app/js/shared.js` | Общие функции | ✅ Готово |

### 2. Скрипты страниц (39 файлов)
| Файл | Страница | Статус |
|------|---------|--------|
| login.js | 01-login.html | ✅ Готово |
| dashboard.js | 02-dashboard.html | ✅ Готово |
| projects-list.js | 03-projects-list.html | ✅ Готово |
| project-detail.js | 04-project-detail.html | ✅ Готово |
| project-detail-employee.js | 04-1-project-detail-employee.html | ✅ Готово |
| project-discussion.js | 04-1-project-discussion.html | ✅ Готово |
| project-expertise.js | 04-2-project-expertise.html | ✅ Готово |
| project-history.js | 04-3-project-history.html | ✅ Готово |
| project-finances.js | 04-5-project-finances.html | ✅ Готово |
| project-finances-employee.js | 04-5-project-finances-employee.html | ✅ Готово |
| project-create.js | 05-project-create.html | ✅ Готово |
| section-detail.js | 06-section-detail.html | ✅ Готово |
| section-files.js | 06-1-section-files.html | ✅ Готово |
| section-discussion.js | 06-2-section-discussion.html | ✅ Готово |
| section-finances.js | 06-3-section-finances.html | ✅ Готово |
| section-expertise.js | 06-4-section-expertise.html | ✅ Готово |
| section-history.js | 06-5-section-history.html | ✅ Готово |
| section-observer.js | 06-6-section-observer.html | ✅ Готово |
| tasks-list.js | 07-tasks-list.html | ✅ Готово |
| task-create.js | 08-task-create.html | ✅ Готово |
| employees-list.js | 09-employees-list.html | ✅ Готово |
| employee-create.js | 10-employee-create.html | ✅ Готово |
| notifications.js | 11-notifications.html | ✅ Готово |
| reports.js | 12-reports.html | ✅ Готово |
| settings.js | 13-settings.html | ✅ Готово |
| settings-sections.js | 13-1-settings-sections.html | ✅ Готово |
| settings-surveys.js | 13-2-settings-surveys.html | ✅ Готово |
| settings-expenses.js | 13-3-settings-expenses.html | ✅ Готово |
| settings-contractor-types.js | 13-4-settings-contractor-types.html | ✅ Готово |
| survey-detail.js | 14-survey-detail.html | ✅ Готово |
| survey-detail-observer.js | 14-1-survey-detail-observer.html | ✅ Готово |
| survey-finances.js | 14-2-survey-finances.html | ✅ Готово |
| survey-expertise.js | 14-3-survey-expertise.html | ✅ Готово |
| expertise-create.js | 14-4-expertise-create.html | ✅ Готово |
| survey-create.js | 15-survey-create.html | ✅ Готово |
| expertise-comment.js | 16-expertise-comment.html | ✅ Готово |
| contract-detail.js | 18-contract-detail.html | ✅ Готово |
| payment-detail.js | 19-payment-detail.html | ✅ Готово |
| calendar.js | 20-calendar.html | ✅ Готово |
| expertise-stats.js | 21-expertise-stats.html | ✅ Готово |

### 3. Backend (FastAPI + SQLite)
| Файл | Назначение | Статус |
|------|-----------|--------|
| backend/main.py | API endpoints (50+) | ✅ Готово |
| backend/database.py | SQLite схема (13 таблиц) | ✅ Готово |
| backend/crud.py | CRUD операции | ✅ Готово |
| backend/auth.py | Авторизация по email | ✅ Готово |
| backend/schemas.py | Pydantic схемы | ✅ Готово |

---

## 🚀 Быстрый старт

### Windows
```cmd
cd app
run.bat
```

### Linux/macOS
```bash
cd app
chmod +x run.sh
./run.sh
```

Сервер запустится на http://localhost:8000

### Тестовые пользователи

| Email | Роль | Пароль |
|-------|------|--------|
| director@bureau.ru | Директор | Любой (4+ символа) |
| gip-ivanov@bureau.ru | ГИП | Любой (4+ символа) |
| executor-petrov@bureau.ru | Исполнитель | Любой (4+ символа) |
| executor-sidorov@bureau.ru | Исполнитель | Любой (4+ символа) |
| observer-kuznetsov@bureau.ru | Наблюдатель | Любой (4+ символа) |

---

## 🔄 Режимы работы

### DEMO_MODE (без бэкенда)
```javascript
// app/js/api-config.js
CONFIG.DEMO_MODE = true;
```
Используются mock-данные из `mock-data.js`

### Production Mode (с API)
```javascript
// app/js/api-config.js
CONFIG.DEMO_MODE = false;
CONFIG.BASE_URL = 'http://localhost:8000/api';
```

---

## 📈 Прогресс

```
Инфраструктура:     ████████████████████ 100% (6/6 файлов)
JS страниц:         ████████████████████ 100% (39/39 файлов)
HTML подключено:    ████████████████████ 100% (41/41 страниц)
Backend:            ████████████████████ 100% (5/5 файлов)
```

---

## 📝 Примечания

1. **Прототип в корне проекта** — 42 HTML файла со статическим контентом для визуальной разработки
2. **Рабочая версия в app/** — полная интеграция с API
3. **GitHub:** https://github.com/mabegun/proektburo
