/**
 * Скрипт для страницы сотрудников (09-employees-list.html)
 */

document.addEventListener('DOMContentLoaded', async () => {
  await initPage({ requireAuth: false, loadProfile: true });
  await loadEmployees();
  await loadPaymentsSummary();
  initFilters();
});

/**
 * Обновление профиля в сайдбаре
 */

/**
 * Загрузка сотрудников
 */
async function loadEmployees() {
  try {
    UI.showLoading('#employees-container');
    
    const params = {
      search: getUrlParam('search') || '',
      department: getUrlParam('department') || '',
      role: getUrlParam('role') || '',
      contractor_type: getUrlParam('contractor_type') || '',
    };
    
    const data = await API.employees.getList(params);
    renderEmployees(data.items || data);
    
  } catch (error) {
    console.error('Ошибка загрузки сотрудников:', error);
    UI.showError('#employees-container', 'Не удалось загрузить сотрудников');
  }
}

/**
 * Рендер списка сотрудников
 */
function renderEmployees(employees) {
  const container = document.getElementById('employees-container');
  if (!container) return;
  
  if (!employees || employees.length === 0) {
    UI.showEmpty('#employees-container', 'Нет сотрудников для отображения', '👤');
    return;
  }
  
  const html = employees.map(employee => {
    const contractorTypeClass = getContractorTypeClass(employee.contractorType);
    const contractorTypeText = getContractorTypeText(employee.contractorType);
    
    return `
      <div class="card p-6">
        <div class="flex items-start gap-4 mb-4">
          <div class="avatar-lg bg-gradient-to-br from-slate-700 to-slate-500 text-white">
            ${UI.getInitials(employee.name)}
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-slate-800">${employee.name}</h3>
            <p class="text-sm text-slate-500">${employee.position} / ${employee.role}</p>
            <div class="flex gap-2 mt-1">
              <span class="badge ${contractorTypeClass} text-xs">${contractorTypeText}</span>
              ${employee.department ? `<span class="badge bg-slate-100 text-slate-600 text-xs">${employee.department}</span>` : ''}
            </div>
          </div>
        </div>
        
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-slate-500">Email:</span>
            <span class="text-slate-700">${employee.email}</span>
          </div>
          ${employee.phone ? `
            <div class="flex justify-between">
              <span class="text-slate-500">Телефон:</span>
              <span class="text-slate-700">${employee.phone}</span>
            </div>
          ` : ''}
          <div class="flex justify-between">
            <span class="text-slate-500">Проектов:</span>
            <span class="text-slate-700">${employee.projectsCount || 0}</span>
          </div>
        </div>
        
        <!-- Выплаты -->
        ${employee.payments ? `
          <div class="border-t border-slate-100 mt-4 pt-4">
            <div class="flex justify-between items-center mb-2">
              <span class="text-xs text-slate-500">Выплаты</span>
              <span class="text-xs font-medium text-slate-700">
                ${UI.formatMoney(employee.payments.paid || 0)} / ${UI.formatMoney(employee.payments.total || 0)}
              </span>
            </div>
            <div class="progress-bar" style="height: 6px;">
              <div 
                class="progress-bar-fill" 
                style="width: ${employee.payments.progress || 0}%; background: ${UI.getProgressColor(employee.payments.progress || 0)};"
              ></div>
            </div>
          </div>
        ` : ''}
        
        <!-- Действия -->
        <div class="flex gap-2 mt-4 pt-4 border-t border-slate-100">
          <a href="10-employee-create.html?id=${employee.id}" class="btn-secondary text-sm py-2 px-3">
            Редактировать
          </a>
          <button class="btn-secondary text-sm py-2 px-3 text-red-600 hover:text-red-700" onclick="deleteEmployee(${employee.id})">
            Удалить
          </button>
        </div>
      </div>
    `;
  }).join('');
  
  container.innerHTML = html;
}

function getContractorTypeClass(type) {
  const map = {
    'employee': 'bg-slate-100 text-slate-600',
    'ip': 'bg-blue-100 text-blue-700',
    'self-employed': 'bg-green-100 text-green-700',
    'gpkh': 'bg-amber-100 text-amber-700',
    'ooo': 'bg-purple-100 text-purple-700',
  };
  return map[type] || 'bg-slate-100 text-slate-600';
}

function getContractorTypeText(type) {
  const map = {
    'employee': 'Сотрудник',
    'ip': 'ИП',
    'self-employed': 'Самозанятый',
    'gpkh': 'ГПХ',
    'ooo': 'ООО',
  };
  return map[type] || type;
}

/**
 * Загрузка сводки по выплатам
 */
async function loadPaymentsSummary() {
  try {
    const summary = await api.get('/employees/payments/summary');
    renderPaymentsSummary(summary);
  } catch (error) {
    console.error('Ошибка загрузки сводки:', error);
  }
}

/**
 * Рендер сводки по выплатам
 */
function renderPaymentsSummary(summary) {
  const container = document.getElementById('payments-summary');
  if (!container) return;
  
  container.innerHTML = `
    <div class="card-static p-4">
      <div class="text-sm text-slate-500 mb-1">Выплачено</div>
      <div class="text-2xl font-bold text-slate-800">${UI.formatMoney(summary.paid || 0)}</div>
      <div class="text-xs text-slate-400 mt-1">${summary.employeesCount || 0} исполнителей</div>
    </div>
    <div class="card-static p-4">
      <div class="text-sm text-slate-500 mb-1">В работе</div>
      <div class="text-2xl font-bold text-blue-600">${UI.formatMoney(summary.inProgress || 0)}</div>
      <div class="text-xs text-slate-400 mt-1">${summary.pendingCount || 0} выплат ожидают</div>
    </div>
    <div class="card-static p-4">
      <div class="text-sm text-slate-500 mb-1">Ожидают документов</div>
      <div class="text-2xl font-bold text-amber-600">${UI.formatMoney(summary.awaitingDocs || 0)}</div>
      <div class="text-xs text-slate-400 mt-1">${summary.awaitingDocsCount || 0} выплат</div>
    </div>
    <div class="card-static p-4">
      <div class="text-sm text-slate-500 mb-1">Просрочено</div>
      <div class="text-2xl font-bold text-red-600">${UI.formatMoney(summary.overdue || 0)}</div>
      <div class="text-xs ${summary.overdue === 0 ? 'text-green-500' : 'text-slate-400'} mt-1">
        ${summary.overdue === 0 ? 'Всё в порядке' : summary.overdueCount + ' выплат'}
      </div>
    </div>
  `;
}

/**
 * Инициализация фильтров
 */
function initFilters() {
  const searchInput = document.querySelector('input[placeholder*="Поиск"]');
  const departmentSelect = document.querySelectorAll('select')[0];
  const roleSelect = document.querySelectorAll('select')[1];
  const typeSelect = document.querySelectorAll('select')[2];
  
  if (searchInput) {
    searchInput.value = getUrlParam('search') || '';
    searchInput.addEventListener('change', applyFilters);
  }
  
  if (departmentSelect) {
    departmentSelect.value = getUrlParam('department') || '';
    departmentSelect.addEventListener('change', applyFilters);
  }
  
  if (roleSelect) {
    roleSelect.value = getUrlParam('role') || '';
    roleSelect.addEventListener('change', applyFilters);
  }
  
  if (typeSelect) {
    typeSelect.value = getUrlParam('contractor_type') || '';
    typeSelect.addEventListener('change', applyFilters);
  }
}

/**
 * Применение фильтров
 */
function applyFilters() {
  const searchInput = document.querySelector('input[placeholder*="Поиск"]');
  const departmentSelect = document.querySelectorAll('select')[0];
  const roleSelect = document.querySelectorAll('select')[1];
  const typeSelect = document.querySelectorAll('select')[2];
  
  const params = new URLSearchParams({
    search: searchInput?.value || '',
    department: departmentSelect?.value || '',
    role: roleSelect?.value || '',
    contractor_type: typeSelect?.value || '',
  });
  
  window.location.href = `09-employees-list.html?${params}`;
}

/**
 * Удаление сотрудника
 */
async function deleteEmployee(id) {
  if (!confirm('Вы уверены, что хотите удалить этого сотрудника?')) return;
  
  try {
    await API.employees.delete(id);
    UI.toast('Сотрудник удалён', 'success');
    loadEmployees();
  } catch (error) {
    UI.toast('Ошибка при удалении', 'error');
  }
}
