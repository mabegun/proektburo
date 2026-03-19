/**
 * Скрипт для страницы создания проекта (05-project-create.html)
 */

document.addEventListener('DOMContentLoaded', async () => {
  await initPage({ requireAuth: false, loadProfile: true });
  await loadDictionaries();
  initForm();
});

/**
 * Обновление профиля в сайдбаре
 */

/**
 * Загрузка справочников
 */
async function loadDictionaries() {
  try {
    const [sections, surveys, employees, projectTypes, statuses] = await Promise.all([
      API.dictionaries.getSections(),
      API.dictionaries.getSurveys(),
      API.employees.getList({ role: 'gip' }),
      API.dictionaries.getProjectStatuses(),
      API.dictionaries.getProjectTypes(),
    ]);
    
    renderSectionCheckboxes(sections);
    renderSurveyCheckboxes(surveys);
    renderGipSelect(employees);
    renderProjectTypeSelect(projectTypes);
    renderStatusSelect(statuses);
    
  } catch (error) {
    console.error('Ошибка загрузки справочников:', error);
  }
}

/**
 * Рендер чекбоксов разделов
 */
function renderSectionCheckboxes(sections) {
  const container = document.getElementById('sections-list');
  if (!container) return;

  const list = sections.items || sections;

  container.innerHTML = list.filter(s => s.active !== false).map(section => `
    <label class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
      <input type="checkbox" name="sections" value="${section.code}" class="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500">
      <span class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style="background: ${section.color || '#64748b'}">
        ${section.code}
      </span>
      <span class="text-sm font-medium text-slate-700">${section.name}</span>
    </label>
  `).join('');
}

/**
 * Рендер чекбоксов изысканий
 */
function renderSurveyCheckboxes(surveys) {
  const container = document.getElementById('surveys-list');
  if (!container) return;

  const list = surveys.items || surveys;

  container.innerHTML = list.filter(s => s.active !== false).map(survey => `
    <label class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
      <input type="checkbox" name="surveys" value="${survey.code}" class="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500">
      <span class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style="background: ${survey.color || '#64748b'}">
        ${survey.code}
      </span>
      <span class="text-sm font-medium text-slate-700">${survey.name}</span>
    </label>
  `).join('');
}

/**
 * Рендер селекта ГИП
 */
function renderGipSelect(employees) {
  const select = document.getElementById('project-gip');
  if (!select) return;

  // Если employees - это объект с items
  const list = employees.items || employees;

  select.innerHTML = `
    <option value="">Выберите ГИПа</option>
    ${list.filter(emp => emp.role === 'gip').map(emp => `
      <option value="${emp.id}">${emp.name}</option>
    `).join('')}
    ${list.length === 0 ? '<option value="" disabled>Нет доступных ГИПов</option>' : ''}
  `;
}

/**
 * Рендер селекта типа проекта
 */
function renderProjectTypeSelect(types) {
  const select = document.getElementById('project-type');
  if (!select) return;

  const list = types.items || types;

  select.innerHTML = `
    <option value="">Выберите тип</option>
    ${list.map(type => `
      <option value="${type.code}">${type.name}</option>
    `).join('')}
  `;
}

/**
 * Рендер селекта статуса
 */
function renderStatusSelect(statuses) {
  const select = document.getElementById('project-status');
  if (!select) return;

  const list = statuses.items || statuses;

  select.innerHTML = list.map(status => `
    <option value="${status.code}">${status.name}</option>
  `).join('');
}

/**
 * Инициализация формы
 */
function initForm() {
  const form = document.getElementById('project-create-form');
  const fileInput = document.getElementById('files-input');
  const filesList = document.getElementById('files-list');
  const selectedFiles = [];
  
  // Обработка выбора файлов
  fileInput?.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      selectedFiles.push(file);
      renderFileList(selectedFiles);
    });
  });
  
  // Обработка отправки формы
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const projectData = {
      code: formData.get('code'),
      name: formData.get('name'),
      address: formData.get('address'),
      type: formData.get('type'),
      customer: formData.get('customer'),
      startDate: formData.get('start-date'),
      deadline: formData.get('deadline'),
      area: formData.get('area'),
      floors: formData.get('floors'),
      gipId: formData.get('gip'),
      description: formData.get('description'),
      sections: formData.getAll('sections'),
      surveys: formData.getAll('surveys'),
      status: formData.get('status'),
    };
    
    try {
      setLoading(true);
      
      // Создание проекта
      const project = await API.projects.create(projectData);
      
      // Загрузка файлов (если есть)
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const fileFormData = new FormData();
          fileFormData.append('file', file);
          fileFormData.append('projectId', project.id);
          await api.post('/files/upload', fileFormData);
        }
      }
      
      UI.toast('Проект успешно создан', 'success');
      setTimeout(() => {
        window.location.href = `04-project-detail.html?id=${project.id}`;
      }, 500);
      
    } catch (error) {
      console.error('Ошибка создания проекта:', error);
      UI.toast(error.message || 'Ошибка при создании проекта', 'error');
    } finally {
      setLoading(false);
    }
  });
}

/**
 * Рендер списка файлов
 */
function renderFileList(files) {
  const container = document.getElementById('files-list');
  if (!container) return;
  
  container.innerHTML = files.map((file, index) => `
    <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <p class="text-sm font-medium text-slate-700">${file.name}</p>
          <p class="text-xs text-slate-400">${formatFileSize(file.size)}</p>
        </div>
      </div>
      <button type="button" class="text-slate-400 hover:text-red-600" onclick="removeFile(${index})">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  `).join('');
}

/**
 * Удаление файла из списка
 */
function removeFile(index) {
  const filesList = document.getElementById('files-list');
  const fileInput = document.getElementById('files-input');
  
  // Удаляем файл из массива (нужно сохранить в глобальной переменной)
  // Для простоты перерисовываем список
  filesList.children[index]?.remove();
}

/**
 * Форматирование размера файла
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Установка режима загрузки
 */
function setLoading(loading) {
  const submitBtn = document.getElementById('submit-btn');
  if (submitBtn) {
    submitBtn.disabled = loading;
    submitBtn.innerHTML = loading 
      ? '<span class="animate-spin">⏳</span> Создание...' 
      : 'Создать проект';
  }
}
