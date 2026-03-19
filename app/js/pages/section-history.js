/**
 * Скрипт для страницы истории раздела (06-5-section-history.html)
 * Адаптирован для работы с API
 */

// Карта типов событий
const EVENT_TYPES = {
  file_upload: { color: '#3b82f6', bgColor: 'bg-blue-50', textColor: 'text-blue-700', label: 'Файл загружен', icon: '📄' },
  file_approve: { color: '#22c55e', bgColor: 'bg-green-50', textColor: 'text-green-700', label: 'Файл согласован', icon: '✅' },
  file_reject: { color: '#ef4444', bgColor: 'bg-red-50', textColor: 'text-red-700', label: 'Файл отклонён', icon: '❌' },
  status_change: { color: '#f59e0b', bgColor: 'bg-amber-50', textColor: 'text-amber-700', label: 'Статус изменён', icon: '🔄' },
  participant_add: { color: '#8b5cf6', bgColor: 'bg-purple-50', textColor: 'text-purple-700', label: 'Участник добавлен', icon: '👤' },
  participant_remove: { color: '#94a3b8', bgColor: 'bg-slate-50', textColor: 'text-slate-700', label: 'Участник удалён', icon: '👤' },
  payment: { color: '#10b981', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700', label: 'Выплата', icon: '💰' },
  comment: { color: '#06b6d4', bgColor: 'bg-cyan-50', textColor: 'text-cyan-700', label: 'Комментарий', icon: '💬' },
  expertise: { color: '#ef4444', bgColor: 'bg-red-50', textColor: 'text-red-700', label: 'Замечание', icon: '⚠️' },
  contract_create: { color: '#10b981', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700', label: 'Договор создан', icon: '📝' },
  section_create: { color: '#64748b', bgColor: 'bg-slate-100', textColor: 'text-slate-700', label: 'Раздел создан', icon: '📁' },
};

let currentSectionId = null;

document.addEventListener('DOMContentLoaded', async () => {
  await initPage({ requireAuth: false, loadProfile: true });
  currentSectionId = getUrlParam('id');
  await loadHistory();
  initFilters();
});

/**
 * Загрузка истории
 */
async function loadHistory() {
  try {
    if (!currentSectionId) {
      UI.showError('#history-container', 'Не указан ID раздела');
      return;
    }
    
    UI.showLoading('#history-container');
    
    const data = await API.sections.getHistory(currentSectionId);
    const events = data.events || data.items || data;
    const stats = data.stats || {};
    
    renderHistory(events);
    updateStats(stats);
    
  } catch (error) {
    console.error('Ошибка загрузки истории:', error);
    UI.showError('#history-container', 'Не удалось загрузить историю');
  }
}

/**
 * Рендер истории
 */
function renderHistory(events) {
  const container = document.getElementById('history-container');
  if (!container) return;
  
  if (!events || events.length === 0) {
    UI.showEmpty('#history-container', 'История пуста', '📜');
    return;
  }
  
  // Группируем по дням
  const groups = groupByDay(events);
  
  const html = Object.entries(groups).map(([date, dayEvents]) => {
    const dateLabel = formatDateLabel(date);
    return `
      <div class="mb-8">
        <h3 class="text-sm font-medium text-slate-500 mb-4">${dateLabel}</h3>
        <div class="space-y-4">
          ${dayEvents.map((e, i) => renderEvent(e, i === dayEvents.length - 1)).join('')}
        </div>
      </div>
    `;
  }).join('');
  
  container.innerHTML = html;
}

/**
 * Рендер события
 */
function renderEvent(event, isLast) {
  const type = EVENT_TYPES[event.type] || EVENT_TYPES.comment;
  const initials = event.author?.name?.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2) || '?';
  
  return `
    <div class="flex gap-4 ${isLast ? '' : 'pb-4 border-b border-slate-100'}">
      <div class="flex-shrink-0">
        <div class="w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg" style="border-color: ${type.color}">
          ${type.icon}
        </div>
      </div>
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-xs font-medium ${type.textColor} ${type.bgColor} px-2 py-0.5 rounded">
            ${type.label}
          </span>
          <span class="text-xs text-slate-400">${formatTime(event.createdAt)}</span>
        </div>
        <div class="flex items-start gap-3">
          <div class="avatar bg-gradient-to-br from-slate-700 to-slate-500 text-white text-xs" style="width: 28px; height: 28px;">
            ${initials}
          </div>
          <div class="flex-1">
            <p class="text-sm text-slate-800">${renderEventDescription(event)}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Рендер описания события
 */
function renderEventDescription(event) {
  const author = event.author?.name || 'Система';
  
  switch (event.type) {
    case 'file_upload':
      return `<span class="font-medium">${author}</span> загрузил файл <span class="font-medium text-slate-800">${event.data?.fileName || ''}</span>`;
    case 'file_approve':
      return `<span class="font-medium">${author}</span> согласовал файл <span class="font-medium text-slate-800">${event.data?.fileName || ''}</span>`;
    case 'file_reject':
      return `<span class="font-medium">${author}</span> отклонил файл <span class="font-medium text-slate-800">${event.data?.fileName || ''}</span>`;
    case 'status_change':
      return `<span class="font-medium">${author}</span> изменил статус с <span class="text-blue-600">${event.data?.oldStatus || ''}</span> на <span class="text-green-600">${event.data?.newStatus || ''}</span>`;
    case 'participant_add':
      return `<span class="font-medium">${author}</span> добавил участника <span class="text-purple-600">${event.data?.participantName || ''}</span>`;
    case 'participant_remove':
      return `<span class="font-medium">${author}</span> удалил участника <span class="text-slate-600">${event.data?.participantName || ''}</span>`;
    case 'payment':
      return `<span class="font-medium">${author}</span> добавил выплату <span class="text-green-600 font-medium">${event.data?.amount || ''}</span>`;
    case 'comment':
      return `<span class="font-medium">${author}</span> добавил комментарий: "${event.data?.text || ''}"`;
    case 'expertise':
      return `<span class="font-medium">${author}</span> создал замечание <span class="text-red-600">№${event.data?.commentNumber || ''}</span>`;
    case 'contract_create':
      return `<span class="font-medium">${author}</span> создал договор <span class="font-medium">№${event.data?.contractNumber || ''}</span>`;
    case 'section_create':
      return `<span class="font-medium">${author}</span> создал раздел`;
    default:
      return `<span class="font-medium">${author}</span> ${event.data?.description || 'выполнил действие'}`;
  }
}

/**
 * Инициализация фильтров
 */
function initFilters() {
  const filterType = document.getElementById('filter-type');
  const filterAuthor = document.getElementById('filter-author');
  
  filterType?.addEventListener('change', () => loadHistory());
  filterAuthor?.addEventListener('change', () => loadHistory());
}

/**
 * Обновление статистики
 */
function updateStats(stats) {
  const map = {
    'stat-total': stats.total || 0,
    'stat-files': stats.files || 0,
    'stat-status': stats.status || 0,
    'stat-participants': stats.participants || 0,
    'stat-payments': stats.payments || 0,
    'stat-comments': stats.comments || 0,
  };
  
  Object.entries(map).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });
}

// Вспомогательные функции
function groupByDay(events) {
  const groups = {};
  
  events.forEach(event => {
    const date = new Date(event.createdAt).toISOString().split('T')[0];
    if (!groups[date]) groups[date] = [];
    groups[date].push(event);
  });
  
  return groups;
}

function formatDateLabel(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();
  
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const formatted = `${date.getDate()} ${months[date.getMonth()]}`;
  
  if (isToday) return `Сегодня, ${formatted}`;
  if (isYesterday) return `Вчера, ${formatted}`;
  return formatted;
}

function formatTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}
