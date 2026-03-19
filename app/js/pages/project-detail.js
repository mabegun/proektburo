/**
 * Скрипт для детальной страницы проекта (04-project-detail.html)
 */

document.addEventListener('DOMContentLoaded', async () => {
  await initPage({ requireAuth: false, loadProfile: true });
  await loadProject();
});

/**
 * Загрузка проекта
 */
async function loadProject() {
  try {
    const projectId = getUrlParam('id');
    if (!projectId) {
      UI.showError('#project-title', 'Не указан ID проекта');
      return;
    }
    
    UI.showLoading('#project-title');
    
    const project = await API.projects.getById(projectId);
    renderProject(project);
    
  } catch (error) {
    console.error('Ошибка загрузки проекта:', error);
    UI.showError('#project-title', 'Не удалось загрузить проект');
  }
}

/**
 * Рендер проекта
 */
function renderProject(project) {
  // Заголовок, код, статус, адрес
  renderProjectHeader(project);
  
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
  
  // Прогресс
  renderProjectProgress(project);
  
  // Команда
  renderProjectTeam(project.team || []);
  
  // Последние файлы
  renderRecentFiles(project.recentFiles || []);
}

/**
 * Рендер заголовка проекта
 */
function renderProjectHeader(project) {
  // Название
  const titleEl = document.getElementById('project-title');
  if (titleEl) {
    titleEl.textContent = project.name || '—';
  }
  
  // Код
  const codeEl = document.getElementById('project-code');
  if (codeEl) {
    codeEl.textContent = project.code || '—';
  }
  
  // Статус
  const statusEl = document.getElementById('project-status');
  if (statusEl) {
    const statusClass = UI.getProjectStatusClass(project.status);
    const statusText = UI.getProjectStatusText(project.status);
    statusEl.className = `badge ${statusClass}`;
    statusEl.textContent = statusText;
  }
  
  // Адрес
  const addressEl = document.getElementById('project-address');
  if (addressEl) {
    addressEl.textContent = project.address || '—';
  }
}

/**
 * Рендер основной информации
 */
function renderProjectInfo(project) {
  const container = document.getElementById('project-info');
  if (!container) return;
  
  const typeText = getProjectTypeText(project.type);
  
  container.innerHTML = `
    <div>
      <p class="text-sm text-slate-500">Шифр проекта</p>
      <p class="font-medium text-slate-800 font-mono">${project.code || '—'}</p>
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
      <p class="font-medium text-slate-800">${project.floors ? project.floors + ' этажей' : '—'}</p>
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
    <p class="text-sm text-slate-600 leading-relaxed">${project.description || 'Описание отсутствует'}</p>
  `;
}

/**
 * Рендер файлов
 */
function renderProjectFiles(files) {
  const container = document.getElementById('project-files');
  const countEl = document.getElementById('project-files-count');
  
  if (countEl) {
    countEl.textContent = `Файлы (${files.length})`;
  }
  
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
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-slate-700">${file.name}</p>
            <p class="text-xs text-slate-400">${file.uploadedBy || '—'} • ${UI.formatDate(file.uploadedAt)} • ${formatFileSize(file.size)}</p>
          </div>
        </div>
        <a href="${file.url || '#'}" download class="text-slate-400 hover:text-blue-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
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
    
    return `
      <a href="14-survey-detail.html?id=${survey.id}" class="block p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center ${getStatusBgClass(survey.status)}">
              ${getStatusIconSvg(survey.status)}
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

/**
 * Рендер прогресса
 */
function renderProjectProgress(project) {
  const container = document.getElementById('project-progress');
  if (!container) return;
  
  const progress = project.progress || 0;
  const completed = project.completedCount || 0;
  const inProgress = project.inProgressCount || 0;
  
  container.innerHTML = `
    <div class="relative pt-1">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-slate-700">Выполнение</span>
        <span class="text-sm font-medium text-slate-700">${progress}%</span>
      </div>
      <div class="progress-bar mb-4">
        <div class="progress-bar-fill" style="width: ${progress}%"></div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4 text-center">
      <div class="p-3 rounded-lg bg-slate-50">
        <p class="text-2xl font-bold text-slate-800">${completed}</p>
        <p class="text-xs text-slate-500">Завершено</p>
      </div>
      <div class="p-3 rounded-lg bg-slate-50">
        <p class="text-2xl font-bold text-slate-800">${inProgress}</p>
        <p class="text-xs text-slate-500">В работе</p>
      </div>
    </div>
  `;
}

/**
 * Рендер команды
 */
function renderProjectTeam(team) {
  const container = document.getElementById('project-team');
  if (!container) return;
  
  if (team.length === 0) {
    container.innerHTML = '<p class="text-sm text-slate-400">Команда не назначена</p>';
    return;
  }
  
  const teamHtml = team.map(member => {
    const avatarColors = ['from-slate-700 to-slate-500', 'from-blue-500 to-blue-400', 'from-green-500 to-green-400', 'from-purple-500 to-purple-400', 'from-amber-500 to-amber-400'];
    const colorIndex = Math.abs(member.name.charCodeAt(0)) % avatarColors.length;
    const avatarColor = avatarColors[colorIndex];
    const initial = member.name ? member.name.charAt(0).toUpperCase() : '?';
    
    return `
      <div class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 group">
        <div class="flex items-center gap-3">
          <div class="avatar bg-gradient-to-br ${avatarColor} text-white">${initial}</div>
          <div>
            <p class="font-medium text-slate-800">${member.name}</p>
            <p class="text-xs text-slate-500">${member.role || 'Участник'}</p>
          </div>
        </div>
        <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all" title="Редактировать роль">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          ${member.canRemove !== false ? `
            <button class="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all" title="Удалить из команды">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
  
  container.innerHTML = teamHtml;
}

/**
 * Рендер последних файлов
 */
function renderRecentFiles(files) {
  const container = document.getElementById('project-recent-files');
  if (!container) return;
  
  if (files.length === 0) {
    container.innerHTML = '<p class="text-sm text-slate-400">Нет файлов</p>';
    return;
  }
  
  const filesHtml = files.map(file => {
    const iconClass = getFileIconClass(file.type);
    return `
      <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
        <div class="w-8 h-8 rounded ${iconClass} flex items-center justify-center">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" /></svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-slate-800 truncate">${file.name}</p>
          <p class="text-xs text-slate-400">${formatFileSize(file.size)} • ${UI.formatDate(file.date)}</p>
        </div>
      </div>
    `;
  }).join('');
  
  container.innerHTML = filesHtml;
}

/**
 * Вспомогательные функции
 */
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

function getStatusIconSvg(status) {
  const map = {
    'done': '<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>',
    'completed': '<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>',
    'in-progress': '<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
    'review': '<svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
    'not-started': '<svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
    'overdue': '<svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
  };
  return map[status] || map['not-started'];
}

function getProjectTypeText(type) {
  const map = {
    'new-construction': 'Новое строительство',
    'reconstruction': 'Реконструкция',
    'renovation': 'Капитальный ремонт',
  };
  return map[type] || type || '—';
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
