/**
 * Shared Functions - общие функции для всех страниц
 *
 * Подключается на всех страницах после api.js и ui-helpers.js
 */

// ==================== TOKEN MANAGEMENT ====================

/**
 * Получить токен авторизации
 */
function getAuthToken() {
  return localStorage.getItem('auth_token') || localStorage.getItem('token');
}

/**
 * Сохранить токен авторизации
 */
function setAuthToken(token) {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('token', token);
}

/**
 * Удалить токен авторизации
 */
function removeAuthToken() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

/**
 * Проверка авторизации
 */
async function checkAuth(requireAuth = false) {
  const token = getAuthToken();
  
  // Если авторизация обязательна, но токена нет - редирект на логин
  if (requireAuth && !token) {
    window.location.href = '01-login.html';
    return null;
  }
  
  // Если токен есть, пробуем получить профиль
  if (token) {
    try {
      const user = await API.auth.getCurrentUser();
      window.currentUser = user;
      return user;
    } catch (error) {
      console.error('Ошибка получения профиля:', error);
      // Если токен невалидный - очищаем
      if (requireAuth) {
        removeAuthToken();
        window.location.href = '01-login.html';
      }
      return null;
    }
  }
  
  return null;
}

/**
 * Получить параметр из URL
 */
function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param) || '';
}

/**
 * Инициализация страницы
 */
async function initPage(options = {}) {
  const { requireAuth = false, loadProfile = true } = options;

  // Проверка авторизации (если требуется)
  const user = await checkAuth(requireAuth);

  // Загрузка профиля в сайдбар
  if (loadProfile && user) {
    updateUserProfile(user);
  }

  return user;
}

/**
 * Обновление профиля в сайдбаре
 */
function updateUserProfile(user) {
  if (!user) return;
  
  // Обновляем имя пользователя
  const nameEl = document.getElementById('user-name');
  if (nameEl) nameEl.textContent = user.name;
  
  // Обновляем роль
  const roleEl = document.getElementById('user-role');
  if (roleEl) roleEl.textContent = getRoleText(user.role);
  
  // Обновляем приветствие (если есть)
  const welcomeEl = document.getElementById('welcome-name');
  if (welcomeEl) welcomeEl.textContent = user.name;
  
  // Обновляем аватар (если есть элемент с классом avatar)
  const avatarEl = document.querySelector('.avatar');
  if (avatarEl && user.name) {
    const initials = user.name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
    avatarEl.textContent = initials;
  }
}

/**
 * Текст роли пользователя
 */
function getRoleText(role) {
  const map = {
    'director': 'Директор',
    'gip': 'ГИП',
    'executor': 'Исполнитель',
    'engineer': 'Инженер',
    'accountant': 'Бухгалтер',
    'employee': 'Сотрудник',
  };
  return map[role] || role;
}

/**
 * Инициализация сайдбара
 */
function initSidebar() {
  // Подсветка текущей страницы
  const currentPath = window.location.pathname.split('/').pop();
  const sidebarLinks = document.querySelectorAll('.sidebar-item');

  sidebarLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Инициализация поиска (Ctrl+K)
 */
function initGlobalSearch() {
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearchModal();
    }
    if (e.key === 'Escape') {
      closeSearchModal();
    }
  });
}

function openSearchModal() {
  const modal = document.getElementById('searchModal');
  if (modal) {
    modal.classList.add('active');
    const input = document.getElementById('searchInput');
    if (input) input.focus();
  }
}

function closeSearchModal() {
  const modal = document.getElementById('searchModal');
  if (modal) modal.classList.remove('active');
}

/**
 * Выполнение глобального поиска
 */
async function performGlobalSearch(query) {
  if (!query || query.length < 2) return [];

  try {
    const results = await API.search.global(query);
    return results;
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

/**
 * Рендер результатов поиска
 */
function renderSearchResults(results, containerId = 'searchResults') {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!results || results.length === 0) {
    container.innerHTML = '<div class="p-4 text-center text-slate-400">Ничего не найдено</div>';
    return;
  }

  const icons = {
    project: '🏗️',
    section: '📁',
    task: '📋',
    employee: '👤',
    survey: '📊',
  };

  const html = results.slice(0, 8).map(item => `
    <a href="${item.link}" class="search-result-item" onclick="closeSearchModal()">
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
 * Инициализация уведомлений
 */
function initNotifications() {
  loadUnreadCount();

  // Периодическое обновление
  setInterval(loadUnreadCount, 60000);
}

async function loadUnreadCount() {
  try {
    const result = await API.notifications.getUnreadCount();
    updateNotificationBadge(result.count);
  } catch (error) {
    console.error('Error loading notification count:', error);
  }
}

function updateNotificationBadge(count) {
  const badges = document.querySelectorAll('.notification-badge');
  badges.forEach(badge => {
    if (count > 0) {
      badge.textContent = count > 9 ? '9+' : count;
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }
  });
}

function toggleNotifications() {
  const dropdown = document.getElementById('notificationsDropdown');
  if (dropdown) {
    dropdown.classList.toggle('hidden');
  }
}

/**
 * Утилиты для работы с датами
 */
function isOverdue(dateString) {
  if (!dateString) return false;
  return new Date(dateString) < new Date();
}

function isDeadlineSoon(dateString, days = 3) {
  if (!dateString) return false;
  const deadline = new Date(dateString);
  const now = new Date();
  const diff = deadline - now;
  return diff > 0 && diff < days * 86400000;
}

function getDeadlineClass(dateString) {
  if (isOverdue(dateString)) return 'deadline-overdue';
  if (isDeadlineSoon(dateString)) return 'deadline-soon';
  return 'deadline-normal';
}

/**
 * Показать/скрыть загрузку страницы
 */
function showPageLoading() {
  const loader = document.getElementById('pageLoader');
  if (loader) loader.classList.remove('hidden');
}

function hidePageLoading() {
  const loader = document.getElementById('pageLoader');
  if (loader) loader.classList.add('hidden');
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initGlobalSearch();
});
