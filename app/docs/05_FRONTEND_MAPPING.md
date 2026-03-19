# 🔗 Frontend-Backend Mapping

## Соответствие страниц и API

### Страницы фронтенда

| № | Файл | Назначение | API Endpoints |
|---|------|------------|---------------|
| 01 | `01-login.html` | Вход в систему | POST /api/auth/login |
| 02 | `02-dashboard.html` | Дашборд | GET /api/dashboard/stats, GET /api/projects |
| 03 | `03-projects-list.html` | Список проектов | GET /api/projects |
| 04 | `04-project-detail.html` | Детали проекта | GET /api/projects/{id} |
| 05 | `05-project-create.html` | Создание проекта | POST /api/projects |
| 06 | `06-section-detail.html` | Детали раздела | GET /api/sections/{id} |
| 07 | `07-tasks-list.html` | Список задач | GET /api/tasks |
| 08 | `08-task-create.html` | Создание задачи | POST /api/tasks |
| 09 | `09-employees-list.html` | Список сотрудников | GET /api/employees |
| 10 | `10-employee-create.html` | Создание сотрудника | POST /api/employees |
| 11 | `11-notifications.html` | Уведомления | GET /api/notifications |
| 13 | `13-settings.html` | Настройки | - |
| 13-1 | `13-1-settings-sections.html` | Справочник разделов | GET /api/dictionaries/sections |
| 13-2 | `13-2-settings-surveys.html` | Справочник изысканий | GET /api/dictionaries/surveys |
| 14 | `14-survey-detail.html` | Детали изыскания | GET /api/surveys/{id} |

---

## Детальное описание страниц

### 01-login.html

**Назначение:** Вход в систему

**Элементы:**
- Input: email
- Button: Войти

**API:**
```javascript
POST /api/auth/login
Request: { email: "director@bureau.ru" }
Response: { token: "...", user: {...} }
```

**Логика:**
1. Пользователь вводит email
2. Отправка POST запроса
3. Сохранение токена в localStorage
4. Редирект на /02-dashboard.html

---

### 02-dashboard.html

**Назначение:** Главная страница со статистикой

**Элементы:**
- Карточки статистики (проекты, задачи, разделы)
- Блок "Требуют внимания"
- Список активных проектов
- Мои задачи

**API:**
```javascript
GET /api/dashboard/stats
GET /api/projects?status=active&limit=5
GET /api/tasks?assigned_to={email}
```

**Данные для отображения:**
```json
{
  "projects": { "total": 3, "active": 2 },
  "sections": { "total": 5, "in_progress": 3 },
  "tasks": { "total": 10, "open": 3 }
}
```

---

### 03-projects-list.html

**Назначение:** Список всех проектов

**Элементы:**
- Фильтры (поиск, статус, тип)
- Карточки проектов с индикаторами

**API:**
```javascript
GET /api/projects?search={query}&status={status}
```

**Рендер карточки:**
```javascript
// Для каждого проекта:
{
  id, name, address, status,
  sections: [{id, code, status}],
  surveys: [{id, type, status}]
}
```

**Ссылки:**
- Название → /04-project-detail.html?id={project.id}
- Индикатор раздела → /06-section-detail.html?id={section.id}
- Индикатор изыскания → /14-survey-detail.html?id={survey.id}

---

### 04-project-detail.html

**Назначение:** Детальная информация о проекте

**Элементы:**
- Информация о проекте
- Вкладки (Обзор, Обсуждение, Замечания, История, Финансы)
- Блок "Разделы"
- Блок "Изыскания"
- Команда проекта

**API:**
```javascript
GET /api/projects/{id}
// Response включает sections, surveys, members
```

**Рендер разделов:**
```html
<div id="sections-list">
  <!-- Для каждого раздела -->
  <a href="06-section-detail.html?id={section.id}">
    {section.code} - {section.name}
  </a>
</div>
```

---

### 05-project-create.html

**Назначение:** Создание нового проекта

**Элементы:**
- Form: name, address, gip_email
- Checkbox: выбор разделов из справочника
- Button: Создать

**API:**
```javascript
// 1. Получить справочник разделов
GET /api/dictionaries/sections

// 2. Создать проект
POST /api/projects
Request: {
  name: "...",
  address: "...",
  gip_email: "..."
}

// 3. Создать разделы
POST /api/projects/{id}/sections
```

---

### 06-section-detail.html

**Назначение:** Детали раздела

**Элементы:**
- Информация о разделе
- Файлы раздела
- Чат
- Соисполнители
- Наблюдатели
- Комплектность

**API:**
```javascript
GET /api/sections/{id}
// Response: section + files + messages + tasks + observers
```

**Загрузка файлов:**
```javascript
POST /api/upload
FormData: {
  file: File,
  project_id: "...",
  section_id: "..."
}
```

**Чат:**
```javascript
GET /api/sections/{id}/chat
POST /api/chat
```

---

### 07-tasks-list.html

**Назначение:** Список задач

**Элементы:**
- Фильтры (статус, приоритет)
- Список задач

**API:**
```javascript
GET /api/tasks?status={status}&assigned_to={email}
```

---

### 08-task-create.html

**Назначение:** Создание задачи

**Элементы:**
- Form: title, description, assigned_to, deadline, priority
- Select: проект, раздел

**API:**
```javascript
GET /api/projects  // Для select
POST /api/tasks
Request: {
  project_id: "...",
  section_id: "...",
  title: "...",
  assigned_to: "...",
  deadline: "2026-03-25"
}
```

---

### 09-employees-list.html

**Назначение:** Список сотрудников

**Элементы:**
- Поиск
- Фильтр по роли
- Карточки сотрудников

**API:**
```javascript
GET /api/employees?search={query}&role={role}
```

---

### 14-survey-detail.html

**Назначение:** Детали изыскания

**Элементы:**
- Информация об изыскании
- Исполнитель (юрлицо)
- Договор
- Файлы
- Чат
- Наблюдатели

**API:**
```javascript
GET /api/surveys/{id}
POST /api/upload  // Для файлов
POST /api/chat    // Для сообщений
```

---

## JavaScript функции

### Авторизация

```javascript
// Проверка токена
function getAuthToken() {
  return localStorage.getItem('authToken');
}

// Проверка авторизации
async function checkAuth() {
  const token = getAuthToken();
  if (!token) {
    window.location.href = '01-login.html';
    return;
  }
  
  try {
    const user = await fetch('/api/user/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json());
    updateUserProfile(user);
  } catch (error) {
    removeAuthToken();
    window.location.href = '01-login.html';
  }
}
```

### Загрузка проектов

```javascript
async function loadProjects() {
  try {
    const data = await fetch('/api/projects', {
      headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    }).then(r => r.json());
    
    renderProjects(data.items);
  } catch (error) {
    console.error('Ошибка:', error);
  }
}
```

### Рендер проекта

```javascript
function renderProjects(projects) {
  const container = document.getElementById('projects-container');
  
  const html = projects.map(project => `
    <div class="project-card">
      <h3>${project.name}</h3>
      <p>${project.address}</p>
      <div class="indicators">
        ${project.sections.map(s => `
          <a href="06-section-detail.html?id=${s.id}">
            ${s.code}
          </a>
        `).join('')}
      </div>
    </div>
  `).join('');
  
  container.innerHTML = html;
}
```

---

## Обработка ошибок

```javascript
try {
  const response = await fetch('/api/projects');
  
  if (!response.ok) {
    if (response.status === 401) {
      // Токен истёк
      localStorage.removeItem('authToken');
      window.location.href = '01-login.html';
      return;
    }
    
    if (response.status === 403) {
      // Нет прав
      showError('Нет прав доступа');
      return;
    }
    
    if (response.status === 404) {
      // Не найдено
      showError('Не найдено');
      return;
    }
  }
  
  const data = await response.json();
  renderData(data);
  
} catch (error) {
  console.error('Ошибка:', error);
  showError('Произошла ошибка');
}
```

---

## Состояния UI

### Loading

```javascript
function showLoading(selector) {
  const el = document.querySelector(selector);
  el.innerHTML = `
    <div class="flex items-center justify-center p-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700"></div>
    </div>
  `;
}
```

### Error

```javascript
function showError(selector, message) {
  const el = document.querySelector(selector);
  el.innerHTML = `
    <div class="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
      ${message}
    </div>
  `;
}
```

### Empty

```javascript
function showEmpty(selector, message) {
  const el = document.querySelector(selector);
  el.innerHTML = `
    <div class="text-center p-8 text-slate-400">
      ${message}
    </div>
  `;
}
```

---

**Версия:** 1.0  
**Дата:** 2026-03-18
