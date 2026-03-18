/**
 * Скрипт для страницы создания задачи (08-task-create.html)
 */

document.addEventListener('DOMContentLoaded', async () => {
  await checkAuth();
  await loadDictionaries();
  initForm();
});

/**
 * Проверка авторизации
 */
async function checkAuth() {
  if (!getAuthToken()) {
    window.location.href = '01-login.html';
  }
  
  try {
    const user = await API.auth.getCurrentUser();
    updateUserProfile(user);
  } catch (error) {
    removeAuthToken();
    window.location.href = '01-login.html';
  }
}

/**
 * Обновление профиля в сайдбаре
 */
function updateUserProfile(user) {
  const profileEl = document.querySelector('.sidebar-profile');
  if (!profileEl) return;
  
  const initials = UI.getInitials(user.name);
  const role = getUserRoleText(user.role);
  
  profileEl.innerHTML = `
    <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
      <div class="avatar bg-gradient-to-br from-slate-700 to-slate-500 text-white">${initials}</div>
      <div class="flex-1 min-w-0">
        <p class="font-semibold text-slate-800 truncate">${user.name}</p>
        <p class="text-xs text-slate-500">${role}</p>
      </div>
    </div>
  `;
}

function getUserRoleText(role) {
  const map = {
    'director': 'Директор',
    'gip': 'ГИП',
    'employee': 'Сотрудник',
  };
  return map[role] || role;
}

/**
 * Загрузка справочников
 */
async function loadDictionaries() {
  try {
    const [projects, sections, employees, priorities] = await Promise.all([
      API.projects.getList({ limit: 100 }),
      API.dictionaries.getSections(),
      API.employees.getList(),
      API.dictionaries.getTaskPriorities(),
    ]);
    
    renderProjectSelect(projects);
    renderSectionSelect(sections);
    renderEmployeeSelect(employees);
    renderPrioritySelect(priorities);
    
  } catch (error) {
    console.error('Ошибка загрузки справочников:', error);
  }
}

/**
 * Рендер селекта проектов
 */
function renderProjectSelect(projects) {
  const select = document.getElementById('project-select');
  if (!select) return;
  
  select.innerHTML = `
    <option value="">Выберите проект</option>
    ${projects.map(project => `
      <option value="${project.id}">${project.code} — ${project.name}</option>
    `).join('')}
  `;
  
  // При выборе проекта загружаем разделы
  select.addEventListener('change', async (e) => {
    const projectId = e.target.value;
    if (projectId) {
      const project = await API.projects.getById(projectId);
      renderSectionSelectForProject(project.sections || []);
    }
  });
}

/**
 * Рендер селекта разделов
 */
function renderSectionSelect(sections) {
  const select = document.getElementById('section-select');
  if (!select) return;
  
  select.innerHTML = `
    <option value="">Выберите раздел (необязательно)</option>
    ${sections.map(section => `
      <option value="${section.id}">${section.code} — ${section.name}</option>
    `).join('')}
  `;
}

/**
 * Рендер селекта разделов для проекта
 */
function renderSectionSelectForProject(sections) {
  const select = document.getElementById('section-select');
  if (!select) return;
  
  select.innerHTML = `
    <option value="">Выберите раздел (необязательно)</option>
    ${sections.map(section => `
      <option value="${section.id}">${section.code} — ${section.name}</option>
    `).join('')}
  `;
}

/**
 * Рендер селекта исполнителей
 */
function renderEmployeeSelect(employees) {
  const select = document.getElementById('assignee-select');
  if (!select) return;
  
  select.innerHTML = `
    <option value="">Выберите исполнителя</option>
    ${employees.map(emp => `
      <option value="${emp.id}">${emp.name} — ${emp.position}</option>
    `).join('')}
  `;
}

/**
 * Рендер селекта приоритетов
 */
function renderPrioritySelect(priorities) {
  const select = document.getElementById('priority-select');
  if (!select) return;
  
  select.innerHTML = priorities.map(priority => `
    <option value="${priority.code}">${priority.name}</option>
  `).join('');
}

/**
 * Инициализация формы
 */
function initForm() {
  const form = document.getElementById('task-form');
  const subtasksContainer = document.getElementById('subtasks-container');
  const addSubtaskBtn = document.getElementById('add-subtask-btn');
  const subtasksList = [];
  
  // Добавление подзадачи
  addSubtaskBtn?.addEventListener('click', () => {
    const subtaskInput = document.getElementById('subtask-input');
    const title = subtaskInput?.value.trim();
    
    if (title) {
      subtasksList.push({ title, completed: false });
      renderSubtasks(subtasksList);
      subtaskInput.value = '';
    }
  });
  
  // Обработка отправки формы
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const taskData = {
      title: formData.get('title'),
      description: formData.get('description'),
      projectId: formData.get('project'),
      sectionId: formData.get('section') || null,
      assigneeId: formData.get('assignee'),
      dueDate: formData.get('due-date'),
      priority: formData.get('priority'),
      subtasks: subtasksList,
    };
    
    try {
      setLoading(true);
      
      const task = await API.tasks.create(taskData);
      
      UI.toast('Задача успешно создана', 'success');
      setTimeout(() => {
        window.location.href = `07-tasks-list.html?id=${task.id}`;
      }, 500);
      
    } catch (error) {
      console.error('Ошибка создания задачи:', error);
      UI.toast(error.message || 'Ошибка при создании задачи', 'error');
    } finally {
      setLoading(false);
    }
  });
}

/**
 * Рендер подзадач
 */
function renderSubtasks(subtasks) {
  const container = document.getElementById('subtasks-list');
  if (!container) return;
  
  if (subtasks.length === 0) {
    container.innerHTML = '<p class="text-sm text-slate-400">Подзадачи не добавлены</p>';
    return;
  }
  
  container.innerHTML = subtasks.map((subtask, index) => `
    <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
      <div class="flex items-center gap-3">
        <input type="checkbox" class="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500">
        <span class="text-sm text-slate-700">${subtask.title}</span>
      </div>
      <button type="button" class="text-slate-400 hover:text-red-600" onclick="removeSubtask(${index})">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  `).join('');
}

/**
 * Удаление подзадачи
 */
function removeSubtask(index) {
  const subtasksList = []; // Нужно хранить в замыкании или глобально
  subtasksList.splice(index, 1);
  renderSubtasks(subtasksList);
}

/**
 * Установка режима загрузки
 */
function setLoading(loading) {
  const submitBtn = document.getElementById('submit-btn');
  if (submitBtn) {
    submitBtn.disabled = loading;
    submitBtn.innerHTML = loading 
      ? '<span class="animate-spin">⏳</span> Создание...' 
      : 'Создать задачу';
  }
}
