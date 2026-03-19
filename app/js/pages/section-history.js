/**
 * Страница истории раздела
 * Файл: Js/pages/section-history.js
 * 
 * Логика работы:
 * 1. Загрузка истории изменений из API
 * 2. Группировка событий по дням (Сегодня, Вчера, дата)
 * 3. Отображение иконок в кружках в зависимости от типа события
 * 4. Фильтрация по типу события, автору и датам
 */

// ============================================================================
// КОНФИГУРАЦИЯ ТИПОВ СОБЫТИЙ
// ============================================================================

/**
 * Карта типов событий с цветами и иконками
 * Каждый тип имеет:
 * - color: цвет границы кружка и иконки
 * - bgColor: цвет фона бейджа
 * - textColor: цвет текста бейджа
 * - icon: SVG иконка
 * - label: название типа для отображения
 */
const EVENT_TYPES = {
  // Загрузка файла
  file_upload: {
    color: '#3b82f6',      // blue-500
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    label: 'Файл загружен',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>`
  },
  
  // Согласование файла
  file_approve: {
    color: '#22c55e',      // green-500
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    label: 'Файл согласован',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>`
  },
  
  // Отклонение файла
  file_reject: {
    color: '#ef4444',      // red-500
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    label: 'Файл отклонён',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>`
  },
  
  // Изменение статуса
  status_change: {
    color: '#f59e0b',      // amber-500
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    label: 'Статус изменён',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>`
  },
  
  // Добавление участника
  participant_add: {
    color: '#8b5cf6',      // purple-500
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    label: 'Участник добавлен',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>`
  },
  
  // Удаление участника
  participant_remove: {
    color: '#94a3b8',      // slate-400
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-700',
    label: 'Участник удалён',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
    </svg>`
  },
  
  // Выплата
  payment: {
    color: '#10b981',      // emerald-500
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    label: 'Выплата',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>`
  },
  
  // Комментарий
  comment: {
    color: '#06b6d4',      // cyan-500
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-700',
    label: 'Комментарий',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>`
  },
  
  // Замечание экспертизы
  expertise: {
    color: '#ef4444',      // red-500
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    label: 'Замечание',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>`
  },
  
  // Создание договора
  contract_create: {
    color: '#10b981',      // emerald-500
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    label: 'Договор создан',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>`
  },
  
  // Создание раздела
  section_create: {
    color: '#64748b',      // slate-500
    bgColor: 'bg-slate-100',
    textColor: 'text-slate-700',
    label: 'Раздел создан',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>`
  }
};

// ============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================================

/**
 * Форматирование даты для группировки
 * @param {string|Date} date - дата события
 * @returns {Object} { key, label } - ключ для группировки и метка для отображения
 */
function formatDateGroup(date) {
  const eventDate = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Сбрасываем время для сравнения только дат
  const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
  
  if (eventDateOnly.getTime() === todayOnly.getTime()) {
    return {
      key: todayOnly.toISOString().split('T')[0],
      label: `Сегодня, ${formatDateRussian(eventDate)}`
    };
  } else if (eventDateOnly.getTime() === yesterdayOnly.getTime()) {
    return {
      key: yesterdayOnly.toISOString().split('T')[0],
      label: `Вчера, ${formatDateRussian(eventDate)}`
    };
  } else {
    return {
      key: eventDateOnly.toISOString().split('T')[0],
      label: formatDateRussian(eventDate)
    };
  }
}

/**
 * Форматирование даты в русском формате
 * @param {Date} date - дата
 * @returns {string} - отформатированная дата
 */
function formatDateRussian(date) {
  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ];
  return `${date.getDate()} ${months[date.getMonth()]}`;
}

/**
 * Форматирование времени
 * @param {string|Date} date - дата/время
 * @returns {string} - время в формате HH:MM
 */
function formatTime(date) {
  const d = new Date(date);
  return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Группировка событий по дням
 * @param {Array} events - массив событий
 * @returns {Object} - события, сгруппированные по дням
 */
function groupEventsByDay(events) {
  const groups = {};
  
  events.forEach(event => {
    const { key, label } = formatDateGroup(event.createdAt);
    
    if (!groups[key]) {
      groups[key] = {
        label: label,
        events: []
      };
    }
    
    groups[key].events.push(event);
  });
  
  // Сортируем дни в обратном порядке (сначала новые)
  const sortedKeys = Object.keys(groups).sort((a, b) => new Date(b) - new Date(a));
  const sortedGroups = {};
  
  sortedKeys.forEach(key => {
    sortedGroups[key] = groups[key];
  });
  
  return sortedGroups;
}

// ============================================================================
// РЕНДЕРИНГ
// ============================================================================

/**
 * Рендеринг одной записи истории
 * @param {Object} event - данные события
 * @param {boolean} isLast - последнее событие в группе (не показывать линию)
 * @returns {string} - HTML разметка
 */
function renderHistoryItem(event, isLast = false) {
  const typeConfig = EVENT_TYPES[event.type] || EVENT_TYPES.comment;
  const time = formatTime(event.createdAt);
  
  // Формируем описание события в зависимости от типа
  let description = '';
  
  switch (event.type) {
    case 'file_upload':
      description = `
        <span class="font-medium">${event.author.name}</span>
        <span class="text-slate-500"> загрузил файл</span>
        <span class="font-medium text-slate-800">${event.data.fileName}</span>
      `;
      if (event.data.fileSize) {
        description += `<span class="text-slate-400 text-xs ml-2">${event.data.fileSize}</span>`;
      }
      break;
      
    case 'file_approve':
      description = `
        <span class="font-medium">${event.author.name}</span>
        <span class="text-slate-500"> согласовал файл</span>
        <span class="font-medium text-slate-800">${event.data.fileName}</span>
      `;
      break;
      
    case 'file_reject':
      description = `
        <span class="font-medium">${event.author.name}</span>
        <span class="text-slate-500"> отклонил файл</span>
        <span class="font-medium text-slate-800">${event.data.fileName}</span>
      `;
      if (event.data.reason) {
        description += `<span class="text-slate-500"> — ${event.data.reason}</span>`;
      }
      break;
      
    case 'status_change':
      description = `
        <span class="font-medium">${event.author.name}</span>
        <span class="text-slate-500"> изменил статус с</span>
        <span class="${event.data.oldStatusColor || 'text-slate-600'}">${event.data.oldStatus}</span>
        <span class="text-slate-500"> на </span>
        <span class="${event.data.newStatusColor || 'text-blue-600'}">${event.data.newStatus}</span>
      `;
      break;
      
    case 'participant_add':
      description = `
        <span class="font-medium">${event.author.name}</span>
        <span class="text-slate-500"> добавил </span>
        <span class="text-purple-600 font-medium">${event.data.participantName}</span>
        <span class="text-slate-500"> как ${event.data.role || 'участника'}</span>
      `;
      break;
      
    case 'participant_remove':
      description = `
        <span class="font-medium">${event.author.name}</span>
        <span class="text-slate-500"> удалил </span>
        <span class="text-slate-600">${event.data.participantName}</span>
        <span class="text-slate-500"> из участников</span>
      `;
      break;
      
    case 'payment':
      description = `
        <span class="font-medium">${event.author.name}</span>
        <span class="text-slate-500"> добавил выплату</span>
        <span class="text-green-600 font-medium"> ${event.data.amount}</span>
      `;
      if (event.data.description) {
        description += `<span class="text-slate-500"> — ${event.data.description}</span>`;
      }
      break;
      
    case 'comment':
      description = `
        <span class="font-medium">${event.author.name}</span>
        <span class="text-slate-500"> добавил комментарий</span>
      `;
      if (event.data.text) {
        description += `<p class="text-slate-600 mt-1 text-sm">${event.data.text}</p>`;
      }
      break;
      
    case 'expertise':
      description = `
        <span class="font-medium">${event.author.name}</span>
        <span class="text-slate-500"> создал замечание</span>
        <span class="text-red-600 font-medium"> №${event.data.commentNumber}</span>
      `;
      break;
      
    case 'contract_create':
      description = `
        <span class="font-medium">${event.author.name}</span>
        <span class="text-slate-500"> создал договор</span>
        <span class="font-medium text-slate-800"> №${event.data.contractNumber}</span>
        <span class="text-slate-500"> с ${event.data.contractorName}</span>
        <span class="text-slate-500"> на сумму </span>
        <span class="text-green-600 font-medium">${event.data.amount}</span>
      `;
      break;
      
    case 'section_create':
      description = `
        <span class="font-medium">${event.author.name}</span>
        <span class="text-slate-500"> создал раздел</span>
      `;
      if (event.data.responsible) {
        description += `<span class="text-slate-500">. Ответственный: </span><span class="font-medium">${event.data.responsible}</span>`;
      }
      break;
      
    default:
      description = `
        <span class="font-medium">${event.author.name}</span>
        <span class="text-slate-500"> ${event.data.description || 'выполнил действие'}</span>
      `;
  }
  
  return `
    <div class="history-item ${isLast ? 'last' : ''}">
      <div class="history-dot" style="border-color: ${typeConfig.color};">
        <div style="color: ${typeConfig.color};">${typeConfig.icon}</div>
      </div>
      <div class="flex items-start gap-3">
        <div class="avatar bg-gradient-to-br from-slate-700 to-slate-500 text-white text-xs" style="width: 28px; height: 28px;">
          ${event.author.avatar || event.author.name.charAt(0)}
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-medium ${typeConfig.textColor} ${typeConfig.bgColor} px-2 py-0.5 rounded">
              ${typeConfig.label}
            </span>
          </div>
          <p class="text-sm text-slate-800">
            ${description}
          </p>
          <p class="text-xs text-slate-400 mt-1">${time}</p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Рендеринг группы событий (один день)
 * @param {string} dayLabel - название дня
 * @param {Array} events - события дня
 * @returns {string} - HTML разметка
 */
function renderDayGroup(dayLabel, events) {
  const eventsHtml = events.map((event, index) => 
    renderHistoryItem(event, index === events.length - 1)
  ).join('');
  
  return `
    <div>
      <p class="text-sm font-medium text-slate-500 mb-4">${dayLabel}</p>
      <div class="space-y-4">
        ${eventsHtml}
      </div>
    </div>
  `;
}

/**
 * Рендеринг всей истории
 * @param {Object} groupedEvents - события, сгруппированные по дням
 */
function renderHistory(groupedEvents) {
  const container = document.getElementById('historyContainer');
  
  if (!container) return;
  
  if (Object.keys(groupedEvents).length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 text-slate-400">
        <svg class="w-12 h-12 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>История изменений пуста</p>
      </div>
    `;
    return;
  }
  
  const html = Object.entries(groupedEvents)
    .map(([key, group]) => renderDayGroup(group.label, group.events))
    .join('');
  
  container.innerHTML = html;
}

// ============================================================================
// API ФУНКЦИИ
// ============================================================================

/**
 * Загрузка истории изменений раздела
 * @param {string} sectionId - ID раздела
 * @param {Object} filters - фильтры (type, author, dateFrom, dateTo)
 * @returns {Promise<Array>} - массив событий
 * 
 * API Endpoint: GET /api/sections/:id/history
 * 
 * Query параметры:
 * - type: тип события (file_upload, status_change, и т.д.)
 * - author: ID автора
 * - dateFrom: дата начала периода (YYYY-MM-DD)
 * - dateTo: дата окончания периода (YYYY-MM-DD)
 * - page: номер страницы (для пагинации)
 * - limit: количество записей на странице
 * 
 * Ответ:
 * {
 *   success: true,
 *   data: {
 *     events: [
 *       {
 *         id: "evt_001",
 *         type: "file_upload",
 *         createdAt: "2024-02-16T14:30:00Z",
 *         author: {
 *           id: "usr_001",
 *           name: "Иванов П.С.",
 *           avatar: "И"
 *         },
 *         data: {
 *           fileName: "АР_План_этажей.pdf",
 *           fileSize: "2.6 МБ"
 *         }
 *       },
 *       ...
 *     ],
 *     total: 24,
 *     page: 1,
 *     limit: 20,
 *     stats: {
 *       files: 8,
 *       approve: 5,
 *       status: 4,
 *       participants: 3,
 *       payments: 2,
 *       comments: 1,
 *       expertise: 1
 *     }
 *   }
 * }
 */
async function loadSectionHistory(sectionId, filters = {}) {
  try {
    // Формируем query-параметры
    const params = new URLSearchParams();
    
    if (filters.type) params.append('type', filters.type);
    if (filters.author) params.append('author', filters.author);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const queryString = params.toString();
    const url = `/api/sections/${sectionId}/history${queryString ? '?' + queryString : ''}`;
    
    // Вызываем API
    const response = await apiClient.get(url);
    
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error || 'Ошибка загрузки истории');
    }
  } catch (error) {
    console.error('Ошибка загрузки истории:', error);
    throw error;
  }
}

/**
 * Обновление статистики в боковой панели
 * @param {Object} stats - объект со статистикой по типам событий
 */
function updateStats(stats) {
  const elements = {
    countFiles: stats.files || 0,
    countApprove: stats.approve || 0,
    countStatus: stats.status || 0,
    countParticipants: stats.participants || 0,
    countPayments: stats.payments || 0,
    countComments: stats.comments || 0,
    countExpertise: stats.expertise || 0,
    statTotal: stats.total || 0
  };
  
  Object.entries(elements).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });
  
  // Обновляем общее количество записей
  const totalRecords = document.getElementById('totalRecords');
  if (totalRecords) totalRecords.textContent = `${stats.total || 0} записей`;
}

// ============================================================================
// ДЕМО-ДАННЫЕ ДЛЯ ТЕСТИРОВАНИЯ
// ============================================================================

/**
 * Демо-данные для тестирования без API
 */
const DEMO_EVENTS = [
  {
    id: 'evt_001',
    type: 'file_upload',
    createdAt: new Date().toISOString(),
    author: { id: 'usr_001', name: 'Иванов П.С.', avatar: 'И' },
    data: { fileName: 'АР_План_этажей_v3.pdf', fileSize: '2.6 МБ' }
  },
  {
    id: 'evt_002',
    type: 'file_approve',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    author: { id: 'usr_001', name: 'Иванов П.С.', avatar: 'И' },
    data: { fileName: 'АР_Фасады.pdf' }
  },
  {
    id: 'evt_003',
    type: 'status_change',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    author: { id: 'usr_002', name: 'Петров А.И.', avatar: 'П' },
    data: { 
      oldStatus: 'В работе', 
      oldStatusColor: 'text-blue-600',
      newStatus: 'На согласовании',
      newStatusColor: 'text-amber-600'
    }
  },
  {
    id: 'evt_004',
    type: 'participant_add',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    author: { id: 'usr_001', name: 'Иванов П.С.', avatar: 'И' },
    data: { participantName: 'Козлов Д.В.', role: 'соисполнитель' }
  },
  {
    id: 'evt_005',
    type: 'expertise',
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    author: { id: 'usr_001', name: 'Иванов П.С.', avatar: 'И' },
    data: { commentNumber: '127' }
  },
  {
    id: 'evt_006',
    type: 'payment',
    createdAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    author: { id: 'usr_001', name: 'Иванов П.С.', avatar: 'И' },
    data: { amount: '50 000 ₽', description: 'Аванс за работу' }
  },
  {
    id: 'evt_007',
    type: 'comment',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    author: { id: 'usr_003', name: 'Козлов Д.В.', avatar: 'К' },
    data: { text: 'Проверил чертежи, всё в порядке. Можно согласовывать.' }
  },
  {
    id: 'evt_008',
    type: 'file_upload',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000).toISOString(),
    author: { id: 'usr_002', name: 'Петров А.И.', avatar: 'П' },
    data: { fileName: 'АР_Разрезы.dwg', fileSize: '8.2 МБ' }
  },
  {
    id: 'evt_009',
    type: 'contract_create',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    author: { id: 'usr_001', name: 'Иванов П.С.', avatar: 'И' },
    data: { 
      contractNumber: '2025-03-15',
      contractorName: 'Петровым А.И.',
      amount: '100 000 ₽'
    }
  },
  {
    id: 'evt_010',
    type: 'section_create',
    createdAt: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(),
    author: { id: 'usr_001', name: 'Иванов П.С.', avatar: 'И' },
    data: { responsible: 'Петров А.И.' }
  }
];

const DEMO_STATS = {
  files: 4,
  approve: 2,
  status: 2,
  participants: 1,
  payments: 1,
  comments: 1,
  expertise: 1,
  total: 12
};

// ============================================================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================================================

let currentPage = 1;
const PAGE_SIZE = 20;
let currentFilters = {};

/**
 * Инициализация страницы
 */
async function init() {
  // Получаем ID раздела из URL
  const urlParams = new URLSearchParams(window.location.search);
  const sectionId = urlParams.get('id') || 'demo';
  
  try {
    let events, stats;
    
    if (sectionId === 'demo' || !window.apiClient) {
      // Используем демо-данные
      console.log('Используются демо-данные');
      events = DEMO_EVENTS;
      stats = DEMO_STATS;
    } else {
      // Загружаем из API
      const data = await loadSectionHistory(sectionId, {
        page: currentPage,
        limit: PAGE_SIZE,
        ...currentFilters
      });
      events = data.events;
      stats = data.stats;
    }
    
    // Группируем по дням
    const groupedEvents = groupEventsByDay(events);
    
    // Рендерим
    renderHistory(groupedEvents);
    updateStats(stats);
    
  } catch (error) {
    console.error('Ошибка инициализации:', error);
    
    const container = document.getElementById('historyContainer');
    if (container) {
      container.innerHTML = `
        <div class="text-center py-12 text-red-500">
          <p>Ошибка загрузки истории</p>
          <button onclick="init()" class="btn-secondary mt-4">Повторить</button>
        </div>
      `;
    }
  }
}

/**
 * Загрузка следующей страницы
 */
async function loadMore() {
  currentPage++;
  
  const urlParams = new URLSearchParams(window.location.search);
  const sectionId = urlParams.get('id') || 'demo';
  
  if (sectionId === 'demo') {
    alert('Демо-режим: все записи загружены');
    return;
  }
  
  try {
    const data = await loadSectionHistory(sectionId, {
      page: currentPage,
      limit: PAGE_SIZE,
      ...currentFilters
    });
    
    if (data.events.length > 0) {
      const container = document.getElementById('historyContainer');
      const groupedEvents = groupEventsByDay(data.events);
      
      // Добавляем новые записи
      Object.entries(groupedEvents).forEach(([key, group]) => {
        const dayHtml = renderDayGroup(group.label, group.events);
        container.insertAdjacentHTML('beforeend', dayHtml);
      });
    }
  } catch (error) {
    console.error('Ошибка загрузки:', error);
  }
}

/**
 * Применение фильтров
 */
function applyFilters() {
  currentFilters = {
    type: document.getElementById('filterType')?.value || '',
    author: document.getElementById('filterAuthor')?.value || '',
    dateFrom: document.getElementById('dateFrom')?.value || '',
    dateTo: document.getElementById('dateTo')?.value || ''
  };
  
  currentPage = 1;
  init();
}

// Слушатели событий
document.addEventListener('DOMContentLoaded', () => {
  init();
  
  // Фильтры
  const filterType = document.getElementById('filterType');
  const filterAuthor = document.getElementById('filterAuthor');
  const dateFrom = document.getElementById('dateFrom');
  const dateTo = document.getElementById('dateTo');
  
  if (filterType) filterType.addEventListener('change', applyFilters);
  if (filterAuthor) filterAuthor.addEventListener('change', applyFilters);
  if (dateFrom) dateFrom.addEventListener('change', applyFilters);
  if (dateTo) dateTo.addEventListener('change', applyFilters);
  
  // Чекбоксы типов событий
  document.querySelectorAll('[data-type]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      // Собираем выбранные типы
      const selectedTypes = Array.from(document.querySelectorAll('[data-type]:checked'))
        .map(cb => cb.dataset.type);
      
      // Обновляем фильтр
      currentFilters.types = selectedTypes;
      currentPage = 1;
      init();
    });
  });
});
