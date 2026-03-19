/**
 * Скрипт для страницы календаря (20-calendar.html)
 */

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let allEvents = [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', async () => {
  await initPage({ requireAuth: false, loadProfile: true });
  await loadCalendarData();
  initFilters();
  initNavigation();
});

/**
 * Загрузка данных для календаря
 */
async function loadCalendarData() {
  try {
    // Загружаем проекты, задачи и изыскания
    const [projects, tasks] = await Promise.all([
      API.projects.getList({ limit: 100 }).catch(() => ({ items: [] })),
      API.tasks.getList({ limit: 100 }).catch(() => ({ items: [] })),
    ]);

    // Преобразуем в события календаря
    allEvents = [];

    // Проекты
    const projectList = projects.items || projects;
    projectList.forEach(project => {
      if (project.deadline) {
        allEvents.push({
          id: `project-${project.id}`,
          type: 'project',
          title: project.name,
          date: project.deadline,
          projectId: project.id,
          projectName: project.name,
          link: `04-project-detail.html?id=${project.id}`,
        });
      }
    });

    // Задачи
    const taskList = tasks.items || tasks;
    taskList.forEach(task => {
      if (task.deadline) {
        allEvents.push({
          id: `task-${task.id}`,
          type: 'section',
          title: task.title,
          date: task.deadline,
          projectId: task.projectId,
          projectName: task.project || '',
          link: `07-tasks-list.html`,
        });
      }
    });

    renderCalendar();
    renderStats();
    renderUpcomingDeadlines();

  } catch (error) {
    console.error('Ошибка загрузки данных календаря:', error);
  }
}

/**
 * Рендер календаря
 */
function renderCalendar() {
  const container = document.getElementById('calendar-grid');
  if (!container) return;

  const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
                       'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

  // Обновляем заголовок
  const monthTitle = document.getElementById('currentMonth');
  if (monthTitle) {
    monthTitle.textContent = `${monthNames[currentMonth]} ${currentYear}`;
  }

  // Обновляем селекты
  const monthSelect = document.getElementById('monthSelect');
  const yearSelect = document.getElementById('yearSelect');
  if (monthSelect) monthSelect.value = currentMonth;
  if (yearSelect) yearSelect.value = currentYear;

  // Получаем дни месяца
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const startDayOfWeek = (firstDay.getDay() + 6) % 7; // Понедельник = 0

  // Фильтруем события
  const filteredEvents = currentFilter === 'all' 
    ? allEvents 
    : allEvents.filter(e => e.type === currentFilter);

  // Группируем события по датам
  const eventsByDate = {};
  filteredEvents.forEach(event => {
    const dateKey = event.date.split('T')[0];
    if (!eventsByDate[dateKey]) eventsByDate[dateKey] = [];
    eventsByDate[dateKey].push(event);
  });

  // Генерируем HTML
  let html = `
    <div class="calendar-header">Пн</div>
    <div class="calendar-header">Вт</div>
    <div class="calendar-header">Ср</div>
    <div class="calendar-header">Чт</div>
    <div class="calendar-header">Пт</div>
    <div class="calendar-header" style="color: #dc2626;">Сб</div>
    <div class="calendar-header" style="color: #dc2626;">Вс</div>
  `;

  // Дни предыдущего месяца
  const prevMonth = new Date(currentYear, currentMonth, 0);
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonth.getDate() - i;
    html += `<div class="calendar-day other-month"><div class="calendar-day-number">${day}</div></div>`;
  }

  // Дни текущего месяца
  const today = new Date();
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isToday = today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
    const dayEvents = eventsByDate[dateStr] || [];

    html += `
      <div class="calendar-day ${isToday ? 'today' : ''}">
        <div class="calendar-day-number">${day}</div>
        ${dayEvents.slice(0, 3).map(event => `
          <a href="${event.link}" class="calendar-event event-${getEventClass(event)}" title="${event.title}">
            ${event.title.substring(0, 20)}${event.title.length > 20 ? '...' : ''}
          </a>
        `).join('')}
        ${dayEvents.length > 3 ? `<div class="text-xs text-slate-400 mt-1">+${dayEvents.length - 3} ещё</div>` : ''}
      </div>
    `;
  }

  // Дни следующего месяца
  const totalCells = startDayOfWeek + lastDay.getDate();
  const remainingCells = (7 - (totalCells % 7)) % 7;
  for (let day = 1; day <= remainingCells; day++) {
    html += `<div class="calendar-day other-month"><div class="calendar-day-number">${day}</div></div>`;
  }

  container.innerHTML = html;
}

/**
 * Получить класс для события
 */
function getEventClass(event) {
  const today = new Date();
  const eventDate = new Date(event.date);
  const diff = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));

  if (diff < 0) return 'urgent';
  if (diff <= 3) return 'urgent';
  
  return event.type;
}

/**
 * Рендер статистики
 */
function renderStats() {
  const today = new Date();
  const monthStart = new Date(currentYear, currentMonth, 1);
  const monthEnd = new Date(currentYear, currentMonth + 1, 0);

  const monthEvents = allEvents.filter(e => {
    const d = new Date(e.date);
    return d >= monthStart && d <= monthEnd;
  });

  const stats = {
    projects: monthEvents.filter(e => e.type === 'project').length,
    sections: monthEvents.filter(e => e.type === 'section').length,
    surveys: monthEvents.filter(e => e.type === 'survey').length,
    urgent: monthEvents.filter(e => {
      const d = new Date(e.date);
      const diff = Math.ceil((d - today) / (1000 * 60 * 60 * 24));
      return diff <= 3 && diff >= 0;
    }).length,
  };

  // Обновляем счётчики
  document.getElementById('stat-projects')?.textContent && (document.getElementById('stat-projects').textContent = stats.projects);
  document.getElementById('stat-sections')?.textContent && (document.getElementById('stat-sections').textContent = stats.sections);
  document.getElementById('stat-surveys')?.textContent && (document.getElementById('stat-surveys').textContent = stats.surveys);
  document.getElementById('stat-urgent')?.textContent && (document.getElementById('stat-urgent').textContent = stats.urgent);
}

/**
 * Рендер ближайших дедлайнов
 */
function renderUpcomingDeadlines() {
  const container = document.getElementById('upcoming-deadlines');
  if (!container) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = allEvents
    .filter(e => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  if (upcoming.length === 0) {
    container.innerHTML = '<p class="text-sm text-slate-400">Ближайших дедлайнов нет</p>';
    return;
  }

  container.innerHTML = upcoming.map(event => {
    const eventDate = new Date(event.date);
    const diff = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
    const borderColor = diff <= 3 ? 'border-red-200 bg-red-50/50' : 
                        diff <= 7 ? 'border-amber-200 bg-amber-50/50' : 
                        'border-slate-200 bg-slate-50';
    const statusColor = diff <= 3 ? 'text-red-600' : diff <= 7 ? 'text-amber-600' : 'text-slate-600';
    const statusText = diff === 0 ? 'Сегодня' : diff === 1 ? 'Завтра' : `Через ${diff} ${declension(diff, ['день', 'дня', 'дней'])}`;

    return `
      <a href="${event.link}" class="block p-3 rounded-xl border ${borderColor} hover:bg-opacity-75 transition-colors">
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1">
            <p class="font-medium text-slate-800 text-sm">${event.title}</p>
            <p class="text-xs text-slate-500 mt-1">${event.projectName || ''}</p>
          </div>
          <div class="text-right">
            <p class="text-xs font-semibold ${statusColor}">${statusText}</p>
            <p class="text-xs text-slate-400">${formatDate(event.date)}</p>
          </div>
        </div>
      </a>
    `;
  }).join('');
}

/**
 * Инициализация фильтров
 */
function initFilters() {
  const filterButtons = document.querySelectorAll('.filter-chip');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      renderCalendar();
    });
  });

  // Селекты месяца и года
  const monthSelect = document.getElementById('monthSelect');
  const yearSelect = document.getElementById('yearSelect');

  monthSelect?.addEventListener('change', (e) => {
    currentMonth = parseInt(e.target.value);
    renderCalendar();
    renderStats();
  });

  yearSelect?.addEventListener('change', (e) => {
    currentYear = parseInt(e.target.value);
    renderCalendar();
    renderStats();
  });
}

/**
 * Инициализация навигации
 */
function initNavigation() {
  // Глобальные функции для кнопок
  window.prevMonth = () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar();
    renderStats();
  };

  window.nextMonth = () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar();
    renderStats();
  };

  window.goToToday = () => {
    currentMonth = new Date().getMonth();
    currentYear = new Date().getFullYear();
    renderCalendar();
    renderStats();
  };
}

/**
 * Форматирование даты
 */
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}

/**
 * Склонение слов
 */
function declension(number, titles) {
  const cases = [2, 0, 1, 1, 1, 2];
  return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}
