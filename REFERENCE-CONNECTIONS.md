# Связи справочников с другими страницами

> Документ для разработчиков бекенда: как данные из справочников используются на разных страницах системы

---

## 📚 Общая схема связей

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          СПРАВОЧНИКИ (Настройки)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│  13-1 Разделы проекта    │  13-2 Виды изысканий  │  13-3 Категории расходов  │
│  (SectionType)           │  (SurveyType)         │  (ExpenseCategory)        │
└────────────┬─────────────┴──────────┬────────────┴─────────────┬────────────┘
             │                        │                          │
             ▼                        ▼                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ИСПОЛЬЗОВАНИЕ                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  Создание проекта        │  Создание проекта     │  Добавление расхода      │
│  (выбор разделов)       │  (выбор изысканий)    │  (выбор категории)       │
│                          │                        │                          │
│  Карточка проекта       │  Карточка проекта     │  Вкладка расходов        │
│  (список разделов)      │  (список изысканий)   │  (группировка)           │
│                          │                        │                          │
│  Карточка исполнителя   │  Карточка изыскания   │  Отчёты                  │
│  (компетенции)          │  (название вида)      │  (аналитика)             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Справочник разделов проекта (`SectionType`)

### 1.1 Структура данных

```typescript
interface SectionType {
  id: string;           // UUID
  shortName: string;    // "АР", "ГП", "КР" — уникальное
  fullName: string;     // "Архитектурные решения"
  color: string;        // "#3b82f6" — для визуализации
  isActive: boolean;    // true/false — деактивация без удаления
  createdAt: Date;
  updatedAt: Date;
}
```

### 1.2 API Endpoints

```
GET    /api/section-types           — список активных
GET    /api/section-types/all       — все (включая деактивированные)
POST   /api/section-types           — создать
PUT    /api/section-types/:id       — обновить
DELETE /api/section-types/:id/deactivate — деактивировать
PUT    /api/section-types/:id/activate   — активировать
```

### 1.3 Где используется

| Страница | Компонент | Как использовать |
|----------|-----------|------------------|
| **05-project-create.html** | Чекбоксы выбора разделов | `GET /api/section-types` (только isActive=true) → вывод списком чекбоксов |
| **04-project-detail.html** | Блок "Разделы проекта" | Список Section проекта JOIN SectionType → вывести название, цвет, статус |
| **06-section-detail.html** | Заголовок раздела | Section.SectionType → вывести название раздела |
| **03-projects-list.html** | Бейджи на карточках | Для каждого проекта: список Section JOIN SectionType → вывести цветные бейджи |
| **10-employee-create.html** | Блок "Компетенции" | `GET /api/section-types` → чекбоксы "Какие разделы умеет делать исполнитель" |
| **09-employees-list.html** | Фильтр по компетенциям | `GET /api/section-types` → выпадающий список для фильтрации |

### 1.4 Связи в БД

```sql
-- Таблица справочника
CREATE TABLE section_types (
  id UUID PRIMARY KEY,
  short_name VARCHAR(10) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  color VARCHAR(7) DEFAULT '#3b82f6',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Связь с проектами (разделы проекта)
CREATE TABLE sections (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  section_type_id UUID REFERENCES section_types(id),
  status VARCHAR(50),
  responsible_id UUID REFERENCES employees(id),
  -- ... другие поля
);

-- Связь с исполнителями (компетенции)
CREATE TABLE employee_competencies (
  employee_id UUID REFERENCES employees(id),
  section_type_id UUID REFERENCES section_types(id),
  PRIMARY KEY (employee_id, section_type_id)
);
```

### 1.5 Пример запроса для карточки проекта

```sql
-- Получить все разделы проекта с данными из справочника
SELECT 
  s.id,
  s.status,
  st.short_name,
  st.full_name,
  st.color,
  e.full_name as responsible_name
FROM sections s
JOIN section_types st ON s.section_type_id = st.id
LEFT JOIN employees e ON s.responsible_id = e.id
WHERE s.project_id = :projectId
ORDER BY st.short_name;
```

---

## 2. Справочник видов изысканий (`SurveyType`)

### 2.1 Структура данных

```typescript
interface SurveyType {
  id: string;           // UUID
  shortName: string;    // "ИГД", "ИГИ", "ИЭИ" — уникальное
  fullName: string;     // "Инженерно-геодезические изыскания"
  color: string;        // "#22c55e" — для визуализации
  isActive: boolean;    // true/false
  createdAt: Date;
  updatedAt: Date;
}
```

### 2.2 API Endpoints

```
GET    /api/survey-types           — список активных
GET    /api/survey-types/all       — все (включая деактивированные)
POST   /api/survey-types           — создать
PUT    /api/survey-types/:id       — обновить
DELETE /api/survey-types/:id/deactivate — деактивировать
PUT    /api/survey-types/:id/activate   — активировать
```

### 2.3 Где используется

| Страница | Компонент | Как использовать |
|----------|-----------|------------------|
| **05-project-create.html** | Чекбоксы выбора изысканий | `GET /api/survey-types` (только isActive=true) → вывод списком чекбоксов |
| **04-project-detail.html** | Блок "Изыскания" | Список Survey проекта JOIN SurveyType → вывести название, цвет, статус, исполнителя |
| **14-survey-detail.html** | Заголовок изыскания | Survey.SurveyType → вывести название вида изыскания |

### 2.4 Связи в БД

```sql
-- Таблица справочника
CREATE TABLE survey_types (
  id UUID PRIMARY KEY,
  short_name VARCHAR(10) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  color VARCHAR(7) DEFAULT '#22c55e',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Связь с проектами (изыскания)
CREATE TABLE surveys (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  survey_type_id UUID REFERENCES survey_types(id),
  status VARCHAR(50),
  responsible_id UUID REFERENCES employees(id),
  contractor_id UUID,  -- ссылка на внешнюю организацию
  -- ... другие поля
);
```

### 2.5 Пример запроса для карточки проекта

```sql
-- Получить все изыскания проекта с данными из справочника
SELECT 
  su.id,
  su.status,
  sut.short_name,
  sut.full_name,
  sut.color,
  e.full_name as responsible_name,
  c.name as contractor_name
FROM surveys su
JOIN survey_types sut ON su.survey_type_id = sut.id
LEFT JOIN employees e ON su.responsible_id = e.id
LEFT JOIN contractors c ON su.contractor_id = c.id
WHERE su.project_id = :projectId
ORDER BY sut.short_name;
```

---

## 3. Справочник категорий расходов (`ExpenseCategory`)

### 3.1 Структура данных

```typescript
interface ExpenseCategory {
  id: string;           // UUID
  name: string;         // "Командировки", "Материалы"
  isActive: boolean;    // true/false
  createdAt: Date;
  updatedAt: Date;
}
```

### 3.2 API Endpoints

```
GET    /api/expense-categories           — список активных
GET    /api/expense-categories/all       — все (включая деактивированные)
POST   /api/expense-categories           — создать
PUT    /api/expense-categories/:id       — обновить
DELETE /api/expense-categories/:id/deactivate — деактивировать
PUT    /api/expense-categories/:id/activate   — активировать
```

### 3.3 Где используется

| Страница | Компонент | Как использовать |
|----------|-----------|------------------|
| **04-1-project-expenses.html** | Форма добавления расхода | `GET /api/expense-categories` → выпадающий список |
| **06-section-detail.html** | Вкладка "Финансы" | Выпадающий список категорий при добавлении расхода по разделу |
| **12-reports.html** | Группировка расходов | Группировка расходов по категориям для аналитики |
| **04-project-detail.html** | Вкладка "Финансы" | Список расходов с категориями |

### 3.4 Связи в БД

```sql
-- Таблица справочника
CREATE TABLE expense_categories (
  id UUID PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Связь с расходами
CREATE TABLE expenses (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  section_id UUID REFERENCES sections(id),  -- опционально
  category_id UUID REFERENCES expense_categories(id),
  amount DECIMAL(12,2) NOT NULL,
  description TEXT,
  receipt_file_url VARCHAR(500),
  status VARCHAR(50),  -- 'pending', 'approved'
  created_by UUID REFERENCES employees(id),
  created_at TIMESTAMP,
  approved_by UUID REFERENCES employees(id),
  approved_at TIMESTAMP
);
```

### 3.5 Пример запроса для отчёта по расходам

```sql
-- Получить расходы проекта с группировкой по категориям
SELECT 
  ec.name as category_name,
  COUNT(e.id) as count,
  SUM(e.amount) as total_amount
FROM expenses e
JOIN expense_categories ec ON e.category_id = ec.id
WHERE e.project_id = :projectId
  AND e.status = 'approved'
GROUP BY ec.id, ec.name
ORDER BY total_amount DESC;
```

---

## 4. Справочник типов контрагентов (`ContractorType`)

### 4.1 Структура данных

```typescript
interface ContractorType {
  id: string;           // UUID
  code: string;         // "ooo", "ip", "self_employed", "individual", "employee"
  name: string;         // "ООО", "ИП", "Самозанятый", "Физлицо (ГПХ)", "Сотрудник"
  requiredDocs: string[];  // Коды обязательных документов
  optionalDocs: string[];  // Коды опциональных документов
  isActive: boolean;    // true/false
  createdAt: Date;
  updatedAt: Date;
}
```

### 4.2 API Endpoints

```
GET    /api/contractor-types           — список активных
GET    /api/contractor-types/all       — все (включая деактивированные)
POST   /api/contractor-types           — создать
PUT    /api/contractor-types/:id       — обновить
DELETE /api/contractor-types/:id/deactivate — деактивировать
PUT    /api/contractor-types/:id/activate   — активировать
```

### 4.3 Где используется

| Страница | Компонент | Как использовать |
|----------|-----------|------------------|
| **04-5-project-finances.html** | Форма создания выплаты | `GET /api/contractor-types` → выбор типа контрагента, подсказки по документам |
| **04-5-project-finances-employee.html** | Карточка выплаты | Отображение типа, прогресс-бар комплектности документов |
| **10-employee-create.html** | Форма исполнителя | Выбор типа контрагента по умолчанию для сотрудника |
| **06-section-detail.html** | Блок "Договор" | Отображение типа контрагента договора |

### 4.4 Матрица обязательных документов

| Тип | Код | Обязательные документы | Опциональные |
|-----|-----|------------------------|--------------|
| ООО | `ooo` | Договор, Акт, Счёт, Счёт-фактура/УПД, Платёжка | — |
| ИП | `ip` | Договор, Акт, Счёт, Платёжка | Счёт-фактура |
| Самозанятый | `self_employed` | Чек из "Мой налог" | Договор |
| Физлицо (ГПХ) | `individual` | Договор ГПХ, Акт | — |
| Сотрудник | `employee` | — | — (через зарплату) |

### 4.5 Связи в БД

```sql
-- Таблица справочника
CREATE TABLE contractor_types (
  id UUID PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  required_docs TEXT[],      -- Массив кодов документов
  optional_docs TEXT[],      -- Массив кодов документов
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Связь с финансовыми операциями
ALTER TABLE finance_operations 
ADD COLUMN contractor_type_id UUID REFERENCES contractor_types(id);

-- Связь с договорами
ALTER TABLE contracts 
ADD COLUMN contractor_type_id UUID REFERENCES contractor_types(id);

-- Связь с исполнителями (тип по умолчанию)
ALTER TABLE employees 
ADD COLUMN default_contractor_type_id UUID REFERENCES contractor_types(id);
```

### 4.6 Пример запроса для формы выплаты

```sql
-- Получить тип контрагента с документами
SELECT 
  ct.id,
  ct.name,
  ct.required_docs,
  ct.optional_docs
FROM contractor_types ct
WHERE ct.id = :contractorTypeId AND ct.is_active = true;
```

### 4.7 Значения по умолчанию

```sql
INSERT INTO contractor_types (id, code, name, required_docs, optional_docs) VALUES
  (gen_random_uuid(), 'ooo', 'ООО', 
   ARRAY['contract', 'act', 'invoice', 'vat_invoice', 'payment_order'], 
   ARRAY[]::TEXT[]),
  (gen_random_uuid(), 'ip', 'ИП', 
   ARRAY['contract', 'act', 'invoice', 'payment_order'], 
   ARRAY['vat_invoice']),
  (gen_random_uuid(), 'self_employed', 'Самозанятый', 
   ARRAY['my_tax_check'], 
   ARRAY['contract']),
  (gen_random_uuid(), 'individual', 'Физлицо (ГПХ)', 
   ARRAY['gph_contract', 'act'], 
   ARRAY[]::TEXT[]),
  (gen_random_uuid(), 'employee', 'Сотрудник', 
   ARRAY[]::TEXT[], 
   ARRAY[]::TEXT[]);
```

---

## 5. Правила деактивации записей справочников

### 5.1 Общие правила

1. **Никогда не удалять** — только деактивировать (`is_active = false`)
2. **Причина:** сохранение истории в связанных записях
3. **Деактивированные записи** не доступны для выбора в новых проектах
4. **Деактивированные записи** отображаются в существующих проектах

### 5.2 Проверка перед деактивацией

```sql
-- Проверка: есть ли активные проекты с этим разделом
SELECT COUNT(*) FROM sections s
JOIN projects p ON s.project_id = p.id
WHERE s.section_type_id = :sectionTypeId
  AND p.status NOT IN ('completed', 'archived');

-- Если COUNT > 0 — предупредить пользователя:
-- "Этот раздел используется в N активных проектах. 
--  Деактивация скроет его из выбора для новых проектов."
```

### 5.3 Повторная активация

```sql
-- Активация деактивированной записи
UPDATE section_types 
SET is_active = true, updated_at = NOW()
WHERE id = :id;
```

---

## 6. Список значений по умолчанию

### 6.1 Разделы проекта (при инициализации системы)

```sql
INSERT INTO section_types (id, short_name, full_name, color) VALUES
  (gen_random_uuid(), 'АР', 'Архитектурные решения', '#3b82f6'),
  (gen_random_uuid(), 'ГП', 'Генеральный план', '#22c55e'),
  (gen_random_uuid(), 'КР', 'Конструктивные решения', '#f59e0b'),
  (gen_random_uuid(), 'ОВ', 'Отопление, вентиляция и кондиционирование', '#8b5cf6'),
  (gen_random_uuid(), 'ВК', 'Водоснабжение и канализация', '#06b6d4'),
  (gen_random_uuid(), 'ЭОМ', 'Электроснабжение и электрооборудование', '#ec4899'),
  (gen_random_uuid(), 'ПОС', 'Проект организации строительства', '#84cc16'),
  (gen_random_uuid(), 'ПБ', 'Пожарная безопасность', '#ef4444');
```

### 6.2 Виды изысканий

```sql
INSERT INTO survey_types (id, short_name, full_name, color) VALUES
  (gen_random_uuid(), 'ИГД', 'Инженерно-геодезические изыскания', '#22c55e'),
  (gen_random_uuid(), 'ИГИ', 'Инженерно-геологические изыскания', '#8b5cf6'),
  (gen_random_uuid(), 'ИЭИ', 'Инженерно-экологические изыскания', '#06b6d4'),
  (gen_random_uuid(), 'ИАДИ', 'Инженерно-археологические изыскания', '#f59e0b');
```

### 6.3 Категории расходов

```sql
INSERT INTO expense_categories (id, name) VALUES
  (gen_random_uuid(), 'Командировки'),
  (gen_random_uuid(), 'Материалы'),
  (gen_random_uuid(), 'Подрядчики'),
  (gen_random_uuid(), 'Транспорт'),
  (gen_random_uuid(), 'Связь'),
  (gen_random_uuid(), 'Прочее');
```

### 6.4 Типы контрагентов

```sql
INSERT INTO contractor_types (id, code, name, required_docs, optional_docs) VALUES
  (gen_random_uuid(), 'ooo', 'ООО', 
   ARRAY['contract', 'act', 'invoice', 'vat_invoice', 'payment_order'], 
   ARRAY[]::TEXT[]),
  (gen_random_uuid(), 'ip', 'ИП', 
   ARRAY['contract', 'act', 'invoice', 'payment_order'], 
   ARRAY['vat_invoice']),
  (gen_random_uuid(), 'self_employed', 'Самозанятый', 
   ARRAY['my_tax_check'], 
   ARRAY['contract']),
  (gen_random_uuid(), 'individual', 'Физлицо (ГПХ)', 
   ARRAY['gph_contract', 'act'], 
   ARRAY[]::TEXT[]),
  (gen_random_uuid(), 'employee', 'Сотрудник', 
   ARRAY[]::TEXT[], 
   ARRAY[]::TEXT[]);
```

---

## 7. Миграция данных

При добавлении новых полей в справочники:

1. Создать колонку с `DEFAULT` значением
2. Обновить существующие записи
3. Проверить целостность связей

```sql
-- Пример: добавление поля description в section_types
ALTER TABLE section_types ADD COLUMN description TEXT DEFAULT '';

-- Пример: проверка целостности
SELECT s.id, s.section_type_id
FROM sections s
LEFT JOIN section_types st ON s.section_type_id = st.id
WHERE st.id IS NULL;
-- Должно вернуть 0 строк
```

---

*Этот документ предназначен для разработчиков бекенда. Обновлять при изменении структуры справочников.*
