# 🚀 Быстрый старт

## Два режима работы

### 1. Demo-режим (без сервера)

Откройте любой HTML файл в браузере:
```
18.02-pb/app/pages/01-login.html
18.02-pb/app/pages/02-dashboard.html
...
```

Все данные mock-овые — для быстрого просмотра интерфейса.

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
source venv/bin/activate   # Linux/macOS
# или: venv\Scripts\activate   # Windows

pip install -r requirements.txt
python init_test_data.py
uvicorn backend.main:app --reload --port 8000
```

---

## Тестовые пользователи

| Email | Роль | Пароль |
|-------|------|--------|
| director@bureau.ru | Директор | Любой от 4 символов |
| gip-ivanov@bureau.ru | ГИП | Любой от 4 символов |
| executor-petrov@bureau.ru | Исполнитель | Любой от 4 символов |
| executor-sidorov@bureau.ru | Исполнитель | Любой от 4 символов |
| observer-kuznetsov@bureau.ru | Наблюдатель | Любой от 4 символов |

> **Важно:** Авторизация по email, пароль может быть любым (от 4 символов)

---

## Структура

```
18.02-pb/
├── 01-login.html, ...     # Прототип (захардкожен)
├── Js/                    # JS прототипа
│
└── app/                   # Рабочая версия
    ├── pages/             # 42 HTML с API
    ├── js/                # API скрипты + mock
    ├── backend/           # FastAPI
    ├── run.sh             # Запуск Linux/macOS
    └── run.bat            # Запуск Windows
```

---

## Что готово

| Компонент | Статус |
|-----------|--------|
| Прототип (41 страница) | ✅ |
| Backend (50+ endpoints) | ✅ |
| База данных (13 таблиц) | ✅ |
| Тестовые данные | ✅ |
| API интеграция frontend | ✅ 100% (42/42) |
| Mock данные | ✅ |

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
→ Сервер уже настроен с CORS. Проверьте `BASE_URL` в `api-config.js`.

### Порт занят
```
Address already in use
```
→ Измените порт: `uvicorn backend.main:app --port 8001`

### База пуста
```bash
cd app
source venv/bin/activate
python init_test_data.py
```

### Файлы не открываются в браузере
→ Убедитесь, что открываете файлы из `app/pages/`, а не из корня проекта.

---

## GitHub

**Репозиторий:** https://github.com/mabegun/proektburo

Для push-а изменений:
```bash
git add -A
git commit -m "ваше сообщение"
git push origin main
```
