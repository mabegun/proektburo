# 📚 Инструкция по подключению API к прототипу

## 🎯 Проблема
Сейчас у вас есть:
- ✅ Готовый API (бэкенд)
- ✅ HTML-прототип (фронтенд)
- ❌ Нет связи между ними (все данные захардкожены)

## 🔧 Решение

### Шаг 1: Добавьте скрипты на страницы

В **каждую** HTML-страницу добавьте перед закрывающим тегом `</body>`:

```html
<!-- Подключение API-слоя -->
<script src="js/api-config.js"></script>
<script src="js/api-client.js"></script>
<script src="js/api.js"></script>
<script src="js/ui-helpers.js"></script>

<!-- Скрипт конкретной страницы -->
<script src="js/pages/dashboard.js"></script>
```

**Пример для 02-dashboard.html:**
```html
<!-- ... весь контент страницы ... -->

<!-- В конце, перед </body> -->
<script src="js/api-config.js"></script>
<script src="js/api-client.js"></script>
<script src="js/api.js"></script>
<script src="js/ui-helpers.js"></script>
<script src="js/pages/dashboard.js"></script>
</body>
</html>
```

---

### Шаг 2: Добавьте ID к элементам интерфейса

Чтобы JavaScript мог обновлять данные, добавьте `id` к ключевым элементам.

**Пример для дашборда:**

```html
<!-- Было (хардкод) -->
<div class="grid grid-cols-4 gap-6 mb-8">
  <div class="stat-card">
    <p class="text-sm text-slate-500 mb-2">Всего проектов</p>
    <p class="text-3xl font-bold text-slate-800">35</p>
  </div>
</div>

<!-- Стало (с id для JS) -->
<div class="grid grid-cols-4 gap-6 mb-8" id="dashboard-stats">
  <!-- Содержимое будет загружено из API -->
</div>
```

**Пример для списка проектов:**

```html
<!-- Было -->
<div class="space-y-4" id="projects-list">
  <div class="project-card">
    <h3>ЖК "Северное сияние"</h3>
    <!-- хардкод данные -->
  </div>
</div>

<!-- Стало -->
<div class="space-y-4" id="projects-list">
  <!-- JS загрузит проекты из API -->
</div>
```

---

### Шаг 3: Настройте BASE_URL

В файле `js/api-config.js` измените `BASE_URL` на адрес вашего API:

```javascript
const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api', // или https://api.yoursite.com/api
  // ...
};
```

---

### Шаг 4: Адаптируйте API-методы под ваш бэкенд

В файле `js/api.js` проверьте и при необходимости измените эндпоинты:

```javascript
// Если ваш API использует другие пути:
projects: {
  getList: (params) => 
    api.get('/projects/list'), // было '/projects'
  
  getById: (id) => 
    api.get(`/projects/get/${id}`), // было '/projects/{id}'
}
```

---

## 📋 Таблица подключения страниц

| Страница | Файл | Что подключить |
|----------|------|---------------|
| Вход | 01-login.html | `js/pages/login.js` |
| Дашборд | 02-dashboard.html | `js/pages/dashboard.js` |
| Проекты | 03-projects-list.html | `js/pages/projects-list.js` |
| Проект | 04-project-detail.html | `js/pages/project-detail.js` |
| Задачи | 07-tasks-list.html | `js/pages/tasks-list.js` |
| Сотрудники | 09-employees-list.html | `js/pages/employees-list.js` |
| Уведомления | 11-notifications.html | `js/pages/notifications.js` |

---

## 🛠 Пример: Подключение страницы проектов

### 1. Создайте файл `js/pages/projects-list.js`:

```javascript
document.addEventListener('DOMContentLoaded', async () => {
  await checkAuth();
  await loadProjects();
});

async function checkAuth() {
  if (!getAuthToken()) {
    window.location.href = '01-login.html';
  }
}

async function loadProjects() {
  try {
    UI.showLoading('#projects-container');
    
    const params = {
      search: getUrlParam('search') || '',
      status: getUrlParam('status') || '',
      type: getUrlParam('type') || '',
    };
    
    const data = await API.projects.getList(params);
    renderProjects(data.items);
    
  } catch (error) {
    UI.showError('#projects-container', 'Не удалось загрузить проекты');
  }
}

function renderProjects(projects) {
  const container = document.getElementById('projects-container');
  if (!container) return;
  
  if (!projects.length) {
    UI.showEmpty('#projects-container', 'Нет проектов');
    return;
  }
  
  container.innerHTML = projects.map(project => `
    <a href="04-project-detail.html?id=${project.id}" class="project-card">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-sm font-mono text-slate-400">${project.code}</span>
            <h3 class="font-semibold text-slate-800">${project.name}</h3>
            <span class="badge ${UI.getProjectStatusClass(project.status)}">
              ${UI.getProjectStatusText(project.status)}
            </span>
          </div>
          <p class="text-slate-500">${project.address}</p>
        </div>
        <div class="w-32">
          <div class="progress-bar">
            <div class="progress-bar-fill" style="width: ${project.progress}%"></div>
          </div>
        </div>
      </div>
    </a>
  `).join('');
}
```

### 2. В 03-projects-list.html добавьте ID:

```html
<!-- Список проектов -->
<div class="space-y-4" id="projects-container">
  <!-- JS загрузит проекты сюда -->
</div>
```

### 3. Подключите скрипт:

```html
<!-- В конце 03-projects-list.html -->
<script src="js/api-config.js"></script>
<script src="js/api-client.js"></script>
<script src="js/api.js"></script>
<script src="js/ui-helpers.js"></script>
<script src="js/pages/projects-list.js"></script>
</body>
</html>
```

---

## 🔐 Работа с токеном

Токен автоматически:
- Сохраняется в localStorage при входе
- Добавляется ко всем запросам в заголовок `Authorization: Bearer <token>`
- Проверяется при загрузке страниц
- При ошибке 401 — редирект на страницу входа

---

## 🎨 UI-хелперы

### Базовые функции

```javascript
UI.showLoading('#container');          // Показать загрузку
UI.showError('#container', 'Текст');   // Показать ошибку
UI.showEmpty('#container', 'Текст');   // Показать "пусто"
UI.formatDate('2025-03-16');           // "16.03.2025"
UI.formatMoney(150000);                // "150 000 ₽"
UI.toast('Успешно!', 'success');       // Toast-уведомление
UI.getInitials('Иванов И.И.');         // "ИИ"
UI.declension(5, ['день', 'дня', 'дней']); // "дней"
```

### Индикаторы статусов

```javascript
// Статусы проектов
UI.getProjectStatusClass('in-progress');  // "status-in-progress"
UI.getProjectStatusText('in-progress');   // "В работе"

// Статусы разделов
UI.getSectionStatusClass('done');         // "section-done"
UI.getSectionStatusText('done');          // "Завершён"

// Статусы изысканий
UI.getSurveyStatusClass('in-progress');   // "survey-in-progress"
UI.getSurveyStatusText('in-progress');    // "В работе"

// Цвета статусов
UI.getStatusColor('completed', 'bg');     // "#dcfce7"
UI.getStatusColor('completed', 'text');   // "#16a34a"
UI.getStatusColor('overdue', 'all');      // { bg, text, border }

// Иконки статусов
UI.getStatusIcon('completed', 'emoji');   // "✅"
UI.getStatusIcon('completed', 'svg');     // SVG path
UI.getStatusIcon('completed', 'html');    // <svg>...</svg>
```

### Числовые индикаторы

```javascript
// Прогресс
UI.calculateProgress(25, 100);            // 25
UI.getProgressClass(75);                  // "progress-good"
UI.getProgressColor(75);                  // "#059669"

// Рендер прогресс-бара
UI.renderProgressBar(75, {
  showLabel: true,
  size: 'md', // sm, md, lg
  color: 'auto' // или hex/css
});

// Рендер счётчика
UI.renderCounter(35, {
  label: 'Всего проектов',
  icon: '🏗️',
  trend: 'up', // up, down, neutral
  size: 'md' // sm, md, lg
});
```

### Цветовые индикаторы

```javascript
// Цвет по типу (для графиков)
UI.getColorByType('project');             // "#1e293b"
UI.getColorByType('section');             // "#3b82f6"
UI.getColorByType(0, 'default');          // Первый цвет палитры
UI.getColorByType('task', 'pastel');      // Пастельная палитра

// Приоритеты
UI.getPriorityClass('high');              // "priority-high"
UI.getPriorityText('high');               // "Высокий"

// Типы уведомлений
UI.getNotificationTypeClass('task');      // "notification-task"
```

### Иконки сущностей

```javascript
// SVG иконки
UI.getEntityIcon('project', 'w-5 h-5');   // SVG project
UI.getEntityIcon('task', 'w-6 h-6');      // SVG task
UI.getEntityIcon('employee');             // SVG employee
UI.getEntityIcon('money');                // SVG money
UI.getEntityIcon('notification');         // SVG notification

// Emoji иконки
UI.getEntityEmoji('project');             // "🏗️"
UI.getEntityEmoji('task');                // "📋"
UI.getEntityEmoji('employee');            // "👤"
UI.getEntityEmoji('money');               // "💰"
```

### Примеры использования

```javascript
// Рендер карточки статистики
function renderStats(stats) {
  return `
    <div class="stat-card">
      ${UI.renderCounter(stats.projects.total, {
        label: 'Всего проектов',
        icon: UI.getEntityEmoji('project'),
        trend: 'up'
      })}
    </div>
  `;
}

// Рендер индикатора раздела
function renderSectionIndicator(section) {
  const statusClass = UI.getSectionStatusClass(section.status);
  const statusText = UI.getSectionStatusText(section.status);
  const icon = UI.getStatusIcon(section.status, 'emoji');
  
  return `
    <a href="06-section-detail.html?id=${section.id}" 
       class="section-indicator ${statusClass}">
      ${icon} ${section.code}
      <div class="section-tooltip">
        <div class="section-tooltip-title">${section.name}</div>
        <div>Статус: ${statusText}</div>
      </div>
    </a>
  `;
}

// Рендер прогресс-бара проекта
function renderProjectProgress(project) {
  return UI.renderProgressBar(project.progress, {
    size: 'sm',
    color: UI.getProgressColor(project.progress)
  });
}
```

---

## 📡 Если API ещё не готов

Используйте mock-данные для разработки:

```javascript
// js/pages/projects-list.js
async function loadProjects() {
  // Временные mock-данные
  const mockProjects = [
    { id: 1, code: '2025-001', name: 'ЖК "Северное сияние"', ... },
  ];
  
  renderProjects(mockProjects);
  
  // Когда API будет готов — раскомментировать:
  // const data = await API.projects.getList();
  // renderProjects(data.items);
}
```

---

## ✅ Чек-лист готовности страницы

- [ ] Добавлены скрипты api-*.js
- [ ] Добавлен скрипт страницы (pages/*.js)
- [ ] Элементам добавлены ID для JS
- [ ] Удалены хардкод-данные из HTML
- [ ] Настроен BASE_URL
- [ ] Работает загрузка данных
- [ ] Работают состояния: loading, error, empty
- [ ] Работает навигация (ссылки с ID)
- [ ] Работает авторизация (редирект если нет токена)

---

## 🚀 Быстрый старт

1. Исправьте `BASE_URL` в `js/api-config.js`
2. Добавьте скрипты в `01-login.html` и `02-dashboard.html`
3. Проверьте вход в систему
4. Последовательно подключайте остальные страницы

**Вопросы?** Смотрите примеры в `js/pages/dashboard.js` и `js/pages/login.js`
