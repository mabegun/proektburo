/**
 * Скрипт для страницы выплаты (19-payment-detail.html)
 */

document.addEventListener('DOMContentLoaded', async () => {
  await initPage({ requireAuth: false, loadProfile: true });
  await loadPayment();
  initActions();
});

async function loadPayment() {
  try {
    const paymentId = getUrlParam('id');
    if (!paymentId) { UI.showError('#payment-content', 'Не указан ID выплаты'); return; }
    
    UI.showLoading('#payment-content');
    const payment = await API.finances.getPaymentById(paymentId);
    renderPayment(payment);
  } catch (error) {
    console.error('Ошибка загрузки выплаты:', error);
    UI.showError('#payment-content', 'Не удалось загрузить выплату');
  }
}

function renderPayment(payment) {
  renderPaymentInfo(payment);
  renderDocuments(payment.documents || []);
  renderHistory(payment.history || []);
}

function renderPaymentInfo(payment) {
  const container = document.getElementById('payment-info');
  if (!container) return;
  
  const statusClass = getPaymentStatusClass(payment.status);
  const statusText = getPaymentStatusText(payment.status);
  const documentsProgress = payment.documentsTotal > 0 ? Math.round((payment.documentsUploaded / payment.documentsTotal) * 100) : 0;
  
  container.innerHTML = `
    <div class="grid grid-cols-2 gap-4">
      <div><p class="text-sm text-slate-500">Номер выплаты</p><p class="font-medium text-slate-800 font-mono">№${payment.number}</p></div>
      <div><p class="text-sm text-slate-500">Статус</p><p class="font-medium"><span class="badge ${statusClass}">${statusText}</span></p></div>
      <div><p class="text-sm text-slate-500">Получатель</p><p class="font-medium text-slate-800">${payment.employeeName}</p></div>
      <div><p class="text-sm text-slate-500">Тип контрагента</p><p class="font-medium text-slate-800">${getContractorTypeText(payment.contractorType)}</p></div>
      <div><p class="text-sm text-slate-500">Сумма</p><p class="font-medium text-slate-800 text-lg">${UI.formatMoney(payment.amount)}</p></div>
      <div><p class="text-sm text-slate-500">Дата</p><p class="font-medium text-slate-800">${UI.formatDate(payment.date)}</p></div>
    </div>
    ${payment.documentsTotal > 0 ? `
      <div class="mt-4">
        <div class="flex justify-between text-xs mb-1"><span class="text-slate-500">Комплектность документов</span><span class="font-medium ${documentsProgress === 100 ? 'text-green-600' : 'text-amber-600'}">${documentsProgress}%</span></div>
        <div class="progress-bar" style="height: 8px;"><div class="progress-bar-fill" style="width: ${documentsProgress}%; background: ${UI.getProgressColor(documentsProgress)};"></div></div>
        <p class="text-xs text-slate-400 mt-1">${payment.documentsUploaded} из ${payment.documentsTotal} документов</p>
      </div>
    ` : ''}
  `;
}

function renderDocuments(documents) {
  const container = document.getElementById('documents-list');
  if (!container) return;
  
  const requiredDocs = ['Договор', 'Акт выполненных работ', 'Счёт на оплату', 'Платёжное поручение'];
  
  container.innerHTML = requiredDocs.map(docName => {
    const doc = documents.find(d => d.type === docName.toLowerCase());
    const isUploaded = !!doc;
    return `
      <div class="flex items-center justify-between p-4 rounded-xl border ${isUploaded ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 ${isUploaded ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'} rounded-lg flex items-center justify-center">${UI.getEntityIcon('file', 'w-5 h-5')}</div>
          <div>
            <p class="font-medium text-slate-700">${docName}</p>
            <p class="text-xs ${isUploaded ? 'text-green-600' : 'text-slate-400'}">${isUploaded ? `Загружен ${UI.formatDate(doc.uploadedAt)}` : 'Не загружен'}</p>
          </div>
        </div>
        ${isUploaded ? `<a href="${doc.url}" download class="text-slate-400 hover:text-blue-600">${UI.getEntityIcon('file', 'w-5 h-5')}</a>` : '<span class="text-slate-300">—</span>'}
      </div>
    `;
  }).join('');
}

function renderHistory(history) {
  const container = document.getElementById('payment-history');
  if (!container) return;
  if (history.length === 0) { container.innerHTML = '<p class="text-sm text-slate-400">История пуста</p>'; return; }
  
  container.innerHTML = history.map(event => `<div class="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0"><div class="w-2 h-2 rounded-full bg-slate-400 mt-2"></div><div class="flex-1"><p class="text-sm text-slate-700">${event.description}</p><p class="text-xs text-slate-400">${formatEventTime(event.createdAt)}</p></div></div>`).join('');
}

function initActions() {
  const uploadBtn = document.getElementById('upload-document-btn');
  uploadBtn?.addEventListener('click', () => {
    const modal = document.getElementById('upload-modal');
    modal?.classList.remove('hidden');
  });
  
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal')?.classList.add('hidden');
    });
  });
}

function getPaymentStatusClass(status) {
  const map = { 'paid': 'status-completed', 'approved': 'status-in-progress', 'created': 'status-not-started', 'awaiting_docs': 'status-revision', 'overdue': 'status-overdue' };
  return map[status] || 'status-not-started';
}

function getPaymentStatusText(status) {
  const map = { 'paid': 'Выплачено', 'approved': 'Утверждено', 'created': 'Создано', 'awaiting_docs': 'Ожидает документов', 'overdue': 'Просрочено' };
  return map[status] || status;
}

function getContractorTypeText(type) {
  const map = { 'ooo': 'ООО', 'ip': 'ИП', 'self-employed': 'Самозанятый', 'gpkh': 'ГПХ', 'employee': 'Сотрудник' };
  return map[type] || type;
}

function formatEventTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Только что';
  if (minutes < 60) return `${minutes} мин. назад`;
  return UI.formatDate(dateString);
}
