/**
 * Скрипт для страницы списка проектов (03-projects-list.html)
 */

document.addEventListener('DOMContentLoaded', async () => {
  await checkAuth();
  await loadProjects();
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
 * Загрузка проектов
 */
async function loadProjects() {
  try {
    UI.showLoading('#projects-container');
    
    const params = {
      search: getUrlParam('search') || '',
      status: getUrlParam('status') || '',
      type: getUrlParam('type') || '',
    };
    
    const data = await API.projects.getList(params);
    renderProjects(data.items || data);
    
  } catch (error) {
    console.error('Ошибка загрузки проектов:', error);
    UI.showError('#projects-container', 'Не удалось загрузить проекты. Попробуйте обновить страницу.');
  }
}

/**
 * Рендер списка проектов
 */
function renderProjects(projects) {
  const container = document.getElementById('projects-container');
  if (!container) return;
  
  if (!projects || projects.length === 0) {
    UI.showEmpty('#projects-container', 'Нет проектов для отображения', '🏗️');
    return;
  }
  
  const html = projects.map(project => {
    const sectionsHtml = (project.sections || []).map(section => {
      const statusClass = UI.getSectionStatusClass(section.status);
      return `
        <a href="06-section-detail.html?project=${project.id}&section=${section.code}" 
           class="section-indicator ${statusClass}">
          ${section.code}
          <div class="section-tooltip">
            <div class="section-tooltip-title">${section.name}</div>
            <div class="section-tooltip-row"><span>Статус:</span> ${UI.getSectionStatusText(section.status)}</div>
            <div class="section-tooltip-row"><span>Ответственный:</span> ${section.responsible || 'Не назначен'}</div>
          </div>
        </a>
      `;
    }).join('');
    
    const surveysHtml = (project.surveys || []).map(survey => {
      const statusClass = UI.getSectionStatusClass(survey.status);
      return `
        <a href="14-survey-detail.html?project=${project.id}&survey=${survey.code}" 
           class="survey-indicator ${statusClass}">
          ${survey.code}
          <div class="survey-tooltip">
            <div class="survey-tooltip-title">${survey.name}</div>
            <div class="survey-tooltip-row"><span>Статус:</span> ${UI.getSectionStatusText(survey.status)}</div>
            <div class="survey-tooltip-row"><span>Ответственный:</span> ${survey.responsible || 'Не назначен'}</div>
          </div>
        </a>
      `;
    }).join('');
    
    return `
      <div class="project-card">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-sm font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">${project.code}</span>
              <a href="04-project-detail.html?id=${project.id}" class="project-card-link">
                <h3 class="font-semibold text-slate-800 text-lg">${project.name}</h3>
              </a>
              <span class="badge ${UI.getProjectStatusClass(project.status)}">${UI.getProjectStatusText(project.status)}</span>
            </div>
            <p class="text-slate-500 mb-3">${project.address}</p>

            <!-- Индикаторы изысканий и разделов -->
            <div class="flex items-center gap-2 flex-wrap mb-3">
              <span class="text-xs text-slate-400 font-medium">И:</span>
              <div class="flex gap-1.5 flex-wrap">${surveysHtml}</div>
              
              <span class="text-slate-300 mx-1">|</span>
              
              <span class="text-xs text-slate-400 font-medium">Р:</span>
              <div class="flex gap-1.5 flex-wrap">${sectionsHtml}</div>
            </div>

            <div class="flex items-center gap-6 text-sm text-slate-500">
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                ${project.sections?.length || 0} разделов
              </span>
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                ${project.team?.length || 0} исполнителей
              </span>
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                до ${UI.formatDate(project.deadline)}
              </span>
            </div>
          </div>
          
          <div class="text-right">
            <div class="w-32">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-slate-500">Прогресс</span>
                <span class="font-medium text-slate-700">${project.progress}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-bar-fill" style="width: ${project.progress}%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  container.innerHTML = html;
}

/**
 * Инициализация фильтров
 */
function initFilters() {
  const searchInput = document.querySelector('input[placeholder*="Поиск"]');
  const statusSelect = document.querySelectorAll('select')[0];
  const typeSelect = document.querySelectorAll('select')[1];
  
  if (searchInput) {
    searchInput.value = getUrlParam('search') || '';
    searchInput.addEventListener('change', applyFilters);
  }
  
  if (statusSelect) {
    statusSelect.value = getUrlParam('status') || '';
    statusSelect.addEventListener('change', applyFilters);
  }
  
  if (typeSelect) {
    typeSelect.value = getUrlParam('type') || '';
    typeSelect.addEventListener('change', applyFilters);
  }
}

/**
 * Применение фильтров
 */
function applyFilters() {
  const searchInput = document.querySelector('input[placeholder*="Поиск"]');
  const statusSelect = document.querySelectorAll('select')[0];
  const typeSelect = document.querySelectorAll('select')[1];
  
  const params = new URLSearchParams({
    search: searchInput?.value || '',
    status: statusSelect?.value || '',
    type: typeSelect?.value || '',
  });
  
  window.location.href = `03-projects-list.html?${params}`;
}
