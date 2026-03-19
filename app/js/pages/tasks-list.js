/**
 * Скрипт для страницы списка задач (07-tasks-list.html)
 */

document.addEventListener('DOMContentLoaded', async () => {
  await initPage({ requireAuth: false, loadProfile: true });
  await loadTasks();
  initTabs();
});

/**
 * Обновление профиля в сайдбаре
 */

/**
 * Загрузка задач
 */
async function loadTasks() {
  try {
    UI.showLoading('#tasks-container');
    
    const params = {
      assignee_id: getUrlParam('assignee') || '',
      project_id: getUrlParam('project') || '',
      status: getUrlParam('status') || '',
      priority: getUrlParam('priority') || '',
    };
    
    const data = await API.tasks.getList(params);
    const tasks = data.items || data;
    renderTasks(tasks);
    updateTabCounters(tasks);
    
  } catch (error) {
    console.error('Ошибка загрузки задач:', error);
    UI.showError('#tasks-container', 'Не удалось загрузить задачи');
  }
}

/**
 * Рендер списка задач
 */
function renderTasks(tasks) {
  const container = document.getElementById('tasks-container');
  if (!container) return;
  
  if (!tasks || tasks.length === 0) {
    UI.showEmpty('#tasks-container', 'Нет задач для отображения', '📋');
    return;
  }
  
  const html = tasks.map(task => {
    const priorityClass = getPriorityClass(task.priority);
    const priorityText = getPriorityText(task.priority);
    const statusClass = getStatusClass(task.status);
    const statusText = getStatusText(task.status);
    
    const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
    const totalSubtasks = task.subtasks?.length || 0;
    const progress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;
    
    return `
      <div class="card p-5">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-3">
            <span class="badge ${priorityClass}">${priorityText}</span>
            <span class="badge ${statusClass}">${statusText}</span>
          </div>
          <div class="flex gap-2">
            <button class="text-slate-400 hover:text-slate-600" onclick="editTask(${task.id})">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button class="text-slate-400 hover:text-red-600" onclick="deleteTask(${task.id})">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <h3 class="font-semibold text-slate-800 mb-2">${task.title}</h3>
        <p class="text-sm text-slate-500 mb-4">${task.description || ''}</p>
        
        <div class="flex items-center gap-4 text-sm text-slate-500 mb-3">
          <a href="04-project-detail.html?id=${task.projectId}" class="flex items-center gap-1 hover:text-blue-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            ${task.projectName || 'Проект'}
          </a>
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            ${UI.formatDate(task.dueDate)}
          </span>
        </div>
        
        <!-- Подзадачи -->
        ${totalSubtasks > 0 ? `
          <div class="border-t border-slate-100 pt-3">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs text-slate-500">Чек-лист</span>
              <span class="text-xs text-slate-500">${completedSubtasks}/${totalSubtasks}</span>
            </div>
            <div class="space-y-1">
              ${task.subtasks.slice(0, 3).map(subtask => `
                <div class="subtask-item">
                  <input type="checkbox" class="subtask-checkbox" 
                         ${subtask.completed ? 'checked' : ''}
                         onchange="toggleSubtask(${task.id}, ${subtask.id})">
                  <span class="subtask-text ${subtask.completed ? 'completed' : ''}">${subtask.title}</span>
                </div>
              `).join('')}
              ${totalSubtasks > 3 ? `
                <div class="text-xs text-slate-400 pl-7">+ ещё ${totalSubtasks - 3}</div>
              ` : ''}
            </div>
            <div class="checklist-progress mt-2">
              <div class="checklist-progress-bar">
                <div class="checklist-progress-fill" style="width: ${progress}%"></div>
              </div>
              <span>${progress}%</span>
            </div>
          </div>
        ` : ''}
        
        <!-- Исполнители -->
        ${task.assignees?.length > 0 ? `
          <div class="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
            ${task.assignees.slice(0, 4).map(assignee => `
              <div class="avatar w-8 h-8 text-xs bg-gradient-to-br from-blue-600 to-blue-400" 
                   title="${assignee.name}">
                ${UI.getInitials(assignee.name)}
              </div>
            `).join('')}
            ${task.assignees.length > 4 ? `
              <span class="text-xs text-slate-400">+${task.assignees.length - 4}</span>
            ` : ''}
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
  
  container.innerHTML = html;
}

function getPriorityClass(priority) {
  const map = {
    'critical': 'priority-critical',
    'high': 'priority-high',
    'medium': 'priority-medium',
    'low': 'priority-low',
  };
  return map[priority] || 'priority-low';
}

function getPriorityText(priority) {
  const map = {
    'critical': 'Критичный',
    'high': 'Высокий',
    'medium': 'Средний',
    'low': 'Низкий',
  };
  return map[priority] || priority;
}

function getStatusClass(status) {
  const map = {
    'todo': 'status-not-started',
    'in-progress': 'status-in-progress',
    'done': 'status-completed',
    'review': 'status-revision',
  };
  return map[status] || 'status-not-started';
}

function getStatusText(status) {
  const map = {
    'todo': 'К выполнению',
    'in-progress': 'В работе',
    'done': 'Завершено',
    'review': 'На проверке',
  };
  return map[status] || status;
}

/**
 * Обновление счётчиков вкладок
 */
function updateTabCounters(tasks) {
  // Все задачи
  const countAll = tasks.length;
  const elAll = document.getElementById('count-all');
  if (elAll) elAll.textContent = countAll;
  
  // Мои задачи (назначенные текущему пользователю)
  const currentUserId = window.currentUser?.id;
  const countMy = tasks.filter(t => 
    t.assignees?.some(a => a.id === currentUserId) || 
    t.assigneeId === currentUserId
  ).length;
  const elMy = document.getElementById('count-my');
  if (elMy) elMy.textContent = countMy;
  
  // Наблюдаемые задачи
  const countWatching = tasks.filter(t => t.isWatching || t.watching).length;
  const elWatching = document.getElementById('count-watching');
  if (elWatching) elWatching.textContent = countWatching;
}

/**
 * Инициализация вкладок
 */
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab') || btn.textContent.toLowerCase().replace(' ', '-');
      switchTab(tab);
    });
  });
}

function switchTab(tab) {
  // Обновляем активные классы
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
  });
  
  // Фильтруем задачи
  const params = new URLSearchParams({ assignee: tab === 'my' ? 'me' : '' });
  window.location.href = `07-tasks-list.html?${params}`;
}

/**
 * Редактирование задачи
 */
function editTask(taskId) {
  window.location.href = `08-task-create.html?id=${taskId}`;
}

/**
 * Удаление задачи
 */
async function deleteTask(taskId) {
  if (!confirm('Вы уверены, что хотите удалить эту задачу?')) return;
  
  try {
    await API.tasks.delete(taskId);
    UI.toast('Задача удалена', 'success');
    loadTasks(); // Перезагрузить список
  } catch (error) {
    UI.toast('Ошибка при удалении задачи', 'error');
  }
}

/**
 * Переключение подзадачи
 */
async function toggleSubtask(taskId, subtaskId) {
  try {
    await API.tasks.toggleSubtask(taskId, subtaskId);
    loadTasks(); // Перезагрузить список
  } catch (error) {
    UI.toast('Ошибка при обновлении подзадачи', 'error');
  }
}
