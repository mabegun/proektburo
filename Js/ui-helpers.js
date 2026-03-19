/**
 * UI Helpers - функции для обновления интерфейса
 * 
 * Включает функции для:
 * - Состояний (loading, error, empty)
 * - Форматирования (даты, деньги, текст)
 * - Индикаторов (статусы, цвета, иконки)
 * - Числовых показателей (прогресс, счётчики)
 */

const UI = {
  /**
   * Показать состояние загрузки
   */
  showLoading(selector) {
    const el = document.querySelector(selector);
    if (!el) return;
    
    el.innerHTML = `
      <div class="flex items-center justify-center p-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700"></div>
        <span class="ml-3 text-slate-600">Загрузка...</span>
      </div>
    `;
  },

  /**
   * Показать ошибку
   */
  showError(selector, message) {
    const el = document.querySelector(selector);
    if (!el) return;
    
    el.innerHTML = `
      <div class="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>${message}</span>
        </div>
      </div>
    `;
  },

  /**
   * Показать пустое состояние
   */
  showEmpty(selector, message, icon = '📭') {
    const el = document.querySelector(selector);
    if (!el) return;
    
    el.innerHTML = `
      <div class="text-center p-8 text-slate-400">
        <div class="text-4xl mb-2">${icon}</div>
        <div>${message}</div>
      </div>
    `;
  },

  /**
   * Форматировать дату
   */
  formatDate(dateString) {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  },

  /**
   * Форматировать деньги
   */
  formatMoney(amount, currency = '₽') {
    if (amount === null || amount === undefined) return '—';
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0,
    }).format(amount).replace('₽', currency.trim());
  },

  /**
   * Получить статус проекта (класс)
   */
  getProjectStatusClass(status) {
    const map = {
      'not-started': 'status-not-started',
      'in-progress': 'status-in-progress',
      'completed': 'status-completed',
      'review': 'status-revision',
    };
    return map[status] || 'status-not-started';
  },

  /**
   * Получить статус проекта (текст)
   */
  getProjectStatusText(status) {
    const map = {
      'not-started': 'Не начат',
      'in-progress': 'В работе',
      'completed': 'Завершён',
      'review': 'На согласовании',
    };
    return map[status] || status;
  },

  /**
   * Получить статус раздела (класс)
   */
  getSectionStatusClass(status) {
    const map = {
      'done': 'section-done',
      'in-progress': 'section-in-progress',
      'review': 'section-review',
      'not-started': 'section-not-started',
      'overdue': 'section-overdue',
    };
    return map[status] || 'section-not-started';
  },

  /**
   * Получить статус раздела (текст)
   */
  getSectionStatusText(status) {
    const map = {
      'done': 'Завершён',
      'in-progress': 'В работе',
      'review': 'На проверке',
      'not-started': 'Не начат',
      'overdue': 'Просрочен',
    };
    return map[status] || status;
  },

  /**
   * Склонение слов
   */
  declension(number, words) {
    const cases = [2, 0, 1, 1, 1, 2];
    return words[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
  },

  /**
   * Инициализы из ФИО
   */
  getInitials(name) {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  },

  /**
   * Показать toast-уведомление
   */
  toast(message, type = 'info') {
    const colors = {
      success: 'bg-green-600',
      error: 'bg-red-600',
      warning: 'bg-amber-600',
      info: 'bg-slate-700',
    };

    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-xl shadow-lg z-50 transition-opacity duration-300`;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  // ==================== ИНДИКАТОРЫ СТАТУСОВ ====================

  /**
   * Получить статус изыскания (класс)
   */
  getSurveyStatusClass(status) {
    const map = {
      'done': 'survey-done',
      'completed': 'survey-done',
      'in-progress': 'survey-in-progress',
      'not-started': 'survey-not-started',
      'overdue': 'survey-overdue',
    };
    return map[status] || 'survey-not-started';
  },

  /**
   * Получить статус изыскания (текст)
   */
  getSurveyStatusText(status) {
    const map = {
      'done': 'Завершён',
      'completed': 'Завершён',
      'in-progress': 'В работе',
      'not-started': 'Не начат',
      'overdue': 'Просрочено',
    };
    return map[status] || status;
  },

  /**
   * Получить цвет для статуса (hex/css)
   */
  getStatusColor(status, format = 'bg') {
    const colors = {
      // Статусы проектов
      'not-started': { bg: '#f1f5f9', text: '#64748b', border: '#cbd5e1' },
      'in-progress': { bg: '#dbeafe', text: '#1d4ed8', border: '#93c5fd' },
      'completed': { bg: '#dcfce7', text: '#16a34a', border: '#86efac' },
      'review': { bg: '#fef3c7', text: '#d97706', border: '#fcd34d' },
      'overdue': { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' },
      // Для разделов
      'done': { bg: '#dcfce7', text: '#16a34a', border: '#86efac' },
    };

    const color = colors[status] || colors['not-started'];

    if (format === 'bg') return color.bg;
    if (format === 'text') return color.text;
    if (format === 'border') return color.border;
    if (format === 'all') return color;
    return color.bg;
  },

  /**
   * Получить иконку для статуса (SVG или emoji)
   */
  getStatusIcon(status, type = 'emoji') {
    const emojis = {
      'not-started': '⏸️',
      'in-progress': '⏳',
      'completed': '✅',
      'done': '✅',
      'review': '👀',
      'overdue': '⚠️',
      'critical': '🔴',
      'warning': '🟡',
      'success': '🟢',
    };

    const svgs = {
      'not-started': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />',
      'in-progress': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />',
      'completed': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />',
      'done': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />',
      'review': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />',
      'overdue': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />',
    };

    if (type === 'emoji') return emojis[status] || '❓';
    if (type === 'svg') return svgs[status] || svgs['not-started'];
    if (type === 'html') {
      return `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">${svgs[status] || svgs['not-started']}</svg>`;
    }
    return emojis[status] || '❓';
  },

  // ==================== ЧИСЛОВЫЕ ИНДИКАТОРЫ ====================

  /**
   * Рассчитать процент выполнения
   */
  calculateProgress(current, total) {
    if (!total || total === 0) return 0;
    return Math.round((current / total) * 100);
  },

  /**
   * Получить класс прогресс-бара по проценту
   */
  getProgressClass(percentage) {
    if (percentage >= 100) return 'progress-complete';
    if (percentage >= 75) return 'progress-good';
    if (percentage >= 50) return 'progress-medium';
    if (percentage >= 25) return 'progress-low';
    return 'progress-critical';
  },

  /**
   * Получить цвет прогресс-бара
   */
  getProgressColor(percentage) {
    if (percentage >= 100) return '#16a34a'; // green
    if (percentage >= 75) return '#059669'; // teal
    if (percentage >= 50) return '#2563eb'; // blue
    if (percentage >= 25) return '#d97706'; // amber
    return '#dc2626'; // red
  },

  /**
   * Рендер прогресс-бара
   */
  renderProgressBar(percentage, options = {}) {
    const {
      showLabel = true,
      size = 'md', // sm, md, lg
      color = 'auto',
    } = options;

    const heights = { sm: '4px', md: '8px', lg: '12px' };
    const barColor = color === 'auto' ? this.getProgressColor(percentage) : color;

    return `
      <div class="progress-wrapper">
        ${showLabel ? `
          <div class="flex justify-between text-xs mb-1">
            <span class="text-slate-500">Прогресс</span>
            <span class="font-medium">${percentage}%</span>
          </div>
        ` : ''}
        <div class="progress-bar" style="height: ${heights[size]};">
          <div 
            class="progress-bar-fill" 
            style="width: ${percentage}%; background: ${barColor};"
          ></div>
        </div>
      </div>
    `;
  },

  /**
   * Рендер числового индикатора (счётчик)
   */
  renderCounter(value, options = {}) {
    const {
      label,
      icon,
      trend, // 'up', 'down', 'neutral'
      color = 'slate',
      size = 'md', // sm, md, lg
    } = options;

    const sizes = {
      sm: { num: 'text-xl', label: 'text-xs' },
      md: { num: 'text-3xl', label: 'text-sm' },
      lg: { num: 'text-4xl', label: 'text-base' },
    };

    const trendIcons = {
      up: '↑',
      down: '↓',
      neutral: '→',
    };

    return `
      <div class="stat-card">
        <div class="flex items-center gap-2 mb-2">
          ${icon ? `<span class="text-lg">${icon}</span>` : ''}
          <span class="${sizes[size].label} text-slate-500">${label || ''}</span>
        </div>
        <div class="flex items-end gap-2">
          <span class="${sizes[size].num} font-bold text-slate-800">${value}</span>
          ${trend ? `
            <span class="text-sm ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-slate-400'}">
              ${trendIcons[trend]}
            </span>
          ` : ''}
        </div>
      </div>
    `;
  },

  // ==================== ЦВЕТОВЫЕ ИНДИКАТОРЫ ====================

  /**
   * Получить цвет по типу (для графиков, диаграмм)
   */
  getColorByType(type, palette = 'default') {
    const palettes = {
      default: [
        '#1e293b', '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
        '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316',
      ],
      status: [
        '#dc2626', '#d97706', '#2563eb', '#16a34a', '#64748b',
      ],
      pastel: [
        '#fecaca', '#fde68a', '#bbf7d0', '#bfdbfe', '#ddd6fe',
      ],
    };

    const colors = palettes[palette] || palettes.default;

    if (typeof type === 'number') {
      return colors[type % colors.length];
    }

    // Хеш из строки
    let hash = 0;
    for (let i = 0; i < type.length; i++) {
      hash = type.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  },

  /**
   * Получить класс цвета для приоритета
   */
  getPriorityClass(priority) {
    const map = {
      'critical': 'priority-critical',
      'high': 'priority-high',
      'medium': 'priority-medium',
      'low': 'priority-low',
    };
    return map[priority] || 'priority-low';
  },

  /**
   * Получить текст для приоритета
   */
  getPriorityText(priority) {
    const map = {
      'critical': 'Критичный',
      'high': 'Высокий',
      'medium': 'Средний',
      'low': 'Низкий',
    };
    return map[priority] || priority;
  },

  /**
   * Получить класс для типа уведомления
   */
  getNotificationTypeClass(type) {
    const map = {
      'task': 'notification-task',
      'project': 'notification-project',
      'comment': 'notification-comment',
      'file': 'notification-file',
      'expertise': 'notification-expertise',
      'system': 'notification-system',
    };
    return map[type] || 'notification-system';
  },

  // ==================== ИКОНКИ ПО ТИПАМ ====================

  /**
   * Получить иконку для типа сущности (SVG)
   */
  getEntityIcon(type, size = 'w-5 h-5') {
    const icons = {
      project: `<svg class="${size}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>`,
      section: `<svg class="${size}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>`,
      task: `<svg class="${size}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>`,
      employee: `<svg class="${size}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>`,
      survey: `<svg class="${size}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.806-.98l-5.394-2.697a1 1 0 00-.894 0L9 7" /></svg>`,
      file: `<svg class="${size}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>`,
      money: `<svg class="${size}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
      notification: `<svg class="${size}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>`,
      expertise: `<svg class="${size}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`,
      calendar: `<svg class="${size}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`,
      settings: `<svg class="${size}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`,
    };

    return icons[type] || icons.project;
  },

  /**
   * Получить emoji для типа сущности
   */
  getEntityEmoji(type) {
    const emojis = {
      project: '🏗️',
      section: '📁',
      task: '📋',
      employee: '👤',
      survey: '📊',
      file: '📎',
      money: '💰',
      notification: '🔔',
      expertise: '⚠️',
      calendar: '📅',
      settings: '⚙️',
    };
    return emojis[type] || '📄';
  },
};
