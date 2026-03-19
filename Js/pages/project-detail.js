/**
 * Скрипт для детальной страницы проекта (04-project-detail.html)
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
 * Рендер проекта
 */
function renderProject(project) {
  // Основная информация
  renderProjectInfo(project);
  
  // Вводные данные
  renderProjectDescription(project);
  
  // Файлы
  renderProjectFiles(project.files || []);
  
  // Изыскания
  renderProjectSurveys(project.surveys || []);
  
  // Разделы
  renderProjectSections(project.sections || []);
}

/**
 * Рендер основной информации
 */
function renderProjectInfo(project) {
  const container = document.getElementById('project-info');
  if (!container) return;
  
  const statusClass = UI.getProjectStatusClass(project.status);
  const statusText = UI.getProjectStatusText(project.status);
  const typeText = getProjectTypeText(project.type);
  
  container.innerHTML = `
    <div class="grid grid-cols-2 gap-4">
      <div>
        <p class="text-sm text-slate-500">Шифр проекта</p>
        <p class="font-medium text-slate-800 font-mono">${project.code}</p>
      </div>
      <div>
        <p class="text-sm text-slate-500">Тип проекта</p>
        <p class="font-medium text-slate-800">${typeText}</p>
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
        <p class="font-medium text-slate-800">${UI.formatDate(project.deadline)}</p>
      </div>
      <div>
        <p class="text-sm text-slate-500">Площадь</p>
        <p class="font-medium text-slate-800">${project.area ? project.area.toLocaleString() + ' м²' : '—'}</p>
      </div>
      <div>
        <p class="text-sm text-slate-500">Этажность</p>
        <p class="font-medium text-slate-800">${project.floors || '—'}</p>
      </div>
    </div>
  `;
}

/**
 * Рендер описания и файлов
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

function getFileIconClass(type) {
  const map = {
    'pdf': 'bg-red-100 text-red-600',
    'dwg': 'bg-blue-100 text-blue-600',
    'zip': 'bg-green-100 text-green-600',
    'doc': 'bg-indigo-100 text-indigo-600',
    'docx': 'bg-indigo-100 text-indigo-600',
    'xlsx': 'bg-emerald-100 text-emerald-600',
  };
  return map[type] || 'bg-slate-100 text-slate-600';
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
    const progressColor = UI.getProgressColor(survey.progress || 0);
    
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
              ${survey.budget ? `
                <p class="text-xs ${survey.progress >= 100 ? 'text-green-600' : 'text-amber-600'} mt-1">
                  💰 ${UI.formatMoney(survey.paid || 0)} из ${UI.formatMoney(survey.budget)} (${survey.progress || 0}%)
                </p>
              ` : `
                <p class="text-xs text-slate-400 mt-1">💰 Договор не заключён</p>
              `}
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
 * Рендер разделов
 */
function renderProjectSections(sections) {
  const container = document.getElementById('project-sections');
  if (!container) return;
  
  if (sections.length === 0) {
    container.innerHTML = '<p class="text-sm text-slate-400">Разделы не назначены</p>';
    return;
  }
  
  const sectionsHtml = sections.map(section => {
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
              <p class="font-medium text-slate-800">${section.name}</p>
              <p class="text-sm text-slate-500">${statusText} • ${section.responsible || 'Не назначен'}</p>
            </div>
          </div>
          <span class="badge ${statusClass}">${statusText}</span>
        </div>
      </a>
    `;
  }).join('');
  
  container.innerHTML = sectionsHtml;
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

function getProjectTypeText(type) {
  const map = {
    'new-construction': 'Новое строительство',
    'reconstruction': 'Реконструкция',
    'renovation': 'Капитальный ремонт',
  };
  return map[type] || type;
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
