/**
 * Скрипт для справочника изысканий (13-2-settings-surveys.html)
 */

document.addEventListener('DOMContentLoaded', async () => {
  await checkAuth();
  await loadSurveys();
  initModal();
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

async function loadSurveys() {
  try {
    UI.showLoading('#surveys-container');
    const surveys = await API.dictionaries.getSurveys();
    renderSurveys(surveys);
  } catch (error) {
    console.error('Ошибка загрузки изысканий:', error);
    UI.showError('#surveys-container', 'Не удалось загрузить изыскания');
  }
}

function renderSurveys(surveys) {
  const columns = [
    { field: 'color', label: '', type: 'color' },
    { field: 'code', label: 'Код' },
    { field: 'name', label: 'Название' },
    { field: 'active', label: 'Статус', type: 'status' },
  ];
  
  DictionaryUI.renderTable('surveys-container', surveys, columns, {
    actions: ['edit', 'deactivate'],
    addButton: { label: 'Добавить вид изысканий', action: 'openAddModal()' },
    onAction: 'handleSurveyAction',
  });
}

function initModal() {
  ModalUI.initModal({
    modalId: 'survey-modal',
    openButtonSelector: '[data-action="add-survey"]',
    closeSelectors: ['[data-close-modal]'],
    formId: 'survey-form',
    validate: (data) => {
      const errors = [];
      if (!data.code) errors.push('Введите код изыскания');
      if (!data.name) errors.push('Введите название изыскания');
      return errors;
    },
    onSubmit: async (data) => {
      if (data.id) {
        await api.put(`/dictionaries/surveys/${data.id}`, data);
      } else {
        await api.post('/dictionaries/surveys', data);
      }
      loadSurveys();
    },
  });
}

window.openAddModal = () => ModalUI.open('survey-modal', { autoFocus: true });

window.handleSurveyAction = async (type, id) => {
  if (type === 'edit') {
    const surveys = await API.dictionaries.getSurveys();
    const survey = surveys.find(s => s.id === id);
    if (survey) {
      ModalUI.open('survey-modal');
      ModalUI.fillForm('survey-form', survey);
    }
  } else if (type === 'deactivate') {
    if (!confirm('Деактивировать этот вид изысканий?')) return;
    await api.patch(`/dictionaries/surveys/${id}`, { active: false });
    loadSurveys();
  }
};
