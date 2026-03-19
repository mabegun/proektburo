/**
 * Скрипт для страницы создания сотрудника (10-employee-create.html)
 */

document.addEventListener('DOMContentLoaded', async () => {
  await initPage({ requireAuth: false, loadProfile: true });
  await loadDictionaries();
  initForm();
});

let contractorTypesData = [];

/**
 * Загрузка справочников
 */
async function loadDictionaries() {
  try {
    const [departments, roles, positions, contractorTypes] = await Promise.all([
      API.dictionaries.getDepartments(),
      API.dictionaries.getRoles(),
      API.dictionaries.getPositions(),
      API.dictionaries.getContractorTypes(),
    ]);

    renderDepartmentSelect(departments);
    renderRoleSelect(roles);
    renderPositionSelect(positions);
    renderContractorTypeSelect(contractorTypes);

    contractorTypesData = contractorTypes;

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

  const list = departments.items || departments;

  select.innerHTML = `
    <option value="">Выберите отдел</option>
    ${list.map(dept => `
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

  const list = roles.items || roles;

  select.innerHTML = `
    <option value="">Выберите роль</option>
    ${list.map(role => `
      <option value="${role.code}">${role.name}</option>
    `).join('')}
  `;
}

/**
 * Рендер селекта должностей
 */
function renderPositionSelect(positions) {
  const select = document.getElementById('position-select');
  if (!select) return;

  const list = positions.items || positions;

  select.innerHTML = `
    <option value="">Выберите должность</option>
    ${list.map(pos => `
      <option value="${pos.code}">${pos.name}</option>
    `).join('')}
  `;
}

/**
 * Рендер селекта типов контрагентов
 */
function renderContractorTypeSelect(types) {
  const select = document.getElementById('contractor-type-select');
  if (!select) return;

  const list = types.items || types;

  // По умолчанию выбран "Сотрудник"
  select.innerHTML = list.map(type => `
    <option value="${type.code}" ${type.code === 'employee' ? 'selected' : ''}>
      ${type.shortName ? type.shortName + ' — ' : ''}${type.name}
    </option>
  `).join('');

  // При выборе типа показываем подсказку о документах
  select.addEventListener('change', (e) => {
    const typeCode = e.target.value;
    const type = list.find(t => t.code === typeCode);
    showContractorHint(type);
  });

  // Показываем подсказку для выбранного по умолчанию
  const defaultType = list.find(t => t.code === 'employee');
  showContractorHint(defaultType);
}

/**
 * Показ подсказки о документах
 */
function showContractorHint(type) {
  const container = document.getElementById('contractor-hint');
  if (!container || !type) {
    if (container) container.innerHTML = '';
    return;
  }

  // Если документы не требуются
  if (!type.requiredDocuments || type.requiredDocuments.length === 0) {
    container.innerHTML = `
      <div class="bg-green-50 border border-green-200 rounded-xl p-4">
        <p class="text-sm text-green-700">
          <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Для штатных сотрудников документы не требуются — выплата через зарплату.
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <p class="text-sm font-medium text-blue-800 mb-2">
        📋 Для типа "${type.name}" потребуются документы:
      </p>
      <ul class="text-sm text-blue-700 space-y-1">
        ${type.requiredDocuments.map(doc => `
          <li class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            ${getDocumentName(doc)}
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}

/**
 * Название документа по коду
 */
function getDocumentName(code) {
  const names = {
    'contract': 'Договор',
    'act': 'Акт выполненных работ',
    'invoice': 'Счёт на оплату',
    'upd': 'УПД (Универсальный передаточный документ)',
    'payment_order': 'Платёжное поручение',
    'my_tax_check': 'Чек из приложения "Мой налог"',
    'invoice_vat': 'Счёт-фактура с НДС',
  };
  return names[code] || code;
}

/**
 * Инициализация формы
 */
function initForm() {
  const form = document.getElementById('employee-form');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const position = formData.get('position');

    // Валидация
    if (!name) {
      UI.toast('Введите ФИО', 'error');
      return;
    }
    if (!email) {
      UI.toast('Введите Email', 'error');
      return;
    }
    if (!position) {
      UI.toast('Выберите должность', 'error');
      return;
    }

    const employeeData = {
      name: name,
      position: position,
      email: email,
      phone: formData.get('phone') || '',
      department: formData.get('department') || '',
      role: formData.get('role') || 'engineer',
      contractorType: formData.get('contractorType') || 'employee',
    };

    try {
      setLoading(true);

      const employee = await API.employees.create(employeeData);

      UI.toast('Сотрудник успешно добавлен', 'success');
      setTimeout(() => {
        window.location.href = '09-employees-list.html';
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
