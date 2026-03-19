/**
 * DataBinder — автоматическая привязка данных к UI элементам
 * Использование: DataBinder.bind(containerElement, apiResponse);
 */

const DataBinder = {
  
  /**
   * Форматтеры данных
   */
  formatters: {
    'date': (v) => {
      if (!v) return '';
      const d = new Date(v);
      return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
    },
    'date-short': (v) => {
      if (!v) return '';
      const d = new Date(v);
      return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
    },
    'datetime': (v) => {
      if (!v) return '';
      const d = new Date(v);
      return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    },
    'relative-time': (v) => {
      if (!v) return '';
      const date = new Date(v);
      const now = new Date();
      const diff = now - date;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);
      
      if (minutes < 1) return 'Только что';
      if (minutes < 60) return `${minutes} ${declension(minutes, ['минуту', 'минуты', 'минут'])} назад`;
      if (hours < 24) return `${hours} ${declension(hours, ['час', 'часа', 'часов'])} назад`;
      if (days < 7) return `${days} ${declension(days, ['день', 'дня', 'дней'])} назад`;
      return DataBinder.formatters.date(v);
    },
    'money': (v) => {
      if (v === null || v === undefined) return '';
      return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(v);
    },
    'number': (v) => {
      if (v === null || v === undefined) return '0';
      return new Intl.NumberFormat('ru-RU').format(v);
    },
    'percent': (v) => {
      if (v === null || v === undefined) return '0%';
      return `${v}%`;
    },
    'deadline': (v) => {
      if (!v) return '';
      const date = new Date(v);
      const now = new Date();
      const diff = date - now;
      const days = Math.ceil(diff / 86400000);
      
      const dateStr = DataBinder.formatters.date(v);
      
      if (diff < 0) return `📅 до ${dateStr} 🔴`;
      if (days <= 3) return `📅 до ${dateStr} ⚠️`;
      return `📅 до ${dateStr}`;
    },
    'initials': (v) => {
      if (!v) return '';
      return v.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    }
  },
  
  /**
   * Маппинг статусов в CSS классы и текст
   */
  statusMaps: {
    // Статусы проектов
    'ProjectStatus': {
      'draft': { text: 'Черновик', class: 'status-draft', color: '#94a3b8' },
      'in_progress': { text: 'В работе', class: 'status-in-progress', color: '#3b82f6' },
      'on_approval': { text: 'На согласовании', class: 'status-on-approval', color: '#f59e0b' },
      'completed': { text: 'Завершён', class: 'status-completed', color: '#22c55e' },
      'archived': { text: 'В архиве', class: 'status-archived', color: '#64748b' }
    },
    // Статусы разделов
    'SectionStatus': {
      'not_started': { text: 'Не начат', class: 'section-not-started', indicator: 'section-not-started' },
      'in_progress': { text: 'В работе', class: 'section-in-progress', indicator: 'section-in-progress' },
      'on_approval': { text: 'На согласовании', class: 'section-review', indicator: 'section-review' },
      'approved': { text: 'Согласован', class: 'section-done', indicator: 'section-done' },
      'on_expertise': { text: 'На экспертизе', class: 'section-review', indicator: 'section-review' },
      'overdue': { text: 'Просрочен', class: 'section-overdue', indicator: 'section-overdue' }
    },
    // Статусы изысканий
    'SurveyStatus': {
      'not_started': { text: 'Не начат', class: 'survey-not-started', indicator: 'survey-not-started' },
      'in_progress': { text: 'В работе', class: 'survey-in-progress', indicator: 'survey-in-progress' },
      'completed': { text: 'Завершён', class: 'survey-done', indicator: 'survey-done' }
    },
    // Статусы замечаний
    'ExpertiseStatus': {
      'created': { text: 'Создано', class: 'status-created' },
      'in_progress': { text: 'В работе', class: 'status-in-progress' },
      'review': { text: 'На проверке', class: 'status-review' },
      'closed': { text: 'Закрыто', class: 'status-completed' },
      'rejected': { text: 'Отклонено', class: 'status-rejected' }
    },
    // Приоритет
    'Priority': {
      'critical': { text: 'Критичный', class: 'priority-critical', attention: 'attention-critical' },
      'high': { text: 'Высокий', class: 'priority-high', attention: 'attention-warning' },
      'medium': { text: 'Средний', class: 'priority-medium', attention: 'attention-info' },
      'low': { text: 'Низкий', class: 'priority-low', attention: 'attention-info' }
    },
    // Приоритет внимания
    'AttentionPriority': {
      'critical': { class: 'attention-critical', textClass: 'red', iconClass: 'red' },
      'warning': { class: 'attention-warning', textClass: 'amber', iconClass: 'amber' },
      'info': { class: 'attention-info', textClass: 'blue', iconClass: 'blue' }
    }
  },
  
  /**
   * Получение вложенного значения из объекта
   */
  getNestedValue(obj, path) {
    if (!path) return obj;
    return path.split('.').reduce((acc, part) => {
      if (acc === null || acc === undefined) return undefined;
      // Поддержка массивов: items[].name
      if (part.endsWith('[]')) {
        const key = part.slice(0, -2);
        return acc[key];
      }
      return acc[part];
    }, obj);
  },
  
  /**
   * Установка значения в элемент
   */
  setElementValue(element, value, data) {
    const format = element.dataset.format;
    const defaultValue = element.dataset.default;
    
    let displayValue = value;
    
    // Применяем форматирование
    if (format && this.formatters[format]) {
      displayValue = this.formatters[format](value, data);
    }
    
    // Если значение undefined/null, используем default
    if (displayValue === undefined || displayValue === null || displayValue === '') {
      displayValue = defaultValue ?? '';
    }
    
    // Проверяем тип элемента
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
      element.value = displayValue;
    } else {
      element.textContent = displayValue;
    }
  },
  
  /**
   * Установка атрибута
   */
  setElementAttribute(element, attrTemplate, data) {
    const attrName = attrTemplate.split(':')[0];
    const attrValue = attrTemplate.split(':')[1];
    
    if (attrValue && attrValue.includes('{')) {
      // Шаблон с подстановкой
      let result = attrValue;
      const matches = attrValue.match(/\{([^}]+)\}/g);
      if (matches) {
        matches.forEach(match => {
          const field = match.slice(1, -1);
          const value = this.getNestedValue(data, field);
          result = result.replace(match, value ?? '');
        });
      }
      element.setAttribute(attrName, result);
    }
  },
  
  /**
   * Применение маппинга класса
   */
  applyClassMap(element, mapConfig, value) {
    const [field, ...classes] = mapConfig.split(':');
    
    // Удаляем старые классы
    classes.forEach(cls => {
      if (cls.includes(',')) {
        cls.split(',').forEach(c => element.classList.remove(c.trim()));
      } else {
        element.classList.remove(cls.trim());
      }
    });
    
    // Находим индекс для значения
    let index = -1;
    
    // Если значение enum, используем маппинг
    const enumName = element.dataset.enum;
    if (enumName && this.statusMaps[enumName]) {
      const mapping = this.statusMaps[enumName][value];
      if (mapping && mapping.class) {
        element.classList.add(mapping.class);
        // Также обновляем текст, если есть
        if (mapping.text && !element.dataset.noUpdateText) {
          element.textContent = mapping.text;
        }
      }
    } else {
      // Простой маппинг по индексу или значению
      if (typeof value === 'boolean') {
        index = value ? 1 : 0;
      } else if (typeof value === 'number') {
        index = value;
      } else {
        // Ищем значение в классах
        index = classes.findIndex(cls => cls.toLowerCase().includes(value.toLowerCase()));
      }
      
      if (index >= 0 && index < classes.length) {
        const classToAdd = classes[index].split(',')[0].trim();
        element.classList.add(classToAdd);
      }
    }
  },
  
  /**
   * Привязка данных к одному элементу
   */
  bindElement(element, data) {
    // Простые значения
    if (element.dataset.value) {
      const value = this.getNestedValue(data, element.dataset.value);
      this.setElementValue(element, value, data);
    }
    
    // Атрибуты (href, src и т.д.)
    if (element.dataset.attr) {
      this.setElementAttribute(element, element.dataset.attr, data);
    }
    
    // Ссылка (href)
    if (element.dataset.link) {
      let link = element.dataset.link;
      const matches = link.match(/\{([^}]+)\}/g);
      if (matches) {
        matches.forEach(match => {
          const field = match.slice(1, -1);
          const value = this.getNestedValue(data, field);
          link = link.replace(match, value ?? '');
        });
      }
      element.setAttribute('href', link);
    }
    
    // Маппинг классов
    if (element.dataset.classMap) {
      const field = element.dataset.classMap.split(':')[0];
      const value = this.getNestedValue(data, field);
      this.applyClassMap(element, element.dataset.classMap, value);
    }
    
    // Boolean класс (для read/unread и т.д.)
    if (element.dataset.boolClass) {
      const [field, trueClass, falseClass] = element.dataset.boolClass.split(':');
      const value = this.getNestedValue(data, field);
      element.classList.remove(trueClass, falseClass);
      element.classList.add(value ? trueClass : falseClass);
    }
    
    // Стиль (например, width для прогресс-бара)
    if (element.dataset.style) {
      const [prop, template] = element.dataset.style.split(':');
      let value = template;
      const matches = template.match(/\{([^}]+)\}/g);
      if (matches) {
        matches.forEach(match => {
          const field = match.slice(1, -1);
          const val = this.getNestedValue(data, field);
          value = value.replace(match, val ?? '');
        });
      }
      element.style[prop] = value;
    }
  },
  
  /**
   * Привязка данных к контейнеру и всем дочерним элементам
   */
  bind(container, data) {
    if (!container || !data) return;
    
    // Привязываем сам контейнер
    this.bindElement(container, data);
    
    // Привязываем все дочерние элементы с data-атрибутами
    container.querySelectorAll('[data-value], [data-link], [data-attr], [data-class-map], [data-bool-class], [data-style]').forEach(el => {
      this.bindElement(el, data);
    });
  },
  
  /**
   * Рендер списка из массива данных
   */
  renderList(container, items, templateId, options = {}) {
    if (!container || !items) return;
    
    const template = document.querySelector(`[data-template="${templateId}"]`);
    if (!template) {
      console.warn(`Template not found: ${templateId}`);
      return;
    }
    
    // Очищаем контейнер (кроме шаблона)
    container.innerHTML = '';
    
    // Ограничиваем количество
    const limit = options.limit || items.length;
    const itemsToRender = items.slice(0, limit);
    
    itemsToRender.forEach((item, index) => {
      const clone = template.cloneNode(true);
      clone.removeAttribute('data-template');
      clone.style.display = '';
      
      // Добавляем data-index
      clone.dataset.index = index;
      
      // Привязываем данные
      this.bind(clone, item);
      
      container.appendChild(clone);
    });
  },
  
  /**
   * Рендер индикаторов разделов/изысканий
   */
  renderIndicators(container, items, type = 'section') {
    if (!container || !items) return;
    
    container.innerHTML = '';
    
    // Добавляем префикс
    const prefix = document.createElement('span');
    prefix.className = 'text-xs text-slate-400 font-medium';
    prefix.textContent = type === 'section' ? 'Р:' : 'И:';
    container.appendChild(prefix);
    
    items.forEach(item => {
      const indicator = document.createElement('a');
      indicator.href = `${type === 'section' ? '06-section-detail' : '14-survey-detail'}.html?id=${item.id}`;
      indicator.className = `${type}-indicator`;
      indicator.dataset.enum = type === 'section' ? 'SectionStatus' : 'SurveyStatus';
      indicator.dataset.classMap = `status:${type}-done,${type}-in-progress,${type}-review,${type}-not-started,${type}-overdue`;
      
      // Код
      const code = document.createElement('span');
      code.dataset.value = 'code';
      code.textContent = item.code;
      
      // Tooltip
      const tooltip = document.createElement('span');
      tooltip.className = `${type}-tooltip`;
      tooltip.innerHTML = `
        <span class="${type}-tooltip-title" data-value="name"></span>
        <span class="${type}-tooltip-row"><span>Статус:</span> <span data-value="status" data-enum="${type === 'section' ? 'SectionStatus' : 'SurveyStatus'}"></span></span>
        <span class="${type}-tooltip-row"><span>Ответственный:</span> <span data-value="responsible.name">Не назначен</span></span>
      `;
      
      indicator.appendChild(code);
      indicator.appendChild(tooltip);
      container.appendChild(indicator);
      
      // Привязываем данные
      this.bind(indicator, item);
    });
  },
  
  /**
   * Показ состояния загрузки
   */
  showLoading(container) {
    container.querySelectorAll('[data-value]').forEach(el => {
      el.classList.add('animate-pulse');
      el.style.color = '#e2e8f0';
      el.textContent = '—';
    });
  },
  
  /**
   * Скрытие состояния загрузки
   */
  hideLoading(container) {
    container.querySelectorAll('[data-value]').forEach(el => {
      el.classList.remove('animate-pulse');
      el.style.color = '';
    });
  },
  
  /**
   * Показ пустого состояния
   */
  showEmpty(container, message = 'Нет данных') {
    container.innerHTML = `
      <div class="text-center py-8 text-slate-400">
        <p>${message}</p>
      </div>
    `;
  },
  
  /**
   * Показ ошибки
   */
  showError(container, message = 'Ошибка загрузки данных') {
    container.innerHTML = `
      <div class="text-center py-8 text-red-500">
        <p>${message}</p>
        <button class="mt-2 text-sm text-blue-500 hover:underline" onclick="location.reload()">Повторить</button>
      </div>
    `;
  }
};

// Вспомогательная функция склонения
function declension(number, words) {
  const cases = [2, 0, 1, 1, 1, 2];
  return words[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DataBinder;
}
