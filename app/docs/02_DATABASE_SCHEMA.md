# 🗄️ Схема базы данных

## Обзор

База данных SQLite содержит 13 таблиц для управления проектным бюро.

---

## Таблицы

### 1. users (Пользователи)

Хранит информацию о пользователях системы.

| Поле | Тип | PK | FK | Null | Описание |
|------|-----|----|----|----|----------|
| email | TEXT | ✅ | | ❌ | Email (логин) |
| name | TEXT | | | ❌ | ФИО |
| role | TEXT | | | ❌ | Роль: director, gip, executor, observer |
| password_hash | TEXT | | | ✅ | Хэш пароля |
| created_at | TEXT | | | ❌ | Дата создания (ISO) |

**Пример:**
```json
{
  "email": "director@bureau.ru",
  "name": "Директоров Директор Д.",
  "role": "director",
  "password_hash": "$2b$12$...",
  "created_at": "2026-03-18T10:00:00"
}
```

---

### 2. projects (Проекты)

Проекты документации.

| Поле | Тип | PK | FK | Null | Описание |
|------|-----|----|----|----|----------|
| id | TEXT | ✅ | | ❌ | UUID проекта |
| name | TEXT | | | ❌ | Название |
| address | TEXT | | | ✅ | Адрес объекта |
| gip_email | TEXT | | users | ✅ | Email ГИПа |
| director_email | TEXT | | users | ✅ | Email директора |
| status | TEXT | | | ❌ | active, expertise, completed, archived |
| created_at | TEXT | | | ❌ | Дата создания |
| settings | TEXT | | | ✅ | JSON с настройками |

**Статусы:**
- `active` — В работе
- `expertise` — На экспертизе
- `completed` — Завершён
- `archived` — Архив

---

### 3. sections (Разделы проекта)

Разделы проектной документации (АР, ГП, КР, ОВ...).

| Поле | Тип | PK | FK | Null | Описание |
|------|-----|----|----|----|----------|
| id | TEXT | ✅ | | ❌ | UUID раздела |
| project_id | TEXT | | projects | ❌ | ID проекта |
| code | TEXT | | | ❌ | Код: АР, ГП, КР... |
| name | TEXT | | | ❌ | Полное название |
| cipher | TEXT | | | ✅ | Шифр: АР.12.34 |
| executor_email | TEXT | | users | ✅ | Email исполнителя |
| status | TEXT | | | ❌ | in_progress, checking, correction, done |
| created_at | TEXT | | | ❌ | Дата создания |

---

### 4. surveys (Изыскания)

Инженерные изыскания по проекту.

| Поле | Тип | PK | FK | Null | Описание |
|------|-----|----|----|----|----------|
| id | TEXT | ✅ | | ❌ | UUID изыскания |
| project_id | TEXT | | projects | ❌ | ID проекта |
| type | TEXT | | | ❌ | geology, geodesy, ecology, archaeology, hydrology |
| name | TEXT | | | ❌ | Название |
| executor_email | TEXT | | users | ✅ | Email исполнителя |
| status | TEXT | | | ❌ | in_progress, done |
| created_at | TEXT | | | ❌ | Дата создания |

---

### 5. files (Файлы)

Загруженные файлы (PDF, DWG...).

| Поле | Тип | PK | FK | Null | Описание |
|------|-----|----|----|----|----------|
| id | INTEGER | ✅ | | ❌ | Автоинкремент |
| project_id | TEXT | | projects | ❌ | ID проекта |
| section_id | TEXT | | sections | ✅ | ID раздела |
| survey_id | TEXT | | surveys | ✅ | ID изыскания |
| filename | TEXT | | | ❌ | Физическое имя |
| original_name | TEXT | | | ❌ | Оригинальное имя |
| uploaded_at | TEXT | | | ❌ | Дата загрузки |
| uploaded_by | TEXT | | users | ❌ | Email загрузившего |
| checked | INTEGER | | | ❌ | 0/1 - Проверен ли штамп |
| errors_count | INTEGER | | | ❌ | Количество ошибок |
| errors_details | TEXT | | | ✅ | JSON с ошибками |

---

### 6. chat_messages (Сообщения чата)

Обсуждения в разделах и изысканиях.

| Поле | Тип | PK | FK | Null | Описание |
|------|-----|----|----|----|----------|
| id | INTEGER | ✅ | | ❌ | Автоинкремент |
| project_id | TEXT | | projects | ❌ | ID проекта |
| section_id | TEXT | | sections | ✅ | ID раздела |
| survey_id | TEXT | | surveys | ✅ | ID изыскания |
| author_email | TEXT | | users | ❌ | Email автора |
| text | TEXT | | | ❌ | Текст сообщения |
| created_at | TEXT | | | ❌ | Дата создания |

---

### 7. tasks (Задачи)

Задачи и поручения.

| Поле | Тип | PK | FK | Null | Описание |
|------|-----|----|----|----|----------|
| id | INTEGER | ✅ | | ❌ | Автоинкремент |
| project_id | TEXT | | projects | ❌ | ID проекта |
| section_id | TEXT | | sections | ✅ | ID раздела |
| survey_id | TEXT | | surveys | ✅ | ID изыскания |
| title | TEXT | | | ❌ | Заголовок |
| description | TEXT | | | ✅ | Описание |
| assigned_by | TEXT | | users | ❌ | Кто назначил |
| assigned_to | TEXT | | users | ❌ | Кому назначили |
| status | TEXT | | | ❌ | open, in_progress, done, cancelled |
| created_at | TEXT | | | ❌ | Дата создания |
| deadline | TEXT | | | ✅ | Дедлайн |

---

### 8. history (История изменений)

Лог всех изменений в системе.

| Поле | Тип | PK | FK | Null | Описание |
|------|-----|----|----|----|----------|
| id | INTEGER | ✅ | | ❌ | Автоинкремент |
| project_id | TEXT | | projects | ❌ | ID проекта |
| section_id | TEXT | | sections | ✅ | ID раздела |
| survey_id | TEXT | | surveys | ✅ | ID изыскания |
| user_email | TEXT | | users | ❌ | Email пользователя |
| action | TEXT | | | ❌ | Тип действия |
| field_name | TEXT | | | ✅ | Имя поля |
| old_value | TEXT | | | ✅ | Старое значение |
| new_value | TEXT | | | ✅ | Новое значение |
| details | TEXT | | | ✅ | Описание |
| created_at | TEXT | | | ❌ | Дата создания |

**Типы действий (action):**
- `project_created`
- `project_updated`
- `section_created`
- `section_updated`
- `file_uploaded`
- `file_deleted`
- `chat_message`
- `task_created`
- `task_updated`
- `member_added`
- `observer_added`

---

### 9. project_members (Команда проекта)

Участники проекта.

| Поле | Тип | PK | FK | Null | Описание |
|------|-----|----|----|----|----------|
| id | INTEGER | ✅ | | ❌ | Автоинкремент |
| project_id | TEXT | | projects | ❌ | ID проекта |
| employee_email | TEXT | | users | ❌ | Email сотрудника |
| role_in_project | TEXT | | | ✅ | Роль в проекте |
| added_by | TEXT | | users | ✅ | Кто добавил |
| added_at | TEXT | | | ❌ | Дата добавления |

**Уникальность:** (project_id, employee_email)

---

### 10. section_observers (Наблюдатели раздела)

| Поле | Тип | PK | FK | Null | Описание |
|------|-----|----|----|----|----------|
| id | INTEGER | ✅ | | ❌ | Автоинкремент |
| section_id | TEXT | | sections | ❌ | ID раздела |
| observer_email | TEXT | | users | ❌ | Email наблюдателя |
| added_at | TEXT | | | ❌ | Дата добавления |

**Уникальность:** (section_id, observer_email)

---

### 11. survey_observers (Наблюдатели изыскания)

| Поле | Тип | PK | FK | Null | Описание |
|------|-----|----|----|----|----------|
| id | INTEGER | ✅ | | ❌ | Автоинкремент |
| survey_id | TEXT | | surveys | ❌ | ID изыскания |
| observer_email | TEXT | | users | ❌ | Email наблюдателя |
| added_at | TEXT | | | ❌ | Дата добавления |

**Уникальность:** (survey_id, observer_email)

---

### 12. section_types (Справочник разделов)

| Поле | Тип | PK | FK | Null | Описание |
|------|-----|----|----|----|----------|
| id | TEXT | ✅ | | ❌ | UUID типа |
| code | TEXT | | | ❌ | Код: АР, ГП, КР... |
| name | TEXT | | | ❌ | Название |
| color | TEXT | | | ✅ | Цвет: #3b82f6 |
| is_active | INTEGER | | | ❌ | 1/0 |

**Значения по умолчанию:**
- АР - Архитектурные решения
- ГП - Генеральный план
- КР - Конструктивные решения
- ОВ - Отопление и вентиляция
- ВК - Водоснабжение и канализация
- ЭОМ - Электроснабжение

---

### 13. survey_types (Справочник изысканий)

| Поле | Тип | PK | FK | Null | Описание |
|------|-----|----|----|----|----------|
| id | TEXT | ✅ | | ❌ | UUID типа |
| code | TEXT | | | ❌ | Код: ИГД, ИГГ... |
| name | TEXT | | | ❌ | Название |
| is_active | INTEGER | | | ❌ | 1/0 |

**Значения по умолчанию:**
- ИГД - Инженерно-геодезические
- ИГГ - Инженерно-геологические
- ИЭИ - Инженерно-экологические
- ИАДИ - Инженерно-археологические
- ИГМ - Инженерно-гидрометеорологические

---

## ER-диаграмма

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   projects  │──1:N──│   sections  │──1:N──│    files    │
└─────────────┘       └─────────────┘       └─────────────┘
       │                     │                     │
       │1:N                  │1:N                  │
       ▼                     ▼                     ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   surveys   │       │chat_messages│       │   history   │
└─────────────┘       └─────────────┘       └─────────────┘
       │
       │1:N
       ▼
┌─────────────┐
│    files    │
└─────────────┘

┌─────────────┐       ┌─────────────┐
│   projects  │──1:N──│project_members│
└─────────────┘       └─────────────┘

┌─────────────┐       ┌─────────────┐
│   sections  │──1:N──│section_observers│
└─────────────┘       └─────────────┘

┌─────────────┐       ┌─────────────┐
│   surveys   │──1:N──│survey_observers│
└─────────────┘       └─────────────┘
```

---

## SQL для создания таблиц

См. файл: `database.py` (функция `init_db()`)

---

**Версия:** 1.0  
**Дата:** 2026-03-18
