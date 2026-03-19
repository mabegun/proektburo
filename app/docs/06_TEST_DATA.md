# 🧪 Тестовые данные

## Обзор

При инициализации создаются тестовые данные для демонстрации функционала.

---

## Пользователи (5)

| Email | Роль | ФИО | Пароль |
|-------|------|-----|--------|
| `director@bureau.ru` | director | Директоров Директор Директорович | не требуется |
| `gip-ivanov@bureau.ru` | gip | Иванов Иван Иванович | не требуется |
| `executor-petrov@bureau.ru` | executor | Петров Пётр Петрович | не требуется |
| `executor-sidorov@bureau.ru` | executor | Сидоров Сидор Сидорович | не требуется |
| `observer-kuznetsov@bureau.ru` | observer | Кузнецов Кузьма Кузьмич | не требуется |

---

## Проекты (3)

### Проект 1: Жилой дом на Ленина

- **ID:** `uuid-1`
- **Статус:** active
- **ГИП:** gip-ivanov@bureau.ru
- **Адрес:** г. Москва, ул. Ленина, д. 5

**Разделы:**
1. АР (Архитектурные решения)
   - Шифр: АР.12.34
   - Исполнитель: executor-petrov@bureau.ru
   - Статус: in_progress
   - Файлы: 2 (plan.pdf, facade.pdf)
   - Чат: 3 сообщения
   - Задачи: 1

2. КР (Конструктивные решения)
   - Шифр: КР.05.02
   - Исполнитель: executor-sidorov@bureau.ru
   - Статус: checking
   - Файлы: 1 (konstr.pdf)
   - Наблюдатель: observer-kuznetsov@bureau.ru

**Изыскания:**
1. Геология (geology)
   - Исполнитель: executor-petrov@bureau.ru
   - Статус: in_progress

2. Геодезия (geodesy)
   - Исполнитель: executor-sidorov@bureau.ru
   - Статус: done

**Команда:** 4 участника

**История:** 7 записей

---

### Проект 2: Офис на Пушкина

- **ID:** `uuid-2`
- **Статус:** expertise
- **ГИП:** gip-ivanov@bureau.ru
- **Адрес:** г. Санкт-Петербург, ул. Пушкина, д. 10

**Разделы:**
1. ОВ (Отопление и вентиляция)
   - Шифр: ОВ.03.15
   - Исполнитель: executor-petrov@bureau.ru
   - Статус: in_progress

2. ВК (Водоснабжение и канализация)
   - Шифр: ВК.04.08
   - Исполнитель: executor-sidorov@bureau.ru
   - Статус: in_progress

3. ЭОМ (Электроснабжение)
   - Шифр: ЭО.06.12
   - Исполнитель: executor-petrov@bureau.ru
   - Статус: correction

**Изыскания:** нет

---

### Проект 3: Склад в Казани

- **ID:** `uuid-3`
- **Статус:** completed
- **ГИП:** gip-ivanov@bureau.ru
- **Адрес:** г. Казань, ул. Промышленная, д. 1

**Разделы:** завершены

**Изыскания:** завершены

---

## Сообщения чата (20)

### Проект 1, Раздел АР

1. **gip-ivanov@bureau.ru**: "Петров П.П., проверьте пожалуйста штамп на плане"
2. **executor-petrov@bureau.ru**: "Хорошо, исправлю до конца дня"
3. **executor-petrov@bureau.ru**: "Исправил, загрузил новую версию"

### Проект 1, Раздел КР

4. **gip-ivanov@bureau.ru**: "Нужно согласовать узлы с архитектором"
5. **executor-sidorov@bureau.ru**: "Принято, свяжусь с Петровым"

...

---

## Задачи (10)

| ID | Название | Проект | Раздел | Исполнитель | Статус | Дедлайн |
|----|----------|--------|--------|-------------|--------|---------|
| 1 | Исправить штамп на стр. 5 | Проект 1 | АР | executor-petrov | open | 2026-03-25 |
| 2 | Согласовать узлы с архитектором | Проект 1 | КР | executor-sidorov | in_progress | 2026-03-20 |
| 3 | Проверить расчёты | Проект 2 | ОВ | executor-petrov | open | 2026-03-30 |
| ... | ... | ... | ... | ... | ... | ... |

---

## История изменений (30)

| ID | Проект | Пользователь | Действие | Детали |
|----|--------|--------------|----------|--------|
| 1 | Проект 1 | director | project_created | Создан проект |
| 2 | Проект 1 | gip | section_created | Создан раздел АР |
| 3 | Проект 1 | executor | file_uploaded | Загружен plan.pdf |
| 4 | Проект 1 | gip | task_created | Создана задача |
| 5 | Проект 1 | executor | chat_message | Сообщение в чат |
| ... | ... | ... | ... | ... |

---

## Файлы (10)

| ID | Проект | Раздел | Имя | Размер | Загружен |
|----|--------|--------|-----|--------|----------|
| 1 | Проект 1 | АР | plan.pdf | 2.4 МБ | executor-petrov |
| 2 | Проект 1 | АР | facade.pdf | 3.8 МБ | executor-petrov |
| 3 | Проект 1 | КР | konstr.pdf | 5.2 МБ | executor-sidorov |
| 4 | Проект 2 | ОВ | ventilation.pdf | 4.1 МБ | executor-petrov |
| ... | ... | ... | ... | ... | ... |

---

## Справочники

### Разделы (10)

| Код | Название | Цвет |
|-----|----------|------|
| АР | Архитектурные решения | #3b82f6 |
| ГП | Генеральный план | #22c55e |
| КР | Конструктивные решения | #f59e0b |
| ОВ | Отопление и вентиляция | #8b5cf6 |
| ВК | Водоснабжение и канализация | #06b6d4 |
| ЭОМ | Электроснабжение | #ec4899 |
| ПОС | Проект организации строительства | #84cc16 |
| ПБ | Пожарная безопасность | #ef4444 |
| НВК | Наружные сети | #14b8a6 |
| ТХ | Технологические решения | #f97316 |

### Изыскания (5)

| Код | Название |
|-----|----------|
| ИГД | Инженерно-геодезические |
| ИГГ | Инженерно-геологические |
| ИЭИ | Инженерно-экологические |
| ИАДИ | Инженерно-археологические |
| ИГМ | Инженерно-гидрометеорологические |

---

## Скрипт инициализации

```python
# backend/test_data.py

def create_test_data():
    """Создать тестовые данные"""
    
    # 1. Пользователи
    users = [
        ("director@bureau.ru", "Директоров Д.Д.", "director"),
        ("gip-ivanov@bureau.ru", "Иванов И.И.", "gip"),
        ...
    ]
    
    for email, name, role in users:
        crud.create_user(email, name, role)
    
    # 2. Проекты
    project1 = crud.create_project(
        name="Жилой дом на Ленина",
        address="г. Москва, ул. Ленина, д. 5",
        gip_email="gip-ivanov@bureau.ru",
        status="active"
    )
    
    # 3. Разделы
    section_ar = crud.create_section(
        project_id=project1["id"],
        code="АР",
        name="Архитектурные решения",
        cipher="АР.12.34",
        executor_email="executor-petrov@bureau.ru"
    )
    
    # 4. Изыскания
    survey_geo = crud.create_survey(
        project_id=project1["id"],
        type="geology",
        name="Инженерно-геологические изыскания",
        executor_email="executor-petrov@bureau.ru"
    )
    
    # 5. Файлы
    crud.create_file(
        project_id=project1["id"],
        section_id=section_ar["id"],
        filename="plan.pdf",
        original_name="plan.pdf",
        uploaded_by="executor-petrov@bureau.ru"
    )
    
    # 6. Чат
    crud.create_chat_message(
        project_id=project1["id"],
        section_id=section_ar["id"],
        author_email="gip-ivanov@bureau.ru",
        text="Петров П.П., проверьте штамп"
    )
    
    # 7. Задачи
    crud.create_task(
        project_id=project1["id"],
        section_id=section_ar["id"],
        title="Исправить штамп на стр. 5",
        assigned_by="gip-ivanov@bureau.ru",
        assigned_to="executor-petrov@bureau.ru",
        deadline="2026-03-25"
    )
    
    # 8. История
    crud.create_history(
        project_id=project1["id"],
        user_email="director@bureau.ru",
        action="project_created",
        details="Создан проект"
    )
```

---

## API для инициализации

```
GET /api/init-test-data
```

**Response:**
```json
{
  "success": true,
  "message": "Тестовые данные созданы"
}
```

---

## Проверка данных

```python
# Проверка пользователей
users = crud.get_all_users()
assert len(users) == 5

# Проверка проектов
projects = crud.get_all_projects()
assert len(projects) == 3

# Проверка разделов
sections = crud.get_sections_by_project(projects[0]["id"])
assert len(sections) == 2

# Проверка изысканий
surveys = crud.get_surveys_by_project(projects[0]["id"])
assert len(surveys) == 2
```

---

**Версия:** 1.0  
**Дата:** 2026-03-18
