/**
 * Скрипт для страницы проекта для сотрудника (04-1-project-detail-employee.html)
 * Версия для исполнителя — показывает только доступные разделы
 */

document.addEventListener('DOMContentLoaded', async () => {
  await checkAuth();
  await loadProject();
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
 * Загрузка проекта
 */
async function loadProject() {
  try {
    const projectId = getUrlParam('id');
    if (!projectId) {
      UI.showError('#project-content', 'Не указан ID проекта');
      return;
    }
    
    UI.showLoading('#project-content');
    
    const project = await API.projects.getById(projectId);
    renderProject(project);
    
  } catch (error) {
    console.error('Ошибка загрузки проекта:', error);
    UI.showError('#project-content', 'Не удалось загрузить проект');
  }
}

/**
 * Рендер проекта (версия сотрудника)
 */
function renderProject(project) {
  // Основная информация
  renderProjectInfo(project);
  
  // Вводные данные
  renderProjectDescription(project);
  
  // Файлы
  renderProjectFiles(project.files || []);
  
  // Изыскания (только доступные)
  renderProjectSurveys(project.surveys || []);
  
  // Разделы (сгруппированные: мои / доступные)
  renderProjectSectionsGrouped(project.sections || []);
}

/**
 * Рендер основной информации
 */
function renderProjectInfo(project) {
  const container = document.getElementById('project-info');
  if (!container) return;
  
  const statusClass = UI.getProjectStatusClass(project.status);
  const statusText = UI.getProjectStatusText(project.status);
  
  container.innerHTML = `
    <div class="grid grid-cols-2 gap-4">
      <div>
        <p class="text-sm text-slate-500">Шифр проекта</p>
        <p class="font-medium text-slate-800 font-mono">${project.code}</p>
      </div>
      <div>
        <p class="text-sm text-slate-500">Статус</p>
        <p class="font-medium">
          <span class="badge ${statusClass}">${statusText}</span>
        </p>
      </div>
      <div>
        <p class="text-sm text-slate-500">Заказчик</p>
        <p class="font-medium text-slate-800">${project.customer || '—'}</p>
      </div>
      <div>
        <p class="text-sm text-slate-500">Дата начала</p>
        <p class="font-medium text-slate-800">${UI.formatDate(project.startDate)}</p>
      </div>
      <div>
        <p class="text-sm text-slate-500">Срок сдачи</p>
        <p class="font-medium ${getDeadlineClass(project.deadline)}">${UI.formatDate(project.deadline)}</p>
      </div>
      <div>
        <p class="text-sm text-slate-500">Площадь</p>
        <p class="font-medium text-slate-800">${project.area ? project.area.toLocaleString() + ' м²' : '—'}</p>
      </div>
    </div>
  `;
}

/**
 * Рендер описания
 */
function renderProjectDescription(project) {
  const container = document.getElementById('project-description');
  if (!container) return;
  
  container.innerHTML = `
    <div class="mb-4">
      <p class="text-sm text-slate-600 leading-relaxed">${project.description || 'Описание отсутствует'}</p>
    </div>
  `;
}

/**
 * Рендер файлов
 */
function renderProjectFiles(files) {
  const container = document.getElementById('project-files');
  if (!container) return;
  
  if (files.length === 0) {
    container.innerHTML = '<p class="text-sm text-slate-400">Файлы не загружены</p>';
    return;
  }
  
  const filesHtml = files.map(file => {
    const iconClass = getFileIconClass(file.type);
    return `
      <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 ${iconClass} rounded-lg flex items-center justify-center">
            ${UI.getEntityIcon('file', 'w-5 h-5')}
          </div>
          <div>
            <p class="text-sm font-medium text-slate-700">${file.name}</p>
            <p class="text-xs text-slate-400">${file.uploadedBy} • ${UI.formatDate(file.uploadedAt)} • ${formatFileSize(file.size)}</p>
          </div>
        </div>
        <a href="${file.url}" download class="text-slate-400 hover:text-blue-600">
          ${UI.getEntityIcon('file', 'w-5 h-5')}
        </a>
      </div>
    `;
  }).join('');
  
  container.innerHTML = filesHtml;
}

/**
 * Рендер изысканий
 */
function renderProjectSurveys(surveys) {
  const container = document.getElementById('project-surveys');
  if (!container) return;
  
  if (surveys.length === 0) {
    container.innerHTML = '<p class="text-sm text-slate-400">Изыскания не назначены</p>';
    return;
  }
  
  const surveysHtml = surveys.map(survey => {
    const statusClass = UI.getSurveyStatusClass(survey.status);
    const statusText = UI.getSurveyStatusText(survey.status);
    
    return `
      <a href="14-survey-detail.html?id=${survey.id}" class="block p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center ${getStatusBgClass(survey.status)}">
              ${UI.getStatusIcon(survey.status, 'html')}
            </div>
            <div>
              <p class="font-medium text-slate-800">${survey.name}</p>
              <p class="text-sm text-slate-500">${statusText} • ${survey.responsible || 'Не назначен'}</p>
            </div>
          </div>
          <span class="badge ${statusClass}">${statusText}</span>
        </div>
      </a>
    `;
  }).join('');
  
  container.innerHTML = surveysHtml;
}

/**
 * Рендер разделов с группировкой (МОИ / ДОСТУПНЫ)
 */
function renderProjectSectionsGrouped(sections) {
  const container = document.getElementById('project-sections');
  if (!container) return;
  
  if (sections.length === 0) {
    container.innerHTML = '<p class="text-sm text-slate-400">Разделы не назначены</p>';
    return;
  }
  
  // Группируем разделы
  const mySections = sections.filter(s => s.isMy || s.role === 'responsible' || s.role === 'coexecutor');
  const viewableSections = sections.filter(s => s.role === 'observer' || !s.isMy);
  
  let html = '';
  
  // Мои разделы
  if (mySections.length > 0) {
    html += `
      <div class="sections-group mb-6">
        <p class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Мои разделы</p>
        <div class="space-y-3">
          ${mySections.map(section => renderSectionCard(section, true)).join('')}
        </div>
      </div>
    `;
  }
  
  // Доступны для просмотра
  if (viewableSections.length > 0) {
    html += `
      <div class="sections-group">
        <p class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Доступны для просмотра</p>
        <div class="space-y-3">
          ${viewableSections.map(section => renderSectionCard(section, false)).join('')}
        </div>
      </div>
    `;
  }
  
  container.innerHTML = html;
}

/**
 * Рендер карточки раздела
 */
function renderSectionCard(section, isMy) {
  const statusClass = UI.getSectionStatusClass(section.status);
  const statusText = UI.getSectionStatusText(section.status);
  
  return `
    <a href="06-section-detail.html?id=${section.id}" class="block p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center ${getStatusBgClass(section.status)}">
            <span class="text-xs font-bold" style="color: ${section.color || '#64748b'}">${section.code}</span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <p class="font-medium text-slate-800">${section.name}</p>
              ${isMy ? '<span class="badge bg-blue-100 text-blue-700 text-xs">Мой</span>' : ''}
            </div>
            <p class="text-sm text-slate-500">${statusText} • ${section.responsible || 'Не назначен'}</p>
          </div>
        </div>
        <span class="badge ${statusClass}">${statusText}</span>
      </div>
    </a>
  `;
}

// Вспомогательные функции
function getDeadlineClass(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diff = date - now;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  
  if (days < 0) return 'text-red-600 font-semibold';
  if (days <= 5) return 'text-amber-600 font-medium';
  return 'text-slate-600';
}

function getStatusBgClass(status) {
  const map = {
    'done': 'bg-green-100',
    'completed': 'bg-green-100',
    'in-progress': 'bg-blue-100',
    'review': 'bg-amber-100',
    'not-started': 'bg-slate-100',
    'overdue': 'bg-red-100',
  };
  return map[status] || 'bg-slate-100';
}

function getFileIconClass(type) {
  const map = {
    'pdf': 'bg-red-100 text-red-600',
    'dwg': 'bg-blue-100 text-blue-600',
    'zip': 'bg-green-100 text-green-600',
    'doc': 'bg-indigo-100 text-indigo-600',
  };
  return map[type] || 'bg-slate-100 text-slate-600';
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
