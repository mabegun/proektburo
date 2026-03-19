/**
 * Скрипт для Дашборда (02-dashboard.html)
 * Загружает данные из API и обновляет интерфейс
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Проверка авторизации
  await initPage({ requireAuth: false, loadProfile: true });
  
  // Загрузка данных дашборда
  await loadDashboard();
  
  // Загрузка уведомлений
  await loadNotifications();
  
  // Инициализация поиска
  initSearch();
});

/**
 * Обновление профиля пользователя в сайдбаре
 */

/**
 * Загрузка данных дашборда
 */
async function loadDashboard() {
  try {
    // Показываем загрузку
    UI.showLoading('#dashboard-stats');
    UI.showLoading('#attention-block');
    
    // Загружаем статистику и критичные события
    const [stats, attention] = await Promise.all([
      API.dashboard.getStats(),
      API.dashboard.getAttention(),
    ]);
    
    // Рендерим статистику
    renderStats(stats);
    
    // Рендерим блок "Требуют внимания"
    renderAttention(attention);
    
    // Загружаем проекты для карточек
    await loadRecentProjects();
    
  } catch (error) {
    console.error('Ошибка загрузки дашборда:', error);
    UI.showError('#dashboard-content', 'Не удалось загрузить данные дашборда. Попробуйте обновить страницу.');
  }
}

/**
 * Рендер карточек статистики
 */
function renderStats(stats) {
  // Обновляем отдельные элементы статистики
  const totalEl = document.getElementById('stat-total');
  const activeEl = document.getElementById('stat-active');
  const sectionsEl = document.getElementById('stat-sections');
  const tasksEl = document.getElementById('stat-tasks');
  
  if (totalEl) totalEl.textContent = stats.projects?.total || 0;
  if (activeEl) activeEl.textContent = stats.projects?.active || 0;
  
  if (sectionsEl) {
    const inProgress = stats.sections?.in_progress || 0;
    const total = stats.sections?.total || 0;
    sectionsEl.innerHTML = `${inProgress}<span class="text-lg text-slate-400">/${total}</span>`;
  }
  
  if (tasksEl) tasksEl.textContent = stats.tasks?.total || 0;
}

/**
 * Рендер блока "Требуют внимания"
 */
function renderAttention(attentionItems) {
  const container = document.getElementById('attention-list');
  if (!container) return;
  
  if (!attentionItems || attentionItems.length === 0) {
    container.innerHTML = '<div class="col-span-3 text-center text-slate-400 py-8">Нет событий, требующих внимания ✅</div>';
    return;
  }
  
  const attentionCards = attentionItems.slice(0, 6).map(item => {
    const typeClass = item.priority === 'critical' ? 'attention-critical' : 
                      item.priority === 'warning' ? 'attention-warning' : 'attention-info';
    
    const icons = {
      'overdue-project': '📅',
      'pending-review': '⏳',
      'overdue-payment': '💰',
      'deadline-soon': '⏰',
      'missing-documents': '📋',
    };
    
    return `
      <a href="${item.link}" class="attention-card ${typeClass} p-4 rounded-xl">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="font-semibold text-${item.priority === 'critical' ? 'red' : item.priority === 'warning' ? 'amber' : 'blue'}-800 text-sm">${item.title}</p>
            <p class="text-${item.priority === 'critical' ? 'red' : item.priority === 'warning' ? 'amber' : 'blue'}-600 text-xs mt-1">${item.description}</p>
            <p class="text-${item.priority === 'critical' ? 'red' : item.priority === 'warning' ? 'amber' : 'blue'}-500 text-xs mt-2">${item.badge}</p>
          </div>
          <svg class="w-5 h-5 text-${item.priority === 'critical' ? 'red' : item.priority === 'warning' ? 'amber' : 'blue'}-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </a>
    `;
  }).join('');
  
  container.innerHTML = attentionCards;
}

/**
 * Загрузка последних проектов
 */
async function loadRecentProjects() {
  try {
    const data = await API.projects.getList({ limit: 5 });
    renderProjects(data.items);
  } catch (error) {
    console.error('Ошибка загрузки проектов:', error);
  }
}

/**
 * Рендер списка проектов
 */
function renderProjects(projects) {
  const container = document.getElementById('projects-list');
  if (!container) return;
  
  if (!projects || projects.length === 0) {
    container.innerHTML = '<div class="text-center text-slate-400 py-8">Нет проектов для отображения</div>';
    return;
  }
  
  const projectsHtml = projects.map(project => `
    <a href="04-project-detail.html?id=${project.id}" class="block p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-mono text-slate-400">${project.code}</span>
            <span class="badge ${UI.getProjectStatusClass(project.status)}">${UI.getProjectStatusText(project.status)}</span>
          </div>
          <h3 class="font-semibold text-slate-800">${project.name}</h3>
          <p class="text-sm text-slate-500 mt-1">${project.address}</p>
          <div class="flex items-center gap-4 mt-3 text-xs text-slate-500">
            <span>📅 до ${UI.formatDate(project.deadline)}</span>
            <span>📁 ${project.sectionsCount || 0} разделов</span>
          </div>
        </div>
        <div class="w-32">
          <div class="flex justify-between text-xs mb-1">
            <span class="text-slate-500">Прогресс</span>
            <span class="font-medium">${project.progress}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-bar-fill" style="width: ${project.progress}%"></div>
          </div>
        </div>
      </div>
    </a>
  `).join('');
  
  container.innerHTML = projectsHtml;
}

/**
 * Загрузка уведомлений
 */
async function loadNotifications() {
  try {
    const [notifications, unreadCount] = await Promise.all([
      API.notifications.getList({ limit: 4 }),
      API.notifications.getUnreadCount(),
    ]);
    
    renderNotifications(notifications.items);
    updateUnreadCount(unreadCount.count);
  } catch (error) {
    console.error('Ошибка загрузки уведомлений:', error);
  }
}

/**
 * Рендер уведомлений в выпадающем списке
 */
function renderNotifications(notifications) {
  const container = document.getElementById('notifications-list');
  if (!container) return;
  
  if (!notifications || notifications.length === 0) {
    container.innerHTML = '<div class="p-4 text-center text-slate-400 text-sm">Нет уведомлений</div>';
    return;
  }
  
  const icons = {
    'task': '📋',
    'project': '🏗️',
    'comment': '💬',
    'file': '📎',
    'expertise': '⚠️',
  };
  
  const html = notifications.map(notif => `
    <a href="${notif.link}" class="block p-4 hover:bg-slate-50 border-b border-slate-50">
      <div class="flex items-start gap-3">
        <div class="w-2 h-2 rounded-full bg-${notif.read ? 'slate' : 'red'}-500 mt-2 flex-shrink-0"></div>
        <div class="flex-1">
          <p class="text-sm font-medium text-slate-700">${notif.title}</p>
          <p class="text-xs text-slate-500 mt-1">${notif.description}</p>
          <p class="text-xs text-slate-400 mt-2">${formatNotificationTime(notif.createdAt)}</p>
        </div>
      </div>
    </a>
  `).join('');
  
  container.innerHTML = html;
}

/**
 * Обновление счётчика непрочитанных уведомлений
 */
function updateUnreadCount(count) {
  const badges = document.querySelectorAll('.notifications-badge');
  badges.forEach(badge => {
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }
  });
}

/**
 * Форматирование времени уведомления
 */
function formatNotificationTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Только что';
  if (minutes < 60) return `${minutes} ${UI.declension(minutes, ['минуту', 'минуты', 'минут'])} назад`;
  if (hours < 24) return `${hours} ${UI.declension(hours, ['час', 'часа', 'часов'])} назад`;
  if (days < 7) return `${days} ${UI.declension(days, ['день', 'дня', 'дней'])} назад`;
  
  return UI.formatDate(dateString);
}

/**
 * Инициализация глобального поиска
 */
function initSearch() {
  const searchInput = document.getElementById('global-search-input');
  if (!searchInput) return;
  
  let debounceTimer;
  
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    const query = e.target.value.trim();
    
    if (query.length < 2) {
      document.getElementById('search-results').innerHTML = '';
      return;
    }
    
    debounceTimer = setTimeout(() => search(query), 300);
  });
}

/**
 * Поиск по системе
 */
async function search(query) {
  try {
    const results = await api.get(`/search?q=${encodeURIComponent(query)}`);
    renderSearchResults(results);
  } catch (error) {
    console.error('Ошибка поиска:', error);
  }
}

/**
 * Рендер результатов поиска
 */
function renderSearchResults(results) {
  const container = document.getElementById('search-results');
  if (!container) return;
  
  if (!results || results.length === 0) {
    container.innerHTML = '<div class="p-4 text-center text-slate-400 text-sm">Ничего не найдено</div>';
    return;
  }
  
  const icons = {
    'project': '🏗️',
    'section': '📁',
    'task': '📋',
    'employee': '👤',
  };
  
  const html = results.slice(0, 8).map(item => `
    <a href="${item.link}" class="search-result-item">
      <div class="search-icon ${item.type}">${icons[item.type] || '📄'}</div>
      <div class="search-item-info">
        <div class="search-item-title">${item.title}</div>
        <div class="search-item-subtitle">${item.subtitle}</div>
      </div>
    </a>
  `).join('');
  
  container.innerHTML = html;
}

/**
 * Открытие/закрытие уведомлений
 */
function toggleNotifications() {
  const dropdown = document.getElementById('notificationsDropdown');
  if (dropdown) {
    dropdown.classList.toggle('hidden');
  }
}

/**
 * Открытие поиска
 */
function openSearch() {
  const modal = document.getElementById('searchModal');
  if (modal) {
    modal.classList.add('active');
    document.getElementById('global-search-input')?.focus();
  }
}

/**
 * Закрытие поиска
 */
function closeSearch() {
  const modal = document.getElementById('searchModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// Горячие клавиши
document.addEventListener('keydown', (e) => {
  // Ctrl+K или Cmd+K для поиска
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    openSearch();
  }
  
  // Escape закрывает поиск
  if (e.key === 'Escape') {
    closeSearch();
  }
});
