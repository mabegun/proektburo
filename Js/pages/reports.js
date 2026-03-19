/**
 * Скрипт для страницы отчётов (12-reports.html)
 */

document.addEventListener('DOMContentLoaded', async () => {
  await checkAuth();
  loadReports();
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

async function loadReports() {
  try {
    UI.showLoading('#reports-content');
    const [stats, projectsReport, employeesReport] = await Promise.all([
      API.dashboard.getStats(),
      api.get('/reports/projects'),
      api.get('/reports/employees'),
    ]);
    renderStats(stats);
    renderProjectsReport(projectsReport);
    renderEmployeesReport(employeesReport);
  } catch (error) {
    console.error('Ошибка загрузки отчётов:', error);
    UI.showError('#reports-content', 'Не удалось загрузить отчёты');
  }
}

function renderStats(stats) {
  const container = document.getElementById('dashboard-stats');
  if (!container) return;
  container.innerHTML = `<div class="grid grid-cols-4 gap-6">${UI.renderCounter(stats.projects.total, { label: 'Всего проектов', icon: '🏗️' })}${UI.renderCounter(stats.tasks.total, { label: 'Задачи', icon: '📋' })}${UI.renderCounter(stats.sections.inProgress, { label: 'Разделов в работе', icon: '📁' })}${UI.renderCounter(stats.finances.month, { label: 'Финансы за месяц', icon: '💰' })}</div>`;
}

function renderProjectsReport(report) {
  const container = document.getElementById('projects-report');
  if (!container) return;
  // Рендер отчёта по проектам
}

function renderEmployeesReport(report) {
  const container = document.getElementById('employees-report');
  if (!container) return;
  // Рендер отчёта по сотрудникам
}

function initActions() {
  document.getElementById('export-excel-btn')?.addEventListener('click', () => {
    UI.toast('Экспорт в Excel начат', 'info');
    // Логика экспорта
  });
  
  document.getElementById('report-projects-btn')?.addEventListener('click', () => {
    UI.toast('Отчёт по проектам формируется', 'info');
  });
  
  document.getElementById('report-employees-btn')?.addEventListener('click', () => {
    UI.toast('Отчёт по исполнителям формируется', 'info');
  });
}
