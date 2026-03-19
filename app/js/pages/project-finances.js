/**
 * Скрипт для страницы финансов проекта (04-5-project-finances.html)
 */

document.addEventListener('DOMContentLoaded', async () => {
  await initPage({ requireAuth: false, loadProfile: true });
  await loadProjectFinances();
  initActions();
});

/**
 * Обновление профиля в сайдбаре
 */

/**
 * Загрузка финансов проекта
 */
async function loadProjectFinances() {
  try {
    const projectId = getUrlParam('id');
    if (!projectId) {
      UI.showError('#finances-content', 'Не указан ID проекта');
      return;
    }
    
    UI.showLoading('#finances-content');
    
    const [finances, contracts, employees, sections] = await Promise.all([
      API.projects.getFinances(projectId),
      API.finances.getContracts({ projectId }),
      API.employees.getList(),
      API.sections.getList(projectId),
    ]);
    
    renderBalance(finances);
    renderIncomes(finances.incomes || []);
    renderExpenses(finances.expenses || []);
    renderMissingDocuments(finances.missingDocuments || []);
    
    // Сохраняем данные для модальных окон
    window.financesData = { contracts, employees, sections };
    
  } catch (error) {
    console.error('Ошибка загрузки финансов:', error);
    UI.showError('#finances-content', 'Не удалось загрузить финансы');
  }
}

/**
 * Рендер баланса
 */
function renderBalance(finances) {
  const container = document.getElementById('project-balance');
  if (!container) return;
  
  const balance = (finances.totalIncome || 0) - (finances.totalExpenses || 0);
  
  container.innerHTML = `
    <div class="grid grid-cols-3 gap-4">
      <div class="card-static p-4">
        <div class="text-sm text-slate-500 mb-1">Поступления</div>
        <div class="text-2xl font-bold text-green-600">${UI.formatMoney(finances.totalIncome || 0)}</div>
        <div class="text-xs text-slate-400 mt-1">${finances.incomesCount || 0} операций</div>
      </div>
      <div class="card-static p-4">
        <div class="text-sm text-slate-500 mb-1">Расходы и выплаты</div>
        <div class="text-2xl font-bold text-red-600">${UI.formatMoney(finances.totalExpenses || 0)}</div>
        <div class="text-xs text-slate-400 mt-1">${finances.expensesCount || 0} операций</div>
      </div>
      <div class="card-static p-4">
        <div class="text-sm text-slate-500 mb-1">Баланс</div>
        <div class="text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}">
          ${UI.formatMoney(balance)}
        </div>
        <div class="text-xs text-slate-400 mt-1">
          ${balance >= 0 ? 'Проект рентабелен' : 'Убыток'}
        </div>
      </div>
    </div>
  `;
}

/**
 * Рендер поступлений
 */
function renderIncomes(incomes) {
  const container = document.getElementById('incomes-list');
  if (!container) return;
  
  if (incomes.length === 0) {
    container.innerHTML = '<p class="text-sm text-slate-400">Поступлений ещё не было</p>';
    return;
  }
  
  const html = incomes.map(income => `
    <div class="p-4 bg-green-50 rounded-xl border border-green-200">
      <div class="flex justify-between items-start mb-2">
        <div>
          <p class="font-medium text-green-800">${income.name}</p>
          <p class="text-sm text-green-600">${UI.formatDate(income.date)}</p>
        </div>
        <span class="badge bg-green-200 text-green-800 text-xs">
          ${getIncomeStatusText(income.status)}
        </span>
      </div>
      <div class="flex justify-between items-center">
        <p class="text-sm text-green-700">${income.source}</p>
        <p class="text-lg font-bold text-green-800">${UI.formatMoney(income.amount)}</p>
      </div>
      ${income.expectedDate && income.status !== 'received' ? `
        <div class="mt-2 text-xs ${income.status === 'overdue' ? 'text-red-600' : 'text-amber-600'}">
          ${income.status === 'overdue' ? '🔴 Просрочено' : '⏳ Ожидается'} ${UI.formatDate(income.expectedDate)}
        </div>
      ` : ''}
    </div>
  `).join('');
  
  container.innerHTML = html;
}

/**
 * Рендер расходов
 */
function renderExpenses(expenses) {
  const container = document.getElementById('expenses-list');
  if (!container) return;
  
  if (expenses.length === 0) {
    container.innerHTML = '<p class="text-sm text-slate-400">Расходов ещё не было</p>';
    return;
  }
  
  const html = expenses.map(expense => `
    <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
      <div class="flex justify-between items-start mb-2">
        <div>
          <p class="font-medium text-slate-800">${expense.name}</p>
          <p class="text-sm text-slate-500">${UI.formatDate(expense.date)}</p>
        </div>
        <span class="badge ${getExpenseStatusClass(expense.status)} text-xs">
          ${getExpenseStatusText(expense.status)}
        </span>
      </div>
      <div class="flex justify-between items-center mb-2">
        <div>
          <p class="text-sm font-medium text-slate-700">${expense.employeeName}</p>
          <p class="text-xs text-slate-400">${getContractorTypeText(expense.contractorType)}</p>
        </div>
        <p class="text-lg font-bold text-slate-800">${UI.formatMoney(expense.amount)}</p>
      </div>
      ${expense.sectionName ? `
        <div class="text-xs text-slate-400 mb-2">
          📁 ${expense.sectionName}
        </div>
      ` : ''}
      <div class="flex gap-2">
        ${expense.documentsMissing > 0 ? `
          <span class="text-xs text-amber-600">
            ⚠️ Не хватает ${expense.documentsMissing} док.
          </span>
        ` : `
          <span class="text-xs text-green-600">
            ✓ Все документы
          </span>
        `}
        <a href="19-payment-detail.html?id=${expense.id}" class="text-xs text-blue-600 hover:underline ml-auto">
          Подробнее →
        </a>
      </div>
    </div>
  `).join('');
  
  container.innerHTML = html;
}

/**
 * Рендер недостающих документов
 */
function renderMissingDocuments(documents) {
  const container = document.getElementById('missing-documents');
  if (!container) return;
  
  if (documents.length === 0) {
    container.innerHTML = `
      <div class="text-center py-4 text-green-600">
        <p class="font-medium">✓ Все документы загружены</p>
      </div>
    `;
    return;
  }
  
  const html = documents.map(doc => `
    <div class="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-200">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <p class="text-sm font-medium text-amber-800">${doc.operationName}</p>
          <p class="text-xs text-amber-600">${getContractorTypeText(doc.contractorType)} • Не хватает: ${doc.missingDocs.join(', ')}</p>
        </div>
      </div>
      <button class="btn-secondary text-sm py-2 px-3" onclick="sendReminder(${doc.operationId})">
        Напомнить
      </button>
    </div>
  `).join('');
  
  container.innerHTML = html;
}

/**
 * Инициализация действий
 */
function initActions() {
  // Открытие модального окна добавления поступления
  const openIncomeModal = document.getElementById('open-add-income-modal');
  openIncomeModal?.addEventListener('click', () => {
    document.getElementById('add-income-modal')?.classList.remove('hidden');
  });
  
  // Открытие модального окна добавления расхода
  const openExpenseModal = document.getElementById('open-add-expense-modal');
  openExpenseModal?.addEventListener('click', () => {
    document.getElementById('add-expense-modal')?.classList.remove('hidden');
  });
  
  // Закрытие модальных окон
  document.querySelectorAll('[data-close-modal]')?.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal')?.classList.add('hidden');
    });
  });
}

// Вспомогательные функции
function getIncomeStatusText(status) {
  const map = {
    'expected': 'Ожидается',
    'received': 'Получено',
    'overdue': 'Просрочено',
  };
  return map[status] || status;
}

function getExpenseStatusClass(status) {
  const map = {
    'created': 'bg-slate-100 text-slate-600',
    'approved': 'bg-blue-100 text-blue-700',
    'paid': 'bg-green-100 text-green-700',
    'closed': 'bg-slate-100 text-slate-600',
    'overdue': 'bg-red-100 text-red-700',
  };
  return map[status] || 'bg-slate-100 text-slate-600';
}

function getExpenseStatusText(status) {
  const map = {
    'created': 'Создано',
    'approved': 'Утверждено',
    'paid': 'Выплачено',
    'closed': 'Закрыто',
    'overdue': 'Просрочено',
  };
  return map[status] || status;
}

function getContractorTypeText(type) {
  const map = {
    'ooo': 'ООО',
    'ip': 'ИП',
    'self-employed': 'Самозанятый',
    'gpkh': 'ГПХ',
    'employee': 'Сотрудник',
  };
  return map[type] || type;
}

// Глобальные функции
window.sendReminder = async (operationId) => {
  try {
    await api.post(`/finance-operations/${operationId}/reminder`);
    UI.toast('Напоминание отправлено', 'success');
  } catch (error) {
    UI.toast('Ошибка при отправке напоминания', 'error');
  }
};
