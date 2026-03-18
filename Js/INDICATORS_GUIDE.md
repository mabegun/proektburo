# 📊 Шпаргалка по индикаторам

**Все типы индикаторов, цветов, иконок и числовых показателей**

---

## 1️⃣ Числовые индикаторы показателей

### Где используются:
- **Дашборд (02-dashboard.html)**: карточки статистики
- **Список проектов (03-projects-list.html)**: прогресс-бары
- **Финансы (04-5, 14-2, 19)**: суммы, выплаты
- **Задачи (07-tasks-list.html)**: счётчики подзадач
- **Уведомления (11-notifications.html)**: счётчик непрочитанных

### Типы индикаторов:

| Тип | Пример | API |
|-----|--------|-----|
| **Прогресс выполнения** | 33%, 75%, 100% | `project.progress`, `section.progress` |
| **Счётчик элементов** | 5 разделов, 3 задачи | `sections.length`, `tasks.length` |
| **Сумма** | 150 000 ₽, 45 000 ₽ | `payment.amount`, `contract.sum` |
| **Дней до дедлайна** | 14 дней, 2 дня | `deadline - now` |
| **Соотношение** | 3/5 выполнено | `completed/total` |

### Использование в коде:

```javascript
// Прогресс-бар
UI.renderProgressBar(project.progress, {
  size: 'md',
  showLabel: true
});

// Счётчик
UI.renderCounter(stats.projects.total, {
  label: 'Всего проектов',
  icon: '🏗️',
  trend: 'up'
});

// Цвет прогресса
const color = UI.getProgressColor(percentage);
// 100% → #16a34a (зелёный)
// 75%  → #059669 (бирюзовый)
// 50%  → #2563eb (синий)
// 25%  → #d97706 (оранжевый)
// 0%   → #dc2626 (красный)
```

---

## 2️⃣ Цветовые индикаторы статусов

### Проекты

| Статус | Класс | Цвет фона | Цвет текста | Emoji |
|--------|-------|-----------|-------------|-------|
| Не начат | `status-not-started` | #f1f5f9 | #64748b | ⏸️ |
| В работе | `status-in-progress` | #dbeafe | #1d4ed8 | ⏳ |
| Завершён | `status-completed` | #dcfce7 | #16a34a | ✅ |
| На согласовании | `status-revision` | #fef3c7 | #d97706 | 👀 |
| Просрочен | `status-overdue` | #fee2e2 | #dc2626 | ⚠️ |

### Разделы

| Статус | Класс | Цвет фона | Цвет текста | Emoji |
|--------|-------|-----------|-------------|-------|
| Завершён | `section-done` | #dcfce7 | #16a34a | ✅ |
| В работе | `section-in-progress` | #dbeafe | #1d4ed8 | ⏳ |
| На проверке | `section-review` | #fef3c7 | #d97706 | 👀 |
| Не начат | `section-not-started` | #f1f5f9 | #94a3b8 | ⏸️ |
| Просрочен | `section-overdue` | #fee2e2 | #dc2626 | ⚠️ |

### Изыскания

| Статус | Класс | Цвет фона | Цвет текста | Emoji |
|--------|-------|-----------|-------------|-------|
| Завершён | `survey-done` | #d1fae5 | #059669 | ✅ |
| В работе | `survey-in-progress` | #e0e7ff | #4f46e5 | ⏳ |
| Не начат | `survey-not-started` | #f1f5f9 | #94a3b8 | ⏸️ |

### Приоритеты (задачи, замечания)

| Приоритет | Класс | Цвет фона | Цвет текста |
|-----------|-------|-----------|-------------|
| Критичный | `priority-critical` | #fee2e2 | #dc2626 |
| Высокий | `priority-high` | #fef3c7 | #d97706 |
| Средний | `priority-medium` | #dbeafe | #1d4ed8 |
| Низкий | `priority-low` | #f1f5f9 | #64748b |

### Уведомления

| Тип | Класс | Цвет иконки |
|-----|-------|-------------|
| Задача | `notification-task` | 📋 |
| Проект | `notification-project` | 🏗️ |
| Комментарий | `notification-comment` | 💬 |
| Файл | `notification-file` | 📎 |
| Экспертиза | `notification-expertise` | ⚠️ |
| Система | `notification-system` | ⚙️ |

---

## 3️⃣ Иконки статусов и сущностей

### SVG иконки (через UI.getEntityIcon)

```javascript
UI.getEntityIcon('project')      // 🏗️ Здание
UI.getEntityIcon('section')      // 📁 Папка
UI.getEntityIcon('task')         // 📋 Список
UI.getEntityIcon('employee')     // 👤 Человек
UI.getEntityIcon('survey')       // 📊 График
UI.getEntityIcon('file')         // 📎 Файл
UI.getEntityIcon('money')        // 💰 Деньги
UI.getEntityIcon('notification') // 🔔 Колокольчик
UI.getEntityIcon('expertise')    // ⚠️ Внимание
UI.getEntityIcon('calendar')     // 📅 Календарь
UI.getEntityIcon('settings')     // ⚙️ Настройки
```

### Emoji для быстрого использования

```javascript
UI.getEntityEmoji('project')      // "🏗️"
UI.getEntityEmoji('section')      // "📁"
UI.getEntityEmoji('task')         // "📋"
UI.getEntityEmoji('employee')     // "👤"
UI.getEntityEmoji('survey')       // "📊"
UI.getEntityEmoji('file')         // "📎"
UI.getEntityEmoji('money')        // "💰"
UI.getEntityEmoji('notification') // "🔔"
UI.getEntityEmoji('expertise')    // "⚠️"
UI.getEntityEmoji('calendar')     // "📅"
UI.getEntityEmoji('settings')     // "⚙️"
```

### Иконки статусов (через UI.getStatusIcon)

```javascript
UI.getStatusIcon('completed', 'emoji')  // "✅"
UI.getStatusIcon('completed', 'svg')    // SVG path
UI.getStatusIcon('completed', 'html')   // <svg>...</svg>

UI.getStatusIcon('in-progress', 'emoji') // "⏳"
UI.getStatusIcon('overdue', 'emoji')     // "⚠️"
UI.getStatusIcon('review', 'emoji')      // "👀"
```

---

## 4️⃣ Индикаторы разделов (визуализация)

### Как выглядят в интерфейсе:

```
┌─────────────────────────────────────────────────────┐
│  И: [ИГД✅] [ИГИ⏳] [ИЭИ⏸️]                          │
│  Р: [АР✅] [ГП✅] [КР⏳] [ОВ⏸️] [ВК⏸️] [ЭОМ⏸️]      │
└─────────────────────────────────────────────────────┘
```

### Код для рендера:

```javascript
function renderSectionIndicators(sections) {
  return sections.map(section => {
    const statusClass = UI.getSectionStatusClass(section.status);
    const statusIcon = UI.getStatusIcon(section.status, 'emoji');
    const statusText = UI.getSectionStatusText(section.status);
    
    return `
      <a href="06-section-detail.html?id=${section.id}" 
         class="section-indicator ${statusClass}"
         title="${section.name}: ${statusText}">
        ${statusIcon} ${section.code}
      </a>
    `;
  }).join('');
}
```

### Всплывающие подсказки:

```html
<div class="section-indicator section-done">
  АР
  <div class="section-tooltip">
    <div class="section-tooltip-title">АР — Архитектурные решения</div>
    <div class="section-tooltip-row">
      <span>Статус:</span> Завершён
    </div>
    <div class="section-tooltip-row">
      <span>Ответственный:</span> Петров А.И.
    </div>
  </div>
</div>
```

---

## 5️⃣ Индикаторы изысканий (визуализация)

### Как выглядят в интерфейсе:

```
┌─────────────────────────────────────────────────────┐
│  Изыскания:                                         │
│  [ИГД ✅ Завершён] [ИГИ ⏳ В работе] [ИЭИ ⏸️ Не начат]│
└─────────────────────────────────────────────────────┘
```

### Код для рендера:

```javascript
function renderSurveyIndicators(surveys) {
  return surveys.map(survey => {
    const statusClass = UI.getSurveyStatusClass(survey.status);
    const statusIcon = UI.getStatusIcon(survey.status, 'emoji');
    const statusText = UI.getSurveyStatusText(survey.status);
    
    return `
      <a href="14-survey-detail.html?id=${survey.id}" 
         class="survey-indicator ${statusClass}">
        ${statusIcon} ${survey.code}
        <div class="survey-tooltip">
          <div class="survey-tooltip-title">${survey.name}</div>
          <div>Статус: ${statusText}</div>
          <div>Ответственный: ${survey.responsible || 'Не назначен'}</div>
        </div>
      </a>
    `;
  }).join('');
}
```

---

## 6️⃣ Цветовые палитры для графиков

### Палитра "Default"

```javascript
UI.getColorByType('project', 'default')
// #1e293b (тёмно-серый)
// #3b82f6 (синий)
// #10b981 (зелёный)
// #f59e0b (оранжевый)
// #ef4444 (красный)
// #8b5cf6 (фиолетовый)
// #ec4899 (розовый)
// #06b6d4 (голубой)
// #84cc16 (салатовый)
// #f97316 (оранжевый)
```

### Палитра "Status"

```javascript
UI.getColorByType('status', 'status')
// #dc2626 (красный — просрочено)
// #d97706 (оранжевый — внимание)
// #2563eb (синий — в работе)
// #16a34a (зелёный — завершено)
// #64748b (серый — не начато)
```

### Палитра "Pastel"

```javascript
UI.getColorByType('type', 'pastel')
// #fecaca (светло-красный)
// #fde68a (светло-жёлтый)
// #bbf7d0 (светло-зелёный)
// #bfdbfe (светло-синий)
// #ddd6fe (светло-фиолетовый)
```

---

## 7️⃣ Примеры комплексного использования

### Карточка проекта

```javascript
function renderProjectCard(project) {
  const progressColor = UI.getProgressColor(project.progress);
  const statusClass = UI.getProjectStatusClass(project.status);
  const statusText = UI.getProjectStatusText(project.status);
  const daysLeft = calculateDaysLeft(project.deadline);
  
  return `
    <div class="project-card">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-sm font-mono">${project.code}</span>
            <h3 class="font-semibold">${project.name}</h3>
            <span class="badge ${statusClass}">${statusText}</span>
          </div>
          
          <!-- Индикаторы разделов -->
          <div class="flex gap-2 mb-3">
            ${renderSectionIndicators(project.sections)}
          </div>
          
          <div class="text-sm text-slate-500">
            ${UI.getEntityIcon('calendar', 'w-4 h-4')}
            До ${UI.formatDate(project.deadline)} 
            (${daysLeft} дн.)
          </div>
        </div>
        
        <!-- Прогресс -->
        <div class="w-32">
          ${UI.renderProgressBar(project.progress, {
            size: 'sm',
            color: progressColor
          })}
        </div>
      </div>
    </div>
  `;
}
```

### Карточка статистики

```javascript
function renderStatCard(stats) {
  return `
    <div class="stat-card">
      ${UI.renderCounter(stats.projects.total, {
        label: 'Всего проектов',
        icon: UI.getEntityEmoji('project'),
        trend: stats.projects.trend, // 'up', 'down', 'neutral'
        size: 'lg'
      })}
      
      <div class="flex gap-2 mt-2 text-xs">
        <span class="text-blue-600">
          ${stats.projects.inProgress} в работе
        </span>
        <span class="text-green-600">
          ${stats.projects.completed} завершено
        </span>
      </div>
    </div>
  `;
}
```

### Список уведомлений

```javascript
function renderNotification(notif) {
  const icon = UI.getEntityIcon(notif.type, 'w-5 h-5');
  const typeClass = UI.getNotificationTypeClass(notif.type);
  
  return `
    <div class="notification-item ${notif.read ? 'read' : 'unread'}">
      <div class="notification-icon ${typeClass}">
        ${icon}
      </div>
      <div class="notification-content">
        <p class="notification-title">${notif.title}</p>
        <p class="notification-description">${notif.description}</p>
        <span class="notification-time">${formatTime(notif.createdAt)}</span>
      </div>
      ${!notif.read ? '<span class="unread-dot"></span>' : ''}
    </div>
  `;
}
```

---

## 8️⃣ Справочник сокращений

### Разделы проекта

| Код | Название |
|-----|----------|
| АР | Архитектурные решения |
| ГП | Генеральный план |
| КР | Конструктивные решения |
| ОВ | Отопление и вентиляция |
| ВК | Водоснабжение и канализация |
| ЭОМ | Электроснабжение |
| НВК | Наружные сети водоснабжения и канализации |
| ТМ | Тепломеханические решения |
| АТ | Автоматизация |
| ПЗ | Пояснительная записка |
| ПОС | Проект организации строительства |
| ПБ | Пожарная безопасность |

### Изыскания

| Код | Название |
|-----|----------|
| ИГД | Инженерно-геодезические |
| ИГИ | Инженерно-геологические |
| ИЭИ | Инженерно-экологические |
| ИАДИ | Инженерно-архитектурно-дизайнерские |

---

## 9️⃣ Быстрая справка по функциям

```javascript
// СТАТУСЫ
UI.getProjectStatusClass(status)      // Класс проекта
UI.getSectionStatusClass(status)      // Класс раздела
UI.getSurveyStatusClass(status)       // Класс изыскания
UI.getProjectStatusText(status)       // Текст проекта
UI.getSectionStatusText(status)       // Текст раздела
UI.getSurveyStatusText(status)        // Текст изыскания

// ЦВЕТА
UI.getStatusColor(status, format)     // Цвет статуса
UI.getProgressColor(percentage)       // Цвет прогресса
UI.getColorByType(type, palette)      // Цвет из палитры

// ИКОНКИ
UI.getStatusIcon(status, type)        // Иконка статуса
UI.getEntityIcon(type, size)          // SVG иконка
UI.getEntityEmoji(type)               // Emoji иконка

// ЧИСЛА
UI.calculateProgress(current, total)  // Процент
UI.getProgressClass(percentage)       // Класс прогресса
UI.renderProgressBar(pct, opts)       // HTML прогресс-бара
UI.renderCounter(value, opts)         // HTML счётчика

// ФОРМАТИРОВАНИЕ
UI.formatDate(dateString)             // "16.03.2025"
UI.formatMoney(amount)                // "150 000 ₽"
UI.getInitials(name)                  // "ИИ"
UI.declension(num, words)             // "5 дней"
```

---

**Итого:** В системе используется **~50 типов индикаторов** (статусы, цвета, иконки, числа) для визуализации состояния проектов, разделов, изысканий, задач и финансов.
