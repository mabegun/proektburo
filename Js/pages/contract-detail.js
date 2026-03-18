/**
 * Скрипт для страницы договора (18-contract-detail.html)
 */

document.addEventListener('DOMContentLoaded', async () => {
  await checkAuth();
  await loadContract();
});

async function checkAuth() {
  if (!getAuthToken()) window.location.href = '01-login.html';
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

async function loadContract() {
  try {
    const contractId = getUrlParam('id');
    if (!contractId) { UI.showError('#contract-content', 'Не указан ID договора'); return; }
    
    UI.showLoading('#contract-content');
    const contract = await API.finances.getContractById(contractId);
    renderContract(contract);
  } catch (error) {
    console.error('Ошибка загрузки договора:', error);
    UI.showError('#contract-content', 'Не удалось загрузить договор');
  }
}

function renderContract(contract) {
  renderContractInfo(contract);
  renderRelatedObjects(contract);
  renderPayments(contract.payments || []);
  renderDocuments(contract.documents || []);
}

function renderContractInfo(contract) {
  const container = document.getElementById('contract-info');
  if (!container) return;
  
  container.innerHTML = `
    <div class="grid grid-cols-2 gap-4">
      <div><p class="text-sm text-slate-500">Номер договора</p><p class="font-medium text-slate-800 font-mono">${contract.code}</p></div>
      <div><p class="text-sm text-slate-500">Дата</p><p class="font-medium text-slate-800">${UI.formatDate(contract.date)}</p></div>
      <div><p class="text-sm text-slate-500">Контрагент</p><p class="font-medium text-slate-800">${contract.contractor?.name || '—'}</p></div>
      <div><p class="text-sm text-slate-500">Тип</p><p class="font-medium text-slate-800">${getContractTypeText(contract.type)}</p></div>
      <div><p class="text-sm text-slate-500">Сумма</p><p class="font-medium text-slate-800">${UI.formatMoney(contract.amount)}</p></div>
      <div><p class="text-sm text-slate-500">Статус</p><p class="font-medium"><span class="badge ${getContractStatusClass(contract.status)}">${getContractStatusText(contract.status)}</span></p></div>
    </div>
  `;
}

function renderRelatedObjects(contract) {
  const container = document.getElementById('related-objects');
  if (!container) return;
  
  const sections = contract.sections || [];
  const surveys = contract.surveys || [];
  
  if (sections.length === 0 && surveys.length === 0) {
    container.innerHTML = '<p class="text-sm text-slate-400">Нет связанных объектов</p>';
    return;
  }
  
  let html = '';
  if (sections.length > 0) {
    html += `<div class="mb-4"><p class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Разделы</p><div class="space-y-2">${sections.map(s => `<a href="06-section-detail.html?id=${s.id}" class="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"><div class="flex items-center gap-3"><span class="w-8 h-8 rounded flex items-center justify-center text-xs font-bold" style="background: ${s.color}">${s.code}</span><span class="text-sm font-medium text-slate-700">${s.name}</span></div><span class="badge ${UI.getSectionStatusClass(s.status)}">${UI.getSectionStatusText(s.status)}</span></a>`).join('')}</div></div>`;
  }
  
  if (surveys.length > 0) {
    html += `<div><p class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Изыскания</p><div class="space-y-2">${surveys.map(s => `<a href="14-survey-detail.html?id=${s.id}" class="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"><div class="flex items-center gap-3"><span class="w-8 h-8 rounded flex items-center justify-center text-xs font-bold" style="background: ${s.color}">${s.code}</span><span class="text-sm font-medium text-slate-700">${s.name}</span></div><span class="badge ${UI.getSurveyStatusClass(s.status)}">${UI.getSurveyStatusText(s.status)}</span></a>`).join('')}</div></div>`;
  }
  
  container.innerHTML = html;
}

function renderPayments(payments) {
  const container = document.getElementById('payments-list');
  if (!container) return;
  
  if (payments.length === 0) {
    container.innerHTML = '<p class="text-sm text-slate-400">Выплат по договору ещё не было</p>';
    return;
  }
  
  container.innerHTML = payments.map(payment => `
    <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
      <div>
        <p class="text-sm font-medium text-slate-700">${payment.name}</p>
        <p class="text-xs text-slate-400">${UI.formatDate(payment.date)}</p>
      </div>
      <div class="text-right">
        <p class="text-sm font-bold text-slate-800">${UI.formatMoney(payment.amount)}</p>
        <span class="badge ${getPaymentStatusClass(payment.status)} text-xs">${getPaymentStatusText(payment.status)}</span>
      </div>
    </div>
  `).join('');
}

function renderDocuments(documents) {
  const container = document.getElementById('documents-list');
  if (!container) return;
  
  if (documents.length === 0) {
    container.innerHTML = '<p class="text-sm text-slate-400">Документы не прикреплены</p>';
    return;
  }
  
  container.innerHTML = documents.map(doc => `
    <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 ${getDocumentIconClass(doc.type)} rounded-lg flex items-center justify-center">${UI.getEntityIcon('file', 'w-5 h-5')}</div>
        <div>
          <p class="text-sm font-medium text-slate-700">${doc.name}</p>
          <p class="text-xs text-slate-400">${UI.formatDate(doc.uploadedAt)}</p>
        </div>
      </div>
      <a href="${doc.url}" download class="text-slate-400 hover:text-blue-600">${UI.getEntityIcon('file', 'w-5 h-5')}</a>
    </div>
  `).join('');
}

function getContractTypeText(type) {
  const map = { 'survey': 'На изыскания', 'section': 'На раздел', 'project': 'На проект' };
  return map[type] || type;
}

function getContractStatusClass(status) {
  const map = { 'active': 'status-in-progress', 'completed': 'status-completed', 'cancelled': 'status-overdue' };
  return map[status] || 'status-not-started';
}

function getContractStatusText(status) {
  const map = { 'active': 'Действует', 'completed': 'Завершён', 'cancelled': 'Расторгнут' };
  return map[status] || status;
}

function getPaymentStatusClass(status) {
  const map = { 'paid': 'status-completed', 'approved': 'status-in-progress', 'created': 'status-not-started' };
  return map[status] || 'status-not-started';
}

function getPaymentStatusText(status) {
  const map = { 'paid': 'Выплачено', 'approved': 'Утверждено', 'created': 'Создано' };
  return map[status] || status;
}

function getDocumentIconClass(type) {
  const map = { 'contract': 'bg-blue-100 text-blue-600', 'act': 'bg-green-100 text-green-600', 'invoice': 'bg-amber-100 text-amber-600' };
  return map[type] || 'bg-slate-100 text-slate-600';
}
