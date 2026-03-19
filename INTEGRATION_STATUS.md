# 📊 Статус интеграции API с фронтендом

**Дата:** 16.03.2026  
**Проект:** Система управления проектным бюро

---

## ✅ Создано (готово к использованию)

### 1. Базовая инфраструктура
| Файл | Назначение | Статус |
|------|-----------|--------|
| `js/api-config.js` | Конфигурация API, токены, утилиты | ✅ Готово |
| `js/api-client.js` | Базовый HTTP-клиент | ✅ Готово |
| `js/api.js` | Методы API для всех сущностей | ✅ Готово |
| `js/ui-helpers.js` | UI-хелперы (форматирование, toast) | ✅ Готово |
| `js/README.md` | Документация по подключению | ✅ Готово |

### 2. Скрипты страниц
| Файл | Страница | Статус |
|------|---------|--------|
| `js/pages/login.js` | 01-login.html | ✅ Готово |
| `js/pages/dashboard.js` | 02-dashboard.html | ✅ Готово |
| `js/pages/projects-list.js` | 03-projects-list.html | ✅ Готово |
| `js/pages/tasks-list.js` | 07-tasks-list.html | ✅ Готово |

### 3. Обновлённые HTML-файлы
| Файл | Изменения | Статус |
|------|----------|--------|
| 01-login.html | Форма + подключение скриптов | ✅ Готово |
| 02-dashboard.html | Подключение скриптов | ✅ Готово |

---

## 🔧 Что нужно сделать

### Шаг 1: Настроить BASE_URL
**Файл:** `js/api-config.js`

```javascript
const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api', // ← Укажите ваш API
  // ...
};
```

### Шаг 2: Проверить соответствие API-методов
**Файл:** `js/api.js`

Сверьте эндпоинты с вашим реальным API:

```javascript
// Было:
projects: {
  getList: (params) => api.get('/projects'),
}

// Может потребоваться:
projects: {
  getList: (params) => api.get('/project/list'), // ← ваш путь
}
```

### Шаг 3: Подключить скрипты к остальным страницам

Для каждой страницы:

1. **Добавить ID к контейнерам** (куда загружать данные)
2. **Подключить скрипты** перед `</body>`:

```html
<script src="js/api-config.js"></script>
<script src="js/api-client.js"></script>
<script src="js/api.js"></script>
<script src="js/ui-helpers.js"></script>
<script src="js/pages/projects-list.js"></script>
</body>
```

---

## 📋 План подключения страниц

| # | Страница | Файл | Скрипт | Статус |
|---|----------|------|--------|--------|
| 1 | Вход | 01-login.html | js/pages/login.js | ✅ Подключено |
| 2 | Дашборд | 02-dashboard.html | js/pages/dashboard.js | ✅ Подключено |
| 3 | Проекты | 03-projects-list.html | js/pages/projects-list.js | ⏳ Готово к подключению |
| 4 | Проект | 04-project-detail.html | js/pages/project-detail.js | 🔴 Нужно создать |
| 5 | Проект (сотрудник) | 04-1-project-detail-employee.html | — | 🔴 Нужно создать |
| 6 | Обсуждение | 04-1-project-discussion.html | — | 🔴 Нужно создать |
| 7 | Экспертиза | 04-2-project-expertise.html | — | 🔴 Нужно создать |
| 8 | История | 04-3-project-history.html | — | 🔴 Нужно создать |
| 9 | Финансы (ГИП) | 04-5-project-finances.html | — | 🔴 Нужно создать |
| 10 | Финансы (сотрудник) | 04-5-project-finances-employee.html | — | 🔴 Нужно создать |
| 11 | Создание проекта | 05-project-create.html | js/pages/project-create.js | 🔴 Нужно создать |
| 12 | Раздел | 06-section-detail.html | js/pages/section-detail.js | 🔴 Нужно создать |
| 13 | Экспертиза раздела | 06-1-section-expertise.html | — | 🔴 Нужно создать |
| 14 | Раздел (наблюдатель) | 06-2-section-observer.html | — | 🔴 Нужно создать |
| 15 | Задачи | 07-tasks-list.html | js/pages/tasks-list.js | ⏳ Готово к подключению |
| 16 | Создание задачи | 08-task-create.html | js/pages/task-create.js | 🔴 Нужно создать |
| 17 | Сотрудники | 09-employees-list.html | js/pages/employees-list.js | 🔴 Нужно создать |
| 18 | Создание сотрудника | 10-employee-create.html | js/pages/employee-create.js | 🔴 Нужно создать |
| 19 | Уведомления | 11-notifications.html | js/pages/notifications.js | 🔴 Нужно создать |
| 20 | Отчёты | 12-reports.html | js/pages/reports.js | 🔴 Нужно создать |
| 21 | Настройки | 13-settings.html | — | 🔴 Нужно создать |
| 22 | Справочники | 13-1-settings-sections.html | js/pages/settings-sections.js | 🔴 Нужно создать |
| 23 | Виды изысканий | 13-2-settings-surveys.html | — | 🔴 Нужно создать |
| 24 | Категории расходов | 13-3-settings-expenses.html | — | 🔴 Нужно создать |
| 25 | Типы контрагентов | 13-4-settings-contractor-types.html | — | 🔴 Нужно создать |
| 26 | Изыскание | 14-survey-detail.html | js/pages/survey-detail.js | 🔴 Нужно создать |
| 27 | Изыскание (наблюдатель) | 14-1-survey-detail-observer.html | — | 🔴 Нужно создать |
| 28 | Финансы изыскания | 14-2-survey-finances.html | — | 🔴 Нужно создать |
| 29 | Экспертиза изыскания | 14-3-survey-expertise.html | — | 🔴 Нужно создать |
| 30 | Создание экспертизы | 14-4-expertise-create.html | js/pages/expertise-create.js | 🔴 Нужно создать |
| 31 | Создание изыскания | 15-survey-create.html | js/pages/survey-create.js | 🔴 Нужно создать |
| 32 | Замечание экспертизы | 16-expertise-comment.html | — | 🔴 Нужно создать |
| 33 | Детали договора | 18-contract-detail.html | js/pages/contract-detail.js | 🔴 Нужно создать |
| 34 | Детали выплаты | 19-payment-detail.html | js/pages/payment-detail.js | 🔴 Нужно создать |
| 35 | Календарь | 20-calendar.html | js/pages/calendar.js | 🔴 Нужно создать |
| 36 | Статистика экспертизы | 21-expertise-stats.html | — | 🔴 Нужно создать |

---

## 🎯 Приоритеты подключения

### 🔴 Критичные (MVP)
1. **01-login.html** — вход в систему ✅
2. **02-dashboard.html** — главная страница ✅
3. **03-projects-list.html** — список проектов
4. **04-project-detail.html** — карточка проекта
5. **09-employees-list.html** — сотрудники
6. **07-tasks-list.html** — задачи

### 🟡 Важные
7. **06-section-detail.html** — раздел проекта
8. **14-survey-detail.html** — изыскание
9. **04-5-project-finances.html** — финансы проекта
10. **11-notifications.html** — уведомления
11. **05-project-create.html** — создание проекта
12. **08-task-create.html** — создание задачи

### 🟢 Дополнительные
13. **12-reports.html** — отчёты
14. **13-settings.html** — настройки
15. **20-calendar.html** — календарь
16. Остальные страницы

---

## 📝 Чек-лист для каждой страницы

При подключении страницы:

- [ ] Добавить ID к контейнерам данных
- [ ] Удалить хардкод-данные из HTML
- [ ] Подключить скрипты (api-*.js + page-*.js)
- [ ] Создать/адаптировать скрипт страницы
- [ ] Настроить загрузку данных из API
- [ ] Обработать состояния: loading, error, empty
- [ ] Проверить навигацию (ссылки работают)
- [ ] Проверить авторизацию (редирект если нет токена)
- [ ] Протестировать в браузере

---

## 🚀 Быстрый старт

### 1. Проверка работы

Откройте `01-login.html` в браузере:
```bash
# Если у вас есть локальный сервер
start http://localhost:8000/01-login.html

# Или просто откройте файл двойным кликом
```

### 2. Тест входа

Введите любые данные:
- Email: `test@prokb.ru`
- Пароль: `1234`

Если API ещё не подключен — сработает временный код и откроется дашборд.

### 3. Проверка консоли

Нажмите F12 → Console. Должны быть видны:
- ✅ Загрузка скриптов
- ⚠️ Ошибки API (если сервер недоступен)

---

## 🛠 Если API ещё не готов

Используйте mock-данные в скриптах страниц:

```javascript
async function loadProjects() {
  // Временно используем mock-данные
  const mockProjects = [
    { 
      id: 1, 
      code: '2025-001', 
      name: 'ЖК "Северное сияние"',
      status: 'in-progress',
      progress: 33,
      deadline: '2025-06-30',
      sections: [],
      surveys: []
    },
  ];
  
  renderProjects(mockProjects);
  
  // Когда API будет готов:
  // const data = await API.projects.getList();
  // renderProjects(data.items);
}
```

---

## 📞 Вопросы и поддержка

### Частые проблемы

**1. Ошибка CORS**
```
Access to fetch at 'http://api.example.com' from origin 'http://localhost' has been blocked by CORS policy
```
**Решение:** Настройте CORS на бэкенде или используйте proxy.

**2. Токен не сохраняется**
**Проверка:** Откройте DevTools → Application → Local Storage. Должен быть ключ `authToken`.

**3. Скрипты не загружаются**
**Проверка:** Убедитесь, что пути относительные (`js/api-config.js`, а не `/js/api-config.js`).

---

## 📈 Прогресс

```
Создано инфраструктуры: ████████████████████ 100% (5/5 файлов)
Скрипты страниц:        ████░░░░░░░░░░░░░░░░  20% (4/20 страниц)
HTML подключено:        ██░░░░░░░░░░░░░░░░░░░  10% (2/20 страниц)
```

**Ближайшие задачи:**
1. Подключить 03-projects-list.html
2. Создать js/pages/project-detail.js
3. Подключить 09-employees-list.html
