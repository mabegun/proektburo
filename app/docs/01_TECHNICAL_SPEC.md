# 📋 Техническое задание на разработку бэкенда

## 🎯 Описание проекта

Система управления проектным бюро для архитектурно-проектных организаций.

**Назначение:** Управление проектами, разделами, изысканиями, задачами, документами и финансами.

---

## 🏗️ Архитектура системы

### Технологический стек

| Компонент | Технология | Версия |
|-----------|------------|--------|
| Backend | FastAPI (Python) | 3.9+ |
| Database | SQLite | 3.x |
| Files Storage | Файловая система | - |
| Auth | JWT tokens | - |

### Структура проекта

```
project-bureau/
├── backend/
│   ├── main.py              # FastAPI приложение, роуты
│   ├── database.py          # SQLite подключение, модели
│   ├── models.py            # SQLAlchemy модели (опционально)
│   ├── schemas.py           # Pydantic схемы
│   ├── crud.py              # CRUD операции
│   ├── auth.py              # Авторизация (JWT)
│   ├── dependencies.py      # Зависимости FastAPI
│   └── utils/
│       ├── stamp_checker.py # Проверка штампов PDF
│       └── file_storage.py  # Работа с файлами
├── frontend/                # HTML + JS прототип
├── data/
│   ├── database.sqlite      # База данных
│   └── files/               # Загруженные файлы
│       └── {project_id}/
│           └── {section_id}/
└── docs/
    └── backend/             # Эта документация
```

---

## 📊 База данных

### Таблицы (13)

1. **users** - Пользователи
2. **projects** - Проекты
3. **sections** - Разделы проекта
4. **surveys** - Изыскания
5. **files** - Файлы
6. **chat_messages** - Чат
7. **tasks** - Задачи
8. **history** - История изменений
9. **project_members** - Команда проекта
10. **section_observers** - Наблюдатели раздела
11. **survey_observers** - Наблюдатели изыскания
12. **section_types** - Справочник разделов
13. **survey_types** - Справочник изысканий

### Схема БД

См. файл: `DATABASE_SCHEMA.md`

---

## 🔐 Авторизация и права доступа

### Роли пользователей

| Роль | Описание | Права |
|------|----------|-------|
| `director` | Директор организации | Полный доступ ко всему |
| `gip` | Главный инженер проекта | Доступ к своим проектам |
| `executor` | Исполнитель | Доступ к своим разделам |
| `observer` | Наблюдатель | Только чтение |

### Матрица прав доступа

См. файл: `ACCESS_CONTROL.md`

---

## 📡 API Endpoints

### Группы endpoints

1. **Авторизация** (`/api/auth/*`)
2. **Проекты** (`/api/projects/*`)
3. **Разделы** (`/api/sections/*`)
4. **Изыскания** (`/api/surveys/*`)
5. **Файлы** (`/api/files/*`)
6. **Чат** (`/api/chat/*`)
7. **Задачи** (`/api/tasks/*`)
8. **История** (`/api/history/*`)
9. **Справочники** (`/api/dictionaries/*`)
10. **Сотрудники** (`/api/employees/*`)

### Полный список endpoints

См. файл: `API_ENDPOINTS.md`

---

## 📄 Работа с файлами

### Хранение файлов

```
data/files/
└── {project_id}/
    ├── {section_id}/
    │   ├── {uuid}.pdf
    │   └── {uuid}.dwg
    ├── {survey_id}/
    │   └── {uuid}.pdf
    └── common/
        └── {uuid}.pdf
```

### Требования

- Загрузка через `multipart/form-data`
- Генерация уникальных имён (UUID)
- Сохранение оригинального имени в БД
- Проверка MIME-типа
- Ограничение размера (макс. 50 МБ)

См. файл: `FILE_STORAGE.md`

---

## 🧪 Тестовые данные

### Требования

При инициализации должны создаваться:

- **5 пользователей** (director, gip, 2x executor, observer)
- **3 проекта** (active, expertise, completed)
- **5 разделов** (АР, КР, ОВ, ВК, ЭОМ)
- **4 изыскания** (геология, геодезия)
- **10 файлов** (тестовые PDF)
- **20 сообщений чата**
- **10 задач**
- **30 записей истории**

См. файл: `TEST_DATA.md`

---

## 📝 Требования к коду

### Стиль кода

- PEP 8
- Type hints (Python 3.9+)
- Docstrings для всех функций

### Структура endpoint'ов

```python
@app.get("/api/projects", response_model=ProjectList)
async def get_projects(
    current_user: dict = Depends(get_current_user),
    search: str = "",
    status: str = ""
):
    """Получить список проектов"""
    projects = crud.get_projects(current_user, search, status)
    return {"items": projects, "total": len(projects)}
```

### Обработка ошибок

```python
try:
    project = crud.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Проект не найден")
    return project
except HTTPException:
    raise
except Exception as e:
    logger.error(f"Error: {e}")
    raise HTTPException(status_code=500, detail="Внутренняя ошибка")
```

### Валидация данных

Использовать Pydantic схемы:

```python
class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    address: Optional[str] = None
    gip_email: str = Field(..., pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$')
    status: str = Field(default="active")
```

---

## 🚀 Развёртывание

### Локальная разработка

```bash
# Установка зависимостей
pip install -r requirements.txt

# Инициализация БД
python init_test_data.py

# Запуск сервера
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### Продакшен

```bash
# Gunicorn + Uvicorn workers
gunicorn backend.main:app \
    --workers 4 \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:8000
```

---

## 📚 Документы для ИИ-разработчика

После изучения этого файла, ИИ должен изучить:

1. **DATABASE_SCHEMA.md** - Структура БД
2. **API_ENDPOINTS.md** - Все endpoints
3. **ACCESS_CONTROL.md** - Права доступа
4. **FILE_STORAGE.md** - Работа с файлами
5. **TEST_DATA.md** - Тестовые данные
6. **FRONTEND_MAPPING.md** - Связь с фронтендом

---

## ✅ Чек-лист готовности

- [ ] Все 13 таблиц созданы
- [ ] Все CRUD операции реализованы
- [ ] Авторизация работает (JWT)
- [ ] Права доступа проверяются
- [ ] Файлы загружаются в папки
- [ ] Тестовые данные создаются
- [ ] API документация доступна (/docs)
- [ ] Все endpoints протестированы

---

**Версия:** 1.0  
**Дата:** 2026-03-18  
**Статус:** Готово к разработке
