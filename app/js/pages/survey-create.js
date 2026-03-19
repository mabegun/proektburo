/**
 * Скрипт для страницы создания изыскания (15-survey-create.html)
 */

document.addEventListener('DOMContentLoaded', async () => {
  await initPage({ requireAuth: false, loadProfile: true });
  await loadDictionaries();
  initForm();
});

async function loadDictionaries() {
  try {
    const [surveyTypes, employees, contractors] = await Promise.all([
      API.dictionaries.getSurveys(),
      API.employees.getList(),
      api.get('/contractors'),
    ]);
    
    renderTypeSelect(surveyTypes);
    renderEmployeeSelect(employees);
    renderContractorSelect(contractors);
  } catch (error) {
    console.error('Ошибка загрузки справочников:', error);
  }
}

function renderTypeSelect(types) {
  const select = document.getElementById('type-select');
  if (!select) return;
  select.innerHTML = `<option value="">Выберите тип изыскания</option>${types.map(t => `<option value="${t.code}">${t.name}</option>`).join('')}`;
}

function renderEmployeeSelect(employees) {
  const select = document.getElementById('responsible-select');
  if (!select) return;
  select.innerHTML = `<option value="">Выберите ответственного</option>${employees.map(e => `<option value="${e.id}">${e.name}</option>`).join('')}`;
}

function renderContractorSelect(contractors) {
  const select = document.getElementById('contractor-select');
  if (!select) return;
  select.innerHTML = `<option value="">Выберите исполнителя (юрлицо)</option>${contractors.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}`;
}

function initForm() {
  const form = document.getElementById('survey-form');
  const fileInput = document.getElementById('contract-file-input');
  const filePreview = document.getElementById('contract-file-preview');
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
      type: formData.get('type'),
      responsibleId: formData.get('responsible'),
      deadline: formData.get('deadline'),
      budget: parseFloat(formData.get('budget')),
      contractorId: formData.get('contractor'),
      comment: formData.get('comment'),
    };
    
    try {
      setLoading(true);
      const survey = await API.surveys.create(data);
      
      if (selectedFile) {
        const fileFormData = new FormData();
        fileFormData.append('file', selectedFile);
        await api.post(`/surveys/${survey.id}/contract-file`, fileFormData);
      }
      
      UI.toast('Изыскание успешно создано', 'success');
      setTimeout(() => {
        window.location.href = `14-survey-detail.html?id=${survey.id}`;
      }, 500);
    } catch (error) {
      UI.toast(error.message || 'Ошибка при создании изыскания', 'error');
    } finally {
      setLoading(false);
    }
  });
}

function setLoading(loading) {
  const submitBtn = document.getElementById('submit-btn');
  if (submitBtn) {
    submitBtn.disabled = loading;
    submitBtn.innerHTML = loading ? '<span class="animate-spin">⏳</span> Создание...' : 'Создать изыскание';
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
