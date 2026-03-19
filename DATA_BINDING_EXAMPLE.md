# 📋 Пример HTML с Data-атрибутами

Файл: `02-dashboard-annotated.html` — пример разметки с data-атрибутами для автоматической интеграции.

---

## Пример разметки карточки статистики

```html
<!-- Карточки статистики -->
<div class="grid grid-cols-4 gap-6 mb-8" data-container="stats">
  
  <!-- 
    DATA_BINDING: {
      endpoint: "GET /api/dashboard/stats",
      field: "projects.total",
      type: "number",
      loading: "skeleton"
    }
  -->
  <div class="stat-card" data-bind-card="projects.total">
    <p class="text-sm text-slate-500 mb-1" data-label>Всего проектов</p>
    <p class="text-3xl font-bold text-slate-800" 
       data-value="projects.total"
       data-default="0">3</p>
  </div>
  
  <!-- 
    DATA_BINDING: {
      endpoint: "GET /api/dashboard/stats",
      field: "projects.inProgress",
      type: "number"
    }
  -->
  <div class="stat-card" data-bind-card="projects.inProgress">
    <p class="text-sm text-slate-500 mb-1" data-label>В работе</p>
    <p class="text-3xl font-bold text-blue-600" 
       data-value="projects.inProgress"
       data-default="0">3</p>
  </div>
  
  <!-- 
    DATA_BINDING: {
      endpoint: "GET /api/dashboard/stats",
      field: "sections.completed",
      type: "number",
      format: "fraction:sections.total"
    }
  -->
  <div class="stat-card" data-bind-card="sections.completed">
    <p class="text-sm text-slate-500 mb-1">Выполнено разделов</p>
    <p class="text-3xl font-bold text-slate-800" 
       data-value="sections.completed"
       data-default="0">7<span class="text-lg text-slate-400" data-value="sections.total">/13</span></p>
  </div>
  
  <!-- 
    DATA_BINDING: {
      endpoint: "GET /api/dashboard/stats",
      field: "tasks.my",
      type: "number"
    }
  -->
  <div class="stat-card" data-bind-card="tasks.my">
    <p class="text-sm text-slate-500 mb-1">Мои задачи</p>
    <p class="text-3xl font-bold text-slate-800" 
       data-value="tasks.my"
       data-default="0">2</p>
  </div>
</div>
```

---

## Пример разметки карточки проекта

```html
<!-- 
  DATA_BINDING: {
    endpoint: "GET /api/projects",
    iterator: "items",
    link: "04-project-detail.html?id={id}"
  }
-->
<div class="project-card" 
     data-template="project-card"
     data-link="04-project-detail.html?id={id}">
  
  <!-- Код проекта -->
  <span class="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded"
        data-value="code">2025-001</span>
  
  <!-- Название проекта -->
  <a href="#" class="project-card-title font-medium" 
     data-value="name"
     data-link="href:04-project-detail.html?id={id}">ЖК "Северное сияние"</a>
  
  <!-- Статус -->
  <!-- 
    DATA_BINDING: {
      field: "status",
      type: "enum",
      map: {
        "draft": {"text": "Черновик", "class": "status-draft"},
        "in_progress": {"text": "В работе", "class": "status-in-progress"},
        "completed": {"text": "Завершён", "class": "status-completed"}
      }
    }
  -->
  <span class="badge" 
        data-value="status"
        data-enum="ProjectStatus">В работе</span>
  
  <!-- Адрес -->
  <p class="text-sm text-slate-500 mb-3" data-value="address">г. Москва, ул. Ленина, д. 45</p>
  
  <!-- Прогресс -->
  <div class="flex items-center justify-between text-xs">
    <span class="text-slate-400" data-format="progress-text">2 из 6 разделов готово</span>
    <span data-value="deadline" data-format="date-deadline">📅 до 30.06.2025</span>
  </div>
</div>
```

---

## Пример разметки индикаторов раздела

```html
<!-- 
  DATA_BINDING: {
    endpoint: "GET /api/projects/:id",
    field: "sections",
    iterator: true
  }
-->
<div class="flex items-center gap-1.5 flex-wrap mb-3" data-container="sections">
  
  <!-- 
    DATA_BINDING: {
      template: "section-indicator",
      iterate: "sections"
    }
  -->
  <a href="#" 
     class="section-indicator"
     data-template="section-indicator"
     data-link="06-section-detail.html?id={id}"
     data-class-map="status:section-done,section-in-progress,section-review,section-not-started,section-overdue">
    
    <!-- Код раздела -->
    <span data-value="code">АР</span>
    
    <!-- Tooltip -->
    <span class="section-tooltip">
      <span class="section-tooltip-title" 
            data-value="name">АР — Архитектурные решения</span>
      <span class="section-tooltip-row">
        <span>Статус:</span>
        <span data-value="status" data-format="status-label">Завершён</span>
      </span>
      <span class="section-tooltip-row">
        <span>Ответственный:</span>
        <span data-value="responsible.name">Петров А.И.</span>
      </span>
    </span>
  </a>
  
</div>
```

---

## Пример разметки "Требуют внимания"

```html
<!-- 
  DATA_BINDING: {
    endpoint: "GET /api/dashboard/attention",
    iterator: "items",
    limit: 6
  }
-->
<div class="grid grid-cols-3 gap-4" data-container="attention">
  
  <!-- 
    DATA_BINDING: {
      template: "attention-card",
      iterate: "items",
      class_map: "priority:attention-critical,attention-warning,attention-info"
    }
  -->
  <a href="#" 
     class="attention-card p-4 rounded-xl"
     data-template="attention-card"
     data-link="link"
     data-class-map="priority:attention-critical,attention-warning,attention-info">
    
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="font-semibold text-sm" 
           data-value="title"
           data-class-map="priority:text-red-800,text-amber-800,text-blue-800">
          Просрочен дедлайн проекта
        </p>
        <p class="text-xs mt-1" 
           data-value="description"
           data-class-map="priority:text-red-600,text-amber-600,text-blue-600">
          Кап. ремонт школы №15
        </p>
        <p class="text-xs mt-2" 
           data-value="badge"
           data-class-map="priority:text-red-500,text-amber-500,text-blue-500">
          📅 14 дней просрочки
        </p>
      </div>
    </div>
  </a>
  
</div>
```

---

## Пример разметки уведомлений

```html
<!-- 
  DATA_BINDING: {
    endpoint: "GET /api/notifications",
    query: "limit=4",
    iterator: "items"
  }
-->
<div class="max-h-96 overflow-y-auto" data-container="notifications">
  
  <a href="#"
     data-template="notification-item"
     data-link="link"
     class="block p-4 hover:bg-slate-50 border-b border-slate-50">
    
    <div class="flex items-start gap-3">
      <!-- Индикатор прочитанности -->
      <div class="w-2 h-2 rounded-full mt-2 flex-shrink-0"
           data-value="read"
           data-class-map="boolean:bg-slate-300,bg-red-500"></div>
      
      <div class="flex-1">
        <p class="text-sm font-medium text-slate-700" data-value="title">Новая задача</p>
        <p class="text-xs text-slate-500 mt-1" data-value="description">Вам назначена задача</p>
        <p class="text-xs text-slate-400 mt-2" 
           data-value="createdAt" 
           data-format="relative-time">2 часа назад</p>
      </div>
    </div>
  </a>
  
</div>
```

---

## Справочник data-атрибутов

| Атрибут | Описание | Пример |
|---------|----------|--------|
| `data-container` | Контейнер для списка элементов | `data-container="projects"` |
| `data-template` | Имя шаблона для клонирования | `data-template="project-card"` |
| `data-value` | Поле из API для подстановки | `data-value="name"` |
| `data-link` | Ссылка с подстановкой ID | `data-link="04-project-detail.html?id={id}"` |
| `data-class-map` | Маппинг значения в CSS класс | `data-class-map="status:done,in-progress,review"` |
| `data-enum` | Название enum-типа для маппинга | `data-enum="ProjectStatus"` |
| `data-format` | Функция форматирования | `data-format="date-deadline"` |
| `data-default` | Значение по умолчанию | `data-default="0"` |
| `data-bind-card` | Идентификатор карточки для привязки | `data-bind-card="projects.total"` |

---

## Автоматический парсер для интеграции

```javascript
/**
 * Автоматическая привязка данных к элементам
 * Использование: DataBinder.bind(containerElement, apiResponse);
 */
const DataBinder = {
  
  // Форматтеры данных
  formatters: {
    'date': (v) => UI.formatDate(v),
    'date-deadline': (v) => `📅 до ${UI.formatDate(v)}`,
    'relative-time': (v) => formatNotificationTime(v),
    'money': (v) => UI.formatMoney(v),
    'progress-text': (v, data) => `${data.completed} из ${data.total} разделов готово`,
  },
  
  // Маппинг статусов
  enumMaps: {
    'ProjectStatus': {
      'draft': { text: 'Черновик', class: 'status-draft' },
      'in_progress': { text: 'В работе', class: 'status-in-progress' },
      'completed': { text: 'Завершён', class: 'status-completed' },
    },
    'SectionStatus': {
      'not_started': { text: 'Не начат', class: 'section-not-started' },
      'in_progress': { text: 'В работе', class: 'section-in-progress' },
      'approved': { text: 'Согласован', class: 'section-done' },
      'review': { text: 'На согласовании', class: 'section-review' },
      'overdue': { text: 'Просрочен', class: 'section-overdue' },
    },
    // ... другие маппинги
  },
  
  /**
   * Привязка данных к контейнеру
   */
  bind(container, data) {
    // Привязка простых значений
    container.querySelectorAll('[data-value]').forEach(el => {
      const field = el.dataset.value;
      const value = this.getNestedValue(data, field);
      
      if (value !== undefined) {
        // Форматирование
        const format = el.dataset.format;
        const formatted = format ? this.formatters[format]?.(value, data) ?? value : value;
        
        el.textContent = formatted;
      } else {
        // Значение по умолчанию
        el.textContent = el.dataset.default ?? '';
      }
    });
    
    // Привязка ссылок
    container.querySelectorAll('[data-link]').forEach(el => {
      const linkTemplate = el.dataset.link;
      const link = linkTemplate.replace('{id}', data.id);
      el.setAttribute('href', link);
    });
    
    // Маппинг классов
    container.querySelectorAll('[data-class-map]').forEach(el => {
      const mapConfig = el.dataset.classMap;
      const [field, ...classes] = mapConfig.split(':');
      const value = this.getNestedValue(data, field);
      
      // Определяем индекс класса
      const index = this.getClassIndex(value, classes);
      if (index >= 0) {
        classes.forEach((cls, i) => {
          el.classList.toggle(cls, i === index);
        });
      }
    });
    
    // Маппинг enum
    container.querySelectorAll('[data-enum]').forEach(el => {
      const enumName = el.dataset.enum;
      const value = this.getNestedValue(data, el.dataset.value);
      const enumMap = this.enumMaps[enumName]?.[value];
      
      if (enumMap) {
        el.textContent = enumMap.text;
        el.className = el.className.replace(/status-\S+|section-\S+/, '');
        el.classList.add(enumMap.class);
      }
    });
  },
  
  /**
   * Рендер списка
   */
  renderList(container, items, templateId) {
    const template = document.querySelector(`[data-template="${templateId}"]`);
    if (!template) return;
    
    container.innerHTML = '';
    
    items.forEach(item => {
      const clone = template.cloneNode(true);
      clone.removeAttribute('data-template');
      this.bind(clone, item);
      container.appendChild(clone);
    });
  },
  
  /**
   * Получение вложенного значения
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  },
  
  /**
   * Определение индекса класса
   */
  getClassIndex(value, classes) {
    // Для boolean: первый класс = false, второй = true
    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }
    // Для enum: ищем по значению
    return classes.findIndex(cls => cls.includes(value));
  }
};
```

---

## Использование при интеграции

```javascript
// Загрузка дашборда
async function loadDashboard() {
  const stats = await API.get('/api/dashboard/stats');
  const attention = await API.get('/api/dashboard/attention');
  const projects = await API.get('/api/projects?limit=5');
  
  // Автоматическая привязка статистики
  DataBinder.bind(document.querySelector('[data-container="stats"]'), stats);
  
  // Автоматический рендер списка
  DataBinder.renderList(
    document.querySelector('[data-container="attention"]'),
    attention.items,
    'attention-card'
  );
  
  DataBinder.renderList(
    document.querySelector('[data-container="projects"]'),
    projects.items,
    'project-card'
  );
}
```
