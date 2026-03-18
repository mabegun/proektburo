/**
 * Скрипт для страницы календаря (20-calendar.html)
 */

document.addEventListener('DOMContentLoaded', async () => {
  await checkAuth();
  await loadCalendar();
  initFilters();
});

async function checkAuth() {
  if (!getAuthToken()) window.location.href = '01-login.html';
  try {
    const user = await API.auth.getCurrentUser();
    updateUserProfile(user);
  } catch (error) {
    removeAuthToken();
    window.location.href = '01-login.html';
  }
}

function updateUserProfile(user) {
  const profileEl = document.querySelector('.sidebar-profile');
  if (!profileEl) return;
  const initials = UI.getInitials(user.name);
  profileEl.innerHTML = `<div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50"><div class="avatar bg-gradient-to-br from-slate-700 to-slate-500 text-white">${initials}</div><div class="flex-1 min-w-0"><p class="font-semibold text-slate-800 truncate">${user.name}</p><p class="text-xs text-slate-500">${getUserRoleText(user.role)}</p></div></div>`;
}

function getUserRoleText(role) {
  const map = { 'director': 'Директор', 'gip': 'ГИП', 'employee': 'Сотрудник' };
  return map[role] || role;
}

async function loadCalendar() {
  try {
    UI.showLoading('#calendar-content');
    const [events, deadlines] = await Promise.all([
      api.get('/calendar/events'),
      api.get('/calendar/deadlines'),
    ]);
    renderCalendar(events, deadlines);
    renderUpcomingDeadlines(deadlines);
  } catch (error) {
    console.error('Ошибка загрузки календаря:', error);
    UI.showError('#calendar-content', 'Не удалось загрузить календарь');
  }
}

function renderCalendar(events, deadlines) {
  const container = document.getElementById('calendar-grid');
  if (!container) return;
  
  // Простая реализация календаря
  const today = new Date();
  const month = today.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
  
  container.innerHTML = `<div class="text-center py-12"><h3 class="text-lg font-semibold text-slate-800 mb-2">${month}</h3><p class="text-slate-500">Календарь дедлайнов</p><div class="mt-4 text-sm text-slate-400">Здесь будет отображён календарь с дедлайнами проектов, разделов и изысканий</div></div>`;
}

function renderUpcomingDeadlines(deadlines) {
  const container = document.getElementById('upcoming-deadlines');
  if (!container) return;
  
  if (deadlines.length === 0) {
    container.innerHTML = '<p class="text-sm text-slate-400">Ближайших дедлайнов нет</p>';
    return;
  }
  
  container.innerHTML = deadlines.slice(0, 5).map(deadline => `
    <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 ${getDeadlineIconClass(deadline.type)} rounded-lg flex items-center justify-center">${getDeadlineIcon(deadline.type)}</div>
        <div>
          <p class="text-sm font-medium text-slate-700">${deadline.name}</p>
          <p class="text-xs text-slate-400">${deadline.projectName}</p>
        </div>
      </div>
      <div class="text-right">
        <p class="text-sm font-bold ${getDeadlineColorClass(deadline.date)}">${UI.formatDate(deadline.date)}</p>
        <span class="badge ${getDeadlineStatusClass(deadline.daysLeft)}">${getDeadlineStatusText(deadline.daysLeft)}</span>
      </div>
    </div>
  `).join('');
}

function initFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('btn-primary'));
      btn.classList.add('btn-primary');
      // Применение фильтра
    });
  });
}

function getDeadlineIconClass(type) {
  const map = { 'project': 'bg-blue-100 text-blue-600', 'section': 'bg-green-100 text-green-600', 'survey': 'bg-purple-100 text-purple-600', 'urgent': 'bg-red-100 text-red-600' };
  return map[type] || 'bg-slate-100 text-slate-600';
}

function getDeadlineIcon(type) {
  const icons = { 'project': '🏗️', 'section': '📁', 'survey': '📊', 'urgent': '⚠️' };
  return icons[type] || '📅';
}

function getDeadlineColorClass(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = date - now;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return 'text-red-600';
  if (days <= 5) return 'text-amber-600';
  return 'text-slate-600';
}

function getDeadlineStatusClass(daysLeft) {
  if (daysLeft < 0) return 'status-overdue';
  if (daysLeft <= 5) return 'status-revision';
  return 'status-in-progress';
}

function getDeadlineStatusText(daysLeft) {
  if (daysLeft < 0) return `Просрочено (${Math.abs(daysLeft)} дн.)`;
  if (daysLeft === 0) return 'Сегодня';
  if (daysLeft === 1) return 'Завтра';
  if (daysLeft <= 5) return `Через ${daysLeft} дн.`;
  return UI.formatDate(new Date(Date.now() + daysLeft * 86400000).toISOString());
}
