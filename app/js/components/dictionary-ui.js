/**
 * Универсальные компоненты для справочников
 * Используется на страницах:
 * - 13-1-settings-sections.html
 * - 13-2-settings-surveys.html
 * - 13-3-settings-expenses.html
 * - 13-4-settings-contractor-types.html
 */

const DictionaryUI = {
  /**
   * Рендер таблицы справочника
   */
  renderTable(containerId, items, columns, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (!items || items.length === 0) {
      container.innerHTML = `
        <div class="text-center py-8 text-slate-400">
          <p>Нет данных для отображения</p>
          ${options.addButton ? `
            <button class="btn-primary mt-3 text-sm py-2 px-4" onclick="${options.addButton.action}">
              ${options.addButton.label}
            </button>
          ` : ''}
        </div>
      `;
      return;
    }
    
    const headerHtml = this.renderTableHeader(columns);
    const rowsHtml = items.map(item => this.renderTableRow(item, columns, options)).join('');
    
    container.innerHTML = `
      <div class="overflow-x-auto">
        <table class="w-full">
          ${headerHtml}
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  },
  
  /**
   * Рендер заголовка таблицы
   */
  renderTableHeader(columns) {
    const headers = columns
      .filter(col => col.visible !== false)
      .map(col => `<th class="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">${col.label}</th>`)
      .join('');
    
    return `
      <thead class="bg-slate-50">
        <tr>${headers}</tr></thead>
    `;
  },
  
  /**
   * Рендер строки таблицы
   */
  renderTableRow(item, columns, options = {}) {
    const cells = columns
      .filter(col => col.visible !== false)
      .map(col => {
        const value = this.getCellContent(item, col);
        return `<td class="px-6 py-4 text-sm text-slate-700">${value}</td>`;
      })
      .join('');
    
    const actions = this.renderRowActions(item, options);
    
    return `
      <tr class="hover:bg-slate-50 transition-colors ${item.active === false ? 'opacity-50' : ''}">
        ${cells}
        ${actions}
      </tr>
    `;
  },
  
  /**
   * Получение содержимого ячейки
   */
  getCellContent(item, column) {
    if (column.render) {
      return column.render(item);
    }
    
    const value = item[column.field];
    
    switch (column.type) {
      case 'color':
        return `
          <span class="w-4 h-4 rounded inline-block" style="background: ${value}"></span>
        `;
      
      case 'badge':
        return `
          <span class="badge ${column.getClass ? column.getClass(value) : ''}">
            ${column.getText ? column.getText(value) : value}
          </span>
        `;
      
      case 'status':
        return `
          <span class="badge ${this.getStatusClass(value)}">
            ${this.getStatusText(value)}
          </span>
        `;
      
      case 'boolean':
        return value ? '✓' : '—';
      
      case 'money':
        return UI.formatMoney(value);
      
      case 'date':
        return UI.formatDate(value);
      
      default:
        return value || '—';
    }
  },
  
  /**
   * Рендер действий строки
   */
  renderRowActions(item, options = {}) {
    const actions = options.actions || [];
    if (actions.length === 0) return '';
    
    const buttons = actions.map(action => {
      const icon = action.icon || this.getActionIcon(action.type);
      const onClick = action.onClick || `${options.onAction || 'handleAction'}('${action.type}', ${item.id})`;
      
      return `
        <button 
          class="text-slate-400 hover:${this.getActionHoverClass(action.type)} transition-colors"
          onclick="${onClick}"
          title="${action.label || action.type}"
        >
          ${icon}
        </button>
      `;
    }).join('');
    
    return `
      <td class="px-6 py-4 text-right">
        <div class="flex gap-2 justify-end">
          ${buttons}
        </div>
      </td>
    `;
  },
  
  /**
   * Иконка действия по типу
   */
  getActionIcon(type) {
    const icons = {
      'edit': UI.getEntityIcon('settings', 'w-4 h-4'),
      'delete': `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      `,
      'view': UI.getEntityIcon('file', 'w-4 h-4'),
      'activate': `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      `,
      'deactivate': `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      `,
    };
    return icons[type] || icons['edit'];
  },
  
  /**
   * Класс ховера для действия
   */
  getActionHoverClass(type) {
    const classes = {
      'edit': 'text-blue-600',
      'delete': 'text-red-600',
      'view': 'text-green-600',
      'activate': 'text-green-600',
      'deactivate': 'text-amber-600',
    };
    return classes[type] || 'text-slate-600';
  },
  
  /**
   * Класс статуса
   */
  getStatusClass(status) {
    const map = {
      'active': 'status-completed',
      'inactive': 'status-not-started',
      'done': 'status-completed',
      'in-progress': 'status-in-progress',
      'not-started': 'status-not-started',
    };
    return map[status] || 'status-not-started';
  },
  
  /**
   * Текст статуса
   */
  getStatusText(status) {
    const map = {
      'active': 'Активен',
      'inactive': 'Неактивен',
      'done': 'Завершён',
      'in-progress': 'В работе',
      'not-started': 'Не начат',
    };
    return map[status] || status;
  },
  
  /**
   * Открытие модального окна
   */
  openModal(modalId, data = null) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.classList.remove('hidden');
    
    if (data) {
      // Заполнение формы данными для редактирования
      this.fillFormData(modal, data);
    }
  },
  
  /**
   * Закрытие модального окна
   */
  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.classList.add('hidden');
    
    // Очистка формы
    const form = modal.querySelector('form');
    if (form) form.reset();
  },
  
  /**
   * Заполнение формы данными
   */
  fillFormData(modal, data) {
    Object.keys(data).forEach(key => {
      const input = modal.querySelector(`[name="${key}"]`);
      if (input) {
        if (input.type === 'checkbox') {
          input.checked = data[key];
        } else {
          input.value = data[key];
        }
      }
    });
  },
  
  /**
   * Инициализация модального окна с формой
   */
  initModalForm(options) {
    const {
      modalId,
      formId,
      addButtonSelector,
      closeSelectors,
      onSubmit,
      onOpen,
    } = options;
    
    // Открытие модального окна
    document.querySelectorAll(addButtonSelector).forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const data = btn.dataset.edit ? JSON.parse(btn.dataset.edit) : null;
        this.openModal(modalId, data);
        if (onOpen) onOpen(data);
      });
    });
    
    // Закрытие модального окна
    closeSelectors?.forEach(selector => {
      document.querySelectorAll(selector).forEach(btn => {
        btn.addEventListener('click', () => this.closeModal(modalId));
      });
    });
    
    // Обработка отправки формы
    const form = document.getElementById(formId);
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      
      try {
        await onSubmit(data);
        this.closeModal(modalId);
        UI.toast('Сохранено успешно', 'success');
      } catch (error) {
        UI.toast(error.message || 'Ошибка при сохранении', 'error');
      }
    });
  },
  
  /**
   * Рендер цветового индикатора
   */
  renderColorPicker(name, value = '#3b82f6') {
    return `
      <div class="flex items-center gap-3">
        <input 
          type="color" 
          name="${name}" 
          value="${value}"
          class="w-10 h-10 rounded border border-slate-300 cursor-pointer"
        >
        <span class="text-sm text-slate-600 font-mono">${value}</span>
      </div>
    `;
  },
  
  /**
   * Рендер переключателя статусов
   */
  renderStatusToggle(name, value, options = []) {
    return `
      <div class="flex gap-2">
        ${options.map(opt => `
          <label class="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="${name}" 
              value="${opt.value}"
              ${value === opt.value ? 'checked' : ''}
              class="w-4 h-4 text-blue-600"
            >
            <span class="text-sm text-slate-700">${opt.label}</span>
          </label>
        `).join('')}
      </div>
    `;
  },
};

// Глобальные функции для справочников
window.handleDictionaryAction = async (type, id) => {
  const actions = {
    'edit': () => {
      // Открыть модальное окно редактирования
      const btn = document.querySelector(`[data-edit*="${id}"]`);
      if (btn && btn.dataset.edit) {
        const data = JSON.parse(btn.dataset.edit);
        DictionaryUI.openModal('dictionary-modal', data);
      }
    },
    'delete': async () => {
      if (!confirm('Вы уверены, что хотите удалить эту запись?')) return;
      // Вызвать API удаления
    },
    'activate': async () => {
      // Активировать запись
    },
    'deactivate': async () => {
      // Деактивировать запись
    },
  };
  
  if (actions[type]) {
    await actions[type]();
  }
};
