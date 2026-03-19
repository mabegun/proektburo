# 🚀 START HERE - Инструкция для ИИ-разработчика

## Добро пожаловать!

Этот документ поможет вам быстро понять проект и начать разработку бэкенда.

---

## 📚 Порядок изучения

### Шаг 1: Общее понимание (30 мин)

1. **Прочитайте:** `01_TECHNICAL_SPEC.md`
   - Что за система
   - Технологический стек
   - Структура проекта

2. **Посмотрите:** HTML файлы прототипа
   - `02-dashboard.html` - главная страница
   - `03-projects-list.html` - список проектов
   - `04-project-detail.html` - детали проекта
   - `06-section-detail.html` - детали раздела

---

### Шаг 2: База данных (1 час)

1. **Изучите:** `02_DATABASE_SCHEMA.md`
   - 13 таблиц
   - Связи между таблицами
   - Примеры данных

2. **Создайте:** `backend/database.py`
   - Функция `init_db()` для создания таблиц
   - Функция `get_db_connection()` для подключения

---

### Шаг 3: API Endpoints (2 часа)

1. **Изучите:** `03_API_ENDPOINTS.md`
   - Все endpoints сгруппированы
   - Форматы запросов и ответов
   - Коды ошибок

2. **Создайте:** `backend/main.py`
   - FastAPI приложение
   - Роуты для всех endpoints

---

### Шаг 4: Права доступа (30 мин)

1. **Изучите:** `04_ACCESS_CONTROL.md`
   - 4 роли пользователей
   - Матрица прав
   - Примеры проверки

2. **Создайте:** `backend/auth.py` и `backend/dependencies.py`
   - Проверка токена
   - Проверка прав

---

### Шаг 5: CRUD операции (2 часа)

1. **Создайте:** `backend/crud.py`
   - Функции для всех таблиц
   - Create, Read, Update, Delete

2. **Создайте:** `backend/schemas.py`
   - Pydantic схемы для валидации

---

### Шаг 6: Тестовые данные (30 мин)

1. **Изучите:** `06_TEST_DATA.md`
   - Какие данные создавать
   - Связи между данными

2. **Создайте:** `backend/test_data.py` и `init_test_data.py`

---

### Шаг 7: Интеграция с фронтендом (1 час)

1. **Изучите:** `05_FRONTEND_MAPPING.md`
   - Какие страницы какие API используют
   - JavaScript функции

2. **Изучите:** `07_API_INTEGRATION.md`
   - Как находить места для подключения API
   - Как создавать контейнеры
   - Как писать JS скрипты

3. **Изучите:** `08_CSS_TROUBLESHOOTING.md`
   - Решение проблем со стилями
   - Отладка вёрстки
   - Частые ошибки

4. **Протестируйте:** Откройте HTML страницы в браузере

---

## 📁 Структура для изучения

```
docs/backend/
├── START_HERE.md              # ← Вы здесь
├── 01_TECHNICAL_SPEC.md       # Техзадание
├── 02_DATABASE_SCHEMA.md      # База данных
├── 03_API_ENDPOINTS.md        # API
├── 04_ACCESS_CONTROL.md       # Права доступа
├── 05_FRONTEND_MAPPING.md     # Фронтенд
└── 06_TEST_DATA.md            # Тестовые данные
```

---

## ✅ Чек-лист готовности

После изучения всех документов вы сможете:

- [ ] Понимать назначение системы
- [ ] Описывать структуру БД
- [ ] Перечислять основные endpoints
- [ ] Объяснять систему прав доступа
- [ ] Понимать как фронтенд использует API

---

## 🛠️ Начало разработки

### 1. Создайте структуру проекта

```bash
mkdir project-bureau
cd project-bureau
mkdir backend data docs
```

### 2. Установите зависимости

```bash
pip install fastapi uvicorn pydantic python-multipart aiofiles
```

### 3. Создайте файлы

```bash
touch backend/main.py
touch backend/database.py
touch backend/schemas.py
touch backend/crud.py
touch backend/auth.py
```

### 4. Начните с базы данных

```python
# backend/database.py

import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "data" / "database.sqlite"

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Таблица users
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            email TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            role TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # ... остальные таблицы
    
    conn.commit()
    conn.close()
```

### 5. Создайте первый endpoint

```python
# backend/main.py

from fastapi import FastAPI
from backend.database import init_db

app = FastAPI()

@app.on_event("startup")
async def startup():
    init_db()

@app.get("/api/test")
async def test():
    return {"message": "Backend работает!"}
```

### 6. Запустите сервер

```bash
cd backend
uvicorn main:app --reload
```

### 7. Проверьте

Откройте: http://localhost:8000/api/test

---

## 📞 Полезные ссылки

- **FastAPI документация:** https://fastapi.tiangolo.com/
- **Pydantic документация:** https://docs.pydantic.dev/
- **SQLite документация:** https://www.sqlite.org/docs.html

---

## 🎯 Цель

После выполнения всех шагов у вас будет:

✅ Работающий бэкенд на FastAPI  
✅ База данных SQLite с 13 таблицами  
✅ 50+ API endpoints  
✅ Система авторизации и прав доступа  
✅ Тестовые данные для демонстрации  
✅ Интеграция с фронтендом  

---

## ⏱️ Оценка времени

| Этап | Время |
|------|-------|
| Изучение документации | 4 часа |
| Создание БД | 1 час |
| Создание API | 6 часов |
| Тестирование | 2 часа |
| Интеграция | 2 часа |
| **Итого** | **15 часов** |

---

## ❓ Вопросы?

Если возникли вопросы, обратитесь к:

1. `01_TECHNICAL_SPEC.md` - общее описание
2. `02_DATABASE_SCHEMA.md` - структура БД
3. `03_API_ENDPOINTS.md` - спецификация API
4. `05_FRONTEND_MAPPING.md` - интеграция с фронтендом

---

**Удачи в разработке! 🚀**

---

**Версия:** 1.0  
**Дата:** 2026-03-18  
**Статус:** Готово к разработке
