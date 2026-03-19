/**
 * Скрипт для страницы финансов сотрудника (04-5-project-finances-employee.html)
 * Версия для исполнителя — только свои выплаты
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
 * Загрузка финансов
 */
async function loadProjectFinances() {
  try {
    const projectId = getUrlParam('id');
    if (!projectId) {
      UI.showError('#finances-content', 'Не указан ID проекта');
      return;
    }
    
    UI.showLoading('#finances-content');
    
    // Загружаем только свои выплаты
    const [myPayments, project, sections] = await Promise.all([
      api.get(`/finance-operations/my?projectId=${projectId}`),
      API.projects.getById(projectId),
      API.sections.getList(projectId),
    ]);
    
    renderMyPaymentsSummary(myPayments);
    renderMyPayments(myPayments);
    renderPaymentsByStatus(myPayments);
    renderPaymentsBySection(myPayments, sections);
    renderAttentionBlocks(myPayments);
    
  } catch (error) {
    console.error('Ошибка загрузки финансов:', error);
    UI.showError('#finances-content', 'Не удалось загрузить финансы');
  }
}

/**
 * Рендер сводки по своим выплатам
 */
function renderMyPaymentsSummary(payments) {
  const container = document.getElementById('my-payments-summary');
  if (!container) return;
  
  const total = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const paid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (p.amount || 0), 0);
  const inProgress = payments.filter(p => ['approved', 'created'].includes(p.status)).reduce((sum, p) => sum + (p.amount || 0), 0);
  const awaitingDocs = payments.filter(p => p.status === 'awaiting_docs').reduce((sum, p) => sum + (p.amount || 0), 0);
  
  container.innerHTML = `
    <div class="card-static p-4">
      <div class="text-sm text-slate-500 mb-1">Мои выплаты</div>
      <div class="text-2xl font-bold text-slate-800">${UI.formatMoney(total)}</div>
      <div class="text-xs text-slate-400 mt-1">${payments.length} операций</div>
    </div>
    <div class="card-static p-4">
      <div class="text-sm text-slate-500 mb-1">Выплачено</div>
      <div class="text-2xl font-bold text-green-600">${UI.formatMoney(paid)}</div>
      <div class="text-xs text-slate-400 mt-1">${payments.filter(p => p.status === 'paid').length} выплат</div>
    </div>
    <div class="card-static p-4">
      <div class="text-sm text-slate-500 mb-1">В работе</div>
      <div class="text-2xl font-bold text-blue-600">${UI.formatMoney(inProgress)}</div>
      <div class="text-xs text-slate-400 mt-1">${payments.filter(p => ['approved', 'created'].includes(p.status)).length} выплат ожидают</div>
    </div>
    <div class="card-static p-4">
      <div class="text-sm text-slate-500 mb-1">Ожидают документов</div>
      <div class="text-2xl font-bold text-amber-600">${UI.formatMoney(awaitingDocs)}</div>
      <div class="text-xs text-slate-400 mt-1">${payments.filter(p => p.status === 'awaiting_docs').length} выплат</div>
    </div>
  `;
}

/**
 * Рендер списка моих выплат
 */
function renderMyPayments(payments) {
  const container = document.getElementById('my-payments-list');
  if (!container) return;
  
  if (payments.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-slate-400">
        <p>Выплат ещё не было</p>
        <button class="btn-primary mt-3 text-sm py-2 px-4" onclick="openAddPaymentModal()">
          Выставить счёт
        </button>
      </div>
    `;
    return;
  }
  
  const html = payments.map(payment => {
    const statusClass = getPaymentStatusClass(payment.status);
    const statusText = getPaymentStatusText(payment.status);
    const documentsProgress = payment.documentsTotal > 0 
      ? Math.round((payment.documentsUploaded / payment.documentsTotal) * 100) 
      : 0;
    
    return `
      <div class="card p-4">
        <div class="flex justify-between items-start mb-3">
          <div>
            <p class="font-semibold text-slate-800">${payment.name}</p>
            <p class="text-sm text-slate-500">${UI.formatDate(payment.date)}</p>
          </div>
          <span class="badge ${statusClass}">${statusText}</span>
        </div>
        
        <div class="flex justify-between items-center mb-3">
          <div>
            <p class="text-sm font-medium text-slate-700">${payment.sectionName || 'Проект'}</p>
            <p class="text-xs text-slate-400">${getContractorTypeText(payment.contractorType)}</p>
          </div>
          <p class="text-lg font-bold text-slate-800">${UI.formatMoney(payment.amount)}</p>
        </div>
        
        <!-- Прогресс документов -->
        ${payment.documentsTotal > 0 ? `
          <div class="mb-2">
            <div class="flex justify-between text-xs mb-1">
              <span class="text-slate-500">Документы</span>
              <span class="font-medium ${documentsProgress === 100 ? 'text-green-600' : 'text-amber-600'}">
                ${payment.documentsUploaded} из ${payment.documentsTotal}
              </span>
            </div>
            <div class="progress-bar" style="height: 6px;">
              <div 
                class="progress-bar-fill" 
                style="width: ${documentsProgress}%; background: ${UI.getProgressColor(documentsProgress)};"
              ></div>
            </div>
          </div>
        ` : ''}
        
        <!-- Действия -->
        <div class="flex gap-2 mt-3 pt-3 border-t border-slate-100">
          <a href="19-payment-detail.html?id=${payment.id}" class="btn-secondary text-sm py-2 px-3 flex-1 text-center">
            Подробнее
          </a>
          ${payment.status === 'created' || payment.status === 'awaiting_docs' ? `
            <button class="btn-primary text-sm py-2 px-3" onclick="uploadDocuments(${payment.id})">
              Загрузить документы
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
  
  container.innerHTML = html;
}

/**
 * Рендер выплат по статусам
 */
function renderPaymentsByStatus(payments) {
  const container = document.getElementById('payments-by-status');
  if (!container) return;
  
  const byStatus = {};
  payments.forEach(p => {
    byStatus[p.status] = (byStatus[p.status] || 0) + (p.amount || 0);
  });
  
  const statuses = [
    { code: 'paid', label: 'Выплачено', class: 'text-green-600' },
    { code: 'approved', label: 'Утверждено', class: 'text-blue-600' },
    { code: 'created', label: 'Создано', class: 'text-slate-600' },
    { code: 'awaiting_docs', label: 'Ожидают документов', class: 'text-amber-600' },
  ];
  
  container.innerHTML = statuses.map(status => `
    <div class="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
      <span class="text-sm text-slate-600">${status.label}</span>
      <span class="text-sm font-medium ${status.class}">
        ${UI.formatMoney(byStatus[status.code] || 0)}
      </span>
    </div>
  `).join('');
}

/**
 * Рендер выплат по разделам
 */
function renderPaymentsBySection(payments, sections) {
  const container = document.getElementById('payments-by-section');
  if (!container) return;
  
  const bySection = {};
  payments.forEach(p => {
    if (p.sectionId) {
      bySection[p.sectionId] = (bySection[p.sectionId] || 0) + (p.amount || 0);
    }
  });
  
  const sectionPayments = sections
    .filter(s => bySection[s.id])
    .map(s => ({
      ...s,
      amount: bySection[s.id],
    }));
  
  if (sectionPayments.length === 0) {
    container.innerHTML = '<p class="text-sm text-slate-400">Нет выплат по разделам</p>';
    return;
  }
  
  container.innerHTML = sectionPayments.map(section => `
    <div class="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
      <div class="flex items-center gap-2">
        <span class="w-6 h-6 rounded flex items-center justify-center text-xs font-bold" style="background: ${section.color}">
          ${section.code}
        </span>
        <span class="text-sm text-slate-600">${section.name}</span>
      </div>
      <span class="text-sm font-medium text-slate-800">
        ${UI.formatMoney(section.amount)}
      </span>
    </div>
  `).join('');
}

/**
 * Рендер блока "Требует внимания"
 */
function renderAttentionBlocks(payments) {
  const container = document.getElementById('attention-blocks');
  if (!container) return;
  
  const awaitingDocs = payments.filter(p => p.status === 'awaiting_docs');
  const overdue = payments.filter(p => {
    if (!p.deadline) return false;
    return new Date(p.deadline) < new Date() && p.status !== 'paid';
  });
  const soonDeadline = payments.filter(p => {
    if (!p.deadline) return false;
    const diff = new Date(p.deadline) - new Date();
    return diff > 0 && diff < 5 * 24 * 60 * 60 * 1000 && p.status !== 'paid';
  });
  
  let html = '';
  
  if (awaitingDocs.length > 0) {
    html += `
      <a href="11-notifications.html" class="attention-card attention-warning p-4 rounded-xl">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="font-semibold text-amber-800 text-sm">Требуются документы</p>
            <p class="text-amber-600 text-xs mt-1">${awaitingDocs.length} выплат без документов</p>
            <p class="text-amber-500 text-xs mt-2">📋 Загрузите сейчас</p>
          </div>
          <svg class="w-5 h-5 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      </a>
    `;
  }
  
  if (overdue.length > 0) {
    html += `
      <a href="my-payments.html" class="attention-card attention-critical p-4 rounded-xl">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="font-semibold text-red-800 text-sm">Просрочен дедлайн</p>
            <p class="text-red-600 text-xs mt-1">${overdue.length} выплат просрочено</p>
            <p class="text-red-500 text-xs mt-2">🔴 Требует внимания</p>
          </div>
          <svg class="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </a>
    `;
  }
  
  if (soonDeadline.length > 0) {
    html += `
      <a href="my-payments.html" class="attention-card attention-warning p-4 rounded-xl">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="font-semibold text-amber-800 text-sm">Дедлайн скоро</p>
            <p class="text-amber-600 text-xs mt-1">${soonDeadline.length} выплат в ближайшие 5 дней</p>
            <p class="text-amber-500 text-xs mt-2">⏳ Успейте загрузить</p>
          </div>
          <svg class="w-5 h-5 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </a>
    `;
  }
  
  if (html === '') {
    html = `
      <div class="text-center py-4 text-green-600">
        <p class="font-medium">✓ Всё в порядке</p>
        <p class="text-sm text-slate-400 mt-1">Нет требований к вниманию</p>
      </div>
    `;
  }
  
  container.innerHTML = html;
}

/**
 * Инициализация действий
 */
function initActions() {
  // Кнопка выставить счёт
  const openAddPayoutModal = document.getElementById('open-add-payout-modal');
  openAddPayoutModal?.addEventListener('click', () => {
    openAddPaymentModal();
  });
}

/**
 * Открытие модального окна добавления выплаты
 */
function openAddPaymentModal() {
  const modal = document.getElementById('add-payout-modal');
  if (modal) {
    modal.classList.remove('hidden');
  }
}

/**
 * Загрузка документов
 */
function uploadDocuments(paymentId) {
  window.location.href = `19-payment-detail.html?id=${paymentId}&action=upload`;
}

// Вспомогательные функции
function getPaymentStatusClass(status) {
  const map = {
    'paid': 'status-completed',
    'approved': 'status-in-progress',
    'created': 'status-not-started',
    'awaiting_docs': 'status-revision',
    'closed': 'status-completed',
    'overdue': 'status-overdue',
  };
  return map[status] || 'status-not-started';
}

function getPaymentStatusText(status) {
  const map = {
    'paid': 'Выплачено',
    'approved': 'Утверждено',
    'created': 'Создано',
    'awaiting_docs': 'Ожидает документов',
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
window.openAddPaymentModal = openAddPaymentModal;
window.uploadDocuments = uploadDocuments;
