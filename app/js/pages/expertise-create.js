/**
 * Скрипт для страницы создания замечания (14-4-expertise-create.html)
 */

document.addEventListener('DOMContentLoaded', async () => {
  await initPage({ requireAuth: false, loadProfile: true });
  await loadDictionaries();
  initForm();
});

async function loadDictionaries() {
  try {
    const [sections, surveys, employees, priorities] = await Promise.all([
      API.dictionaries.getSections(),
      API.dictionaries.getSurveys(),
      API.employees.getList(),
      API.dictionaries.getTaskPriorities(),
    ]);
    
    const surveyId = getUrlParam('survey');
    const sectionId = getUrlParam('section');
    
    if (surveyId) {
      renderSurveySelect(surveys.filter(s => s.id === surveyId));
    } else if (sectionId) {
      renderSectionSelect(sections.filter(s => s.id === sectionId));
    } else {
      renderSectionSelect(sections);
      renderSurveySelect(surveys);
    }
    
    renderEmployeeSelect(employees);
    renderPrioritySelect(priorities);
  } catch (error) {
    console.error('Ошибка загрузки справочников:', error);
  }
}

function renderSectionSelect(sections) {
  const select = document.getElementById('section-select');
  if (!select) return;
  select.innerHTML = `<option value="">Выберите раздел</option>${sections.map(s => `<option value="${s.id}">${s.code} — ${s.name}</option>`).join('')}`;
}

function renderSurveySelect(surveys) {
  const select = document.getElementById('survey-select');
  if (!select) return;
  select.innerHTML = `<option value="">Выберите изыскание</option>${surveys.map(s => `<option value="${s.id}">${s.code} — ${s.name}</option>`).join('')}`;
}

function renderEmployeeSelect(employees) {
  const select = document.getElementById('assignee-select');
  if (!select) return;
  select.innerHTML = `<option value="">Выберите исполнителя</option>${employees.map(e => `<option value="${e.id}">${e.name}</option>`).join('')}`;
}

function renderPrioritySelect(priorities) {
  const select = document.getElementById('priority-select');
  if (!select) return;
  select.innerHTML = priorities.map(p => `<option value="${p.code}">${p.name}</option>`).join('');
}

function initForm() {
  const form = document.getElementById('expertise-form');
  const fileInput = document.getElementById('file-input');
  const filePreview = document.getElementById('file-preview');
  let selectedFile = null;
  
  fileInput?.addEventListener('change', (e) => {
    selectedFile = e.target.files[0];
    if (selectedFile) {
      filePreview.innerHTML = `<div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"><div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">${UI.getEntityIcon('file', 'w-5 h-5')}</div><div class="flex-1"><p class="text-sm font-medium text-slate-700">${selectedFile.name}</p><p class="text-xs text-slate-400">${formatFileSize(selectedFile.size)}</p></div></div>`;
    }
  });
  
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = {
      number: formData.get('number'),
      sectionId: formData.get('section'),
      surveyId: formData.get('survey'),
      assigneeId: formData.get('assignee'),
      deadline: formData.get('deadline'),
      priority: formData.get('priority'),
      text: formData.get('text'),
    };
    
    try {
      setLoading(true);
      const expertise = await API.expertise.create(data);
      
      if (selectedFile) {
        const fileFormData = new FormData();
        fileFormData.append('file', selectedFile);
        await api.post(`/expertise/${expertise.id}/files`, fileFormData);
      }
      
      UI.toast('Замечание успешно создано', 'success');
      setTimeout(() => {
        window.location.href = expertise.sectionId ? `06-1-section-expertise.html?id=${expertise.sectionId}` : `14-3-survey-expertise.html?id=${expertise.surveyId}`;
      }, 500);
    } catch (error) {
      UI.toast(error.message || 'Ошибка при создании замечания', 'error');
    } finally {
      setLoading(false);
    }
  });
}

function setLoading(loading) {
  const submitBtn = document.getElementById('submit-btn');
  if (submitBtn) {
    submitBtn.disabled = loading;
    submitBtn.innerHTML = loading ? '<span class="animate-spin">⏳</span> Создание...' : 'Создать замечание';
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
