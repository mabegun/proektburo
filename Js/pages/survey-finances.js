/**
 * Скрипт для страницы финансов изыскания (14-2-survey-finances.html)
 */

document.addEventListener('DOMContentLoaded', async () => {
  await checkAuth();
  await loadSurveyFinances();
  initActions();
});

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

function updateUserProfile(user) {
  const profileEl = document.querySelector('.sidebar-profile');
  if (!profileEl) return;
  const initials = UI.getInitials(user.name);
  profileEl.innerHTML = `<div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50"><div class="avatar bg-gradient-to-br from-slate-700 to-slate-500 text-white">${initials}</div><div class="flex-1 min-w-0"><p class="font-semibold text-slate-800 truncate">${user.name}</p><p class="text-xs text-slate-500">${getUserRoleText(user.role)}</p></div></div>`;
}

function getUserRoleText(role) {
  const map = { 'director': 'Директор', 'gip': 'ГИП', 'employee': 'Сотрудник' };
  return map[role] || role;
}

async function loadSurveyFinances() {
  try {
    const surveyId = getUrlParam('id');
    if (!surveyId) {
      UI.showError('#finances-content', 'Не указан ID изыскания');
      return;
    }
    
    UI.showLoading('#finances-content');
    
    const [finances, contract] = await Promise.all([
      API.surveys.getFinances(surveyId),
      api.get(`/surveys/${surveyId}/contract`),
    ]);
    
    renderContractInfo(contract);
    renderPayments(finances.payments || []);
    renderPaymentStats(finances);
    
  } catch (error) {
    console.error('Ошибка загрузки финансов:', error);
    UI.showError('#finances-content', 'Не удалось загрузить финансы');
  }
}

function renderContractInfo(contract) {
  const container = document.getElementById('contract-info');
  if (!container) return;
  
  if (!contract) {
    container.innerHTML = '<p class="text-sm text-slate-400">Договор не заключён</p>';
    return;
  }
  
  const progress = contract.budget > 0 ? Math.round((contract.paid / contract.budget) * 100) : 0;
  
  container.innerHTML = `
    <div class="card-static p-4">
      <div class="grid grid-cols-2 gap-4">
        <div><p class="text-sm text-slate-500">Номер договора</p><p class="font-medium text-slate-800">${contract.code}</p></div>
        <div><p class="text-sm text-slate-500">Дата</p><p class="font-medium text-slate-800">${UI.formatDate(contract.date)}</p></div>
        <div><p class="text-sm text-slate-500">Сумма</p><p class="font-medium text-slate-800">${UI.formatMoney(contract.budget)}</p></div>
        <div><p class="text-sm text-slate-500">Выплачено</p><p class="font-medium text-green-600">${UI.formatMoney(contract.paid)}</p></div>
      </div>
      <div class="mt-4">
        <div class="flex justify-between text-xs mb-1"><span class="text-slate-500">Прогресс оплаты</span><span class="font-medium">${progress}%</span></div>
        <div class="progress-bar" style="height: 8px;"><div class="progress-bar-fill" style="width: ${progress}%; background: ${UI.getProgressColor(progress)};"></div></div>
      </div>
    </div>
  `;
}

function renderPayments(payments) {
  const container = document.getElementById('payments-list');
  if (!container) return;
  
  if (payments.length === 0) {
    container.innerHTML = '<p class="text-sm text-slate-400">Выплат ещё не было</p>';
    return;
  }
  
  container.innerHTML = payments.map(payment => `
    <div class="card p-4">
      <div class="flex justify-between items-start mb-2">
        <div>
          <p class="font-semibold text-slate-800">${payment.name}</p>
          <p class="text-sm text-slate-500">${UI.formatDate(payment.date)}</p>
        </div>
        <span class="badge ${getPaymentStatusClass(payment.status)}">${getPaymentStatusText(payment.status)}</span>
      </div>
      <div class="flex justify-between items-center">
        <div>
          <p class="text-sm font-medium text-slate-700">${payment.employeeName}</p>
          <p class="text-xs text-slate-400">${getContractorTypeText(payment.contractorType)}</p>
        </div>
        <p class="text-lg font-bold text-slate-800">${UI.formatMoney(payment.amount)}</p>
      </div>
      <a href="19-payment-detail.html?id=${payment.id}" class="text-sm text-blue-600 hover:underline mt-2 inline-block">Подробнее →</a>
    </div>
  `).join('');
}

function renderPaymentStats(finances) {
  const container = document.getElementById('payment-stats');
  if (!container) return;
  
  container.innerHTML = `
    <div class="grid grid-cols-3 gap-4">
      <div class="card-static p-4"><div class="text-sm text-slate-500 mb-1">Всего выплат</div><div class="text-2xl font-bold text-slate-800">${finances.totalPayments || 0}</div></div>
      <div class="card-static p-4"><div class="text-sm text-slate-500 mb-1">Выплачено</div><div class="text-2xl font-bold text-green-600">${UI.formatMoney(finances.paid || 0)}</div></div>
      <div class="card-static p-4"><div class="text-sm text-slate-500 mb-1">Ожидает</div><div class="text-2xl font-bold text-amber-600">${UI.formatMoney(finances.pending || 0)}</div></div>
    </div>
  `;
}

function initActions() {
  const addPaymentBtn = document.getElementById('add-payment-btn');
  addPaymentBtn?.addEventListener('click', () => {
    const surveyId = getUrlParam('id');
    window.location.href = `14-4-expertise-create.html?survey=${surveyId}&type=payment`;
  });
}

function getPaymentStatusClass(status) {
  const map = { 'paid': 'status-completed', 'approved': 'status-in-progress', 'created': 'status-not-started', 'overdue': 'status-overdue' };
  return map[status] || 'status-not-started';
}

function getPaymentStatusText(status) {
  const map = { 'paid': 'Выплачено', 'approved': 'Утверждено', 'created': 'Создано', 'overdue': 'Просрочено' };
  return map[status] || status;
}

function getContractorTypeText(type) {
  const map = { 'ooo': 'ООО', 'ip': 'ИП', 'self-employed': 'Самозанятый', 'gpkh': 'ГПХ', 'employee': 'Сотрудник' };
  return map[type] || type;
}
