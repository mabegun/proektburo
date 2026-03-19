/**
 * UI Helpers - утилиты для работы с интерфейсом
 *
 * Включает:
 * - Состояния (loading, error, empty)
 * - Форматирование (даты, деньги, текст)
 * - Индикаторы статусов
 * - Toast уведомления
 * - DictionaryUI - компонент для справочников
 * - ModalUI - компонент для модальных окон
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

// ==================== DICTIONARY UI ====================

/**
 * Компонент для отображения справочников
 */
const DictionaryUI = {
  /**
   * Рендер таблицы справочника
   */
  renderTable(containerId, items, columns, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!items || items.length === 0) {
      UI.showEmpty(`#${containerId}`, 'Нет записей');
      return;
    }

    const { actions = [], addButton = null, onAction = null } = options;

    let html = `
      <!-- Заголовок таблицы -->
      <div class="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500">
        ${columns.map(col => `
          <div class="${col.type === 'color' ? 'col-span-1' : col.field === 'name' ? 'col-span-5' : 'col-span-2'}">${col.label}</div>
        `).join('')}
        ${actions.length > 0 ? '<div class="col-span-2 text-right">Действия</div>' : ''}
      </div>

      <!-- Строки -->
      <div class="divide-y divide-slate-100">
    `;

    items.forEach(item => {
      html += `
        <div class="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 transition-colors ${!item.active ? 'opacity-50' : ''}">
          ${columns.map(col => this.renderCell(item, col)).join('')}
          ${actions.length > 0 ? this.renderActions(item, actions, onAction) : ''}
        </div>
      `;
    });

    html += '</div>';

    // Кнопка добавления
    if (addButton) {
      html += `
        <div class="p-4 border-t border-slate-100">
          <button onclick="${addButton.action}" class="btn-secondary w-full">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            ${addButton.label}
          </button>
        </div>
      `;
    }

    container.innerHTML = html;
  },

  /**
   * Рендер ячейки
   */
  renderCell(item, col) {
    const value = item[col.field];

    if (col.type === 'color') {
      return `
        <div class="col-span-1">
          <div class="w-10 h-10 rounded-lg" style="background-color: ${value || '#94a3b8'};"></div>
        </div>
      `;
    }

    if (col.type === 'status') {
      const isActive = item.active !== false;
      return `
        <div class="col-span-2">
          <span class="${isActive ? 'status-active' : 'status-inactive'} px-3 py-1 rounded-full text-sm">
            ${isActive ? 'Активен' : 'Неактивен'}
          </span>
        </div>
      `;
    }

    if (col.render) {
      return `<div class="col-span-2">${col.render(item)}</div>`;
    }

    const colSpan = col.field === 'name' ? 'col-span-5' : 'col-span-2';
    return `<div class="${colSpan} ${col.field === 'code' ? 'font-semibold text-slate-800' : 'text-slate-600'}">${value || '—'}</div>`;
  },

  /**
   * Рендер действий
   */
  renderActions(item, actions, onAction) {
    const buttons = actions.map(action => {
      const icons = {
        edit: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />',
        deactivate: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />',
        activate: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />',
      };

      return `
        <button class="btn-icon" onclick="${onAction}('${action}', '${item.id}')" title="${action === 'edit' ? 'Редактировать' : action === 'deactivate' ? 'Деактивировать' : 'Активировать'}">
          <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">${icons[action]}</svg>
        </button>
      `;
    }).join('');

    return `<div class="col-span-2 flex justify-end gap-2">${buttons}</div>`;
  },
};

// ==================== MODAL UI ====================

/**
 * Компонент для работы с модальными окнами
 */
const ModalUI = {
  /**
   * Инициализация модального окна
   */
  initModal(options) {
    const { modalId, openButtonSelector, closeSelectors, formId, validate, onSubmit } = options;

    // Закрытие по кнопкам
    if (closeSelectors) {
      document.querySelectorAll(closeSelectors.join(', ')).forEach(btn => {
        btn.addEventListener('click', () => this.close(modalId));
      });
    }

    // Обработка формы
    if (formId) {
      const form = document.getElementById(formId);
      if (form) {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();

          const data = this.getFormData(formId);

          // Валидация
          if (validate) {
            const errors = validate(data);
            if (errors.length > 0) {
              UI.toast(errors[0], 'error');
              return;
            }
          }

          // Отправка
          try {
            await onSubmit(data);
            this.close(modalId);
            UI.toast('Сохранено', 'success');
          } catch (error) {
            UI.toast(error.message || 'Ошибка сохранения', 'error');
          }
        });
      }
    }
  },

  /**
   * Открыть модальное окно
   */
  open(modalId, options = {}) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';

      if (options.autoFocus) {
        const input = modal.querySelector('input:not([type="hidden"])');
        if (input) input.focus();
      }
    }
  },

  /**
   * Закрыть модальное окно
   */
  close(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  },

  /**
   * Получить данные формы
   */
  getFormData(formId) {
    const form = document.getElementById(formId);
    if (!form) return {};

    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    return data;
  },

  /**
   * Заполнить форму данными
   */
  fillForm(formId, data) {
    const form = document.getElementById(formId);
    if (!form || !data) return;

    Object.keys(data).forEach(key => {
      const input = form.querySelector(`[name="${key}"], #${key}`);
      if (input) {
        if (input.type === 'checkbox') {
          input.checked = !!data[key];
        } else {
          input.value = data[key];
        }
      }
    });
  },

  /**
   * Рендер полей формы
   */
  renderFields(fields) {
    return fields.map(field => {
      if (field.type === 'select') {
        return `
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">${field.label}</label>
            <select name="${field.name}" class="input-field" ${field.required ? 'required' : ''}>
              ${field.placeholder ? `<option value="">${field.placeholder}</option>` : ''}
              ${(field.options || []).map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
            </select>
          </div>
        `;
      }

      return `
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">${field.label}</label>
          <input type="${field.type || 'text'}" name="${field.name}" class="input-field" 
            placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}>
        </div>
      `;
    }).join('');
  },
};
