/**
 * Скрипт для страницы изыскания (14-survey-detail.html)
 */

document.addEventListener('DOMContentLoaded', async () => {
  await initPage({ requireAuth: false, loadProfile: true });
  await loadSurvey();
  initActions();
});

/**
 * Обновление профиля в сайдбаре
 */

/**
 * Загрузка изыскания
 */
async function loadSurvey() {
  try {
    const surveyId = getUrlParam('id');
    if (!surveyId) {
      UI.showError('#survey-content', 'Не указан ID изыскания');
      return;
    }
    
    UI.showLoading('#survey-content');
    
    const survey = await API.surveys.getById(surveyId);
    renderSurvey(survey);
    
  } catch (error) {
    console.error('Ошибка загрузки изыскания:', error);
    UI.showError('#survey-content', 'Не удалось загрузить изыскание');
  }
}

/**
 * Рендер изыскания
 */
function renderSurvey(survey) {
  // Заголовок и статус
  renderSurveyHeader(survey);
  
  // Основная информация
  renderSurveyInfo(survey);
  
  // Исполнитель (юрлицо)
  renderSurveyContractor(survey.contractor);
  
  // Договор
  renderSurveyContract(survey.contract);
  
  // Файлы
  renderSurveyFiles(survey.files || []);
  
  // Наблюдатели
  renderSurveyObservers(survey.observers || []);
  
  // Обсуждение
  renderSurveyComments(survey.comments || []);
  
  // История изменений
  renderSurveyHistory(survey.history || []);
}

/**
 * Рендер заголовка изыскания
 */
function renderSurveyHeader(survey) {
  // Название
  const titleEl = document.getElementById('survey-title');
  if (titleEl) {
    titleEl.textContent = survey.name || survey.title || 'Изыскание';
  }
  
  // Статус
  const statusEl = document.getElementById('survey-status');
  if (statusEl) {
    const statusClass = UI.getSurveyStatusClass(survey.status);
    const statusText = UI.getSurveyStatusText(survey.status);
    statusEl.className = `badge ${statusClass}`;
    statusEl.textContent = statusText;
  }
  
  // Ответственный
  const responsibleEl = document.getElementById('survey-responsible');
  if (responsibleEl) {
    responsibleEl.textContent = `Ответственный: ${survey.responsible?.name || 'Не назначен'}`;
  }
}

/**
 * Рендер основной информации
 */
function renderSurveyInfo(survey) {
  const container = document.getElementById('survey-info');
  if (!container) return;
  
  const statusClass = UI.getSurveyStatusClass(survey.status);
  const statusText = UI.getSurveyStatusText(survey.status);
  const progressColor = UI.getProgressColor(survey.progress || 0);
  
  container.innerHTML = `
    <div class="grid grid-cols-2 gap-4">
      <div>
        <p class="text-sm text-slate-500">Код изыскания</p>
        <p class="font-medium text-slate-800 font-mono">${survey.code}</p>
      </div>
      <div>
        <p class="text-sm text-slate-500">Статус</p>
        <p class="font-medium">
          <span class="badge ${statusClass}">${statusText}</span>
        </p>
      </div>
      <div>
        <p class="text-sm text-slate-500">Тип изыскания</p>
        <p class="font-medium text-slate-800">${survey.typeName}</p>
      </div>
      <div>
        <p class="text-sm text-slate-500">Ответственный</p>
        <p class="font-medium text-slate-800">${survey.responsible?.name || 'Не назначен'}</p>
      </div>
      <div>
        <p class="text-sm text-slate-500">Дедлайн</p>
        <p class="font-medium ${getDeadlineClass(survey.deadline)}">
          ${UI.formatDate(survey.deadline)}
        </p>
      </div>
      <div>
        <p class="text-sm text-slate-500">Прогресс</p>
        <div class="flex items-center gap-2">
          <div class="flex-1 progress-bar" style="height: 8px;">
            <div 
              class="progress-bar-fill" 
              style="width: ${survey.progress || 0}%; background: ${progressColor};"
            ></div>
          </div>
          <span class="text-sm font-medium">${survey.progress || 0}%</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Рендер исполнителя
 */
function renderSurveyContractor(contractor) {
  const container = document.getElementById('survey-contractor');
  if (!container) return;
  
  if (!contractor) {
    container.innerHTML = `
      <div class="text-center py-8 text-slate-400">
        <p>Исполнитель не назначен</p>
        <button class="btn-primary mt-3 text-sm py-2 px-4">Назначить исполнителя</button>
      </div>
    `;
    return;
  }
  
  container.innerHTML = `
    <div class="space-y-3">
      <div class="flex justify-between">
        <span class="text-sm text-slate-500">Название:</span>
        <span class="text-sm font-medium text-slate-800">${contractor.name}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-sm text-slate-500">Тип:</span>
        <span class="text-sm font-medium text-slate-800">${getContractorTypeText(contractor.type)}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-sm text-slate-500">ИНН:</span>
        <span class="text-sm font-medium text-slate-800">${contractor.inn || '—'}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-sm text-slate-500">Контакт:</span>
        <span class="text-sm font-medium text-slate-800">${contractor.contact || '—'}</span>
      </div>
    </div>
  `;
}

/**
 * Рендер договора
 */
function renderSurveyContract(contract) {
  const container = document.getElementById('survey-contract');
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
  
  const progress = contract.budget > 0 ? Math.round((contract.paid / contract.budget) * 100) : 0;
  
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
        <span class="text-sm text-slate-500">Сумма:</span>
        <span class="text-sm font-medium text-slate-800">${UI.formatMoney(contract.budget)}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-sm text-slate-500">Выплачено:</span>
        <span class="text-sm font-medium text-slate-800">${UI.formatMoney(contract.paid)}</span>
      </div>
      
      <div class="mt-2">
        <div class="flex justify-between text-xs mb-1">
          <span class="text-slate-500">Прогресс оплаты</span>
          <span class="font-medium">${progress}%</span>
        </div>
        <div class="progress-bar" style="height: 6px;">
          <div 
            class="progress-bar-fill" 
            style="width: ${progress}%; background: ${UI.getProgressColor(progress)};"
          ></div>
        </div>
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
function renderSurveyFiles(files) {
  const container = document.getElementById('survey-files');
  if (!container) return;
  
  if (files.length === 0) {
    container.innerHTML = '<p class="text-sm text-slate-400">Файлы не загружены</p>';
    return;
  }
  
  const filesHtml = files.map(file => {
    const iconClass = getFileIconClass(file.type);
    return `
      <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
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
 * Рендер наблюдателей
 */
function renderSurveyObservers(observers) {
  const container = document.getElementById('survey-observers');
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
function renderSurveyComments(comments) {
  const container = document.getElementById('survey-comments');
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
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Рендер истории изменений
 */
function renderSurveyHistory(history) {
  const container = document.getElementById('survey-history');
  if (!container) return;
  
  if (!history || history.length === 0) {
    container.innerHTML = '<p class="text-slate-400">Нет записей</p>';
    return;
  }
  
  container.innerHTML = history.map(item => `
    <div class="flex gap-2">
      <span class="text-slate-400">${UI.formatDate(item.date, { day: '2-digit', month: '2-digit' })}</span>
      <span class="text-slate-600">${item.action}</span>
    </div>
  `).join('');
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
        const surveyId = getUrlParam('id');
        await api.post(`/surveys/${surveyId}/comments`, { text });
        UI.toast('Комментарий добавлен', 'success');
        loadSurvey(); // Перезагрузить
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
