/**
 * Скрипт для страницы уведомлений (11-notifications.html)
 */

document.addEventListener('DOMContentLoaded', async () => {
  await initPage({ requireAuth: false, loadProfile: true });
  await loadNotifications();
  initFilters();
});

/**
 * Обновление профиля в сайдбаре
 */

/**
 * Загрузка уведомлений
 */
async function loadNotifications() {
  try {
    UI.showLoading('#notifications-container');
    
    const params = {
      type: getUrlParam('type') || '',
      unread: getUrlParam('unread') === 'true',
    };
    
    const data = await API.notifications.getList(params);
    renderNotifications(data.items || data);
    
  } catch (error) {
    console.error('Ошибка загрузки уведомлений:', error);
    UI.showError('#notifications-container', 'Не удалось загрузить уведомления');
  }
}

/**
 * Рендер уведомлений
 */
function renderNotifications(notifications) {
  const container = document.getElementById('notifications-container');
  if (!container) return;
  
  if (!notifications || notifications.length === 0) {
    UI.showEmpty('#notifications-container', 'Нет уведомлений', '🔔');
    return;
  }
  
  const html = notifications.map(notif => {
    const iconClass = getNotificationIconClass(notif.type);
    const icon = UI.getEntityEmoji(notif.type);
    
    return `
      <div class="card p-4 ${notif.read ? 'notification-read' : 'notification-unread'}">
        <div class="flex gap-4">
          <div class="w-10 h-10 rounded-lg ${iconClass} flex items-center justify-center flex-shrink-0">
            ${icon}
          </div>
          <div class="flex-1">
            <div class="flex justify-between items-start mb-1">
              <p class="font-medium text-slate-800">${notif.title}</p>
              <span class="text-xs text-slate-400">${formatNotificationTime(notif.createdAt)}</span>
            </div>
            <p class="text-sm text-slate-600 mb-2">${notif.description}</p>
            ${notif.link ? `
              <div class="flex gap-2">
                <a href="${notif.link}" class="text-sm text-blue-600 hover:underline">
                  Перейти →
                </a>
              </div>
            ` : ''}
            ${!notif.read ? `
              <div class="flex gap-2 mt-2">
                <button class="text-xs text-slate-500 hover:text-slate-700" onclick="markAsRead(${notif.id})">
                  Отметить как прочитанное
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  container.innerHTML = html;
}

function getNotificationIconClass(type) {
  const map = {
    'task': 'bg-blue-100 text-blue-600',
    'project': 'bg-green-100 text-green-600',
    'comment': 'bg-purple-100 text-purple-600',
    'file': 'bg-amber-100 text-amber-600',
    'expertise': 'bg-red-100 text-red-600',
    'system': 'bg-slate-100 text-slate-600',
  };
  return map[type] || 'bg-slate-100 text-slate-600';
}

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
 * Инициализация фильтров
 */
function initFilters() {
  const filterButtons = document.querySelectorAll('.card-static .btn-primary, .card-static .btn-secondary');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Обновляем активные классы
      filterButtons.forEach(b => {
        b.classList.remove('btn-primary');
        b.classList.add('btn-secondary');
      });
      btn.classList.remove('btn-secondary');
      btn.classList.add('btn-primary');
      
      // Применяем фильтр
      const type = btn.getAttribute('data-type');
      applyFilter(type);
    });
  });
}

/**
 * Применение фильтра
 */
function applyFilter(type) {
  const params = new URLSearchParams();
  
  if (type === 'unread') {
    params.set('unread', 'true');
  } else if (type && type !== 'all') {
    params.set('type', type);
  }
  
  window.location.href = `11-notifications.html?${params}`;
}

/**
 * Отметить как прочитанное
 */
async function markAsRead(id) {
  try {
    await API.notifications.markAsRead(id);
    UI.toast('Уведомление отмечено как прочитанное', 'success');
    loadNotifications();
  } catch (error) {
    UI.toast('Ошибка при обновлении', 'error');
  }
}

/**
 * Отметить все как прочитанные
 */
async function markAllAsRead() {
  if (!confirm('Отметить все уведомления как прочитанные?')) return;
  
  try {
    await API.notifications.markAllAsRead();
    UI.toast('Все уведомления прочитаны', 'success');
    loadNotifications();
  } catch (error) {
    UI.toast('Ошибка при обновлении', 'error');
  }
}

// Глобальная функция для кнопки
window.markAllAsRead = markAllAsRead;
