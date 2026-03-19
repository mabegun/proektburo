# 📊 Data Mapping — Схема данных для интеграции

Этот документ описывает связь между UI элементами и API для упрощения интеграции.

---

## Формат описания элемента

```
<!-- DATA_BINDING: {
  endpoint: "GET /api/...",
  field: "object.field",
  type: "string|number|date|enum|boolean|array",
  format: "formatRule",
  fallback: "значение при отсутствии"
} -->
```

---

## 📄 Страница: 02-dashboard.html

### Статистика (блок карточек)

| Элемент | API Endpoint | Поле | Тип | Формат |
|---------|--------------|------|-----|--------|
| Всего проектов | `GET /api/dashboard/stats` | `projects.total` | number | — |
| В работе | `GET /api/dashboard/stats` | `projects.inProgress` | number | — |
| Выполнено разделов | `GET /api/dashboard/stats` | `sections.completed` | number | — |
| Мои задачи | `GET /api/dashboard/stats` | `tasks.my` | number | — |

### Блок "Требуют внимания"

| Элемент | API Endpoint | Поле | Тип | Примечание |
|---------|--------------|------|-----|------------|
| Карточка внимания | `GET /api/dashboard/attention` | `items[]` | array | Максимум 6 элементов |
| priority | `GET /api/dashboard/attention` | `items[].priority` | enum | `critical`, `warning`, `info` |
| title | `GET /api/dashboard/attention` | `items[].title` | string | — |
| description | `GET /api/dashboard/attention` | `items[].description` | string | — |
| badge | `GET /api/dashboard/attention` | `items[].badge` | string | — |
| link | `GET /api/dashboard/attention` | `items[].link` | string | URL для перехода |

### Профиль пользователя (сайдбар)

| Элемент | API Endpoint | Поле | Тип | Формат |
|---------|--------------|------|-----|--------|
| Инициалы | `GET /api/user/profile` | `user.name` | string | `UI.getInitials(name)` |
| ФИО | `GET /api/user/profile` | `user.name` | string | — |
| Роль | `GET /api/user/profile` | `user.role` | enum | `director`, `gip`, `employee` |

### Уведомления (выпадающий список)

| Элемент | API Endpoint | Поле | Тип | Формат |
|---------|--------------|------|-----|--------|
| Счётчик | `GET /api/notifications/unread-count` | `count` | number | — |
| Список | `GET /api/notifications?limit=4` | `items[]` | array | — |
| read | — | `items[].read` | boolean | Точка: красная/серая |
| title | — | `items[].title` | string | — |
| description | — | `items[].description` | string | — |
| createdAt | — | `items[].createdAt` | datetime | `formatNotificationTime()` |

---

## 📄 Страница: 03-projects-list.html

### Список проектов

| Элемент | API Endpoint | Поле | Тип | Формат |
|---------|--------------|------|-----|--------|
| Код проекта | `GET /api/projects` | `items[].code` | string | — |
| Название | `GET /api/projects` | `items[].name` | string | — |
| Статус | `GET /api/projects` | `items[].status` | enum | См. статусы ниже |
| Адрес | `GET /api/projects` | `items[].address` | string | — |
| Прогресс | `GET /api/projects` | `items[].progress` | number | 0-100, для прогресс-бара |
| Дедлайн | `GET /api/projects` | `items[].deadline` | date | `UI.formatDate()` |

### Индикаторы разделов в карточке проекта

| Элемент | API Endpoint | Поле | Тип | Примечание |
|---------|--------------|------|-----|------------|
| Код раздела | `GET /api/projects/:id` | `sections[].code` | string | "АР", "ГП" и т.д. |
| Статус раздела | `GET /api/projects/:id` | `sections[].status` | enum | Определяет цвет |
| Ответственный | `GET /api/projects/:id` | `sections[].responsible.name` | string | Для tooltip |

### Фильтры

| Фильтр | API Parameter | Значения |
|--------|---------------|----------|
| Поиск | `?search={query}` | string |
| Статус | `?status={value}` | `in_progress`, `completed`, `archived` |
| Тип | `?type={value}` | `new_construction`, `reconstruction`, `capital_repair` |

---

## 📄 Страница: 04-project-detail.html

### Основная информация

| Элемент | API Endpoint | Поле | Тип | Формат |
|---------|--------------|------|-----|--------|
| Код | `GET /api/projects/:id` | `code` | string | — |
| Название | `GET /api/projects/:id` | `name` | string | — |
| Статус | `GET /api/projects/:id` | `status` | enum | См. ProjectStatus |
| Тип | `GET /api/projects/:id` | `type` | enum | См. ProjectType |
| Адрес | `GET /api/projects/:id` | `address` | string | — |
| Заказчик | `GET /api/projects/:id` | `customer` | string | — |
| Дата начала | `GET /api/projects/:id` | `startDate` | date | `UI.formatDate()` |
| Дедлайн | `GET /api/projects/:id` | `deadline` | date | `UI.formatDate()` |
| Площадь | `GET /api/projects/:id` | `area` | number | С единицами "м²" |
| Этажность | `GET /api/projects/:id` | `floors` | number | — |
| Описание | `GET /api/projects/:id` | `description` | string | — |

### Команда проекта

| Элемент | API Endpoint | Поле | Тип |
|---------|--------------|------|-----|
| ГИП | `GET /api/projects/:id` | `gip.name` | string |
| Ответственные разделов | `GET /api/projects/:id` | `sections[].responsible` | object[] |

---

## 📄 Страница: 06-section-detail.html

### Основная информация раздела

| Элемент | API Endpoint | Поле | Тип | Формат |
|---------|--------------|------|-----|--------|
| Код | `GET /api/sections/:id` | `code` | string | "АР", "КР" |
| Название | `GET /api/sections/:id` | `name` | string | — |
| Статус | `GET /api/sections/:id` | `status` | enum | См. SectionStatus |
| Проект (ссылка) | `GET /api/sections/:id` | `project.name` | string | — |
| Ответственный | `GET /api/sections/:id` | `responsible.name` | string | — |
| Дедлайн | `GET /api/sections/:id` | `deadline` | date | `UI.formatDate()` |
| Прогресс | `GET /api/sections/:id` | `progress` | number | 0-100 |

### Файлы раздела

| Элемент | API Endpoint | Поле | Тип |
|---------|--------------|------|-----|
| Список файлов | `GET /api/sections/:id/files` | `items[]` | array |
| Название файла | — | `items[].name` | string |
| Размер | — | `items[].size` | number |
| Статус | — | `items[].status` | enum |
| Дата загрузки | — | `items[].uploadedAt` | datetime |

---

## 📄 Страница: 07-tasks-list.html

### Список задач

| Элемент | API Endpoint | Поле | Тип | Формат |
|---------|--------------|------|-----|--------|
| Название | `GET /api/tasks` | `items[].title` | string | — |
| Описание | `GET /api/tasks` | `items[].description` | string | — |
| Статус | `GET /api/tasks` | `items[].status` | enum | `pending`, `in_progress`, `completed` |
| Приоритет | `GET /api/tasks` | `items[].priority` | enum | `critical`, `high`, `medium`, `low` |
| Проект | `GET /api/tasks` | `items[].projectName` | string | — |
| Исполнители | `GET /api/tasks` | `items[].assignees[]` | array | — |
| Дедлайн | `GET /api/tasks` | `items[].dueDate` | date | `UI.formatDate()` |

---

## 🔢 Справочник статусов

### ProjectStatus
| Значение | Label | CSS класс | Цвет |
|----------|-------|-----------|------|
| `draft` | Черновик | `status-draft` | серый |
| `in_progress` | В работе | `status-in-progress` | синий |
| `on_approval` | На согласовании | `status-on-approval` | жёлтый |
| `completed` | Завершён | `status-completed` | зелёный |
| `archived` | В архиве | `status-archived` | серый |

### SectionStatus / SurveyStatus
| Значение | Label | CSS класс | Цвет |
|----------|-------|-----------|------|
| `not_started` | Не начат | `section-not-started` | серый |
| `in_progress` | В работе | `section-in-progress` | синий |
| `on_approval` | На согласовании | `section-review` | жёлтый |
| `approved` | Согласован | `section-done` | зелёный |
| `on_expertise` | На экспертизе | `section-review` | оранжевый |
| `overdue` | Просрочен | `section-overdue` | красный |

### ExpertiseStatus
| Значение | Label | CSS класс |
|----------|-------|-----------|
| `created` | Создано | `status-created` |
| `in_progress` | В работе | `status-in-progress` |
| `review` | На проверке | `status-review` |
| `closed` | Закрыто | `status-completed` |
| `rejected` | Отклонено | `status-rejected` |

### PaymentStatus
| Значение | Label | CSS класс |
|----------|-------|-----------|
| `created` | Создано | `status-draft` |
| `approved` | Утверждено | `status-approved` |
| `paid` | Выплачено | `status-completed` |
| `awaiting_docs` | Ожидает документы | `status-warning` |
| `overdue` | Просрочено | `status-overdue` |

---

## 🔄 Форматирование данных

### Даты
```javascript
// Вход: "2025-06-30" или "2025-06-30T10:00:00Z"
// Выход: "30.06.2025"
UI.formatDate(dateString)

// Даты с относительным временем
// Вход: "2025-03-16T10:00:00Z"
// Выход: "2 часа назад", "вчера", "20.03.2025"
formatNotificationTime(dateString)
```

### Деньги
```javascript
// Вход: 150000
// Выход: "150 000 ₽"
UI.formatMoney(amount)
```

### Инициалы
```javascript
// Вход: "Иванов Петр Сергеевич"
// Выход: "ИП"
UI.getInitials(name)

// Вход: "Петров А.И."
// Выход: "ПА"
UI.getInitials(name)
```

### Склонение слов
```javascript
// Вход: 5, ['день', 'дня', 'дней']
// Выход: "дней"
UI.declension(number, ['форма1', 'форма2', 'форма3'])
```

---

## 🚀 Рекомендации по интеграции

### 1. Порядок реализации API
1. Аутентификация (`POST /api/auth/login`)
2. Профиль пользователя (`GET /api/user/profile`)
3. Дашборд (`GET /api/dashboard/stats`, `GET /api/dashboard/attention`)
4. Список проектов (`GET /api/projects`)
5. Детали проекта (`GET /api/projects/:id`)
6. Остальные endpoints

### 2. Обработка загрузки
```javascript
// Показать скелетон/загрузку
UI.showLoading('#container');

// После получения данных
renderData(data);
```

### 3. Обработка ошибок
```javascript
try {
  const data = await API.getData();
  renderData(data);
} catch (error) {
  UI.showError('#container', 'Не удалось загрузить данные');
  console.error('API Error:', error);
}
```

### 4. Проверка авторизации
```javascript
// На каждой странице (кроме login)
const token = getAuthToken();
if (!token) {
  window.location.href = '01-login.html';
}
```

---

## 📝 Пример использования Data-атрибутов

```html
<!-- Карточка статистики -->
<div class="stat-card"
     data-api="dashboard.stats"
     data-loading-class="loading-skeleton">
  <p class="text-sm text-slate-500" data-label>Всего проектов</p>
  <p class="text-3xl font-bold" data-field="projects.total" data-default="0">3</p>
</div>

<!-- Карточка проекта -->
<a href="04-project-detail.html?id=123" 
   class="project-card"
   data-api="projects.item"
   data-id="123">
  <span class="text-xs font-mono" data-field="code">2025-001</span>
  <h3 data-field="name">ЖК "Северное сияние"</h3>
  <p data-field="address">г. Москва, ул. Ленина, д. 45</p>
  <span class="badge" data-field="status" data-class-map="status">В работе</span>
  <div class="progress-bar">
    <div class="progress-fill" data-field="progress" data-style="width:{value}%"></div>
  </div>
</a>
```

---

## 🎯 Автоматическая привязка (для ИИ-интеграции)

При интеграции ИИ или автоматическом генераторе кода:

1. Найти все элементы с `data-field`
2. Сопоставить с полями из ответа API
3. Применить форматирование согласно `data-format`
4. Установить классы статуса согласно `data-class-map`

Пример скрипта автопривязки:
```javascript
function bindData(container, data) {
  container.querySelectorAll('[data-field]').forEach(el => {
    const field = el.dataset.field;
    const value = getNestedValue(data, field);
    const format = el.dataset.format;
    
    if (value !== undefined) {
      el.textContent = format ? formatters[format](value) : value;
    }
  });
}
```
