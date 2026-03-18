# 🎯 Шпаргалка: Что требует подключения к API

**Проверено:** 36 страниц | **Найдено:** 67 интерактивных элементов | **Готово:** 0%

---

## 🔴 Критичные элементы (без них не работает)

### 1. Вход в систему
| Файл | Что делать |
|------|-----------|
| 01-login.html | ✅ Уже подключено (js/pages/login.js) |

### 2. Проекты
| Файл | Элемент | Статус |
|------|---------|--------|
| 02-dashboard.html | Список проектов, статистика | ✅ Частично подключено |
| 03-projects-list.html | Список проектов с фильтрами | 🔴 Нужно подключить |
| 04-project-detail.html | Детальная страница | 🔴 Нужно подключить |
| 05-project-create.html | Форма создания | 🔴 Нужно подключить |

### 3. Индикаторы (разделы и изыскания)
| Где | Что | Статус |
|-----|-----|--------|
| 02-dashboard.html | Индикаторы в карточках проектов | 🔴 Хардкод |
| 03-projects-list.html | Индикаторы АР, ГП, КР, ОВ, ВК, ЭОМ, ИГД, ИГИ | 🔴 Хардкод |
| 04-project-detail.html | Списки разделов и изысканий | 🔴 Хардкод |

**Разделы:** АР, ГП, КР, ОВ, ВК, ЭОМ, НВК, ТМ, АТ, ПЗ, ПОС, ПБ  
**Изыскания:** ИГД, ИГИ, ИЭИ, ИАДИ

### 4. Числовые индикаторы
| Где | Что | Статус |
|-----|-----|--------|
| 02-dashboard.html | Счётчики: 35 проектов, 42 задачи | 🔴 Хардкод |
| 02-dashboard.html | Прогресс-бары проектов | 🔴 Хардкод |
| 03-projects-list.html | Прогресс каждого проекта | 🔴 Хардкод |
| 07-tasks-list.html | Прогресс выполнения подзадач | 🔴 Хардкод |
| 09-employees-list.html | Сводка по выплатам | 🔴 Хардкод |

### 5. Цветовые индикаторы
| Где | Что | Статус |
|-----|-----|--------|
| Все страницы | Статусы (not-started, in-progress, completed) | 🔴 CSS-классы без данных |
| 07-tasks-list.html | Приоритеты (critical, high, medium, low) | 🔴 CSS-классы без данных |
| 11-notifications.html | Типы уведомлений | 🔴 CSS-классы без данных |

### 6. Иконки статусов
| Где | Что | Статус |
|-----|-----|--------|
| Все страницы | Emoji: ⏸️⏳✅👀⚠️ | 🔴 Статичные |
| Все страницы | SVG иконки сущностей | 🔴 Статичные |

---

## 🟡 Важные элементы

### 4. Задачи
| Файл | Элемент | Статус |
|------|---------|--------|
| 07-tasks-list.html | Список задач | ⏳ Готово к подключению |
| 08-task-create.html | Создание задачи | 🔴 Нужно подключить |

### 5. Сотрудники
| Файл | Элемент | Статус |
|------|---------|--------|
| 09-employees-list.html | Список сотрудников | 🔴 Нужно подключить |
| 10-employee-create.html | Создание сотрудника | 🔴 Нужно подключить |

### 6. Разделы (детально)
| Файл | Элемент | Статус |
|------|---------|--------|
| 06-section-detail.html | Страница раздела | 🔴 Нужно подключить |
| 06-1-section-expertise.html | Замечания раздела | 🔴 Нужно подключить |

### 7. Изыскания (детально)
| Файл | Элемент | Статус |
|------|---------|--------|
| 14-survey-detail.html | Страница изыскания | 🔴 Нужно подключить |
| 14-2-survey-finances.html | Финансы изыскания | 🔴 Нужно подключить |

---

## 🟢 Дополнительные

### 8. Обсуждения и сообщения
| Файл | Элемент | Статус |
|------|---------|--------|
| 04-1-project-discussion.html | Форма отправки сообщений | 🔴 Без обработчика |
| 06-section-detail.html | Комментарии | 🔴 Без обработчика |
| 14-survey-detail.html | Комментарии | 🔴 Без обработчика |

---

## 📊 Индикаторы (числовые, цветовые, иконки)

**Полный аудит:** см. `INDICATORS_AUDIT.md` (~200 индикаторов)  
**Шпаргалка:** см. `js/INDICATORS_GUIDE.md`

### Числовые индикаторы
| Где | Что | Статус |
|-----|-----|--------|
| 02-dashboard.html | Счётчики: 35 проектов, 42 задачи | 🔴 Хардкод |
| 02-dashboard.html | Прогресс-бары проектов | 🔴 Хардкод |
| 03-projects-list.html | Прогресс каждого проекта | 🔴 Хардкод |
| 07-tasks-list.html | Прогресс выполнения подзадач | 🔴 Хардкод |
| 09-employees-list.html | Сводка по выплатам | 🔴 Хардкод |

### Цветовые индикаторы
| Где | Что | Статус |
|-----|-----|--------|
| Все страницы | Статусы (not-started, in-progress, completed) | 🔴 CSS-классы без данных |
| 07-tasks-list.html | Приоритеты (critical, high, medium, low) | 🔴 CSS-классы без данных |
| 11-notifications.html | Типы уведомлений | 🔴 CSS-классы без данных |

### Иконки статусов
| Где | Что | Статус |
|-----|-----|--------|
| Все страницы | Emoji: ⏸️⏳✅👀⚠️ | 🔴 Статичные |
| Все страницы | SVG иконки сущностей | 🔴 Статичные |

### Готовые UI-хелперы

Файл `js/ui-helpers.js` содержит **30+ функций** для работы с индикаторами:

```javascript
// Статусы
UI.getProjectStatusClass('in-progress')  // "status-in-progress"
UI.getSectionStatusText('done')          // "Завершён"
UI.getSurveyStatusClass('completed')     // "survey-done"

// Цвета
UI.getStatusColor('completed', 'bg')     // "#dcfce7"
UI.getProgressColor(75)                  // "#059669"
UI.getColorByType('project')             // "#1e293b"

// Иконки
UI.getEntityIcon('project', 'w-5 h-5')   // SVG иконка
UI.getEntityEmoji('task')                // "📋"
UI.getStatusIcon('completed', 'emoji')   // "✅"

// Числа
UI.renderProgressBar(75, { size: 'md' }) // HTML прогресс-бара
UI.renderCounter(35, { label: 'Всего' }) // HTML счётчика
UI.calculateProgress(25, 100)            // 25
```

**Документация:** `js/README.md` (раздел "Индикаторы статусов", "Числовые индикаторы", и т.д.)

### 9. Загрузка файлов
| Файл | Элемент | Статус |
|------|---------|--------|
| 05-project-create.html | input type="file" | 🟡 Есть input, нет обработчика |
| 14-4-expertise-create.html | Drag-and-drop зона | 🔴 Только вёрстка |
| 15-survey-create.html | Drag-and-drop зона | 🔴 Только вёрстка |
| 16-expertise-comment.html | Загрузка ответа | 🔴 Только вёрстка |

### 10. Финансы
| Файл | Элемент | Статус |
|------|---------|--------|
| 04-5-project-finances.html | Таблица выплат | 🔴 Хардкод |
| 18-contract-detail.html | Договоры | 🔴 Хардкод |
| 19-payment-detail.html | Выплаты | 🔴 Хардкод |

### 11. Замечания экспертизы
| Файл | Элемент | Статус |
|------|---------|--------|
| 04-2-project-expertise.html | Список замечаний | 🔴 Хардкод |
| 14-4-expertise-create.html | Создание замечания | 🔴 Форма без обработчика |
| 16-expertise-comment.html | Детальная страница | 🔴 Хардкод |

### 12. Уведомления
| Файл | Элемент | Статус |
|------|---------|--------|
| 11-notifications.html | Список уведомлений | 🔴 Хардкод |

### 13. Справочники
| Файл | Элемент | Статус |
|------|---------|--------|
| 13-1-settings-sections.html | Разделы проекта | 🔴 Хардкод |
| 13-2-settings-surveys.html | Виды изысканий | 🔴 Хардкод |
| 13-3-settings-expenses.html | Категории расходов | 🔴 Хардкод |
| 13-4-settings-contractor-types.html | Типы контрагентов | 🔴 Хардкод |

---

## 📊 Сводная таблица по всем страницам

| # | Файл | Создание | Файлы | Сообщения | Разделы | Изыскания | Проекты | Приоритет |
|---|------|----------|-------|-----------|---------|-----------|---------|-----------|
| 1 | 01-login.html | — | — | — | — | — | — | 🔴 |
| 2 | 02-dashboard.html | — | — | — | ✅ | ✅ | ✅ | 🔴 |
| 3 | 03-projects-list.html | ✅ | — | — | ✅ | ✅ | ✅ | 🔴 |
| 4 | 04-project-detail.html | ✅ | ✅ | — | ✅ | ✅ | — | 🔴 |
| 5 | 05-project-create.html | ✅ | ✅ | — | — | — | — | 🔴 |
| 6 | 06-section-detail.html | ✅ | ✅ | ✅ | — | — | — | 🟡 |
| 7 | 07-tasks-list.html | ✅ | — | — | — | — | — | 🟡 |
| 8 | 08-task-create.html | ✅ | — | — | — | — | — | 🟡 |
| 9 | 09-employees-list.html | ✅ | — | — | — | — | — | 🟡 |
| 10 | 10-employee-create.html | ✅ | — | — | — | — | — | 🟡 |
| 11 | 11-notifications.html | — | — | — | — | — | — | 🟢 |
| 12 | 14-survey-detail.html | ✅ | ✅ | ✅ | — | — | — | 🟡 |
| 13 | 04-1-project-discussion.html | — | ✅ | ✅ | — | — | — | 🟢 |
| 14 | 04-2-project-expertise.html | ✅ | — | — | — | — | — | 🟢 |
| 15 | 04-5-project-finances.html | ✅ | ✅ | — | — | — | — | 🟢 |
| 16 | 13-settings.html | — | — | — | — | — | — | 🟢 |
| 17 | 13-1-settings-sections.html | ✅ | — | — | — | — | — | 🟢 |
| 18 | 13-2-settings-surveys.html | ✅ | — | — | — | — | — | 🟢 |
| 19 | 13-3-settings-expenses.html | ✅ | — | — | — | — | — | 🟢 |
| 20 | 13-4-settings-contractor-types.html | ✅ | — | — | — | — | — | 🟢 |

**Условные обозначения:**
- ✅ Есть (требует API)
- ⏳ Готово к подключению
- 🔴 Нет / Требует подключения
- — Нет элемента

---

## 🚀 Быстрый старт

### Минимум для работы (MVP):
1. ✅ 01-login.html — Вход
2. ✅ 02-dashboard.html — Дашборд  
3. ⏳ 03-projects-list.html — Проекты
4. ⏳ 04-project-detail.html — Карточка проекта
5. ⏳ 05-project-create.html — Создание проекта

### Расширенный функционал:
6. ⏳ 07-tasks-list.html — Задачи
7. ⏳ 09-employees-list.html — Сотрудники
8. ⏳ 06-section-detail.html — Разделы
9. ⏳ 14-survey-detail.html — Изыскания

### Полный функционал:
10. Все остальные страницы (13-20)

---

## 💡 Как подключать

### Шаблон для страницы:

```javascript
// js/pages/[page-name].js

document.addEventListener('DOMContentLoaded', async () => {
  await checkAuth();
  await loadData();
});

async function checkAuth() {
  if (!getAuthToken()) {
    window.location.href = '01-login.html';
  }
}

async function loadData() {
  try {
    UI.showLoading('#container-id');
    const data = await API.[entity].getList();
    renderData(data);
  } catch (error) {
    UI.showError('#container-id', 'Ошибка загрузки');
  }
}

function renderData(data) {
  const container = document.getElementById('container-id');
  container.innerHTML = data.map(item => `...`).join('');
}
```

### В HTML добавить ID:

```html
<!-- Было -->
<div class="projects-list">
  <div class="project-card">...</div>
</div>

<!-- Стало -->
<div class="projects-list" id="projects-container">
  <!-- JS загрузит проекты -->
</div>
```

### Подключить скрипты:

```html
<script src="js/api-config.js"></script>
<script src="js/api-client.js"></script>
<script src="js/api.js"></script>
<script src="js/ui-helpers.js"></script>
<script src="js/pages/projects-list.js"></script>
</body>
```

---

## 📞 Полная документация

- **Полный аудит:** `FULL_AUDIT.md`
- **Статус интеграции:** `INTEGRATION_STATUS.md`
- **Быстрый старт:** `QUICK_START.md`
- **Документация API:** `js/README.md`

---

**Всего элементов:** 67  
**Подключено:** 5 (7%)  
**Осталось:** 62 (93%)
