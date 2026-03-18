/**
 * Скрипт для страницы замечания экспертизы (16-expertise-comment.html)
 */

document.addEventListener('DOMContentLoaded', async () => {
  await checkAuth();
  await loadExpertiseComment();
  initActions();
});

async function checkAuth() {
  if (!getAuthToken()) window.location.href = '01-login.html';
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
  profileEl.innerHTML = `<div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50"><div class="avatar bg-gradient-to-br from-slate-700 to-slate-500 text-white">${initials}</div><div class="flex-1 min-w-0"><p class="font-semibold text-slate-800 truncate">${user.name}</p><p class="text-xs text-slate-500">${getUserRoleText(user.role)}</p></div></div>`;
}

function getUserRoleText(role) {
  const map = { 'director': 'Директор', 'gip': 'ГИП', 'employee': 'Сотрудник' };
  return map[role] || role;
}

async function loadExpertiseComment() {
  try {
    const expertiseId = getUrlParam('id');
    if (!expertiseId) { UI.showError('#expertise-content', 'Не указан ID замечания'); return; }
    
    UI.showLoading('#expertise-content');
    const [expertise, history] = await Promise.all([API.expertise.getById(expertiseId), api.get(`/expertise/${expertiseId}/history`)]);
    renderExpertiseInfo(expertise);
    renderExpertiseFile(expertise.file);
    renderHistory(history);
  } catch (error) {
    console.error('Ошибка загрузки замечания:', error);
    UI.showError('#expertise-content', 'Не удалось загрузить замечание');
  }
}

function renderExpertiseInfo(expertise) {
  const container = document.getElementById('expertise-info');
  if (!container) return;
  
  const statusClass = getExpertiseStatusClass(expertise.status);
  const statusText = getExpertiseStatusText(expertise.status);
  const priorityClass = getPriorityClass(expertise.priority);
  const isOverdue = expertise.deadline && new Date(expertise.deadline) < new Date();
  
  container.innerHTML = `
    <div class="grid grid-cols-2 gap-4">
      <div><p class="text-sm text-slate-500">Номер замечания</p><p class="font-medium text-slate-800 font-mono">№${expertise.number}</p></div>
      <div><p class="text-sm text-slate-500">Статус</p><p class="font-medium"><span class="badge ${statusClass}">${statusText}</span></p></div>
      <div><p class="text-sm text-slate-500">Приоритет</p><p class="font-medium"><span class="badge ${priorityClass}">${getPriorityText(expertise.priority)}</span></p></div>
      <div><p class="text-sm text-slate-500">Раздел/Изыскание</p><p class="font-medium text-slate-800">${expertise.sectionCode || expertise.surveyCode}</p></div>
      <div><p class="text-sm text-slate-500">Исполнитель</p><p class="font-medium text-slate-800">${expertise.assignee?.name || 'Не назначен'}</p></div>
      <div><p class="text-sm text-slate-500">Дедлайн</p><p class="font-medium ${isOverdue ? 'text-red-600' : ''}">${UI.formatDate(expertise.deadline)}</p></div>
    </div>
    <div class="mt-4"><p class="text-sm text-slate-700 leading-relaxed">${expertise.text}</p></div>
  `;
}

function renderExpertiseFile(file) {
  const container = document.getElementById('expertise-file');
  if (!container) return;
  if (!file) { container.innerHTML = '<p class="text-sm text-slate-400">Файл не прикреплён</p>'; return; }
  
  container.innerHTML = `<div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200"><div class="flex items-center gap-3"><div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">${UI.getEntityIcon('file', 'w-6 h-6 text-red-600')}</div><div><p class="font-medium text-slate-700">${file.name}</p><p class="text-sm text-slate-400">${formatFileSize(file.size)}</p></div></div><a href="${file.url}" download class="btn-secondary text-sm py-2 px-3">Скачать</a></div>`;
}

function renderHistory(history) {
  const container = document.getElementById('expertise-history');
  if (!container) return;
  if (history.length === 0) { container.innerHTML = '<p class="text-sm text-slate-400">История пуста</p>'; return; }
  
  container.innerHTML = history.map(event => `<div class="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0"><div class="w-2 h-2 rounded-full bg-slate-400 mt-2"></div><div class="flex-1"><p class="text-sm text-slate-700">${event.description}</p><p class="text-xs text-slate-400">${formatEventTime(event.createdAt)}</p></div></div>`).join('');
}

function initActions() {
  const replyForm = document.getElementById('reply-form');
  replyForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = e.target.querySelector('textarea')?.value.trim();
    if (text) {
      try {
        const expertiseId = getUrlParam('id');
        await API.expertise.reply(expertiseId, text);
        UI.toast('Ответ отправлен', 'success');
        loadExpertiseComment();
      } catch (error) {
        UI.toast('Ошибка при отправке ответа', 'error');
      }
    }
  });
  
  document.getElementById('save-draft-btn')?.addEventListener('click', () => saveDraft('draft'));
  document.getElementById('send-review-btn')?.addEventListener('click', () => saveDraft('review'));
  document.getElementById('close-expertise-btn')?.addEventListener('click', () => updateStatus('closed'));
  document.getElementById('reject-expertise-btn')?.addEventListener('click', () => updateStatus('rejected'));
}

async function saveDraft(status) {
  const text = document.getElementById('reply-text')?.value.trim();
  if (!text) { UI.toast('Введите текст ответа', 'warning'); return; }
  try {
    const expertiseId = getUrlParam('id');
    await API.expertise.update(expertiseId, { status, replyText: text });
    UI.toast('Черновик сохранён', 'success');
  } catch (error) {
    UI.toast('Ошибка при сохранении', 'error');
  }
}

async function updateStatus(status) {
  try {
    const expertiseId = getUrlParam('id');
    await API.expertise.update(expertiseId, { status });
    UI.toast(`Статус обновлён: ${getExpertiseStatusText(status)}`, 'success');
    loadExpertiseComment();
  } catch (error) {
    UI.toast('Ошибка при обновлении статуса', 'error');
  }
}

function getExpertiseStatusClass(status) {
  const map = { 'created': 'status-not-started', 'in-progress': 'status-in-progress', 'review': 'status-revision', 'closed': 'status-completed', 'rejected': 'status-overdue' };
  return map[status] || 'status-not-started';
}

function getExpertiseStatusText(status) {
  const map = { 'created': 'Создано', 'in-progress': 'В работе', 'review': 'На проверке', 'closed': 'Закрыто', 'rejected': 'Отклонено' };
  return map[status] || status;
}

function getPriorityClass(priority) {
  const map = { 'critical': 'priority-critical', 'high': 'priority-high', 'medium': 'priority-medium', 'low': 'priority-low' };
  return map[priority] || 'priority-low';
}

function getPriorityText(priority) {
  const map = { 'critical': 'Критичный', 'high': 'Высокий', 'medium': 'Средний', 'low': 'Низкий' };
  return map[priority] || priority;
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function formatEventTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Только что';
  if (minutes < 60) return `${minutes} мин. назад`;
  return UI.formatDate(dateString);
}
