/**
 * Скрипт для главной страницы настроек (13-settings.html)
 * Загружает статистику справочников из API
 */

document.addEventListener('DOMContentLoaded', async () => {
  await initPage({ requireAuth: false, loadProfile: true });
  await loadDictionariesStats();
});

/**
 * Загружает статистику по всем справочникам
 */
async function loadDictionariesStats() {
  try {
    // Загружаем данные параллельно
    const [sections, surveys, expenses, contractorTypes] = await Promise.all([
      API.dictionaries.getSections().catch(() => []),
      API.dictionaries.getSurveys().catch(() => []),
      API.dictionaries.getExpenseCategories().catch(() => []),
      API.dictionaries.getContractorTypes().catch(() => []),
    ]);

    // Обновляем счётчики
    updateCountBadge('sections-count', sections.length);
    updateCountBadge('surveys-count', surveys.length);
    updateCountBadge('expenses-count', expenses.length);
    updateCountBadge('contractor-types-count', contractorTypes.length);

  } catch (error) {
    console.error('Ошибка загрузки статистики справочников:', error);
    // Показываем ошибку в счётчиках
    updateCountBadge('sections-count', 0, true);
    updateCountBadge('surveys-count', 0, true);
    updateCountBadge('expenses-count', 0, true);
    updateCountBadge('contractor-types-count', 0, true);
  }
}

/**
 * Обновляет бейдж с количеством записей
 * @param {string} elementId - ID элемента
 * @param {number} count - Количество записей
 * @param {boolean} isError - Признак ошибки
 */
function updateCountBadge(elementId, count, isError = false) {
  const element = document.getElementById(elementId);
  if (!element) return;

  if (isError) {
    element.textContent = 'Ошибка';
    element.classList.add('bg-red-100', 'text-red-500');
    element.classList.remove('bg-slate-100', 'text-slate-400');
  } else {
    element.textContent = formatCount(count);
  }
}

/**
 * Форматирует количество записей для отображения
 * @param {number} count - Количество
 * @returns {string} Отформатированная строка
 */
function formatCount(count) {
  const lastTwo = count % 100;
  const lastOne = count % 10;

  if (lastTwo >= 11 && lastTwo <= 19) {
    return `${count} записей`;
  }

  if (lastOne === 1) {
    return `${count} запись`;
  }

  if (lastOne >= 2 && lastOne <= 4) {
    return `${count} записи`;
  }

  return `${count} записей`;
}
