/**
 * Скрипт для справочника расходов (13-3-settings-expenses.html)
 */

document.addEventListener('DOMContentLoaded', async () => {
  await checkAuth();
  await loadExpenses();
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

async function loadExpenses() {
  try {
    UI.showLoading('#expenses-container');
    const expenses = await API.dictionaries.getExpenseCategories();
    renderExpenses(expenses);
  } catch (error) {
    console.error('Ошибка загрузки категорий:', error);
    UI.showError('#expenses-container', 'Не удалось загрузить категории');
  }
}

function renderExpenses(categories) {
  const columns = [
    { field: 'code', label: 'Код' },
    { field: 'name', label: 'Название' },
    { field: 'parentName', label: 'Родительская категория' },
    { field: 'active', label: 'Статус', type: 'status' },
  ];
  
  DictionaryUI.renderTable('expenses-container', categories, columns, {
    actions: ['edit', 'deactivate'],
    addButton: { label: 'Добавить категорию', action: 'openAddModal()' },
    onAction: 'handleExpenseAction',
  });
}

function initModal() {
  ModalUI.initModal({
    modalId: 'expense-modal',
    openButtonSelector: '[data-action="add-expense"]',
    closeSelectors: ['[data-close-modal]'],
    formId: 'expense-form',
    formFields: ModalUI.renderFields([
      { type: 'text', name: 'code', label: 'Код', required: true },
      { type: 'text', name: 'name', label: 'Название', required: true },
      { type: 'select', name: 'parentId', label: 'Родительская категория', options: [], placeholder: 'Корневая категория' },
    ]),
    validate: (data) => {
      const errors = [];
      if (!data.code) errors.push('Введите код категории');
      if (!data.name) errors.push('Введите название категории');
      return errors;
    },
    onSubmit: async (data) => {
      if (data.id) {
        await api.put(`/dictionaries/expenses/${data.id}`, data);
      } else {
        await api.post('/dictionaries/expenses', data);
      }
      loadExpenses();
    },
  });
}

window.openAddModal = () => ModalUI.open('expense-modal', { autoFocus: true });

window.handleExpenseAction = async (type, id) => {
  if (type === 'edit') {
    const expenses = await API.dictionaries.getExpenseCategories();
    const expense = expenses.find(e => e.id === id);
    if (expense) {
      ModalUI.open('expense-modal');
      ModalUI.fillForm('expense-form', expense);
    }
  } else if (type === 'deactivate') {
    if (!confirm('Деактивировать эту категорию?')) return;
    await api.patch(`/dictionaries/expenses/${id}`, { active: false });
    loadExpenses();
  }
};
