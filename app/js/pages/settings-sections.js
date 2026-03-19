/**
 * Скрипт для справочника разделов (13-1-settings-sections.html)
 * Использует универсальный компонент DictionaryUI
 */

document.addEventListener('DOMContentLoaded', async () => {
  await initPage({ requireAuth: false, loadProfile: true });
  await loadSections();
  initModal();
});

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
