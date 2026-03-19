/**
 * Скрипт для страницы создания сотрудника (10-employee-create.html)
 */

document.addEventListener('DOMContentLoaded', async () => {
  await checkAuth();
  await loadDictionaries();
  initForm();
});

/**
 * Проверка авторизации
 */
async function checkAuth() {
  if (!getAuthToken()) {
    window.location.href = '01-login.html';
  }
  
  try {
    const user = await API.auth.getCurrentUser();
    updateUserProfile(user);
  } catch (error) {
    removeAuthToken();
    window.location.href = '01-login.html';
  }
}

/**
 * Обновление профиля в сайдбаре
 */
function updateUserProfile(user) {
  const profileEl = document.querySelector('.sidebar-profile');
  if (!profileEl) return;
  
  const initials = UI.getInitials(user.name);
  const role = getUserRoleText(user.role);
  
  profileEl.innerHTML = `
    <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
      <div class="avatar bg-gradient-to-br from-slate-700 to-slate-500 text-white">${initials}</div>
      <div class="flex-1 min-w-0">
        <p class="font-semibold text-slate-800 truncate">${user.name}</p>
        <p class="text-xs text-slate-500">${role}</p>
      </div>
    </div>
  `;
}

function getUserRoleText(role) {
  const map = {
    'director': 'Директор',
    'gip': 'ГИП',
    'employee': 'Сотрудник',
  };
  return map[role] || role;
}

/**
 * Загрузка справочников
 */
async function loadDictionaries() {
  try {
    const [departments, roles, contractorTypes] = await Promise.all([
      API.dictionaries.getDepartments(),
      API.dictionaries.getRoles(),
      API.dictionaries.getContractorTypes(),
    ]);
    
    renderDepartmentSelect(departments);
    renderRoleSelect(roles);
    renderContractorTypeSelect(contractorTypes);
    
  } catch (error) {
    console.error('Ошибка загрузки справочников:', error);
  }
}

/**
 * Рендер селекта отделов
 */
function renderDepartmentSelect(departments) {
  const select = document.getElementById('department-select');
  if (!select) return;
  
  select.innerHTML = `
    <option value="">Выберите отдел</option>
    ${departments.map(dept => `
      <option value="${dept.code}">${dept.name}</option>
    `).join('')}
  `;
}

/**
 * Рендер селекта ролей
 */
function renderRoleSelect(roles) {
  const select = document.getElementById('role-select');
  if (!select) return;
  
  select.innerHTML = roles.map(role => `
    <option value="${role.code}">${role.name}</option>
  `).join('');
}

/**
 * Рендер селекта типов контрагентов
 */
function renderContractorTypeSelect(types) {
  const select = document.getElementById('contractor-type-select');
  if (!select) return;
  
  select.innerHTML = types.map(type => `
    <option value="${type.code}">${type.name}</option>
  `).join('');
  
  // При выборе типа показываем подсказку о документах
  select.addEventListener('change', (e) => {
    const typeCode = e.target.value;
    const type = types.find(t => t.code === typeCode);
    showContractorHint(type);
  });
}

/**
 * Показ подсказки о документах
 */
function showContractorHint(type) {
  const container = document.getElementById('contractor-hint');
  if (!container) return;
  
  if (!type) {
    container.innerHTML = '';
    return;
  }
  
  container.innerHTML = `
    <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <p class="text-sm font-medium text-blue-800 mb-2">
        📋 Для типа "${type.name}" потребуются:
      </p>
      <ul class="text-sm text-blue-700 space-y-1">
        ${type.requiredDocuments.map(doc => `
          <li class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            ${doc}
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}

/**
 * Инициализация формы
 */
function initForm() {
  const form = document.getElementById('employee-form');
  
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const employeeData = {
      name: formData.get('name'),
      position: formData.get('position'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      department: formData.get('department'),
      role: formData.get('role'),
      contractorType: formData.get('contractor-type'),
      competencies: formData.getAll('competencies'),
    };
    
    try {
      setLoading(true);
      
      const employee = await API.employees.create(employeeData);
      
      UI.toast('Сотрудник успешно добавлен', 'success');
      setTimeout(() => {
        window.location.href = `09-employees-list.html?id=${employee.id}`;
      }, 500);
      
    } catch (error) {
      console.error('Ошибка создания сотрудника:', error);
      UI.toast(error.message || 'Ошибка при создании сотрудника', 'error');
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
      : 'Добавить исполнителя';
  }
}
