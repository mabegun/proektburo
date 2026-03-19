# 🔌 Интеграция API с фронтендом

## Поиск мест для подключения API

### Шаг 1: Идентификация хардкода

Откройте HTML файл и найдите хардкод-данные:

**Пример (03-projects-list.html):**

```html
<!-- ❌ ХАРДКОД - нужно заменить на API -->
<div class="project-card">
  <h3>ЖК "Северное сияние"</h3>
  <p>г. Москва, ул. Ленина, д. 45</p>
  <span class="badge status-in-progress">В работе</span>
</div>
```

**Ищите:**
- Названия проектов
- Адреса
- Статусы
- Числа (прогресс, количество)
- Даты
- Имена пользователей

---

### Шаг 2: Создание контейнера

Добавьте ID к родительскому элементу:

```html
<!-- ✅ ПРАВИЛЬНО - контейнер для API -->
<div id="projects-container" class="space-y-4">
  <!-- Проекты будут загружены из API -->
</div>
```

**Правила:**
1. Используйте `id="element-name-container"`
2. Удаляйте хардкод-элементы из контейнера
3. Оставляйте комментарии для понимания

---

### Шаг 3: Создание JS скрипта

Создайте файл `static/js/pages/page-name.js`:

```javascript
/**
 * Скрипт для страницы (page-name.html)
 */

document.addEventListener('DOMContentLoaded', async () => {
  await checkAuth();
  await loadData();
});

async function checkAuth() {
  const token = getAuthToken();
  if (!token) {
    window.location.href = '01-login.html';
    return;
  }
}

async function loadData() {
  try {
    // Показать загрузку
    UI.showLoading('#projects-container');
    
    // Загрузить данные
    const data = await fetch(`${API_CONFIG.BASE_URL}/projects`, {
      headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    }).then(r => r.json());
    
    // Рендер
    renderProjects(data.items);
    
  } catch (error) {
    console.error('Ошибка:', error);
    UI.showError('#projects-container', 'Не удалось загрузить данные');
  }
}

function renderProjects(projects) {
  const container = document.getElementById('projects-container');
  if (!container) return;
  
  if (!projects.length) {
    UI.showEmpty('#projects-container', 'Нет проектов');
    return;
  }
  
  const html = projects.map(project => `
    <div class="project-card">
      <h3>${project.name}</h3>
      <p>${project.address}</p>
      <span class="badge ${getProjectStatusClass(project.status)}">
        ${getProjectStatusText(project.status)}
      </span>
    </div>
  `).join('');
  
  container.innerHTML = html;
}
```

---

### Шаг 4: Подключение скрипта

В конце HTML файла (перед `</body>`) добавьте:

```html
  <!-- === ПОДКЛЮЧЕНИЕ API === -->
  <script src="static/js/api-config.js"></script>
  <script src="static/js/api-client.js"></script>
  <script src="static/js/api.js"></script>
  <script src="static/js/ui-helpers.js"></script>
  <script src="static/js/pages/projects-list.js"></script>
</body>
</html>
```

**Порядок важен:**
1. `api-config.js` - настройки
2. `api-client.js` - HTTP клиент
3. `api.js` - методы API
4. `ui-helpers.js` - UI функции
5. `pages/*.js` - скрипт страницы

---

## Поиск элементов для обновления

### Сценарий 1: Полная замена контента

**Было (хардкод):**
```html
<div class="space-y-4" id="projects-container">
  <div class="project-card">
    <h3>ЖК "Северное сияние"</h3>
    ...
  </div>
  <div class="project-card">
    <h3>Реконструкция адм. здания</h3>
    ...
  </div>
</div>
```

**Стало (API):**
```html
<div class="space-y-4" id="projects-container">
  <!-- Проекты будут загружены из API -->
</div>
```

**JS:**
```javascript
function renderProjects(projects) {
  const container = document.getElementById('projects-container');
  container.innerHTML = projects.map(...).join('');
}
```

---

### Сценарий 2: Обновление текста

**Было:**
```html
<h1 id="project-name">ЖК "Северное сияние"</h1>
<p id="project-address">г. Москва, ул. Ленина, д. 45</p>
```

**Стало:**
```html
<h1 id="project-name">Загрузка...</h1>
<p id="project-address">—</p>
```

**JS:**
```javascript
function updateProjectInfo(project) {
  document.getElementById('project-name').textContent = project.name;
  document.getElementById('project-address').textContent = project.address;
}
```

---

### Сценарий 3: Обновление списка

**Было:**
```html
<ul id="sections-list">
  <li>АР - Архитектурные решения</li>
  <li>ГП - Генеральный план</li>
  <li>КР - Конструктивные решения</li>
</ul>
```

**Стало:**
```html
<ul id="sections-list">
  <!-- Разделы будут загружены из API -->
</ul>
```

**JS:**
```javascript
function renderSections(sections) {
  const container = document.getElementById('sections-list');
  container.innerHTML = sections.map(s => `
    <li>${s.code} - ${s.name}</li>
  `).join('');
}
```

---

## Чек-лист интеграции

Для каждой страницы:

- [ ] **Найти хардкод** (названия, числа, статусы)
- [ ] **Добавить ID** к контейнерам
- [ ] **Удалить хардкод** из контейнеров
- [ ] **Создать JS файл** (static/js/pages/*.js)
- [ ] **Написать функцию** загрузки (loadData)
- [ ] **Написать функцию** рендера (render*)
- [ ] **Подключить скрипт** в HTML
- [ ] **Протестировать** в браузере
- [ ] **Проверить** загрузку данных
- [ ] **Проверить** обработку ошибок

---

## Примеры для разных страниц

### Dashboard (02-dashboard.html)

**Контейнеры:**
```html
<div id="dashboard-stats">...</div>
<div id="attention-block">...</div>
<div id="active-projects-list">...</div>
```

**JS:**
```javascript
async function loadDashboard() {
  const [stats, projects] = await Promise.all([
    fetch('/api/dashboard/stats'),
    fetch('/api/projects')
  ]);
  
  renderStats(stats);
  renderProjects(projects.items);
}
```

---

### Project Detail (04-project-detail.html)

**Контейнеры:**
```html
<h1 id="project-name">Загрузка...</h1>
<span id="project-code">—</span>
<p id="project-address">—</p>
<div id="sections-list">...</div>
<div id="surveys-list">...</div>
<div id="team-members">...</div>
```

**JS:**
```javascript
async function loadProject() {
  const projectId = getUrlParam('id');
  const project = await fetch(`/api/projects/${projectId}`);
  
  updateProjectInfo(project);
  renderSections(project.sections);
  renderSurveys(project.surveys);
  renderTeam(project.members);
}
```

---

### Section Detail (06-section-detail.html)

**Контейнеры:**
```html
<h1 id="section-name">Загрузка...</h1>
<span id="section-status">—</span>
<p id="section-responsible">—</p>
<div id="files-list">...</div>
<div id="chat-messages">...</div>
<div id="coexecutors-list">...</div>
<div id="observers-list">...</div>
```

**JS:**
```javascript
async function loadSection() {
  const sectionId = getUrlParam('id');
  const section = await fetch(`/api/sections/${sectionId}`);
  
  updateSectionInfo(section);
  renderFiles(section.files);
  renderChat(section.messages);
  renderCoexecutors(section.coexecutors);
  renderObservers(section.observers);
}
```

---

## Ссылки между страницами

### Генерация ссылок с ID

**Пример (projects-list.js):**
```javascript
function renderProjects(projects) {
  return projects.map(project => `
    <a href="04-project-detail.html?id=${project.id}">
      ${project.name}
    </a>
    ${project.sections.map(s => `
      <a href="06-section-detail.html?id=${s.id}">
        ${s.code}
      </a>
    `).join('')}
  `).join('');
}
```

**Важно:**
- Используйте `project.id`, `section.id` из API
- Не используйте хардкод ID
- Проверяйте что ID существует

---

## Обработка состояний

### Загрузка

```javascript
function showLoading(selector) {
  const el = document.querySelector(selector);
  el.innerHTML = `
    <div class="flex items-center justify-center p-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700"></div>
    </div>
  `;
}
```

### Ошибка

```javascript
function showError(selector, message) {
  const el = document.querySelector(selector);
  el.innerHTML = `
    <div class="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>${message}</span>
      </div>
    </div>
  `;
}
```

### Пусто

```javascript
function showEmpty(selector, message, icon = '📭') {
  const el = document.querySelector(selector);
  el.innerHTML = `
    <div class="text-center p-8 text-slate-400">
      <div class="text-4xl mb-2">${icon}</div>
      <div>${message}</div>
    </div>
  `;
}
```

---

## Отладка

### Console.log

```javascript
async function loadData() {
  try {
    console.log('Загрузка данных...');
    
    const data = await fetch('/api/projects');
    console.log('Получены данные:', data);
    
    renderProjects(data.items);
    console.log('Данные отрендерены');
    
  } catch (error) {
    console.error('Ошибка загрузки:', error);
  }
}
```

### Проверка токена

```javascript
function checkAuth() {
  const token = getAuthToken();
  console.log('Токен:', token ? 'найден' : 'не найден');
  
  if (!token) {
    console.log('Редирект на login');
    window.location.href = '01-login.html';
  }
}
```

---

**Версия:** 1.0  
**Дата:** 2026-03-18
