/**
 * Скрипт для страницы изыскания для наблюдателя (14-1-survey-detail-observer.html)
 */

document.addEventListener('DOMContentLoaded', async () => {
  await checkAuth();
  await loadSurvey();
});

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
  const map = { 'director': 'Директор', 'gip': 'ГИП', 'employee': 'Сотрудник' };
  return map[role] || role;
}

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

function renderSurvey(survey) {
  renderSurveyInfo(survey);
  renderSurveyFiles(survey.files || []);
  renderSurveyComments(survey.comments || []);
  renderAccessInfo();
}

function renderSurveyInfo(survey) {
  const container = document.getElementById('survey-info');
  if (!container) return;
  
  const statusClass = UI.getSurveyStatusClass(survey.status);
  const statusText = UI.getSurveyStatusText(survey.status);
  
  container.innerHTML = `
    <div class="grid grid-cols-2 gap-4">
      <div><p class="text-sm text-slate-500">Код изыскания</p><p class="font-medium text-slate-800 font-mono">${survey.code}</p></div>
      <div><p class="text-sm text-slate-500">Статус</p><p class="font-medium"><span class="badge ${statusClass}">${statusText}</span></p></div>
      <div><p class="text-sm text-slate-500">Тип изыскания</p><p class="font-medium text-slate-800">${survey.typeName}</p></div>
      <div><p class="text-sm text-slate-500">Ответственный</p><p class="font-medium text-slate-800">${survey.responsible?.name || 'Не назначен'}</p></div>
      <div><p class="text-sm text-slate-500">Дедлайн</p><p class="font-medium ${getDeadlineClass(survey.deadline)}">${UI.formatDate(survey.deadline)}</p></div>
      <div><p class="text-sm text-slate-500">Прогресс</p><p class="font-medium text-slate-800">${survey.progress || 0}%</p></div>
    </div>
  `;
}

function renderSurveyFiles(files) {
  const container = document.getElementById('survey-files');
  if (!container) return;
  
  if (files.length === 0) {
    container.innerHTML = '<p class="text-sm text-slate-400">Файлы не загружены</p>';
    return;
  }
  
  container.innerHTML = files.map(file => `
    <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 ${getFileIconClass(file.type)} rounded-lg flex items-center justify-center">${UI.getEntityIcon('file', 'w-5 h-5')}</div>
        <div>
          <p class="text-sm font-medium text-slate-700">${file.name}</p>
          <p class="text-xs text-slate-400">${file.uploadedBy} • ${UI.formatDate(file.uploadedAt)}</p>
        </div>
      </div>
      <a href="${file.url}" download class="text-slate-400 hover:text-blue-600">${UI.getEntityIcon('file', 'w-5 h-5')}</a>
    </div>
  `).join('');
}

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
        <div class="avatar w-10 h-10 bg-blue-600 text-white">${UI.getInitials(comment.author.name)}</div>
        <div class="flex-1">
          <p class="font-medium text-slate-800">${comment.author.name}</p>
          <p class="text-xs text-slate-400">${formatCommentTime(comment.createdAt)}</p>
          <p class="text-sm text-slate-700 mt-2">${comment.text}</p>
        </div>
      </div>
    </div>
  `).join('');
}

function renderAccessInfo() {
  const container = document.getElementById('access-info');
  if (!container) return;
  
  container.innerHTML = `
    <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <h3 class="font-semibold text-blue-800 mb-2">👁️ Режим наблюдателя</h3>
      <ul class="text-sm text-blue-700 space-y-1">
        <li>✓ Просмотр информации об изыскании</li>
        <li>✓ Просмотр файлов</li>
        <li>✓ Участие в обсуждении</li>
        <li class="text-blue-400">✗ Редактирование изыскания</li>
        <li class="text-blue-400">✗ Загрузка файлов</li>
      </ul>
    </div>
  `;
}

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

function getFileIconClass(type) {
  const map = { 'pdf': 'bg-red-100 text-red-600', 'dwg': 'bg-blue-100 text-blue-600', 'zip': 'bg-green-100 text-green-600' };
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
