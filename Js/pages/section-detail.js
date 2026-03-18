/**
 * Скрипт для страницы раздела проекта (06-section-detail.html)
 */

document.addEventListener('DOMContentLoaded', async () => {
  await checkAuth();
  await loadSection();
  initActions();
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
 * Загрузка раздела
 */
async function loadSection() {
  try {
    const sectionId = getUrlParam('id');
    if (!sectionId) {
      UI.showError('#section-content', 'Не указан ID раздела');
      return;
    }
    
    UI.showLoading('#section-content');
    
    const section = await API.sections.getById(sectionId);
    renderSection(section);
    
  } catch (error) {
    console.error('Ошибка загрузки раздела:', error);
    UI.showError('#section-content', 'Не удалось загрузить раздел');
  }
}

/**
 * Рендер раздела
 */
function renderSection(section) {
  // Основная информация
  renderSectionInfo(section);
  
  // Договор
  renderSectionContract(section.contract);
  
  // Файлы
  renderSectionFiles(section.files || []);
  
  // Выплаты
  renderSectionPayments(section.payments || []);
  
  // Соисполнители
  renderSectionTeam(section.team || []);
  
  // Наблюдатели
  renderSectionObservers(section.observers || []);
  
  // Обсуждение
  renderSectionComments(section.comments || []);
  
  // Комплектность
  renderSectionCompleteness(section.completeness);
}

/**
 * Рендер основной информации
 */
function renderSectionInfo(section) {
  const container = document.getElementById('section-info');
  if (!container) return;
  
  const statusClass = UI.getSectionStatusClass(section.status);
  const statusText = UI.getSectionStatusText(section.status);
  
  container.innerHTML = `
    <div class="grid grid-cols-2 gap-4">
      <div>
        <p class="text-sm text-slate-500">Код раздела</p>
        <p class="font-medium text-slate-800 font-mono">${section.code}</p>
      </div>
      <div>
        <p class="text-sm text-slate-500">Статус</p>
        <p class="font-medium">
          <span class="badge ${statusClass}">${statusText}</span>
        </p>
      </div>
      <div>
        <p class="text-sm text-slate-500">Ответственный</p>
        <p class="font-medium text-slate-800">${section.responsible?.name || 'Не назначен'}</p>
      </div>
      <div>
        <p class="text-sm text-slate-500">Дедлайн</p>
        <p class="font-medium text-slate-800 ${getDeadlineClass(section.deadline)}">
          ${UI.formatDate(section.deadline)}
        </p>
      </div>
      <div>
        <p class="text-sm text-slate-500">Прогресс</p>
        <p class="font-medium text-slate-800">${section.progress || 0}%</p>
      </div>
      <div>
        <p class="text-sm text-slate-500">Договор</p>
        <p class="font-medium text-slate-800">${section.contract?.code || 'Не заключён'}</p>
      </div>
    </div>
  `;
}

/**
 * Рендер договора
 */
function renderSectionContract(contract) {
  const container = document.getElementById('section-contract');
  if (!container) return;
  
  if (!contract) {
    container.innerHTML = `
      <div class="text-center py-8 text-slate-400">
        <p>Договор не заключён</p>
        <button class="btn-primary mt-3 text-sm py-2 px-4">Заключить договор</button>
      </div>
    `;
    return;
  }
  
  container.innerHTML = `
    <div class="space-y-3">
      <div class="flex justify-between">
        <span class="text-sm text-slate-500">Номер:</span>
        <span class="text-sm font-medium text-slate-800">${contract.code}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-sm text-slate-500">Дата:</span>
        <span class="text-sm font-medium text-slate-800">${UI.formatDate(contract.date)}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-sm text-slate-500">Тип контрагента:</span>
        <span class="text-sm font-medium text-slate-800">${getContractorTypeText(contract.contractorType)}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-sm text-slate-500">Сумма:</span>
        <span class="text-sm font-medium text-slate-800">${UI.formatMoney(contract.amount)}</span>
      </div>
      <a href="18-contract-detail.html?id=${contract.id}" class="block text-center btn-secondary text-sm py-2">
        Открыть договор
      </a>
    </div>
  `;
}

/**
 * Рендер файлов
 */
function renderSectionFiles(files) {
  const container = document.getElementById('section-files');
  if (!container) return;
  
  if (files.length === 0) {
    container.innerHTML = '<p class="text-sm text-slate-400">Файлы не загружены</p>';
    return;
  }
  
  const filesHtml = files.map(file => {
    const iconClass = getFileIconClass(file.type);
    const statusClass = getFileStatusClass(file.status);
    const statusText = getFileStatusText(file.status);
    
    return `
      <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 ${iconClass} rounded-lg flex items-center justify-center">
            ${UI.getEntityIcon('file', 'w-5 h-5')}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <p class="text-sm font-medium text-slate-700">${file.name}</p>
              <span class="badge ${statusClass} text-xs">${statusText}</span>
            </div>
            <p class="text-xs text-slate-400">${file.uploadedBy} • ${UI.formatDate(file.uploadedAt)}</p>
          </div>
        </div>
        <div class="flex gap-2">
          <a href="${file.url}" download class="text-slate-400 hover:text-blue-600">
            ${UI.getEntityIcon('file', 'w-5 h-5')}
          </a>
          <button class="text-slate-400 hover:text-red-600" onclick="deleteFile(${file.id})">
            ${UI.getEntityIcon('settings', 'w-5 h-5')}
          </button>
        </div>
      </div>
    `;
  }).join('');
  
  container.innerHTML = filesHtml;
}

/**
 * Рендер выплат
 */
function renderSectionPayments(payments) {
  const container = document.getElementById('section-payments');
  if (!container) return;
  
  if (payments.length === 0) {
    container.innerHTML = '<p class="text-sm text-slate-400">Выплаты не назначены</p>';
    return;
  }
  
  const total = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const paid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (p.amount || 0), 0);
  const progress = total > 0 ? Math.round((paid / total) * 100) : 0;
  
  container.innerHTML = `
    <div class="mb-4">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm text-slate-500">Прогресс оплаты</span>
        <span class="text-sm font-medium">${UI.formatMoney(paid)} из ${UI.formatMoney(total)}</span>
      </div>
      <div class="progress-bar" style="height: 8px;">
        <div 
          class="progress-bar-fill" 
          style="width: ${progress}%; background: ${UI.getProgressColor(progress)};"
        ></div>
      </div>
    </div>
    
    <div class="space-y-2">
      ${payments.map(payment => `
        <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <p class="text-sm font-medium text-slate-700">${payment.name}</p>
            <p class="text-xs text-slate-400">${UI.formatDate(payment.date)}</p>
          </div>
          <div class="text-right">
            <p class="text-sm font-medium text-slate-800">${UI.formatMoney(payment.amount)}</p>
            <span class="badge ${getPaymentStatusClass(payment.status)} text-xs">
              ${getPaymentStatusText(payment.status)}
            </span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Рендер команды
 */
function renderSectionTeam(team) {
  const container = document.getElementById('section-team');
  if (!container) return;
  
  if (team.length === 0) {
    container.innerHTML = `
      <p class="text-sm text-slate-400 mb-3">Соисполнители не назначены</p>
      <button class="btn-secondary text-sm py-2 px-4">Добавить соисполнителя</button>
    `;
    return;
  }
  
  container.innerHTML = `
    <div class="space-y-2">
      ${team.map(member => `
        <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div class="flex items-center gap-3">
            <div class="avatar w-10 h-10 ${member.active ? 'bg-blue-600' : 'bg-slate-400'} text-white">
              ${UI.getInitials(member.name)}
            </div>
            <div>
              <p class="text-sm font-medium text-slate-700">${member.name}</p>
              <p class="text-xs text-slate-400">${member.role}</p>
            </div>
          </div>
          <span class="badge ${member.active ? 'status-completed' : 'status-not-started'} text-xs">
            ${member.active ? 'Активен' : 'Не активен'}
          </span>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Рендер наблюдателей
 */
function renderSectionObservers(observers) {
  const container = document.getElementById('section-observers');
  if (!container) return;
  
  if (observers.length === 0) {
    container.innerHTML = `
      <p class="text-sm text-slate-400 mb-3">Наблюдатели не назначены</p>
      <button class="btn-secondary text-sm py-2 px-4">Добавить наблюдателя</button>
    `;
    return;
  }
  
  container.innerHTML = `
    <div class="space-y-2">
      ${observers.map(observer => `
        <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div class="flex items-center gap-3">
            <div class="avatar w-10 h-10 bg-slate-400 text-white">
              ${UI.getInitials(observer.name)}
            </div>
            <div>
              <p class="text-sm font-medium text-slate-700">${observer.name}</p>
              <p class="text-xs text-slate-400">${observer.role}</p>
            </div>
          </div>
          <span class="badge bg-slate-100 text-slate-600 text-xs">Только просмотр</span>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Рендер комментариев
 */
function renderSectionComments(comments) {
  const container = document.getElementById('section-comments');
  if (!container) return;
  
  if (comments.length === 0) {
    container.innerHTML = '<p class="text-sm text-slate-400">Комментариев пока нет</p>';
    return;
  }
  
  container.innerHTML = comments.map(comment => `
    <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
      <div class="flex items-start gap-3">
        <div class="avatar w-10 h-10 bg-blue-600 text-white">
          ${UI.getInitials(comment.author.name)}
        </div>
        <div class="flex-1">
          <div class="flex justify-between items-start">
            <div>
              <p class="font-medium text-slate-800">${comment.author.name}</p>
              <p class="text-xs text-slate-400">${formatCommentTime(comment.createdAt)}</p>
            </div>
          </div>
          <p class="text-sm text-slate-700 mt-2">${comment.text}</p>
          ${comment.file ? `
            <div class="mt-3 p-3 bg-white rounded-lg border border-slate-200">
              <div class="flex items-center gap-3">
                ${UI.getEntityIcon('file', 'w-6 h-6 text-slate-600')}
                <div>
                  <p class="text-sm font-medium text-slate-700">${comment.file.name}</p>
                  <p class="text-xs text-slate-400">${formatFileSize(comment.file.size)}</p>
                </div>
                <a href="${comment.file.url}" download class="ml-auto text-slate-400 hover:text-blue-600">
                  ${UI.getEntityIcon('file', 'w-5 h-5')}
                </a>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Рендер комплектности
 */
function renderSectionCompleteness(completeness) {
  const container = document.getElementById('section-completeness');
  if (!container) return;
  
  if (!completeness) return;
  
  const progress = completeness.progress || 0;
  
  container.innerHTML = `
    <div class="space-y-3">
      <div class="flex justify-between items-center">
        <span class="text-sm font-medium text-slate-700">Комплектность</span>
        <span class="text-sm font-medium ${progress === 100 ? 'text-green-600' : 'text-amber-600'}">
          ${completeness.completed || 0} из ${completeness.total || 0}
        </span>
      </div>
      <div class="progress-bar" style="height: 8px;">
        <div 
          class="progress-bar-fill" 
          style="width: ${progress}%; background: ${UI.getProgressColor(progress)};"
        ></div>
      </div>
      <ul class="space-y-2">
        ${completeness.items.map(item => `
          <li class="flex items-center gap-2 text-sm">
            ${item.completed 
              ? '<span class="text-green-600">✓</span>' 
              : '<span class="text-slate-400">○</span>'
            }
            <span class="${item.completed ? 'text-slate-600' : 'text-slate-500'}">${item.name}</span>
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}

/**
 * Инициализация действий
 */
function initActions() {
  // Отправка комментария
  const commentForm = document.getElementById('comment-form');
  commentForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = e.target.querySelector('textarea')?.value.trim();
    
    if (text) {
      try {
        const sectionId = getUrlParam('id');
        await api.post(`/sections/${sectionId}/comments`, { text });
        UI.toast('Комментарий добавлен', 'success');
        loadSection(); // Перезагрузить
      } catch (error) {
        UI.toast('Ошибка при отправке комментария', 'error');
      }
    }
  });
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

function getContractorTypeText(type) {
  const map = {
    'ooo': 'ООО',
    'ip': 'ИП',
    'self-employed': 'Самозанятый',
    'gpkh': 'ГПХ',
    'employee': 'Сотрудник',
  };
  return map[type] || type;
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

function getFileStatusClass(status) {
  const map = {
    'approved': 'status-completed',
    'pending': 'status-in-progress',
    'revision': 'status-revision',
  };
  return map[status] || 'status-not-started';
}

function getFileStatusText(status) {
  const map = {
    'approved': 'Согласован',
    'pending': 'На проверке',
    'revision': 'Требует правок',
  };
  return map[status] || 'Загружен';
}

function getPaymentStatusClass(status) {
  const map = {
    'paid': 'status-completed',
    'approved': 'status-in-progress',
    'created': 'status-not-started',
    'overdue': 'status-overdue',
  };
  return map[status] || 'status-not-started';
}

function getPaymentStatusText(status) {
  const map = {
    'paid': 'Выплачено',
    'approved': 'Утверждено',
    'created': 'Создано',
    'overdue': 'Просрочено',
  };
  return map[status] || status;
}

function formatCommentTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 1) return 'Только что';
  if (minutes < 60) return `${minutes} мин. назад`;
  return UI.formatDate(dateString);
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
