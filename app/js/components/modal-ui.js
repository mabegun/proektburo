/**
 * Универсальные компоненты для модальных окон и форм
 */

const ModalUI = {
  /**
   * Открыть модальное окно
   */
  open(modalId, options = {}) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Блокировка прокрутки фона
    
    // Автофокус на первом поле
    if (options.autoFocus) {
      const firstInput = modal.querySelector('input, textarea, select');
      firstInput?.focus();
    }
    
    // Вызов колбэка
    if (options.onOpen) {
      options.onOpen();
    }
  },
  
  /**
   * Закрыть модальное окно
   */
  close(modalId, options = {}) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.classList.add('hidden');
    document.body.style.overflow = ''; // Разблокировка прокрутки
    
    // Очистка формы
    if (options.clearForm) {
      const form = modal.querySelector('form');
      if (form) form.reset();
    }
    
    // Вызов колбэка
    if (options.onClose) {
      options.onClose();
    }
  },
  
  /**
   * Инициализация модальных окон на странице
   */
  initModals(configs) {
    configs.forEach(config => {
      this.initModal(config);
    });
  },
  
  /**
   * Инициализация одного модального окна
   */
  initModal(config) {
    const {
      modalId,
      openButtonSelector,
      closeSelectors,
      formId,
      onSubmit,
      onOpen,
      onClose,
      validate,
    } = config;
    
    // Кнопки открытия
    document.querySelectorAll(openButtonSelector).forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const data = btn.dataset.edit ? JSON.parse(btn.dataset.edit) : null;
        this.open(modalId, { autoFocus: true, onOpen: () => onOpen?.(data) });
        
        // Если есть данные для редактирования — заполняем форму
        if (data && formId) {
          this.fillForm(formId, data);
        }
      });
    });
    
    // Кнопки закрытия
    closeSelectors?.forEach(selector => {
      document.querySelectorAll(selector).forEach(btn => {
        btn.addEventListener('click', () => {
          this.close(modalId, { clearForm: true, onClose });
        });
      });
    });
    
    // Закрытие по клику вне модального окна
    const modal = document.getElementById(modalId);
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.close(modalId, { clearForm: true, onClose });
      }
    });
    
    // Обработка формы
    if (formId && onSubmit) {
      const form = document.getElementById(formId);
      form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Валидация
        if (validate) {
          const errors = validate(data);
          if (errors.length > 0) {
            errors.forEach(err => UI.toast(err, 'error'));
            return;
          }
        }
        
        try {
          await onSubmit(data);
          this.close(modalId, { clearForm: true });
          UI.toast('Сохранено успешно', 'success');
        } catch (error) {
          UI.toast(error.message || 'Ошибка при сохранении', 'error');
        }
      });
    }
  },
  
  /**
   * Заполнение формы данными
   */
  fillForm(formId, data) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    form.reset();
    
    Object.keys(data).forEach(key => {
      const input = form.querySelector(`[name="${key}"]`);
      if (input) {
        if (input.type === 'checkbox') {
          input.checked = data[key];
        } else if (input.type === 'radio') {
          const radio = form.querySelector(`[name="${key}"][value="${data[key]}"]`);
          if (radio) radio.checked = true;
        } else {
          input.value = data[key];
        }
      }
    });
  },
  
  /**
   * Показать загрузку в модальном окне
   */
  showLoading(modalId, message = 'Сохранение...') {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    const submitBtn = modal.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="animate-spin">⏳</span> ${message}`;
    }
  },
  
  /**
   * Скрыть загрузку в модальном окне
   */
  hideLoading(modalId, defaultText = 'Сохранить') {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    const submitBtn = modal.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = defaultText;
    }
  },
  
  /**
   * Рендер модального окна (динамическое создание)
   */
  render(options) {
    const {
      id,
      title,
      size = 'md', // sm, md, lg, xl
      children,
      showClose = true,
      footer,
    } = options;
    
    const sizes = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
    };
    
    return `
      <div id="${id}" class="modal fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-xl ${sizes[size]} w-full max-h-[90vh] overflow-hidden flex flex-col">
          <!-- Заголовок -->
          <div class="flex items-center justify-between p-6 border-b border-slate-200">
            <h3 class="text-lg font-semibold text-slate-800">${title}</h3>
            ${showClose ? `
              <button class="text-slate-400 hover:text-slate-600" onclick="ModalUI.close('${id}')">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ` : ''}
          </div>
          
          <!-- Контент -->
          <div class="p-6 overflow-y-auto flex-1">
            ${children}
          </div>
          
          <!-- Подвал -->
          ${footer ? `
            <div class="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
              ${footer}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  },
  
  /**
   * Рендер полей формы
   */
  renderFields(fields) {
    return fields.map(field => {
      switch (field.type) {
        case 'text':
        case 'email':
        case 'password':
        case 'number':
        case 'tel':
        case 'url':
        case 'date':
          return this.renderInput(field);
        
        case 'textarea':
          return this.renderTextarea(field);
        
        case 'select':
          return this.renderSelect(field);
        
        case 'checkbox':
          return this.renderCheckbox(field);
        
        case 'radio':
          return this.renderRadio(field);
        
        case 'file':
          return this.renderFileInput(field);
        
        default:
          return this.renderInput(field);
      }
    }).join('');
  },
  
  /**
   * Рендер текстового поля
   */
  renderInput(field) {
    return `
      <div class="mb-4">
        <label class="block text-sm font-medium text-slate-700 mb-2">
          ${field.label} ${field.required ? '<span class="text-red-500">*</span>' : ''}
        </label>
        <input
          type="${field.type || 'text'}"
          name="${field.name}"
          id="${field.id || field.name}"
          value="${field.value || ''}"
          placeholder="${field.placeholder || ''}"
          ${field.required ? 'required' : ''}
          ${field.disabled ? 'disabled' : ''}
          ${field.readonly ? 'readonly' : ''}
          ${field.pattern ? `pattern="${field.pattern}"` : ''}
          ${field.min ? `min="${field.min}"` : ''}
          ${field.max ? `max="${field.max}"` : ''}
          class="w-full rounded-xl border border-slate-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
        >
        ${field.hint ? `<p class="text-xs text-slate-500 mt-1">${field.hint}</p>` : ''}
      </div>
    `;
  },
  
  /**
   * Рендер текстовой области
   */
  renderTextarea(field) {
    return `
      <div class="mb-4">
        <label class="block text-sm font-medium text-slate-700 mb-2">
          ${field.label} ${field.required ? '<span class="text-red-500">*</span>' : ''}
        </label>
        <textarea
          name="${field.name}"
          id="${field.id || field.name}"
          rows="${field.rows || 4}"
          placeholder="${field.placeholder || ''}"
          ${field.required ? 'required' : ''}
          ${field.disabled ? 'disabled' : ''}
          class="w-full rounded-xl border border-slate-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors resize-y"
        >${field.value || ''}</textarea>
        ${field.hint ? `<p class="text-xs text-slate-500 mt-1">${field.hint}</p>` : ''}
      </div>
    `;
  },
  
  /**
   * Рендер селекта
   */
  renderSelect(field) {
    const options = field.options?.map(opt => 
      `<option value="${opt.value}" ${field.value === opt.value ? 'selected' : ''}>${opt.label}</option>`
    ).join('') || '';
    
    return `
      <div class="mb-4">
        <label class="block text-sm font-medium text-slate-700 mb-2">
          ${field.label} ${field.required ? '<span class="text-red-500">*</span>' : ''}
        </label>
        <select
          name="${field.name}"
          id="${field.id || field.name}"
          ${field.required ? 'required' : ''}
          ${field.disabled ? 'disabled' : ''}
          class="w-full rounded-xl border border-slate-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
        >
          ${field.placeholder ? `<option value="">${field.placeholder}</option>` : ''}
          ${options}
        </select>
        ${field.hint ? `<p class="text-xs text-slate-500 mt-1">${field.hint}</p>` : ''}
      </div>
    `;
  },
  
  /**
   * Рендер чекбокса
   */
  renderCheckbox(field) {
    return `
      <div class="mb-4">
        <label class="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="${field.name}"
            id="${field.id || field.name}"
            ${field.value ? 'checked' : ''}
            ${field.disabled ? 'disabled' : ''}
            class="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-1"
          >
          <div>
            <span class="text-sm font-medium text-slate-700">${field.label}</span>
            ${field.hint ? `<p class="text-xs text-slate-500 mt-1">${field.hint}</p>` : ''}
          </div>
        </label>
      </div>
    `;
  },
  
  /**
   * Рендер радио кнопок
   */
  renderRadio(field) {
    const options = field.options?.map(opt => `
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="${field.name}"
          value="${opt.value}"
          ${field.value === opt.value ? 'checked' : ''}
          class="w-4 h-4 text-blue-600"
        >
        <span class="text-sm text-slate-700">${opt.label}</span>
      </label>
    `).join('') || '';
    
    return `
      <div class="mb-4">
        <label class="block text-sm font-medium text-slate-700 mb-2">
          ${field.label} ${field.required ? '<span class="text-red-500">*</span>' : ''}
        </label>
        <div class="flex gap-4">
          ${options}
        </div>
        ${field.hint ? `<p class="text-xs text-slate-500 mt-1">${field.hint}</p>` : ''}
      </div>
    `;
  },
  
  /**
   * Рендер файла
   */
  renderFileInput(field) {
    return `
      <div class="mb-4">
        <label class="block text-sm font-medium text-slate-700 mb-2">
          ${field.label} ${field.required ? '<span class="text-red-500">*</span>' : ''}
        </label>
        <div class="flex items-center gap-3">
          <input
            type="file"
            name="${field.name}"
            id="${field.id || field.name}"
            accept="${field.accept || ''}"
            ${field.required ? 'required' : ''}
            ${field.multiple ? 'multiple' : ''}
            class="flex-1 rounded-xl border border-slate-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
          >
        </div>
        ${field.hint ? `<p class="text-xs text-slate-500 mt-1">${field.hint}</p>` : ''}
      </div>
    `;
  },
};

// Экспорт для глобального доступа
window.ModalUI = ModalUI;
