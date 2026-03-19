/**
 * Скрипт для справочника разделов (13-1-settings-sections.html)
 * Использует универсальный компонент DictionaryUI
 */

document.addEventListener('DOMContentLoaded', async () => {
  await checkAuth();
  await loadSections();
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

async function loadSections() {
  try {
    UI.showLoading('#sections-container');
    const sections = await API.dictionaries.getSections();
    renderSections(sections);
  } catch (error) {
    console.error('Ошибка загрузки разделов:', error);
    UI.showError('#sections-container', 'Не удалось загрузить разделы');
  }
}

function renderSections(sections) {
  const columns = [
    { field: 'color', label: '', type: 'color' },
    { field: 'code', label: 'Код' },
    { field: 'name', label: 'Название' },
    { field: 'active', label: 'Статус', type: 'status' },
  ];
  
  DictionaryUI.renderTable('sections-container', sections, columns, {
    actions: ['edit', 'deactivate'],
    addButton: { label: 'Добавить раздел', action: 'openAddModal()' },
    onAction: 'handleSectionAction',
  });
}

function initModal() {
  ModalUI.initModal({
    modalId: 'section-modal',
    openButtonSelector: '[data-action="add-section"]',
    closeSelectors: ['[data-close-modal]'],
    formId: 'section-form',
    validate: (data) => {
      const errors = [];
      if (!data.code) errors.push('Введите код раздела');
      if (!data.name) errors.push('Введите название раздела');
      return errors;
    },
    onSubmit: async (data) => {
      if (data.id) {
        await api.put(`/dictionaries/sections/${data.id}`, data);
      } else {
        await api.post('/dictionaries/sections', data);
      }
      loadSections();
    },
  });
}

window.openAddModal = () => {
  ModalUI.open('section-modal', { autoFocus: true });
};

window.handleSectionAction = async (type, id) => {
  if (type === 'edit') {
    const sections = await API.dictionaries.getSections();
    const section = sections.find(s => s.id === id);
    if (section) {
      ModalUI.open('section-modal');
      ModalUI.fillForm('section-form', section);
    }
  } else if (type === 'deactivate') {
    if (!confirm('Деактивировать этот раздел?')) return;
    await api.patch(`/dictionaries/sections/${id}`, { active: false });
    loadSections();
  }
};
