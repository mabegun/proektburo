# Архитектура данных

> Описание сущностей и их взаимосвязей для системы "Проектное бюро"

---

## 1. ER-диаграмма (упрощённая)

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   PROJECT   │──1:N──│   SECTION   │──1:N──│    FILE     │
└─────────────┘       └─────────────┘       └─────────────┘
       │                     │                     │
       │1:N                  │1:N                  │1:1
       │                     │                     │
       ▼                     ▼                     ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  EXPENSE    │       │  COMMENT    │       │   VERSION   │
└─────────────┘       └─────────────┘       └─────────────┘
       │
       │1:N
       ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│EXPENSE_FILE │       │  EMPLOYEE   │───────│    ROLE     │
└─────────────┘       └─────────────┘       └─────────────┘
                            │
                            │M:N
                            ▼
                      ┌─────────────┐
                      │COMPETITION  │
                      │ (разделы)   │
                      └─────────────┘
```

---

## 2. Сущности

### 2.1 Project (Проект)

```typescript
interface Project {
  id: string;
  code: string;                    // Шифр: "2025-001"
  name: string;                    // Название
  status: ProjectStatus;           // Статус
  deadline?: Date;                 // Дедлайн
  
  // Вводные данные
  inputText?: string;              // Текстовое описание ТЗ
  inputFiles: File[];              // Файлы ТЗ, ГП участка
  
  // Связи
  sections: Section[];             // Разделы проекта
  surveys: Survey[];               // Изыскания
  expenses: Expense[];             // Расходы
  comments: Comment[];             // Обсуждение
  expertiseComments: ExpertiseComment[]; // Замечания
  
  // Метаданные
  createdAt: Date;
  updatedAt: Date;
  createdBy: Employee;             // ГИП
}

enum ProjectStatus {
  DRAFT = 'draft',                 // Черновик
  IN_PROGRESS = 'in_progress',     // В работе
  ON_APPROVAL = 'on_approval',     // На согласовании
  COMPLETED = 'completed',         // Завершён
  ARCHIVED = 'archived'            // В архиве
}
```

### 2.2 Section (Раздел проекта)

```typescript
interface Section {
  id: string;
  projectId: string;
  
  // Тип раздела (из справочника)
  sectionType: SectionType;
  
  // Участники
  responsible: Employee;           // Ответственный (один)
  coExecutors: Employee[];         // Соисполнители
  observers: Employee[];           // Наблюдатели
  
  // Содержимое
  status: SectionStatus;
  files: File[];                   // Файлы раздела
  comments: Comment[];             // Обсуждение
  expertiseComments: ExpertiseComment[]; // Замечания
  expenses: Expense[];             // Расходы по разделу
  
  // Метаданные
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface SectionType {
  id: string;
  shortName: string;               // "АР"
  fullName: string;                // "Архитектурные решения"
  color: string;                   // Для индикации
  isActive: boolean;
}

enum SectionStatus {
  NOT_STARTED = 'not_started',     // Не начат
  IN_PROGRESS = 'in_progress',     // В работе
  ON_APPROVAL = 'on_approval',     // На согласовании
  APPROVED = 'approved',           // Согласован
  ON_EXPERTISE = 'on_expertise',   // На экспертизе
}
```

### 2.3 Survey (Проектное изыскание)

```typescript
interface Survey {
  id: string;
  projectId: string;
  
  // Тип изыскания (из справочника)
  surveyType: SurveyType;
  
  // Ответственный от организации
  responsible: Employee;
  
  // Исполнитель (внешняя организация)
  contractor?: Contractor;
  
  // Содержимое
  status: SurveyStatus;
  files: File[];
  comments: Comment[];
  
  // Договор
  contractFile?: File;
  
  // Метаданные
  deadline?: Date;
  createdAt: Date;
}

interface Contractor {
  name: string;                    // Наименование организации
  inn: string;
  kpp: string;
  address: string;
  phone?: string;
  email?: string;
  contactPerson?: string;
}

interface SurveyType {
  id: string;
  shortName: string;               // "ИГД"
  fullName: string;                // "Инженерно-геодезические изыскания"
  isActive: boolean;
}
```

### 2.4 File (Файл)

```typescript
interface File {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  
  // Версионность
  version: number;
  parentFileId?: string;           // ID предыдущей версии
  
  // Привязка
  entityType: 'section' | 'survey' | 'project' | 'expense' | 'expertise';
  entityId: string;
  
  // Статус согласования
  isApproved: boolean;
  approvedBy?: Employee;
  approvedAt?: Date;
  
  // Связь с замечанием
  expertiseCommentId?: string;
  
  // Метаданные
  uploadedBy: Employee;
  uploadedAt: Date;
}
```

### 2.5 Income (Поступление)

```typescript
interface Income {
  id: string;
  projectId: string;

  // Тип поступления
  type: 'advance' | 'stage_payment' | 'final_payment';

  // Данные
  amount: number;
  description?: string;

  // Даты
  invoiceDate: Date;              // Дата счёта
  expectedDate: Date;             // Ожидаемая дата оплаты
  receivedDate?: Date;            // Фактическая дата получения

  // Документы
  invoiceFile: File;              // Счёт от заказчика
  documents: File[];              // Акт, счёт-фактура, платёжка

  // Статус
  status: IncomeStatus;

  // Метаданные
  createdBy: Employee;
  createdAt: Date;
}

enum IncomeStatus {
  PENDING = 'pending',           // Ожидает
  OVERDUE = 'overdue',           // Просрочено
  RECEIVED = 'received'          // Получено
}
```

### 2.6 FinanceOperation (Расход или выплата)

```typescript
interface FinanceOperation {
  id: string;
  projectId: string;
  sectionId?: string;

  // Тип операции
  operationType: 'payout' | 'expense';

  // Для выплат исполнителям
  payoutType?: 'work_invoice' | 'advance_invoice' | 'gph_payment';
  employeeId?: string;           // Исполнитель (для выплат)

  // Для расходов проекта
  categoryId?: string;           // Категория расхода

  // Данные
  amount: number;
  description: string;

  // Даты
  date: Date;                    // Дата создания
  paidDate?: Date;               // Дата выплаты

  // Документы
  documents: File[];             // Счёт, платёжка
  closingDocuments: File[];      // Закрывающие документы

  // Статус
  status: FinanceStatus;

  // Метаданные
  createdBy: Employee;           // Кто создал (может быть за другого)
  approvedBy?: Employee;         // Кто согласовал
  approvedAt?: Date;
  paidBy?: Employee;             // Кто подтвердил выплату
  createdAt: Date;
}

enum FinanceStatus {
  CREATED = 'created',           // Создано
  REJECTED = 'rejected',         // Отклонено
  APPROVED = 'approved',         // Согласовано
  PAID = 'paid',                 // Выплачено
  CLOSED = 'closed'              // Закрыто (документы загружены)
}
```

### 2.7 Expense (Расход) — устарело

> **Внимание:** Сущность `Expense` заменена на `FinanceOperation`. Оставлено для справки.

```typescript
interface Expense {
  id: string;
  projectId: string;
  sectionId?: string;              // Опционально

  // Данные расхода
  category: ExpenseCategory;
  amount: number;
  description: string;

  // Подтверждение
  hasDocument: boolean;
  documentFile?: File;

  // Статус
  status: ExpenseStatus;

  // Метаданные
  date: Date;
  createdBy: Employee;
  approvedBy?: Employee;
  approvedAt?: Date;
  createdAt: Date;
}

interface ExpenseCategory {
  id: string;
  name: string;                    // "Командировки"
  isActive: boolean;
}

enum ExpenseStatus {
  PENDING = 'pending',             // Ожидает
  APPROVED = 'approved'            // Принят
}
```

### 2.6 ExpertiseComment (Замечание экспертизы)

```typescript
interface ExpertiseComment {
  id: string;
  projectId: string;
  sectionId: string;
  
  // Данные замечания
  number: string;                  // Номер от экспертизы
  text: string;                    // Текст замечания
  expertiseFile?: File;            // Файл от экспертизы
  
  // Ответ
  responseFile?: File;             // Файл с ответом/исправлениями
  responseText?: string;
  
  // Статус
  status: ExpertiseCommentStatus;
  
  // Исполнитель
  assignee: Employee;
  
  // История
  history: StatusHistory[];
  
  // Метаданные
  createdAt: Date;
  updatedAt: Date;
}

enum ExpertiseCommentStatus {
  CREATED = 'created',             // Создано
  IN_PROGRESS = 'in_progress',     // В работе
  ON_REVIEW = 'on_review',         // Отправлено на проверку
  REJECTED = 'rejected',           // Отклонено ГИПом
  APPROVED = 'approved',           // Проверено ГИПом
  SENT_TO_EXPERTISE = 'sent',      // Отправлено в экспертизу
  CLOSED = 'closed',               // Закрыто
  CLARIFICATION = 'clarification'  // Уточнение от экспертизы
}
```

### 2.7 Employee (Исполнитель)

```typescript
interface Employee {
  id: string;
  
  // Личные данные
  firstName: string;
  lastName: string;
  middleName: string;
  fullName: string;                // "Иванов Петр Сергеевич"
  shortName: string;               // "Иванов П.С."
  
  // Должность
  position: string;                // "Архитектор"
  role: UserRole;
  
  // Контакты
  email: string;
  phone?: string;
  
  // Компетенции (разделы)
  competencies: SectionType[];
  
  // Аватар
  avatarColor: string;             // Цвет для заглушки
  
  // Статус
  isActive: boolean;
  
  // Метаданные
  createdAt: Date;
}

enum UserRole {
  DIRECTOR = 'director',           // Директор — полный доступ к системе
  GIP = 'gip',                     // ГИП (главный инженер проекта) — создание проектов, согласование
  EMPLOYEE = 'employee'            // Исполнитель — работа по разделам
}

// Примечание: "coexecutor" и "observer" — это роли на уровне раздела/изыскания,
// а не системные роли. Любой исполнитель (employee, gip, director) может быть
// назначен соисполнителем или наблюдателем в конкретном разделе.
// См. матрицу прав доступа в разделе 4.
```

### 2.8 Comment (Комментарий/Обсуждение)

```typescript
interface Comment {
  id: string;
  
  // Привязка
  entityType: 'project' | 'section' | 'survey' | 'task';
  entityId: string;
  
  // Содержимое
  text: string;
  attachments: File[];
  
  // Ответы
  parentId?: string;
  replies: Comment[];
  
  // Метаданные
  author: Employee;
  createdAt: Date;
  updatedAt?: Date;
}
```

---

## 3. Справочники

### 3.1 Справочник разделов (SectionType)
```
| id | shortName | fullName                    | color   |
|----|-----------|----------------------------|---------|
| 1  | АР        | Архитектурные решения      | #3b82f6 |
| 2  | ГП        | Генеральный план           | #22c55e |
| 3  | КР        | Конструктивные решения     | #f59e0b |
| 4  | ОВ        | Отопление и вентиляция     | #8b5cf6 |
| 5  | ВК        | Водоснабжение и канализация| #06b6d4 |
| 6  | ЭОМ       | Электроснабжение           | #ec4899 |
| 7  | ПОС       | Проект организации стр-ва  | #84cc16 |
| 8  | ПБ        | Пожарная безопасность      | #ef4444 |
```

### 3.2 Справочник изысканий (SurveyType)
```
| id | shortName | fullName                           |
|----|-----------|-----------------------------------|
| 1  | ИГД       | Инженерно-геодезические изыскания |
| 2  | ИГГ       | Инженерно-геологические изыскания |
| 3  | ИЭИ       | Инженерно-экологические изыскания |
| 4  | ИАДИ      | Инженерно-археологические изыск.  |
```

### 3.3 Справочник категорий расходов (ExpenseCategory)
```
| id | name           |
|----|----------------|
| 1  | Командировки   |
| 2  | Материалы      |
| 3  | Подрядчики     |
| 4  | Транспорт      |
| 5  | Связь          |
| 6  | Прочее         |
```

### 3.4 Справочник типов контрагентов (ContractorType)
```
| id | code           | name              | requiredDocs                          | optionalDocs    |
|----|----------------|-------------------|---------------------------------------|-----------------|
| 1  | ooo            | ООО               | contract, act, invoice, vat, payment  | —               |
| 2  | ip             | ИП                | contract, act, invoice, payment       | vat             |
| 3  | self_employed  | Самозанятый       | my_tax_check                          | contract        |
| 4  | individual     | Физлицо (ГПХ)     | gph_contract, act                     | —               |
| 5  | employee       | Сотрудник         | —                                     | —               |
```

**Матрица документов:**
| Тип | Договор | Акт | Счёт | Счёт-фактура | Платёжка | Чек "Мой налог" |
|-----|---------|-----|------|--------------|----------|-----------------|
| ООО | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| ИП | ✅ | ✅ | ✅ | ⚪ | ✅ | ❌ |
| Самозанятый | ⚪ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Физлицо (ГПХ) | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Сотрудник | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

✅ — обязателен | ⚪ — опционален | ❌ — не требуется

---

## 4. Права доступа

### 4.1 Матрица прав к разделу

| Действие | ГИП | Ответственный | Соисполнитель | Наблюдатель |
|----------|-----|---------------|---------------|-------------|
| Просмотр файлов | ✅ | ✅ | ✅ | ✅ |
| Участие в обсуждении | ✅ | ✅ | ✅ | ✅ |
| Загрузка файлов | ✅ | ✅ | ✅ | ❌ |
| Удаление файлов | ✅ | ✅ | ✅* | ❌ |
| Согласование файлов | ✅ | ❌ | ❌ | ❌ |
| Работа с замечаниями | ✅ | ✅ | ✅ | ❌ |
| Редактирование раздела | ✅ | ✅ | ❌ | ❌ |
| Назначение участников | ✅ | ❌ | ❌ | ❌ |

*\* Соисполнитель может удалять только свои несогласованные файлы*

### 4.2 Права к расходам

| Роль | Что видит | Что редактирует |
|------|-----------|-----------------|
| ГИП | Все расходы | Любые (до принятия) |
| Исполнитель | Свои расходы | Свои (до принятия) |

---

## 5. Статусы и переходы

### 5.1 Статусы замечаний экспертизы

```
Создано ──► В работе ──► На проверке ──┬──► Проверено ──► В экспертизе ──┬──► Закрыто
                                          │                               │
                                          ▼                               ▼
                                      Отклонено                      Уточнение
                                          │                               │
                                          └──────────► В работе ◄──────────┘
```

---

*Этот документ описывает структуру данных для разработки backend и frontend.*
