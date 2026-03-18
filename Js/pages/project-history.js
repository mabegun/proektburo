/**
 * Скрипт для страницы истории проекта (04-3-project-history.html)
 */

document.addEventListener('DOMContentLoaded', async () => {
  await checkAuth();
  await loadHistory();
  initFilters();
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
 * Загрузка истории
 */
async function loadHistory() {
  try {
    const projectId = getUrlParam('id');
    if (!projectId) {
      UI.showError('#history-content', 'Не указан ID проекта');
      return;
    }
    
    UI.showLoading('#history-content');
    
    const params = {
      type: getUrlParam('type') || '',
      author: getUrlParam('author') || '',
      from: getUrlParam('from') || '',
      to: getUrlParam('to') || '',
    };
    
    const history = await api.get(`/projects/${projectId}/history`, { params });
    renderHistory(history);
    
  } catch (error) {
    console.error('Ошибка загрузки истории:', error);
    UI.showError('#history-content', 'Не удалось загрузить историю');
  }
}

/**
 * Рендер истории
 */
function renderHistory(events) {
  const container = document.getElementById('history-list');
  if (!container) return;
  
  if (!events || events.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 text-slate-400">
        <div class="text-6xl mb-4">📜</div>
        <p class="text-lg font-medium">История пуста</p>
        <p class="text-sm mt-2">Изменений ещё не было</p>
      </div>
    `;
    return;
  }
  
  // Группируем события по датам
  const groupedEvents = groupEventsByDate(events);
  
  const html = Object.entries(groupedEvents).map(([date, dayEvents]) => `
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-4">
        <div class="h-px bg-slate-200 flex-1"></div>
        <span class="text-sm font-medium text-slate-500">${formatHistoryDate(date)}</span>
        <div class="h-px bg-slate-200 flex-1"></div>
      </div>
      <div class="space-y-3">
        ${dayEvents.map(event => renderHistoryEvent(event)).join('')}
      </div>
    </div>
  `).join('');
  
  container.innerHTML = html;
}

/**
 * Группировка событий по датам
 */
function groupEventsByDate(events) {
  const grouped = {};
  
  events.forEach(event => {
    const date = new Date(event.createdAt).toLocaleDateString('ru-RU');
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(event);
  });
  
  return grouped;
}

/**
 * Рендер события истории
 */
function renderHistoryEvent(event) {
  const icon = getEventIcon(event.type);
  const bgColor = getEventBgColor(event.type);
  const description = getEventDescription(event);
  
  return `
    <div class="card p-4">
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center flex-shrink-0">
          ${icon}
        </div>
        <div class="flex-1">
          <div class="flex items-center justify-between mb-1">
            <p class="font-medium text-slate-800">${event.title}</p>
            <span class="text-xs text-slate-400">${formatEventTime(event.createdAt)}</span>
          </div>
          <p class="text-sm text-slate-600 mb-2">${description}</p>
          ${event.author ? `
            <div class="flex items-center gap-2 text-xs text-slate-500">
              ${UI.getEntityIcon('employee', 'w-3 h-3')}
              ${event.author.name}
            </div>
          ` : ''}
          ${event.metadata ? `
            <div class="mt-2 p-2 bg-slate-50 rounded text-xs text-slate-600">
              ${getEventMetadata(event.metadata)}
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

/**
 * Иконка события по типу
 */
function getEventIcon(type) {
  const icons = {
    'project.created': `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
      </svg>
    `,
    'project.updated': UI.getEntityIcon('settings', 'w-5 h-5'),
    'section.added': `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    `,
    'section.status_changed': UI.getEntityIcon('file', 'w-5 h-5'),
    'survey.added': UI.getEntityIcon('survey', 'w-5 h-5'),
    'task.created': UI.getEntityIcon('task', 'w-5 h-5'),
    'task.completed': `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    `,
    'file.uploaded': UI.getEntityIcon('file', 'w-5 h-5'),
    'file.deleted': `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    `,
    'comment.added': `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    `,
    'expertise.created': `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    `,
    'finance.income_added': UI.getEntityIcon('money', 'w-5 h-5'),
    'finance.expense_added': UI.getEntityIcon('money', 'w-5 h-5'),
    'member.added': UI.getEntityIcon('employee', 'w-5 h-5'),
    'member.removed': `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12l-9-9-9 9" />
      </svg>
    `,
  };
  
  return icons[event.type] || UI.getEntityIcon('calendar', 'w-5 h-5');
}

/**
 * Цвет фона события
 */
function getEventBgColor(type) {
  const colors = {
    'project.created': 'bg-green-100 text-green-600',
    'project.updated': 'bg-blue-100 text-blue-600',
    'section.added': 'bg-green-100 text-green-600',
    'section.status_changed': 'bg-amber-100 text-amber-600',
    'survey.added': 'bg-purple-100 text-purple-600',
    'task.created': 'bg-blue-100 text-blue-600',
    'task.completed': 'bg-green-100 text-green-600',
    'file.uploaded': 'bg-slate-100 text-slate-600',
    'file.deleted': 'bg-red-100 text-red-600',
    'comment.added': 'bg-indigo-100 text-indigo-600',
    'expertise.created': 'bg-red-100 text-red-600',
    'finance.income_added': 'bg-green-100 text-green-600',
    'finance.expense_added': 'bg-red-100 text-red-600',
    'member.added': 'bg-purple-100 text-purple-600',
    'member.removed': 'bg-slate-100 text-slate-600',
  };
  
  return colors[type] || 'bg-slate-100 text-slate-600';
}

/**
 * Описание события
 */
function getEventDescription(event) {
  const descriptions = {
    'project.created': `Проект "${event.metadata?.projectName || ''}" был создан`,
    'project.updated': 'Изменены параметры проекта',
    'section.added': `Добавлен раздел ${event.metadata?.sectionCode || ''}`,
    'section.status_changed': `Статус раздела изменён с "${event.metadata?.oldStatus || ''}" на "${event.metadata?.newStatus || ''}"`,
    'survey.added': `Добавлено изыскание ${event.metadata?.surveyCode || ''}`,
    'task.created': `Создана задача: ${event.metadata?.taskTitle || ''}`,
    'task.completed': `Задача "${event.metadata?.taskTitle || ''}" завершена`,
    'file.uploaded': `Загружен файл: ${event.metadata?.fileName || ''}`,
    'file.deleted': `Удалён файл: ${event.metadata?.fileName || ''}`,
    'comment.added': `Добавлен комментарий в ${event.metadata?.target || ''}`,
    'expertise.created': `Создано замечание №${event.metadata?.number || ''}`,
    'finance.income_added': `Поступление: ${UI.formatMoney(event.metadata?.amount)}`,
    'finance.expense_added': `Расход: ${UI.formatMoney(event.metadata?.amount)}`,
    'member.added': `Добавлен участник: ${event.metadata?.memberName || ''}`,
    'member.removed': `Удалён участник: ${event.metadata?.memberName || ''}`,
  };
  
  return descriptions[event.type] || event.description || 'Изменение в проекте';
}

/**
 * Метаданные события
 */
function getEventMetadata(metadata) {
  if (!metadata) return '';
  
  const items = [];
  if (metadata.oldValue) items.push(`Было: ${metadata.oldValue}`);
  if (metadata.newValue) items.push(`Стало: ${metadata.newValue}`);
  if (metadata.section) items.push(`Раздел: ${metadata.section}`);
  if (metadata.amount) items.push(`Сумма: ${UI.formatMoney(metadata.amount)}`);
  
  return items.join(' • ');
}

/**
 * Инициализация фильтров
 */
function initFilters() {
  const typeFilter = document.getElementById('type-filter');
  const authorFilter = document.getElementById('author-filter');
  const dateFromFilter = document.getElementById('date-from');
  const dateToFilter = document.getElementById('date-to');
  const loadMoreBtn = document.getElementById('load-more-btn');
  
  typeFilter?.addEventListener('change', applyFilters);
  authorFilter?.addEventListener('change', applyFilters);
  dateFromFilter?.addEventListener('change', applyFilters);
  dateToFilter?.addEventListener('change', applyFilters);
  
  loadMoreBtn?.addEventListener('click', () => {
    // Загрузка следующей страницы
    UI.toast('Загрузка следующих событий...', 'info');
  });
}

/**
 * Применение фильтров
 */
function applyFilters() {
  const typeFilter = document.getElementById('type-filter');
  const authorFilter = document.getElementById('author-filter');
  const dateFromFilter = document.getElementById('date-from');
  const dateToFilter = document.getElementById('date-to');
  
  const params = new URLSearchParams({
    type: typeFilter?.value || '',
    author: authorFilter?.value || '',
    from: dateFromFilter?.value || '',
    to: dateToFilter?.value || '',
  });
  
  window.location.href = `04-3-project-history.html?${params}`;
}

// Вспомогательные функции
function formatHistoryDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Сегодня';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Вчера';
  }
  
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatEventTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  
  if (minutes < 1) return 'Только что';
  if (minutes < 60) return `${minutes} мин. назад`;
  if (hours < 24) return `${hours} ${UI.declension(hours, ['час', 'часа', 'часов'])} назад`;
  
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}
