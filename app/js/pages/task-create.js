/**
 * Скрипт для страницы создания задачи (08-task-create.html)
 */

document.addEventListener('DOMContentLoaded', async () => {
  await initPage({ requireAuth: false, loadProfile: true });
  await loadDictionaries();
  initForm();
});

/**
 * Загрузка справочников
 */
async function loadDictionaries() {
  try {
    const [projectsRes, employeesRes] = await Promise.all([
      API.projects.getList({ limit: 100 }),
      API.employees.getList(),
    ]);

    renderProjectSelect(projectsRes);
    renderEmployeeSelect(employeesRes);

  } catch (error) {
    console.error('Ошибка загрузки справочников:', error);
  }
}

/**
 * Рендер селекта проектов
 */
function renderProjectSelect(projectsRes) {
  const select = document.getElementById('project-select');
  if (!select) return;

  const projects = projectsRes.items || projectsRes;

  select.innerHTML = `
    <option value="">Выберите проект</option>
    ${projects.map(project => `
      <option value="${project.id}">${project.code} — ${project.name}</option>
    `).join('')}
  `;

  // При выборе проекта загружаем разделы
  select.addEventListener('change', async (e) => {
    const projectId = e.target.value;
    if (projectId) {
      try {
        const project = await API.projects.getById(projectId);
        renderSectionSelectForProject(project.sections || []);
      } catch (err) {
        console.error('Ошибка загрузки разделов:', err);
        renderSectionSelectForProject([]);
      }
    } else {
      renderSectionSelectForProject([]);
    }
  });
}

/**
 * Рендер селекта разделов для проекта
 */
function renderSectionSelectForProject(sections) {
  const select = document.getElementById('section-select');
  if (!select) return;

  select.innerHTML = `
    <option value="">Без раздела</option>
    ${sections.map(section => `
      <option value="${section.id}">${section.code} — ${section.name}</option>
    `).join('')}
  `;
}

/**
 * Рендер селекта исполнителей
 */
function renderEmployeeSelect(employeesRes) {
  const select = document.getElementById('assignee-select');
  if (!select) return;

  const employees = employeesRes.items || employeesRes;

  select.innerHTML = `
    <option value="">Выберите исполнителя</option>
    ${employees.filter(e => e.active !== false).map(emp => `
      <option value="${emp.id}">${emp.name} — ${emp.position || emp.role}</option>
    `).join('')}
  `;
}

/**
 * Инициализация формы
 */
function initForm() {
  const form = document.getElementById('task-form');

  // Обработка отправки формы
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const projectId = formData.get('project');
    const assigneeId = formData.get('assignee');

    // Валидация
    if (!projectId) {
      UI.toast('Выберите проект', 'error');
      return;
    }
    if (!assigneeId) {
      UI.toast('Выберите исполнителя', 'error');
      return;
    }

    const taskData = {
      title: formData.get('title'),
      description: formData.get('description'),
      projectId: parseInt(projectId),
      sectionId: formData.get('section') ? parseInt(formData.get('section')) : null,
      assigneeId: parseInt(assigneeId),
      deadline: formData.get('due-date'),
      priority: formData.get('priority') || 'medium',
    };

    try {
      setLoading(true);

      const task = await API.tasks.create(taskData);

      UI.toast('Задача успешно создана', 'success');
      setTimeout(() => {
        window.location.href = '07-tasks-list.html';
      }, 500);

    } catch (error) {
      console.error('Ошибка создания задачи:', error);
      UI.toast(error.message || 'Ошибка при создании задачи', 'error');
    } finally {
      setLoading(false);
    }
  });
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
      : 'Создать задачу';
  }
}
