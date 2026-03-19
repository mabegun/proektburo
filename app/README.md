# App — Страницы, готовые к интеграции с API

Эта папка содержит HTML страницы, подготовленные для работы с реальным API.

## Структура

```
app/
├── pages/           # HTML страницы
│   ├── 02-dashboard.html
│   ├── 03-projects-list.html
│   ├── 04-project-detail.html
│   └── ...
├── js/
│   ├── data-binder.js    # Автоматическая привязка данных
│   ├── api-client.js     # Клиент для API запросов
│   └── config.js         # Конфигурация (BASE_URL и т.д.)
└── README.md
```

## Data-атрибуты

Все элементы, которые должны получать данные из API, размечены data-атрибутами:

| Атрибут | Описание | Пример |
|---------|----------|--------|
| `data-api` | API endpoint для загрузки | `data-api="projects.list"` |
| `data-value` | Поле из ответа API | `data-value="name"` |
| `data-container` | Контейнер для списка | `data-container="projects"` |
| `data-template` | Шаблон элемента списка | `data-template="project-card"` |
| `data-link` | Ссылка с подстановкой ID | `data-link="04-project-detail.html?id={id}"` |
| `data-format` | Функция форматирования | `data-format="date"`, `data-format="money"` |
| `data-enum` | Enum для маппинга статуса | `data-enum="ProjectStatus"` |
| `data-class-map` | Маппинг значения в CSS класс | `data-class-map="status:done,in-progress"` |
| `data-default` | Значение по умолчанию | `data-default="0"` |

## Использование

```javascript
// Загрузка данных
const stats = await API.get('/api/dashboard/stats');
DataBinder.bind(document.getElementById('stats-container'), stats);

// Рендер списка
const projects = await API.get('/api/projects');
DataBinder.renderList(
  document.getElementById('projects-list'),
  projects.items,
  'project-card'
);
```

## Форматтеры

| Название | Вход | Выход |
|----------|------|-------|
| `date` | `"2025-06-30"` | `"30.06.2025"` |
| `datetime` | `"2025-06-30T10:00:00Z"` | `"30.06.2025 10:00"` |
| `relative-time` | `"2025-03-16T10:00:00Z"` | `"2 часа назад"` |
| `money` | `150000` | `"150 000 ₽"` |
| `number` | `1234567` | `"1 234 567"` |
| `percent` | `33` | `"33%"` |
| `deadline` | `"2025-06-30"` | `"📅 до 30.06.2025"` |
| `initials` | `"Иванов Петр"` | `"ИП"` |

## Enum-маппинги

### ProjectStatus
- `draft` → Черновик, `status-draft`
- `in_progress` → В работе, `status-in-progress`
- `on_approval` → На согласовании, `status-on-approval`
- `completed` → Завершён, `status-completed`

### SectionStatus
- `not_started` → Не начат, `section-not-started`
- `in_progress` → В работе, `section-in-progress`
- `on_approval` → На согласовании, `section-review`
- `approved` → Согласован, `section-done`
- `overdue` → Просрочен, `section-overdue`

### Priority
- `critical` → Критичный, `priority-critical`
- `high` → Высокий, `priority-high`
- `medium` → Средний, `priority-medium`
- `low` → Низкий, `priority-low`

## Запуск

1. Настроить `app/js/config.js` — указать `BASE_URL` API
2. Открыть `app/pages/02-dashboard.html` в браузере
3. Данные загрузятся автоматически при наличии API
