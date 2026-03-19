/**
 * Скрипт для справочника типов контрагентов (13-4-settings-contractor-types.html)
 */

document.addEventListener('DOMContentLoaded', async () => {
  await initPage({ requireAuth: false, loadProfile: true });
  await loadContractorTypes();
  initModal();
});

async function loadContractorTypes() {
  try {
    UI.showLoading('#contractor-types-container');
    const types = await API.dictionaries.getContractorTypes();
    renderContractorTypes(types);
  } catch (error) {
    console.error('Ошибка загрузки типов:', error);
    UI.showError('#contractor-types-container', 'Не удалось загрузить типы');
  }
}

function renderContractorTypes(types) {
  const columns = [
    { field: 'code', label: 'Код' },
    { field: 'name', label: 'Название' },
    { field: 'requiredDocuments', label: 'Документы', render: (item) => `${item.requiredDocuments?.length || 0} шт.` },
    { field: 'active', label: 'Статус', type: 'status' },
  ];
  
  DictionaryUI.renderTable('contractor-types-container', types, columns, {
    actions: ['edit', 'deactivate'],
    addButton: { label: 'Добавить тип', action: 'openAddModal()' },
    onAction: 'handleContractorTypeAction',
  });
}

function initModal() {
  ModalUI.initModal({
    modalId: 'contractor-type-modal',
    openButtonSelector: '[data-action="add-contractor-type"]',
    closeSelectors: ['[data-close-modal]'],
    formId: 'contractor-type-form',
    validate: (data) => {
      const errors = [];
      if (!data.code) errors.push('Введите код типа');
      if (!data.name) errors.push('Введите название типа');
      return errors;
    },
    onSubmit: async (data) => {
      if (data.id) {
        await api.put(`/dictionaries/contractor-types/${data.id}`, data);
      } else {
        await api.post('/dictionaries/contractor-types', data);
      }
      loadContractorTypes();
    },
  });
}

window.openAddModal = () => ModalUI.open('contractor-type-modal', { autoFocus: true });

window.handleContractorTypeAction = async (type, id) => {
  if (type === 'edit') {
    const types = await API.dictionaries.getContractorTypes();
    const contractorType = types.find(t => t.id === id);
    if (contractorType) {
      ModalUI.open('contractor-type-modal');
      ModalUI.fillForm('contractor-type-form', contractorType);
    }
  } else if (type === 'deactivate') {
    if (!confirm('Деактивировать этот тип контрагента?')) return;
    await api.patch(`/dictionaries/contractor-types/${id}`, { active: false });
    loadContractorTypes();
  }
};
