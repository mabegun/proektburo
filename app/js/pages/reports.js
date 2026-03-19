/**
 * Скрипт для страницы отчётов (12-reports.html)
 */

document.addEventListener('DOMContentLoaded', async () => {
  await initPage({ requireAuth: false, loadProfile: true });
  loadReports();
  initActions();
});

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
