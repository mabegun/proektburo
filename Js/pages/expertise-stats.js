/**
 * Скрипт для страницы статистики экспертизы (21-expertise-stats.html)
 */

document.addEventListener('DOMContentLoaded', async () => {
  await checkAuth();
  await loadExpertiseStats();
  initActions();
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

async function loadExpertiseStats() {
  try {
    UI.showLoading('#expertise-stats-content');
    const [summary, byEmployee, bySection, topSpeed] = await Promise.all([
      api.get('/expertise/stats/summary'),
      api.get('/expertise/stats/by-employee'),
      api.get('/expertise/stats/by-section'),
      api.get('/expertise/stats/top-speed'),
    ]);
    renderSummary(summary);
    renderByEmployee(byEmployee);
    renderBySection(bySection);
    renderTopSpeed(topSpeed);
  } catch (error) {
    console.error('Ошибка загрузки статистики:', error);
    UI.showError('#expertise-stats-content', 'Не удалось загрузить статистику');
  }
}

function renderSummary(summary) {
  const container = document.getElementById('summary-stats');
  if (!container) return;
  
  container.innerHTML = `<div class="grid grid-cols-5 gap-4"><div class="card-static p-4"><div class="text-sm text-slate-500 mb-1">Всего замечаний</div><div class="text-2xl font-bold text-slate-800">${summary.total || 0}</div></div><div class="card-static p-4"><div class="text-sm text-slate-500 mb-1">Создано</div><div class="text-2xl font-bold text-slate-600">${summary.created || 0}</div></div><div class="card-static p-4"><div class="text-sm text-slate-500 mb-1">В работе</div><div class="text-2xl font-bold text-blue-600">${summary.inProgress || 0}</div></div><div class="card-static p-4"><div class="text-sm text-slate-500 mb-1">На проверке</div><div class="text-2xl font-bold text-amber-600">${summary.review || 0}</div></div><div class="card-static p-4"><div class="text-sm text-slate-500 mb-1">Закрыто</div><div class="text-2xl font-bold text-green-600">${summary.closed || 0}</div></div></div>`;
}

function renderByEmployee(employees) {
  const container = document.getElementById('by-employee');
  if (!container) return;
  
  if (employees.length === 0) {
    container.innerHTML = '<p class="text-sm text-slate-400">Нет данных</p>';
    return;
  }
  
  container.innerHTML = `<table class="w-full"><thead class="bg-slate-50"><tr><th class="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Сотрудник</th><th class="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Всего</th><th class="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">В работе</th><th class="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Закрыто</th></tr></thead><tbody>${employees.map(e => `<tr class="border-b border-slate-100"><td class="px-6 py-4 text-sm text-slate-700">${e.name}</td><td class="px-6 py-4 text-sm text-right text-slate-800">${e.total}</td><td class="px-6 py-4 text-sm text-right text-blue-600">${e.inProgress}</td><td class="px-6 py-4 text-sm text-right text-green-600">${e.closed}</td></tr>`).join('')}</tbody></table>`;
}

function renderBySection(sections) {
  const container = document.getElementById('by-section');
  if (!container) return;
  
  if (sections.length === 0) {
    container.innerHTML = '<p class="text-sm text-slate-400">Нет данных</p>';
    return;
  }
  
  container.innerHTML = sections.map(section => `
    <div class="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <div class="flex items-center gap-3">
        <span class="w-8 h-8 rounded flex items-center justify-center text-xs font-bold" style="background: ${section.color}">${section.code}</span>
        <span class="text-sm font-medium text-slate-700">${section.name}</span>
      </div>
      <div class="text-right">
        <span class="text-sm font-bold text-slate-800">${section.total}</span>
        <span class="text-xs text-slate-400 ml-2">(${section.closed} закрыто)</span>
      </div>
    </div>
  `).join('');
}

function renderTopSpeed(employees) {
  const container = document.getElementById('top-speed');
  if (!container) return;
  
  if (employees.length === 0) {
    container.innerHTML = '<p class="text-sm text-slate-400">Нет данных</p>';
    return;
  }
  
  container.innerHTML = employees.slice(0, 5).map((e, i) => `
    <div class="flex items-center gap-3 py-2">
      <span class="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">${i + 1}</span>
      <div class="avatar w-8 h-8 bg-blue-600 text-white">${UI.getInitials(e.name)}</div>
      <span class="text-sm font-medium text-slate-700 flex-1">${e.name}</span>
      <span class="text-sm text-green-600 font-medium">${e.avgDays} дн.</span>
    </div>
  `).join('');
}

function initActions() {
  document.getElementById('export-btn')?.addEventListener('click', () => {
    UI.toast('Экспорт статистики начат', 'info');
    // Логика экспорта
  });
}
