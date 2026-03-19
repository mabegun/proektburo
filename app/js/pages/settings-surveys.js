/**
 * Скрипт для справочника изысканий (13-2-settings-surveys.html)
 */

document.addEventListener('DOMContentLoaded', async () => {
  await initPage({ requireAuth: false, loadProfile: true });
  await loadSurveys();
  initModal();
});

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
