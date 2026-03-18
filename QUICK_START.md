# 🚀 Быстрый старт: Подключение API

## Что уже сделано

✅ Создан API-слой для связи фронтенда с бэкендом  
✅ Подключены страницы: Вход (01-login.html) и Дашборд (02-dashboard.html)  
✅ Готовы скрипты для: Проекты, Задачи

---

## 1️⃣ Настройте API (2 минуты)

Откройте `js/api-config.js` и укажите адрес вашего API:

```javascript
const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api',  // ← Ваш API
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};
```

---

## 2️⃣ Проверьте соответствие API (5 минут)

Откройте `js/api.js` и проверьте, что эндпоинты совпадают с вашим API.

**Пример:**
```javascript
// Если ваш API использует '/project/list' вместо '/projects':
projects: {
  getList: (params) => api.get('/project/list'), // ← Измените путь
}
```

---

## 3️⃣ Подключите страницу проектов (3 минуты)

### В файле `03-projects-list.html`:

**Найдите:**
```html
<div class="space-y-4">
  <!-- Проект 1 -->
  <div class="project-card">
    <!-- ... хардкод ... -->
  </div>
</div>
```

**Замените на:**
```html
<div class="space-y-4" id="projects-container">
  <!-- JS загрузит проекты из API -->
</div>
```

**В конце файла (перед `</body>`) добавьте:**
```html
<script src="js/api-config.js"></script>
<script src="js/api-client.js"></script>
<script src="js/api.js"></script>
<script src="js/ui-helpers.js"></script>
<script src="js/pages/projects-list.js"></script>
</body>
</html>
```

---

## 4️⃣ Запустите и проверьте

1. Откройте `01-login.html` в браузере
2. Введите email/пароль
3. Если API работает — увидите данные из бэкенда
4. Если API нет — сработает временный код (демо-режим)

---

## 📡 Структура файлов

```
prototype/
├── js/
│   ├── api-config.js       # Настройки API
│   ├── api-client.js       # HTTP-клиент
│   ├── api.js              # Методы API
│   ├── ui-helpers.js       # UI-хелперы
│   ├── pages/              # Скрипты страниц
│   │   ├── login.js        # ✅ Вход
│   │   ├── dashboard.js    # ✅ Дашборд
│   │   ├── projects-list.js # ✅ Проекты
│   │   └── tasks-list.js   # ✅ Задачи
│   └── README.md           # Документация
├── 01-login.html           # ✅ Подключено
├── 02-dashboard.html       # ✅ Подключено
├── 03-projects-list.html   # ⏳ Готово к подключению
└── INTEGRATION_STATUS.md   # Полный статус
```

---

## 🎯 Следующие шаги

1. **Проверить вход в систему** (01-login.html)
2. **Проверить дашборд** (02-dashboard.html)
3. **Подключить проекты** (03-projects-list.html)
4. **Подключить задачи** (07-tasks-list.html)
5. **Создать скрипт для карточки проекта** (04-project-detail.html)

---

## 🆘 Если что-то не работает

### Откройте консоль браузера (F12)

**Ошибки API:**
```
GET http://localhost:3000/api/dashboard/stats 404
```
→ Проверьте BASE_URL в `js/api-config.js`

**Ошибки CORS:**
```
Access to fetch blocked by CORS policy
```
→ Настройте CORS на бэкенде

**Скрипты не загружаются:**
```
Failed to load resource: net::ERR_FILE_NOT_FOUND
```
→ Проверьте пути (должны быть относительными: `js/api-config.js`)

---

## 📞 Документация

- **Полная инструкция:** `js/README.md`
- **Статус интеграции:** `INTEGRATION_STATUS.md`
- **API методы:** `js/api.js` (комментарии в коде)

---

## 💡 Совет

Не пытайтесь подключить все страницы сразу!

**Итеративный подход:**
1. Подключите 1 страницу
2. Протестируйте
3. Исправьте ошибки
4. Переходите к следующей

**Оптимальный порядок:**
1. Вход ✅
2. Дашборд ✅
3. Проекты
4. Карточка проекта
5. Задачи
6. Сотрудники

---

**Время на полную интеграцию:** ~4-8 часов (20-30 страниц)  
**Время на MVP (6 страниц):** ~1-2 часа
