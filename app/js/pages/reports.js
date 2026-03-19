/**
 * Скрипт для страницы отчётов (12-reports.html)
 */

document.addEventListener('DOMContentLoaded', async () => {
  await initPage({ requireAuth: false, loadProfile: true });
  await loadReports();
  initActions();
});

async function loadReports() {
  try {
    // Загружаем данные параллельно
    const [stats, projects, employees] = await Promise.all([
      API.dashboard.getStats().catch(() => null),
      API.projects.getList({ limit: 100 }).catch(() => ({ items: [] })),
      API.employees.getList().catch(() => ({ items: [] })),
    ]);

    renderStats(stats);
    renderSectionStats(projects);
    renderEmployeeStats(employees);

  } catch (error) {
    console.error('Ошибка загрузки отчётов:', error);
  }
}

/**
 * Рендер основной статистики
 */
function renderStats(stats) {
  if (!stats) return;

  const totalProjects = document.getElementById('stat-total-projects');
  const inProgress = document.getElementById('stat-in-progress');
  const review = document.getElementById('stat-review');
  const overdue = document.getElementById('stat-overdue');

  if (totalProjects) totalProjects.textContent = stats.projects?.total || 0;
  if (inProgress) inProgress.textContent = stats.projects?.inProgress || 0;
  if (review) review.textContent = stats.sections?.review || 0;
  if (overdue) overdue.textContent = stats.tasks?.overdue || 0;
}

/**
 * Рендер статистики по разделам
 */
function renderSectionStats(projectsRes) {
  const projects = projectsRes.items || projectsRes;
  if (!projects.length) return;

  // Собираем статистику по разделам
  const sectionStats = {};
  let totalSections = 0;
  let doneSections = 0;

  projects.forEach(project => {
    if (project.sections) {
      project.sections.forEach(section => {
        if (!sectionStats[section.code]) {
          sectionStats[section.code] = {
            name: section.name,
            total: 0,
            done: 0
          };
        }
        sectionStats[section.code].total++;
        totalSections++;
        if (section.status === 'done' || section.status === 'completed') {
          sectionStats[section.code].done++;
          doneSections++;
        }
      });
    }
  });

  // Рендерим прогресс-бары
  const container = document.getElementById('sections-progress');
  if (!container) return;

  const html = Object.entries(sectionStats).map(([code, data]) => {
    const percent = data.total > 0 ? Math.round((data.done / data.total) * 100) : 0;
    return `
      <div>
        <div class="flex justify-between text-sm mb-1">
          <span class="text-slate-600">${code} - ${data.name}</span>
          <span class="font-medium text-slate-700">${percent}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill" style="width: ${percent}%"></div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html || '<p class="text-sm text-slate-400">Нет данных</p>';
}

/**
 * Рендер статистики по исполнителям
 */
function renderEmployeeStats(employeesRes) {
  const employees = employeesRes.items || employeesRes;
  if (!employees.length) return;

  const container = document.getElementById('employees-stats');
  if (!container) return;

  const colors = ['from-slate-700 to-slate-500', 'from-blue-500 to-blue-400', 'from-green-500 to-green-400', 'from-purple-500 to-purple-400', 'from-amber-500 to-amber-400'];

  const html = employees.slice(0, 5).map((emp, index) => {
    const initials = emp.name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
    const color = colors[index % colors.length];

    return `
      <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50">
        <div class="flex items-center gap-3">
          <div class="avatar bg-gradient-to-br ${color} text-white">${initials}</div>
          <div>
            <p class="font-medium text-slate-800">${emp.name}</p>
            <p class="text-xs text-slate-500">${emp.position || getRoleText(emp.role)}</p>
          </div>
        </div>
        <div class="text-right">
          <p class="font-semibold text-slate-800">${emp.projectsCount || 0} проект${declension(emp.projectsCount || 0, ['', 'а', 'ов'])}</p>
          <p class="text-xs text-slate-500">${emp.payments?.progress || 0}% выплачено</p>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
}

/**
 * Инициализация кнопок экспорта
 */
function initActions() {
  document.getElementById('export-excel-btn')?.addEventListener('click', () => {
    exportToExcel();
  });

  document.getElementById('report-projects-btn')?.addEventListener('click', () => {
    UI.toast('Отчёт по проектам формируется...', 'info');
    setTimeout(() => UI.toast('Отчёт готов к скачиванию', 'success'), 1500);
  });

  document.getElementById('report-employees-btn')?.addEventListener('click', () => {
    UI.toast('Отчёт по исполнителям формируется...', 'info');
    setTimeout(() => UI.toast('Отчёт готов к скачиванию', 'success'), 1500);
  });
}

/**
 * Экспорт в Excel
 */
function exportToExcel() {
  UI.toast('Экспорт в Excel начат...', 'info');
  setTimeout(() => {
    UI.toast('Файл Excel готов к скачиванию', 'success');
  }, 2000);
}

/**
 * Склонение слов
 */
function declension(number, titles) {
  const cases = [2, 0, 1, 1, 1, 2];
  return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

/**
 * Текст роли
 */
function getRoleText(role) {
  const map = {
    'director': 'Директор',
    'gip': 'ГИП',
    'engineer': 'Инженер',
    'accountant': 'Бухгалтер',
  };
  return map[role] || role;
}
