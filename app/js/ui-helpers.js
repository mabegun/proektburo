/**
 * UI Helpers - утилиты для работы с интерфейсом
 *
 * Включает:
 * - Состояния (loading, error, empty)
 * - Форматирование (даты, деньги, текст)
 * - Индикаторы статусов
 * - Toast уведомления
 */

const UI = {
  // ==================== СОСТОЯНИЯ ====================

  /**
   * Показать состояние загрузки
   */
  showLoading(selector) {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
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
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
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
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!el) return;

    el.innerHTML = `
      <div class="text-center p-8 text-slate-400">
        <div class="text-4xl mb-2">${icon}</div>
        <div>${message}</div>
      </div>
    `;
  },

  // ==================== ФОРМАТИРОВАНИЕ ====================

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
   * Форматировать дату и время
   */
  formatDateTime(dateString) {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  /**
   * Относительное время
   */
  formatRelativeTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Только что';
    if (minutes < 60) return `${minutes} ${this.declension(minutes, ['минуту', 'минуты', 'минут'])} назад`;
    if (hours < 24) return `${hours} ${this.declension(hours, ['час', 'часа', 'часов'])} назад`;
    if (days < 7) return `${days} ${this.declension(days, ['день', 'дня', 'дней'])} назад`;

    return this.formatDate(dateString);
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
   * Форматировать число с разделителями
   */
  formatNumber(number) {
    if (number === null || number === undefined) return '—';
    return new Intl.NumberFormat('ru-RU').format(number);
  },

  /**
   * Форматировать проценты
   */
  formatPercent(value) {
    if (value === null || value === undefined) return '—';
    return `${value}%`;
  },

  /**
   * Форматировать дедлайн
   */
  formatDeadline(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = date - now;
    const days = Math.ceil(diff / 86400000);

    let cssClass = 'deadline-normal';
    if (diff < 0) cssClass = 'deadline-overdue';
    else if (days <= 3) cssClass = 'deadline-soon';

    return `<span class="${cssClass}">📅 до ${this.formatDate(dateString)}</span>`;
  },

  /**
   * Склонение слов
   */
  declension(number, words) {
    const cases = [2, 0, 1, 1, 1, 2];
    return words[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
  },

  /**
   * Инициалы из ФИО
   */
  getInitials(name) {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  },

  // ==================== СТАТУСЫ ====================

  /**
   * Класс для статуса проекта
   */
  getProjectStatusClass(status) {
    const map = {
      'not-started': 'status-not-started',
      'draft': 'status-not-started',
      'in-progress': 'status-in-progress',
      'in_progress': 'status-in-progress',
      'completed': 'status-completed',
      'review': 'status-revision',
      'on_approval': 'status-revision',
    };
    return map[status] || 'status-not-started';
  },

  /**
   * Текст для статуса проекта
   */
  getProjectStatusText(status) {
    const map = {
      'not-started': 'Не начат',
      'draft': 'Черновик',
      'in-progress': 'В работе',
      'in_progress': 'В работе',
      'completed': 'Завершён',
      'review': 'На согласовании',
      'on_approval': 'На согласовании',
    };
    return map[status] || status;
  },

  /**
   * Класс для статуса раздела
   */
  getSectionStatusClass(status) {
    const map = {
      'done': 'section-done',
      'completed': 'section-done',
      'approved': 'section-done',
      'in-progress': 'section-in-progress',
      'in_progress': 'section-in-progress',
      'review': 'section-review',
      'on_approval': 'section-review',
      'not-started': 'section-not-started',
      'not_started': 'section-not-started',
      'overdue': 'section-overdue',
    };
    return map[status] || 'section-not-started';
  },

  /**
   * Текст для статуса раздела
   */
  getSectionStatusText(status) {
    const map = {
      'done': 'Завершён',
      'completed': 'Завершён',
      'approved': 'Согласован',
      'in-progress': 'В работе',
      'in_progress': 'В работе',
      'review': 'На проверке',
      'on_approval': 'На согласовании',
      'not-started': 'Не начат',
      'not_started': 'Не начат',
      'overdue': 'Просрочен',
    };
    return map[status] || status;
  },

  /**
   * Класс для статуса изыскания
   */
  getSurveyStatusClass(status) {
    const map = {
      'done': 'survey-done',
      'completed': 'survey-done',
      'in-progress': 'survey-in-progress',
      'in_progress': 'survey-in-progress',
      'not-started': 'survey-not-started',
      'not_started': 'survey-not-started',
    };
    return map[status] || 'survey-not-started';
  },

  /**
   * Текст для статуса изыскания
   */
  getSurveyStatusText(status) {
    const map = {
      'done': 'Завершён',
      'completed': 'Завершён',
      'in-progress': 'В работе',
      'in_progress': 'В работе',
      'not-started': 'Не начат',
      'not_started': 'Не начат',
    };
    return map[status] || status;
  },

  /**
   * Класс для приоритета
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
   * Текст для приоритета
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

  // ==================== ПРОГРЕСС ====================

  /**
   * Рассчитать процент выполнения
   */
  calculateProgress(current, total) {
    if (!total || total === 0) return 0;
    return Math.round((current / total) * 100);
  },

  /**
   * Цвет прогресс-бара
   */
  getProgressColor(percentage) {
    if (percentage >= 100) return '#16a34a';
    if (percentage >= 75) return '#059669';
    if (percentage >= 50) return '#2563eb';
    if (percentage >= 25) return '#d97706';
    return '#dc2626';
  },

  /**
   * HTML прогресс-бара
   */
  renderProgressBar(percentage, options = {}) {
    const { showLabel = true, size = 'md' } = options;
    const heights = { sm: '4px', md: '8px', lg: '12px' };
    const color = this.getProgressColor(percentage);

    return `
      <div class="progress-wrapper">
        ${showLabel ? `
          <div class="flex justify-between text-xs mb-1">
            <span class="text-slate-500">Прогресс</span>
            <span class="font-medium">${percentage}%</span>
          </div>
        ` : ''}
        <div class="progress-bar" style="height: ${heights[size]}; background: #e2e8f0; border-radius: 4px;">
          <div style="width: ${percentage}%; background: ${color}; height: 100%; border-radius: 4px; transition: width 0.3s;"></div>
        </div>
      </div>
    `;
  },

  // ==================== TOAST ====================

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

  // ==================== МОДАЛКИ ====================

  /**
   * Открыть модальное окно
   */
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  /**
   * Закрыть модальное окно
   */
  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },
};
