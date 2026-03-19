# 🚀 Быстрый старт

## Два режима работы

### 1. Статический прототип (без сервера)

Откройте любой HTML файл в браузере:
```
18.02-pb/01-login.html
18.02-pb/02-dashboard.html
...
```

Все данные захардкожены — для визуальной разработки.

### 2. Рабочая версия (с API)

```bash
cd app
./run.sh        # Linux/macOS
run.bat         # Windows
```

Откроется: http://localhost:8000

---

## Запуск сервера

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

### Ручной запуск
```bash
cd app
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python init_test_data.py
uvicorn backend.main:app --reload --port 8000
```

---

## Тестовые пользователи

| Email | Роль |
|-------|------|
| director@bureau.ru | Директор |
| gip-ivanov@bureau.ru | ГИП |
| executor-petrov@bureau.ru | Исполнитель |

> Пароль не требуется — авторизация по email

---

## Структура

```
18.02-pb/
├── 01-login.html, ...     # Прототип (захардкожен)
├── Js/                    # JS прототипа
│
└── app/                   # Рабочая версия
    ├── pages/             # HTML с API
    ├── js/                # API скрипты
    ├── backend/           # FastAPI
    ├── run.sh
    └── run.bat
```

---

## Что готово

| Компонент | Статус |
|-----------|--------|
| Прототип (41 страница) | ✅ |
| Backend (50+ endpoints) | ✅ |
| База данных (13 таблиц) | ✅ |
| Тестовые данные | ✅ |
| API интеграция frontend | 🔄 |

---

## API документация

После запуска сервера:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## Частые проблемы

### Ошибка CORS
```
Access blocked by CORS policy
```
→ Сервер уже настроен с CORS. Проверьте BASE_URL в api-config.js.

### Порт занят
```
Address already in use
```
→ Измените порт: `uvicorn backend.main:app --port 8001`

### База пуста
```bash
cd app
python init_test_data.py
```

---

## Следующие шаги

1. ✅ Запустить сервер
2. ✅ Проверить http://localhost:8000
3. 🔄 Подключить остальные страницы к API
