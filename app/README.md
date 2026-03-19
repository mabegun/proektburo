# Проектное бюро - Рабочая версия

Это рабочая версия приложения с полной интеграцией API. Статический прототип находится в корневой папке `../`.

## Структура

```
app/
├── pages/           # HTML страницы (41 файл)
├── js/
│   ├── api-config.js    # Конфигурация API
│   ├── api-client.js    # HTTP клиент
│   ├── api.js           # Методы API
│   ├── ui-helpers.js    # UI утилиты
│   ├── mock-data.js     # Моковые данные
│   ├── shared.js        # Общие функции
│   ├── components/      # UI компоненты
│   └── pages/           # Скрипты страниц
├── backend/          # FastAPI бэкенд
│   ├── main.py           # API endpoints
│   ├── database.py       # SQLite БД
│   ├── crud.py           # CRUD операции
│   ├── auth.py           # Авторизация
│   └── schemas.py        # Pydantic схемы
├── data/             # База данных и файлы
├── docs/             # Документация
├── run.sh            # Запуск (Linux/macOS)
├── run.bat           # Запуск (Windows)
└── requirements.txt  # Python зависимости
```

## Быстрый старт

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

Скрипт автоматически:
1. Создаст виртуальное окружение `venv/`
2. Установит зависимости
3. Инициализирует базу данных
4. Создаст тестовые данные
5. Запустит сервер на http://localhost:8000

### Ручной запуск

```bash
cd app

# Создание виртуального окружения
python3 -m venv venv
source venv/bin/activate  # Linux/macOS
# venv\Scripts\activate   # Windows

# Установка зависимостей
pip install -r requirements.txt

# Инициализация БД и тестовых данных
python init_test_data.py

# Запуск сервера
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

## Тестовые пользователи

| Email | Роль | Пароль |
|-------|------|--------|
| director@bureau.ru | Директор | Любой |
| gip-ivanov@bureau.ru | ГИП | Любой |
| executor-petrov@bureau.ru | Исполнитель | Любой |
| executor-sidorov@bureau.ru | Исполнитель | Любой |
| observer-kuznetsov@bureau.ru | Наблюдатель | Любой |

**Примечание:** Авторизация по email без пароля (для разработки).

## API Endpoints

### Авторизация
- `POST /api/auth/login` - Вход
- `POST /api/auth/logout` - Выход
- `GET /api/user/profile` - Профиль

### Проекты
- `GET /api/projects` - Список
- `POST /api/projects` - Создать
- `GET /api/projects/{id}` - Детали
- `PUT /api/projects/{id}` - Обновить

### Разделы и изыскания
- `POST /api/projects/{id}/sections` - Создать раздел
- `GET /api/sections/{id}` - Детали раздела
- `POST /api/projects/{id}/surveys` - Создать изыскание
- `GET /api/surveys/{id}` - Детали изыскания

### Остальное
- `GET /api/tasks` - Задачи
- `GET /api/employees` - Сотрудники
- `GET /api/dashboard/stats` - Статистика
- `GET /api/dictionaries/*` - Справочники

Полная документация: http://localhost:8000/docs

## Режимы работы

### С API (Production Mode)
```javascript
// js/api-config.js
CONFIG.DEMO_MODE = false;
CONFIG.BASE_URL = 'http://localhost:8000/api';
```

### Demo Mode (без API)
```javascript
// js/api-config.js
CONFIG.DEMO_MODE = true;
```

## Статический прототип

Для визуальной разработки используйте HTML файлы в корневой папке:
- `../01-login.html`
- `../02-dashboard.html`
- и т.д.

Они содержат захардкоженные данные и не требуют запуска сервера.

## Технологии

**Frontend:**
- HTML5 + Tailwind CSS
- Vanilla JavaScript (ES6+)
- Fetch API

**Backend:**
- FastAPI (Python 3.9+)
- SQLite
- Pydantic

## Разработка

### Добавление нового API endpoint

1. Добавить схему в `backend/schemas.py`
2. Добавить CRUD функцию в `backend/crud.py`
3. Добавить роут в `backend/main.py`
4. Добавить метод в `js/api.js`
5. Создать JS скрипт страницы в `js/pages/`

### Адаптация новой страницы

1. Скопировать HTML из прототипа в `pages/`
2. Добавить ID элементам для динамического обновления
3. Заменить хардкод на placeholder'ы
4. Подключить JS скрипты перед `</body>`
5. Создать/обновить JS скрипт в `js/pages/`

## База данных

### Таблицы (13):
- users - Пользователи
- projects - Проекты
- sections - Разделы
- surveys - Изыскания
- files - Файлы
- chat_messages - Чат
- tasks - Задачи
- history - История
- project_members - Команда
- section_observers - Наблюдатели разделов
- survey_observers - Наблюдатели изысканий
- section_types - Справочник разделов
- survey_types - Справочник изысканий

### Сброс БД
```bash
rm data/database.sqlite
python init_test_data.py
```
