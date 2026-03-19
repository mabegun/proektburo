/**
 * Скрипт для страницы замечаний проекта (04-2-project-expertise.html)
 */

document.addEventListener('DOMContentLoaded', async () => {
  await initPage({ requireAuth: false, loadProfile: true });
  await loadExpertise();
  initFilters();
});

/**
 * Обновление профиля в сайдбаре
 */

/**
 * Загрузка замечаний
 */
async function loadExpertise() {
  try {
    const projectId = getUrlParam('id');
    if (!projectId) {
      UI.showError('#expertise-content', 'Не указан ID проекта');
      return;
    }
    
    UI.showLoading('#expertise-content');
    
    const params = {
      projectId,
      section: getUrlParam('section') || '',
      status: getUrlParam('status') || '',
      assignee: getUrlParam('assignee') || '',
    };
    
    const [expertise, stats, sections, employees] = await Promise.all([
      API.expertise.getList(params),
      api.get(`/projects/${projectId}/expertise/stats`),
      API.sections.getList(projectId),
      API.employees.getList(),
    ]);
    
    renderExpertiseStats(stats);
    renderExpertise(expertise);
    populateFilters(sections, employees);
    
  } catch (error) {
    console.error('Ошибка загрузки замечаний:', error);
    UI.showError('#expertise-content', 'Не удалось загрузить замечания');
  }
}

/**
 * Рендер статистики
 */
function renderExpertiseStats(stats) {
  const container = document.getElementById('expertise-stats');
  if (!container) return;
  
  container.innerHTML = `
    <div class="grid grid-cols-5 gap-4">
      <div class="card-static p-4">
        <div class="text-sm text-slate-500 mb-1">Всего</div>
        <div class="text-2xl font-bold text-slate-800">${stats.total || 0}</div>
      </div>
      <div class="card-static p-4">
        <div class="text-sm text-slate-500 mb-1">Создано</div>
        <div class="text-2xl font-bold text-slate-600">${stats.created || 0}</div>
        <div class="text-xs text-slate-400 mt-1">новых</div>
      </div>
      <div class="card-static p-4">
        <div class="text-sm text-slate-500 mb-1">В работе</div>
        <div class="text-2xl font-bold text-blue-600">${stats.inProgress || 0}</div>
      </div>
      <div class="card-static p-4">
        <div class="text-sm text-slate-500 mb-1">На проверке</div>
        <div class="text-2xl font-bold text-amber-600">${stats.review || 0}</div>
      </div>
      <div class="card-static p-4">
        <div class="text-sm text-slate-500 mb-1">Закрыто</div>
        <div class="text-2xl font-bold text-green-600">${stats.closed || 0}</div>
      </div>
    </div>
  `;
}

/**
 * Рендер замечаний
 */
function renderExpertise(expertise) {
  const container = document.getElementById('expertise-list');
  if (!container) return;
  
  if (expertise.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 text-slate-400">
        <div class="text-6xl mb-4">⚠️</div>
        <p class="text-lg font-medium">Замечаний нет</p>
        <p class="text-sm mt-2">Все разделы соответствуют требованиям!</p>
        <button class="btn-primary mt-4 text-sm py-2 px-4" onclick="createExpertise()">
          Добавить замечание
        </button>
      </div>
    `;
    return;
  }
  
  const html = expertise.map(item => renderExpertiseItem(item)).join('');
  
  container.innerHTML = html;
}

/**
 * Рендер замечания
 */
function renderExpertiseItem(item) {
  const statusClass = getExpertiseStatusClass(item.status);
  const statusText = getExpertiseStatusText(item.status);
  const priorityClass = getPriorityClass(item.priority);
  const priorityText = getPriorityText(item.priority);
  const isOverdue = item.deadline && new Date(item.deadline) < new Date();
  
  return `
    <a href="16-expertise-comment.html?id=${item.id}" class="block card p-4 hover:bg-slate-50 transition-colors">
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-sm font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">№${item.number}</span>
            <span class="badge ${priorityClass}">${priorityText}</span>
            <span class="badge ${statusClass}">${statusText}</span>
            ${isOverdue ? '<span class="text-red-600 text-xs font-medium">🔴 Просрочено</span>' : ''}
          </div>
          
          <p class="text-sm font-medium text-slate-800 mb-2">${item.text}</p>
          
          <div class="flex items-center gap-4 text-sm text-slate-500">
            <span class="flex items-center gap-1">
              <span class="w-6 h-6 rounded flex items-center justify-center text-xs font-bold" style="background: ${item.sectionColor}">
                ${item.sectionCode}
              </span>
              ${item.sectionName}
            </span>
            <span class="flex items-center gap-1">
              ${UI.getEntityIcon('employee', 'w-4 h-4')}
              ${item.assignee?.name || 'Не назначен'}
            </span>
            <span class="flex items-center gap-1">
              ${UI.getEntityIcon('calendar', 'w-4 h-4')}
              ${UI.formatDate(item.deadline)}
            </span>
          </div>
        </div>
        
        <div class="text-right">
          <div class="text-xs text-slate-400 mb-1">Ответов</div>
          <div class="text-lg font-bold text-slate-800">${item.repliesCount || 0}</div>
        </div>
      </div>
    </a>
  `;
}

/**
 * Заполнение фильтров
 */
function populateFilters(sections, employees) {
  const sectionSelect = document.getElementById('section-filter');
  const statusSelect = document.getElementById('status-filter');
  const assigneeSelect = document.getElementById('assignee-filter');
  
  if (sectionSelect && sections) {
    sectionSelect.innerHTML = `
      <option value="">Все разделы</option>
      ${sections.map(s => `<option value="${s.code}">${s.code} — ${s.name}</option>`).join('')}
    `;
    sectionSelect.value = getUrlParam('section') || '';
  }
  
  if (statusSelect) {
    statusSelect.value = getUrlParam('status') || '';
  }
  
  if (assigneeSelect && employees) {
    assigneeSelect.innerHTML = `
      <option value="">Все исполнители</option>
      ${employees.map(e => `<option value="${e.id}">${e.name}</option>`).join('')}
    `;
    assigneeSelect.value = getUrlParam('assignee') || '';
  }
}

/**
 * Инициализация фильтров
 */
function initFilters() {
  const sectionFilter = document.getElementById('section-filter');
  const statusFilter = document.getElementById('status-filter');
  const assigneeFilter = document.getElementById('assignee-filter');
  
  [sectionFilter, statusFilter, assigneeFilter].forEach(filter => {
    filter?.addEventListener('change', applyFilters);
  });
}

/**
 * Применение фильтров
 */
function applyFilters() {
  const sectionFilter = document.getElementById('section-filter');
  const statusFilter = document.getElementById('status-filter');
  const assigneeFilter = document.getElementById('assignee-filter');
  
  const params = new URLSearchParams({
    section: sectionFilter?.value || '',
    status: statusFilter?.value || '',
    assignee: assigneeFilter?.value || '',
  });
  
  window.location.href = `04-2-project-expertise.html?${params}`;
}

/**
 * Создание замечания
 */
window.createExpertise = () => {
  const projectId = getUrlParam('id');
  window.location.href = `14-4-expertise-create.html?project=${projectId}`;
};

// Вспомогательные функции
function getExpertiseStatusClass(status) {
  const map = {
    'created': 'status-not-started',
    'in-progress': 'status-in-progress',
    'review': 'status-revision',
    'closed': 'status-completed',
    'rejected': 'status-overdue',
  };
  return map[status] || 'status-not-started';
}

function getExpertiseStatusText(status) {
  const map = {
    'created': 'Создано',
    'in-progress': 'В работе',
    'review': 'На проверке',
    'closed': 'Закрыто',
    'rejected': 'Отклонено',
  };
  return map[status] || status;
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
