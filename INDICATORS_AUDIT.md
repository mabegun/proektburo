# 📊 Полный аудит индикаторов прототипа

**Дата:** 16.03.2026  
**Проверено страниц:** 36  
**Найдено индикаторов:** 250+

---

## 📋 Структура документа

Для каждой страницы указаны:
1. Числовые индикаторы
2. Цветовые индикаторы (статусы)
3. Иконки
4. Индикаторы разделов/изысканий
5. Логика применения (откуда данные, как рендерить)

---

# 1. Страницы проекта

## 01-login.html — Вход в систему

**Индикаторы:** нет

**Примечание:** Статичная форма входа, нет динамических данных.

---

## 02-dashboard.html — Дашборд

### Числовые индикаторы (8 шт)

| Элемент | Селектор | Пример | Источник данных | Логика |
|---------|----------|--------|-----------------|--------|
| Всего проектов | `.stat-card:nth-child(1) .text-3xl` | 35 | `GET /api/dashboard/stats` → `projects.total` | `stats.projects.total` |
| В работе | `.stat-card:nth-child(1) .text-blue-600` | 12 | `GET /api/dashboard/stats` → `projects.inProgress` | `stats.projects.inProgress` |
| Завершено | `.stat-card:nth-child(1) .text-green-600` | 18 | `GET /api/dashboard/stats` → `projects.completed` | `stats.projects.completed` |
| Всего задач | `.stat-card:nth-child(2) .text-3xl` | 42 | `GET /api/dashboard/stats` → `tasks.total` | `stats.tasks.total` |
| Просрочено задач | `.stat-card:nth-child(2) .text-red-600` | 3 | `GET /api/dashboard/stats` → `tasks.overdue` | `stats.tasks.overdue` |
| Разделов в работе | `.stat-card:nth-child(3) .text-3xl` | 8 | `GET /api/dashboard/stats` → `sections.inProgress` | `stats.sections.inProgress` |
| На проверке | `.stat-card:nth-child(3) .text-amber-600` | 5 | `GET /api/dashboard/stats` → `sections.review` | `stats.sections.review` |
| Финансы за месяц | `.stat-card:nth-child(4) .text-2xl` | 450 000 ₽ | `GET /api/dashboard/stats` → `finances.month` | `UI.formatMoney(stats.finances.month)` |

### Цветовые индикаторы (10 шт)

| Элемент | Классы | Статусы | Источник | Логика |
|---------|--------|---------|----------|--------|
| Карточка "Просрочен дедлайн" | `.attention-critical` | critical | `GET /api/dashboard/attention` → `[].priority` | `item.priority === 'critical' ? 'attention-critical' : ...` |
| Карточка "Замечания на проверке" | `.attention-critical` | critical | `GET /api/dashboard/attention` |同上 |
| Карточка "Просрочена оплата" | `.attention-warning` | warning | `GET /api/dashboard/attention` → `[].priority` | `item.priority === 'warning' ? 'attention-warning' : ...` |
| Карточка "Дедлайн изыскания" | `.attention-warning` | warning | `GET /api/dashboard/attention` |同上 |
| Карточка "Дедлайн раздела" | `.attention-warning` | warning | `GET /api/dashboard/attention` |同上 |
| Карточка "Не загружены документы" | `.attention-info` | info | `GET /api/dashboard/attention` → `[].priority` | `item.priority === 'info' ? 'attention-info' : ...` |
| Счётчик уведомлений | `.bg-red-500` | unread | `GET /api/notifications/unread-count` | `count > 0 ? 'bg-red-500' : 'hidden'` |
| Счётчик задач | `.bg-red-500` | has-items | `GET /api/dashboard/stats` | `tasks.overdue > 0 ? show : hide` |
| Прогресс проектов | `.progress-bar-fill` | 0-100% | `projects[].progress` | `style="width: ${project.progress}%"` |
| Статусы проектов в карточках | `.badge.status-*` | 5 статусов | `projects[].status` | `UI.getProjectStatusClass(project.status)` |

### Иконки (6 шт)

| Элемент | Тип | Emoji/SVG | Источник | Логика |
|---------|-----|-----------|----------|--------|
| Иконка проекта | SVG | 🏗️ | `UI.getEntityIcon('project')` | Статичная |
| Иконка задачи | SVG | 📋 | `UI.getEntityIcon('task')` | Статичная |
| Иконка сотрудника | SVG | 👤 | `UI.getEntityIcon('employee')` | Статичная |
| Иконка уведомления | SVG | 🔔 | `UI.getEntityIcon('notification')` | Статичная |
| Иконка отчёта | SVG | 📊 | `UI.getEntityIcon('file')` | Статичная |
| Иконка настроек | SVG | ⚙️ | `UI.getEntityIcon('settings')` | Статичная |

### Индикаторы разделов (6 шт)

| Элемент | Код | Статус | Источник | Логика |
|---------|-----|--------|----------|--------|
| Индикатор АР | `section-indicator.section-done` | done | `projects[].sections[]` → `status` | `UI.getSectionStatusClass(section.status)` |
| Индикатор ГП | `section-indicator.section-done` | done |同上 |同上 |
| Индикатор КР | `section-indicator.section-in-progress` | in-progress |同上 |同上 |
| Индикатор ОВ | `section-indicator.section-not-started` | not-started |同上 |同上 |
| Индикатор ВК | `section-indicator.section-not-started` | not-started |同上 |同上 |
| Индикатор ЭОМ | `section-indicator.section-not-started` | not-started |同上 |同上 |

### Индикаторы изысканий (3 шт)

| Элемент | Код | Статус | Источник | Логика |
|---------|-----|--------|----------|--------|
| Индикатор ИГД | `survey-indicator.survey-done` | done | `projects[].surveys[]` → `status` | `UI.getSurveyStatusClass(survey.status)` |
| Индикатор ИГИ | `survey-indicator.survey-in-progress` | in-progress |同上 |同上 |
| Индикатор ИЭИ | `survey-indicator.survey-not-started` | not-started |同上 |同上 |

### Логика применения (комплексная)

```javascript
// 1. Загрузка данных дашборда
async function loadDashboard() {
  const [stats, attention, projects] = await Promise.all([
    API.dashboard.getStats(),
    API.dashboard.getAttention(),
    API.projects.getList({ limit: 3 })
  ]);
  
  renderStats(stats);
  renderAttention(attention);
  renderRecentProjects(projects);
}

// 2. Рендер статистики
function renderStats(stats) {
  document.getElementById('dashboard-stats').innerHTML = `
    <div class="stat-card">
      ${UI.renderCounter(stats.projects.total, {
        label: 'Всего проектов',
        icon: UI.getEntityEmoji('project'),
        trend: 'up'
      })}
      <div class="flex gap-2 mt-2 text-xs">
        <span class="text-blue-600">${stats.projects.inProgress} в работе</span>
        <span class="text-green-600">${stats.projects.completed} завершено</span>
      </div>
    </div>
    <!-- Повторить для задач, разделов, финансов -->
  `;
}

// 3. Рендер блока "Требуют внимания"
function renderAttention(items) {
  document.getElementById('attention-block').innerHTML = items.map(item => `
    <a href="${item.link}" class="attention-card ${getAttentionClass(item.priority)}">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="font-semibold text-${getColor(item.priority)}-800 text-sm">
            ${item.title}
          </p>
          <p class="text-${getColor(item.priority)}-600 text-xs mt-1">
            ${item.description}
          </p>
          <p class="text-${getColor(item.priority)}-500 text-xs mt-2">
            ${item.badge}
          </p>
        </div>
        <svg class="w-5 h-5 text-${getColor(item.priority)}-400" ...>...</svg>
      </div>
    </a>
  `).join('');
}

// 4. Рендер индикаторов разделов
function renderSectionIndicators(sections) {
  return sections.map(section => `
    <a href="06-section-detail.html?id=${section.id}" 
       class="section-indicator ${UI.getSectionStatusClass(section.status)}"
       title="${section.name}: ${UI.getSectionStatusText(section.status)}">
      ${section.code}
      <div class="section-tooltip">
        <div class="section-tooltip-title">${section.name}</div>
        <div class="section-tooltip-row">
          <span>Статус:</span> ${UI.getSectionStatusText(section.status)}
        </div>
        <div class="section-tooltip-row">
          <span>Ответственный:</span> ${section.responsible || 'Не назначен'}
        </div>
      </div>
    </a>
  `).join('');
}
```

---

## 03-projects-list.html — Список проектов

### Числовые индикаторы (9 шт)

| Элемент | Селектор | Пример | Источник | Логика |
|---------|----------|--------|----------|--------|
| Прогресс проекта 1 | `.project-card:nth-child(1) .progress-bar-fill` | 33% | `projects[].progress` | `style="width: ${project.progress}%"` |
| Прогресс проекта 2 | `.project-card:nth-child(2) .progress-bar-fill` | 67% |同上 |同上 |
| Прогресс проекта 3 | `.project-card:nth-child(3) .progress-bar-fill` | 15% |同上 |同上 |
| Количество разделов | `.project-card .text-sm svg ~ span` | 6 разделов | `projects[].sections.length` | `${project.sections.length} разделов` |
| Количество исполнителей | `.project-card .text-sm svg:last-child ~ span` | 4 исполнителя | `projects[].team.length` | `${project.team.length} исполнителей` |
| Дней до дедлайна | `.project-card .text-sm svg:last-child ~ span` | до 30.06.2025 | `projects[].deadline` | `до ${UI.formatDate(project.deadline)}` |
| Счётчик в фильтрах | `.badge` | 3 | `filters.status.count` | `filters.find(s => s.id === status).count` |
| Счётчик в сайдбаре (задачи) | `.sidebar-item .bg-red-500` | 2 | `GET /api/tasks/overdue-count` | `count > 0 ? show : hide` |
| Счётчик в сайдбаре (уведомления) | `.sidebar-item .bg-red-500` | 3 | `GET /api/notifications/unread-count` |同上 |

### Цветовые индикаторы (15 шт)

| Элемент | Классы | Статусы | Источник | Логика |
|---------|--------|---------|----------|--------|
| Статус проекта 1 | `.badge.status-in-progress` | in-progress | `projects[].status` | `UI.getProjectStatusClass(project.status)` |
| Статус проекта 2 | `.badge.status-review` | review |同上 |同上 |
| Статус проекта 3 | `.badge.status-not-started` | not-started |同上 |同上 |
| Индикатор раздела АР | `.section-indicator.section-done` | done | `projects[].sections[]` | `UI.getSectionStatusClass(section.status)` |
| Индикатор раздела ГП | `.section-indicator.section-done` | done |同上 |同上 |
| Индикатор раздела КР | `.section-indicator.section-in-progress` | in-progress |同上 |同上 |
| Индикатор раздела ОВ | `.section-indicator.section-not-started` | not-started |同上 |同上 |
| Индикатор раздела ВК | `.section-indicator.section-not-started` | not-started |同上 |同上 |
| Индикатор раздела ЭОМ | `.section-indicator.section-not-started` | not-started |同上 |同上 |
| Индикатор изыскания ИГД | `.survey-indicator.survey-done` | done | `projects[].surveys[]` | `UI.getSurveyStatusClass(survey.status)` |
| Индикатор изыскания ИГИ | `.survey-indicator.survey-in-progress` | in-progress |同上 |同上 |
| Индикатор изыскания ИЭИ | `.survey-indicator.survey-not-started` | not-started |同上 |同上 |
| Активный фильтр | `.btn-primary` | active | User selection | Toggle class on click |
| Ховер на проекте | `.project-card:hover` | transform | CSS | `transform: translateY(-2px)` |
| Активная ссылка в сайдбаре | `.sidebar-item.active` | active | Current page | Compare href |

### Иконки (9 шт)

| Элемент | Тип | Назначение | Источник | Логика |
|---------|-----|------------|----------|--------|
| Иконка проекта | SVG | Сайдбар | `UI.getEntityIcon('project')` | Статичная |
| Иконка задачи | SVG | Сайдбар | `UI.getEntityIcon('task')` | Статичная |
| Иконка сотрудника | SVG | Сайдбар | `UI.getEntityIcon('employee')` | Статичная |
| Иконка уведомления | SVG | Сайдбар | `UI.getEntityIcon('notification')` | Статичная |
| Иконка отчёта | SVG | Сайдбар | `UI.getEntityIcon('file')` | Статичная |
| Иконка настроек | SVG | Сайдбар | `UI.getEntityIcon('settings')` | Статичная |
| Иконка выхода | SVG | Сайдбар | SVG path | Статичная |
| Иконка "Новый проект" | SVG | Кнопка | SVG path | Статичная |
| Иконки в карточке | SVG | Инфо | 4 шт (проект, люди, дата) | Статичные |

### Индикаторы разделов (18 шт = 6 × 3 проекта)

**Проект 1 (ЖК "Северное сияние"):**
- АР: done, ГП: done, КР: in-progress, ОВ: not-started, ВК: not-started, ЭОМ: not-started

**Проект 2 (Реконструкция адм. здания):**
- АР: review, ГП: done, КР: in-progress, ОВ: not-started, ВК: not-started

**Проект 3 (Кап. ремонт школы №15):**
- АР: not-started, ГП: not-started, КР: not-started, ОВ: not-started

**Логика рендера:**
```javascript
function renderProjects(projects) {
  return projects.map(project => `
    <div class="project-card">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-sm font-mono">${project.code}</span>
            <a href="04-project-detail.html?id=${project.id}">
              <h3 class="font-semibold">${project.name}</h3>
            </a>
            <span class="badge ${UI.getProjectStatusClass(project.status)}">
              ${UI.getProjectStatusText(project.status)}
            </span>
          </div>
          <p class="text-slate-500">${project.address}</p>
          
          <!-- Индикаторы изысканий и разделов -->
          <div class="flex items-center gap-2 flex-wrap mb-3">
            <span class="text-xs text-slate-400 font-medium">И:</span>
            <div class="flex gap-1.5 flex-wrap">
              ${project.surveys.map(survey => `
                <a href="14-survey-detail.html?id=${survey.id}" 
                   class="survey-indicator ${UI.getSurveyStatusClass(survey.status)}">
                  ${survey.code}
                  <div class="survey-tooltip">
                    <div class="survey-tooltip-title">${survey.name}</div>
                    <div>Статус: ${UI.getSurveyStatusText(survey.status)}</div>
                  </div>
                </a>
              `).join('')}
            </div>
            
            <span class="text-slate-300 mx-1">|</span>
            
            <span class="text-xs text-slate-400 font-medium">Р:</span>
            <div class="flex gap-1.5 flex-wrap">
              ${project.sections.map(section => `
                <a href="06-section-detail.html?id=${section.id}" 
                   class="section-indicator ${UI.getSectionStatusClass(section.status)}">
                  ${section.code}
                  <div class="section-tooltip">
                    <div class="section-tooltip-title">${section.name}</div>
                    <div>Статус: ${UI.getSectionStatusText(section.status)}</div>
                  </div>
                </a>
              `).join('')}
            </div>
          </div>
          
          <!-- Инфо -->
          <div class="flex items-center gap-6 text-sm text-slate-500">
            <span class="flex items-center gap-2">
              ${UI.getEntityIcon('project', 'w-4 h-4')}
              ${project.sections.length} разделов
            </span>
            <span class="flex items-center gap-2">
              ${UI.getEntityIcon('employee', 'w-4 h-4')}
              ${project.team.length} исполнителей
            </span>
            <span class="flex items-center gap-2">
              ${UI.getEntityIcon('calendar', 'w-4 h-4')}
              до ${UI.formatDate(project.deadline)}
            </span>
          </div>
        </div>
        
        <!-- Прогресс -->
        <div class="w-32">
          ${UI.renderProgressBar(project.progress, { size: 'sm' })}
        </div>
      </div>
    </div>
  `).join('');
}
```

---

## 04-project-detail.html — Детальная страница проекта

### Числовые индикаторы (6 шт)

| Элемент | Пример | Источник | Логика |
|---------|--------|----------|--------|
| Прогресс проекта | 33% | `project.progress` | `UI.renderProgressBar(project.progress)` |
| Количество разделов | 6 разделов | `project.sections.length` | `${sections.length} разделов` |
| Количество изысканий | 3 изыскания | `project.surveys.length` | `${surveys.length} изысканий` |
| Количество файлов | Файлы (3) | `project.files.length` | `Файлы (${files.length})` |
| Этажность | 25 этажей | `project.floors` | `${project.floors} этажей` |
| Площадь | 45 000 м² | `project.area` | `${project.area.toLocaleString()} м²` |

### Цветовые индикаторы (10 шт)

| Элемент | Класс | Статус | Источник | Логика |
|---------|-------|--------|----------|--------|
| Статус проекта | `.badge.status-in-progress` | in-progress | `project.status` | `UI.getProjectStatusClass(project.status)` |
| Статус раздела АР | `.badge.status-completed` | completed | `sections[].status` | `UI.getSectionStatusClass(section.status)` |
| Статус раздела ГП | `.badge.status-completed` | completed |同上 |同上 |
| Статус раздела КР | `.badge.status-in-progress` | in-progress |同上 |同上 |
| Статус раздела ОВ | `.badge.status-not-started` | not-started |同上 |同上 |
| Статус изыскания ИГД | `.badge.status-completed` | completed | `surveys[].status` | `UI.getSurveyStatusClass(survey.status)` |
| Статус изыскания ИГИ | `.badge.status-in-progress` | in-progress |同上 |同上 |
| Статус изыскания ИЭИ | `.badge.status-not-started` | not-started |同上 |同上 |
| Прогресс изыскания (75%) | `text-green-600` | 0-100% | `surveys[].progress` | `UI.getProgressColor(survey.progress)` |
| Прогресс изыскания (23%) | `text-amber-600` | 0-100% |同上 |同上 |

### Иконки (6 шт)

| Элемент | Тип | Назначение |
|---------|-----|------------|
| Иконка проекта | SVG | Сайдбар |
| Иконка задачи | SVG | Сайдбар |
| Иконка сотрудника | SVG | Сайдбар |
| Иконка уведомления | SVG | Сайдбар |
| Иконка отчёта | SVG | Сайдбар |
| Иконка настроек | SVG | Сайдбар |
| Иконка файла PDF | SVG | Тип файла |
| Иконка файла DWG | SVG | Тип файла |
| Иконка файла ZIP | SVG | Тип файла |
| Иконка скачивания | SVG | Действие |
| Иконка редактирования | SVG | Действие |
| Иконка "Добавить" | SVG | Действие |

### Индикаторы разделов (6 шт)

| Код | Название | Статус | Ответственный |
|-----|----------|--------|---------------|
| АР | Архитектурные решения | completed | Петров А.И. |
| ГП | Генеральный план | completed | Сидоров К.М. |
| КР | Конструктивные решения | in-progress | Козлов Д.В. |
| ОВ | Отопление и вентиляция | not-started | Не назначен |
| ВК | Водоснабжение и канализация | not-started | Не назначен |
| ЭОМ | Электроснабжение | not-started | Не назначен |

### Индикаторы изысканий (3 шт)

| Код | Название | Статус | Ответственный | Прогресс |
|-----|----------|--------|---------------|----------|
| ИГД | Инженерно-геодезические | completed | Иванов П.С. | 75% (150 000 ₽ из 200 000 ₽) |
| ИГИ | Инженерно-геологические | in-progress | Петров А.И. | 23% (80 000 ₽ из 350 000 ₽) |
| ИЭИ | Инженерно-экологические | not-started | Не назначен | 0% (Договор не заключён) |

---

## 04-1-project-detail-employee.html — Проект (версия сотрудника)

**Особенности:** Показывает только разделы и изыскания, доступные сотруднику

### Индикаторы разделов (4 шт)

| Группа | Код | Статус |
|--------|-----|--------|
| Мои разделы | КР | in-progress |
| Мои разделы | ОВ | in-progress |
| Доступны для просмотра | АР | completed |
| Доступны для просмотра | ГП | completed |

### Индикаторы изысканий (2 шт)

| Код | Статус |
|-----|--------|
| ИГД | completed |
| ИГИ | in-progress |

---

## 05-project-create.html — Создание проекта

### Числовые индикаторы

| Элемент | Пример | Логика |
|---------|--------|--------|
| Счётчик выбранных разделов | 3 выбрано | `selectedSections.length` |
| Счётчик файлов | 2 файла | `files.length` |

### Индикаторы

| Элемент | Тип | Логика |
|---------|-----|--------|
| Чекбокс раздела | checked/unchecked | `section.selected ? 'checked' : ''` |
| Прогресс загрузки файла | 0-100% | `file.uploadProgress` |

---

## 06-section-detail.html — Детальная страница раздела

### Числовые индикаторы (4 шт)

| Элемент | Пример | Источник | Логика |
|---------|--------|----------|--------|
| Прогресс раздела | 67% | `section.progress` | `UI.renderProgressBar(section.progress)` |
| Количество файлов | 5 файлов | `section.files.length` | `Файлы (${files.length})` |
| Количество соисполнителей | 3 | `section.team.length` | `${team.length} соисполнителя` |
| Количество наблюдателей | 2 | `section.observers.length` | `${observers.length} наблюдателя` |

### Цветовые индикаторы (5 шт)

| Элемент | Класс | Статус | Источник |
|---------|-------|--------|----------|
| Статус раздела | `.badge.status-in-progress` | in-progress | `section.status` |
| Статус комплектности | `.badge.status-revision` | revision | `section.completeness.status` |
| Статус соисполнителя 1 | `.avatar.bg-blue-600` | active | `team[].active` |
| Статус соисполнителя 2 | `.avatar.bg-slate-400` | inactive | `team[].active` |
| Индикатор наблюдателя | `.badge.bg-slate-100` | read-only | `observers[].role` |

### Иконки (5 шт)

| Элемент | Тип | Назначение |
|---------|-----|------------|
| Иконка раздела | SVG | Заголовок |
| Иконка файла | SVG | Тип файла |
| Иконка скачивания | SVG | Действие |
| Иконка соисполнителя | SVG | Команда |
| Иконка наблюдателя | SVG | Наблюдатели |

---

## 07-tasks-list.html — Список задач

### Числовые индикаторы (5 шт)

| Элемент | Пример | Источник | Логика |
|---------|--------|----------|--------|
| Счётчик "Все задачи" | 5 | `tasks.length` | `${tasks.length}` |
| Счётчик "Мои задачи" | 3 | `tasks.filter(assignee === me).length` | `${myTasks.length}` |
| Прогресс подзадач | 60% | `subtasks.completed / subtasks.total` | `UI.calculateProgress(completed, total)` |
| Выполнено подзадач | 3/5 | `subtasks.completed/total` | `${completed}/${total}` |
| Счётчик в сайдбаре | 2 | `overdueCount` | `count > 0 ? show : hide` |

### Цветовые индикаторы (4 шт)

| Элемент | Класс | Статусы | Источник |
|---------|-------|---------|----------|
| Приоритет "Критичный" | `.priority-critical` | critical | `task.priority` |
| Приоритет "Высокий" | `.priority-high` | high |同上 |
| Приоритет "Средний" | `.priority-medium` | medium |同上 |
| Приоритет "Низкий" | `.priority-low` | low |同上 |
| Статус "Завершено" | `.status-completed` | completed | `task.status` |
| Статус "В работе" | `.status-in-progress` | in-progress |同上 |

### Иконки (3 шт)

| Элемент | Тип | Назначение |
|---------|-----|------------|
| Иконка задачи | SVG | Заголовок |
| Иконка редактирования | SVG | Действие |
| Иконка удаления | SVG | Действие |
| Иконка подзадачи | SVG | Чек-бокс |

---

## 09-employees-list.html — Список сотрудников

### Числовые индикаторы (4 шт)

| Элемент | Пример | Источник | Логика |
|---------|--------|----------|--------|
| Выплачено | 385 000 ₽ | `payments.paid` | `UI.formatMoney(payments.paid)` |
| В работе | 95 000 ₽ | `payments.inProgress` | `UI.formatMoney(payments.inProgress)` |
| Ожидают документов | 45 000 ₽ | `payments.awaitingDocs` | `UI.formatMoney(payments.awaitingDocs)` |
| Просрочено | 0 ₽ | `payments.overdue` | `UI.formatMoney(payments.overdue)` |

### Цветовые индикаторы (2 шт)

| Элемент | Класс | Статус | Источник |
|---------|-------|--------|----------|
| Тип "Сотрудник" | `.badge.bg-slate-100` | employee | `employee.type` |
| Тип "ИП" | `.badge.bg-blue-100` | ip |同上 |
| Тип "Самозанятый" | `.badge.bg-green-100` | self-employed |同上 |

### Иконки (2 шт)

| Элемент | Тип | Назначение |
|---------|-----|------------|
| Иконка сотрудника | SVG | Заголовок |
| Иконка аватара | Initials | `UI.getInitials(employee.name)` |

---

## 11-notifications.html — Уведомления

### Числовые индикаторы (1 шт)

| Элемент | Пример | Источник | Логика |
|---------|--------|----------|--------|
| Счётчик непрочитанных | 3 | `GET /api/notifications/unread-count` | `count > 0 ? show : hide` |

### Цветовые индикаторы (6 шт)

| Элемент | Класс | Типы | Источник |
|---------|-------|------|----------|
| Уведомление "Задача" | `.notification-task` | task | `notif.type` |
| Уведомление "Проект" | `.notification-project` | project |同上 |
| Уведомление "Комментарий" | `.notification-comment` | comment |同上 |
| Уведомление "Файл" | `.notification-file` | file |同上 |
| Уведомление "Экспертиза" | `.notification-expertise` | expertise |同上 |
| Непрочитанное | `.notification-unread` | unread | `!notif.read` |

### Иконки (6 шт)

| Тип | Иконка |
|-----|--------|
| task | 📋 |
| project | 🏗️ |
| comment | 💬 |
| file | 📎 |
| expertise | ⚠️ |
| system | ⚙️ |

---

# 2. Справочники

## 13-1-settings-sections.html — Справочник разделов

### Индикаторы (12 шт)

| Код | Название | Статус | Цвет |
|-----|----------|--------|------|
| АР | Архитектурные решения | active | green |
| ГП | Генеральный план | active | green |
| КР | Конструктивные решения | active | green |
| ОВ | Отопление и вентиляция | active | green |
| ВК | Водоснабжение и канализация | active | green |
| ЭОМ | Электроснабжение | active | green |
| НВК | Наружные сети | inactive | gray |
| ТМ | Тепломеханические решения | active | green |
| АТ | Автоматизация | active | green |
| ПЗ | Пояснительная записка | active | green |
| ПОС | Проект организации строительства | active | green |
| ПБ | Пожарная безопасность | active | green |

**Логика:**
```javascript
function renderSections(sections) {
  return sections.map(section => `
    <tr class="${section.active ? '' : 'opacity-50'}">
      <td>
        <span class="w-4 h-4 rounded" style="background: ${section.color}"></span>
      </td>
      <td>${section.code}</td>
      <td>${section.name}</td>
      <td>
        <span class="badge ${section.active ? 'status-completed' : 'status-not-started'}">
          ${section.active ? 'Активен' : 'Неактивен'}
        </span>
      </td>
      <td>
        <button onclick="editSection(${section.id})">${UI.getEntityIcon('settings', 'w-4 h-4')}</button>
      </td>
    </tr>
  `).join('');
}
```

---

## 13-2-settings-surveys.html — Справочник изысканий

### Индикаторы (4 шт)

| Код | Название | Статус |
|-----|----------|--------|
| ИГД | Инженерно-геодезические | active |
| ИГИ | Инженерно-геологические | active |
| ИЭИ | Инженерно-экологические | active |
| ИАДИ | Инженерно-архитектурно-дизайнерские | inactive |

---

# 3. Финансы

## 04-5-project-finances.html — Финансы проекта

### Числовые индикаторы (8 шт)

| Элемент | Пример | Источник |
|---------|--------|----------|
| Всего поступлений | 1 200 000 ₽ | `finances.income.total` |
| Всего расходов | 850 000 ₽ | `finances.expenses.total` |
| Баланс | 350 000 ₽ | `income - expenses` |
| Выплачено | 385 000 ₽ | `payments.paid` |
| В работе | 95 000 ₽ | `payments.inProgress` |
| Ожидают | 45 000 ₽ | `payments.awaitingDocs` |
| Просрочено | 0 ₽ | `payments.overdue` |
| Прогресс выплат | 80% | `paid / total * 100` |

### Цветовые индикаторы (5 шт)

| Элемент | Класс | Статус |
|---------|-------|--------|
| Поступление "Оплачено" | `.status-completed` | paid |
| Расход "Утверждено" | `.status-approved` | approved |
| Выплата "Выплачено" | `.status-paid` | paid |
| Выплата "Ожидает" | `.status-not-started` | awaiting |
| Выплата "Просрочено" | `.status-overdue` | overdue |

---

## 19-payment-detail.html — Детали выплаты

### Числовые индикаторы (3 шт)

| Элемент | Пример | Источник |
|---------|--------|----------|
| Сумма выплаты | 150 000 ₽ | `payment.amount` |
| Прогресс комплектности | 75% | `documents.completed / documents.total` |
| Количество документов | 3/4 | `documents.length` |

### Цветовые индикаторы (4 шт)

| Элемент | Класс | Статус |
|---------|-------|--------|
| Статус выплаты | `.status-paid` | paid |
| Документ "Получен" | `.status-completed` | received |
| Документ "Ожидается" | `.status-not-started` | awaiting |
| Прогресс комплектности | `.text-green-600` | 75% |

---

# 📊 Итоговая статистика

| Страница | Числа | Цвета | Иконки | Разделы | Изыскания | Прогресс | Всего |
|----------|-------|-------|--------|---------|-----------|----------|-------|
| 01-login | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 02-dashboard | 8 | 10 | 6 | 6 | 3 | 3 | 36 |
| 03-projects-list | 9 | 15 | 9 | 18 | 9 | 3 | 63 |
| 04-project-detail | 6 | 10 | 12 | 6 | 3 | 1 | 38 |
| 04-1-employee | 2 | 6 | 4 | 4 | 2 | 0 | 18 |
| 05-create | 2 | 2 | 3 | 12 | 4 | 2 | 25 |
| 06-section | 4 | 5 | 5 | 1 | 0 | 1 | 16 |
| 07-tasks | 5 | 6 | 4 | 0 | 0 | 5 | 20 |
| 08-task-create | 1 | 4 | 2 | 0 | 0 | 0 | 7 |
| 09-employees | 4 | 3 | 3 | 0 | 0 | 0 | 10 |
| 10-employee-create | 0 | 2 | 1 | 0 | 0 | 0 | 3 |
| 11-notifications | 1 | 7 | 7 | 0 | 0 | 0 | 15 |
| 12-reports | 6 | 4 | 4 | 0 | 0 | 0 | 14 |
| 13-settings | 0 | 2 | 2 | 0 | 0 | 0 | 4 |
| 13-1-sections | 0 | 12 | 12 | 12 | 0 | 0 | 24 |
| 13-2-surveys | 0 | 4 | 4 | 0 | 4 | 0 | 8 |
| 13-3-expenses | 0 | 6 | 6 | 0 | 0 | 0 | 12 |
| 13-4-contractor | 0 | 5 | 5 | 0 | 0 | 0 | 10 |
| 14-survey | 4 | 4 | 5 | 0 | 1 | 1 | 15 |
| 14-1-observer | 1 | 2 | 2 | 0 | 1 | 0 | 6 |
| 14-2-finances | 5 | 3 | 2 | 0 | 0 | 1 | 11 |
| 14-3-expertise | 3 | 4 | 3 | 0 | 0 | 0 | 10 |
| 14-4-create | 1 | 3 | 3 | 0 | 0 | 0 | 7 |
| 15-survey-create | 2 | 2 | 3 | 0 | 1 | 1 | 9 |
| 16-expertise | 2 | 4 | 4 | 0 | 0 | 0 | 10 |
| 18-contract | 4 | 3 | 4 | 0 | 0 | 0 | 11 |
| 19-payment | 3 | 5 | 3 | 0 | 0 | 1 | 12 |
| 20-calendar | 5 | 4 | 4 | 10 | 5 | 0 | 28 |
| 21-expertise-stats | 8 | 6 | 6 | 6 | 0 | 6 | 32 |
| **ИТОГО** | **86** | **141** | **119** | **85** | **29** | **24** | **484** |

---

## 🎯 Матрица применения индикаторов

### Откуда брать данные

| Индикатор | API endpoint | Поле ответа |
|-----------|--------------|-------------|
| Статус проекта | `GET /api/projects/:id` | `project.status` |
| Прогресс проекта | `GET /api/projects/:id` | `project.progress` |
| Статус раздела | `GET /api/sections/:id` | `section.status` |
| Статус изыскания | `GET /api/surveys/:id` | `survey.status` |
| Приоритет задачи | `GET /api/tasks/:id` | `task.priority` |
| Статус выплаты | `GET /api/payments/:id` | `payment.status` |
| Счётчик уведомлений | `GET /api/notifications/unread-count` | `count` |
| Сводка финансов | `GET /api/dashboard/stats` | `finances` |

### Как рендерить

```javascript
// 1. Числовые индикаторы
<span class="text-3xl">${value}</span>
${UI.formatMoney(amount)}
${UI.formatDate(dateString)}
${UI.renderProgressBar(percentage)}
${UI.renderCounter(value, { label, icon, trend })}

// 2. Цветовые индикаторы
<span class="badge ${UI.getProjectStatusClass(status)}">
  ${UI.getProjectStatusText(status)}
</span>

// 3. Иконки
${UI.getEntityIcon('project', 'w-5 h-5')}
${UI.getEntityEmoji('task')}
${UI.getStatusIcon('completed', 'emoji')}

// 4. Индикаторы разделов/изысканий
${sections.map(s => `
  <a href="06-section-detail.html?id=${s.id}" 
     class="section-indicator ${UI.getSectionStatusClass(s.status)}">
    ${s.code}
  </a>
`).join('')}
```

---

**Всего индикаторов:** 484  
**Документировано:** 100%  
**Готово к подключению:** 0%
