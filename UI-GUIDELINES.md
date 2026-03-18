# UI Guidelines — Проектное бюро

> Гайдлайны по дизайну интерфейса прототипа

---

## 1. Цветовая палитра

### 1.1 Основные цвета
| Название | Hex | Использование |
|----------|-----|---------------|
| Slate 800 | `#1e293b` | Основной текст, кнопки primary |
| Slate 700 | `#334155` | Secondary текст, градиенты |
| Slate 600 | `#475569` | Текст body |
| Slate 500 | `#64748b` | Placeholder, secondary |
| Slate 400 | `#94a3b8` | Borders, disabled |
| Slate 300 | `#cbd5e1` | Borders hover |
| Slate 200 | `#e2e8f0` | Borders default |
| Slate 100 | `#f1f5f9` | Background hover |
| Slate 50 | `#f8fafc` | Background body |

### 1.2 Акцентные цвета (статусы)
| Статус | Цвет | Hex |
|--------|------|-----|
| Согласован/Успех | Зелёный | `#16a34a` |
| В работе | Синий | `#3b82f6` |
| На проверке | Жёлтый | `#f59e0b` |
| Просрочено | Красный | `#ef4444` |
| Не начат | Серый | `#64748b` |
| Отклонено | Оранжевый | `#ea580c` |

---

## 2. Типографика

### 2.1 Шрифт
- **Основной:** Inter (Google Fonts)
- **Резервный:** system-ui, -apple-system, sans-serif

### 2.2 Размеры
| Класс | Размер | Использование |
|-------|--------|---------------|
| text-xs | 12px | Метки, hints |
| text-sm | 14px | Body text, labels |
| text-base | 16px | Основной текст |
| text-lg | 18px | Подзаголовки |
| text-xl | 20px | Заголовки карточек |
| text-2xl | 24px | Заголовки страниц |
| text-3xl | 30px | Большие цифры |

### 2.3 Начертания
| Weight | Название | Использование |
|--------|----------|---------------|
| 300 | Light | — |
| 400 | Regular | Body text |
| 500 | Medium | Labels, buttons |
| 600 | Semibold | Заголовки |
| 700 | Bold | — |

---

## 3. Отступы

### 3.1 Базовая сетка
Используем шкалу 4px: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64`

### 3.2 Типичные отступы
| Элемент | Padding | Margin |
|---------|---------|--------|
| Карточка | 24px | — |
| Кнопка | 10px 20px | — |
| Поля ввода | 12px 16px | — |
| Пункт меню | 12px 16px | — |
| Между блоками | — | 24px |
| Между секциями | — | 32px |

---

## 4. Скругления

| Элемент | Radius |
|---------|--------|
| Кнопки | 12px |
| Поля ввода | 12px |
| Карточки | 16px |
| Stat-карточки | 20px |
| Бейджи | 20px (pill) |
| Аватары | 12px |
| Элементы списка | 12px |

---

## 5. Тени

### 5.1 Карточки
```css
box-shadow: 0 1px 3px rgba(0,0,0,0.08);
border: 1px solid #e2e8f0;
```

### 5.2 Hover
```css
box-shadow: 0 4px 12px rgba(0,0,0,0.1);
transform: translateY(-2px);
```

### 5.3 Модальные окна
```css
box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

---

## 6. Компоненты

### 6.1 Кнопки

#### Primary
```html
<button class="btn-primary">
  Создать проект
</button>
```
```css
.btn-primary {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: white;
  border-radius: 12px;
  padding: 10px 20px;
  font-weight: 500;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-primary:hover {
  background: linear-gradient(135deg, #334155 0%, #475569 100%);
  transform: translateY(-1px);
}
```

#### Secondary
```html
<button class="btn-secondary">Отмена</button>
```
```css
.btn-secondary {
  background: white;
  color: #475569;
  border-radius: 12px;
  padding: 10px 20px;
  font-weight: 500;
  font-size: 14px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-secondary:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}
```

### 6.2 Поля ввода
```html
<input type="text" class="input-field" placeholder="Введите текст">
```
```css
.input-field {
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 12px 16px;
  font-size: 14px;
  width: 100%;
  transition: all 0.2s ease;
}
.input-field:focus {
  outline: none;
  border-color: #94a3b8;
  box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.15);
}
```

### 6.3 Карточки

#### Статическая
```html
<div class="card-static">
  <!-- Контент -->
</div>
```
```css
.card-static {
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  border: 1px solid #e2e8f0;
}
```

#### Интерактивная
```html
<div class="card">
  <!-- Контент -->
</div>
```
```css
.card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}
.card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}
```

### 6.4 Бейджи статусов
```html
<span class="badge status-completed">Согласован</span>
<span class="badge status-in-progress">В работе</span>
<span class="badge status-revision">На проверке</span>
```
```css
.badge {
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
}
.status-completed { background: #dcfce7; color: #16a34a; }
.status-in-progress { background: #dbeafe; color: #1d4ed8; }
.status-revision { background: #fef3c7; color: #d97706; }
.status-not-started { background: #f1f5f9; color: #64748b; }
```

### 6.5 Индикаторы разделов на карточках проектов

Используются для визуализации статусов разделов проекта на карточках:
- **Список проектов** (`03-projects-list.html`)
- **Дашборд** (`02-dashboard.html`) — блок "Активные проекты"

```html
<!-- Контейнер индикаторов -->
<div class="flex gap-1.5 flex-wrap">
  <span class="section-indicator section-done" data-tooltip="АР — Архитектурные решения (Завершён)">АР</span>
  <span class="section-indicator section-in-progress" data-tooltip="ГП — Генеральный план (В работе)">ГП</span>
  <span class="section-indicator section-review" data-tooltip="КР — На согласовании">КР</span>
  <span class="section-indicator section-not-started" data-tooltip="ОВ — Не начат">ОВ</span>
  <span class="section-indicator section-overdue" data-tooltip="ВК — Просрочен">ВК</span>
</div>
```

```css
/* Базовый стиль индикатора */
.section-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
}

/* Hover-эффект */
.section-indicator:hover {
  transform: scale(1.1);
  z-index: 10;
}

/* Tooltip при наведении */
.section-indicator[data-tooltip]:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #1e293b;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 400;
  white-space: nowrap;
  margin-bottom: 4px;
  z-index: 20;
}

/* Цветовые варианты статусов */
.section-done { 
  background: #dcfce7;  /* green-100 */
  color: #16a34a;       /* green-600 */
}

.section-in-progress { 
  background: #dbeafe;  /* blue-100 */
  color: #1d4ed8;       /* blue-700 */
}

.section-review { 
  background: #fef3c7;  /* amber-100 */
  color: #d97706;       /* amber-600 */
}

.section-not-started { 
  background: #f1f5f9;  /* slate-100 */
  color: #94a3b8;       /* slate-400 */
}

.section-overdue { 
  background: #fee2e2;  /* red-100 */
  color: #dc2626;       /* red-600 */
}
```

**Таблица статусов:**
| Класс | Цвет | Статус | Описание |
|-------|------|--------|----------|
| `section-done` | 🟢 Зелёный | `approved` | Раздел завершён/согласован |
| `section-in-progress` | 🔵 Синий | `in_progress` | Раздел в работе |
| `section-review` | 🟡 Жёлтый | `on_approval` | На согласовании |
| `section-not-started` | ⚪ Серый | `not_started` | Не начат |
| `section-overdue` | 🔴 Красный | `overdue` | Просрочен/требует внимания |

### 6.6 Индикаторы изысканий на карточках проектов

Аналогично индикаторам разделов, используются для визуализации статусов изысканий:
- **Список проектов** (`03-projects-list.html`)
- **Дашборд** (`02-dashboard.html`) — блок "Активные проекты"

```html
<!-- Контейнер индикаторов изысканий -->
<div class="flex gap-1.5 flex-wrap">
  <a href="14-survey-detail.html?project=1&survey=igd" class="survey-indicator survey-done">
    ИГД
    <span class="survey-tooltip">
      <span class="survey-tooltip-title">ИГД — Инженерно-геодезические</span>
      <span class="survey-tooltip-row"><span>Статус:</span> Завершён</span>
      <span class="survey-tooltip-row"><span>Ответственный:</span> Иванов П.С.</span>
    </span>
  </a>
  <a href="14-survey-detail.html?project=1&survey=igi" class="survey-indicator survey-in-progress">
    ИГИ
    <span class="survey-tooltip">...</span>
  </a>
</div>
```

```css
/* Базовый стиль индикатора изыскания */
.survey-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 28px;
  padding: 0 5px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  text-decoration: none;
  border: 2px solid transparent;
}

/* Цветовые варианты статусов изысканий */
.survey-done { 
  background: #d1fae5;  /* emerald-100 */
  color: #059669;       /* emerald-600 */
}

.survey-in-progress { 
  background: #e0e7ff;  /* indigo-100 */
  color: #4f46e5;       /* indigo-600 */
}

.survey-not-started { 
  background: #f1f5f9;  /* slate-100 */
  color: #94a3b8;       /* slate-400 */
}
```

**Отличия от индикаторов разделов:**
| Аспект | Разделы | Изыскания |
|--------|---------|-----------|
| Зелёный | `#dcfce7` / `#16a34a` (green) | `#d1fae5` / `#059669` (emerald) |
| Синий | `#dbeafe` / `#1d4ed8` (blue) | `#e0e7ff` / `#4f46e5` (indigo) |
| Жёлтый | ✅ Есть | ❌ Нет (не используется) |
| Просрочен | ✅ Есть | ❌ Нет (не используется) |

**Tooltip для изысканий:**
```css
.survey-tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: #1e293b;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 11px;
  white-space: nowrap;
  z-index: 100;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}

.survey-indicator:hover .survey-tooltip {
  opacity: 1;
  visibility: visible;
}
```

### 6.7 Индикация просрочки дедлайна

Используется на дашборде и в списках проектов для визуальной индикации сроков.

```html
<!-- Нормальный дедлайн -->
<span class="deadline-normal">📅 до 30.06.2025</span>

<!-- Скоро (менее 7 дней) -->
<span class="deadline-soon">📅 до 15.04.2025 ⚠️</span>

<!-- Просрочен -->
<span class="deadline-overdue">📅 до 01.03.2025 🔴</span>
```

```css
.deadline-normal {
  color: #64748b;  /* slate-500 */
}

.deadline-soon {
  color: #d97706;  /* amber-600 */
  font-weight: 500;
}

.deadline-overdue {
  color: #dc2626;  /* red-600 */
  font-weight: 600;
}
```

**Правила определения:**
| Статус | Условие | Стиль |
|--------|---------|-------|
| Нормальный | До дедлайна > 7 дней | Серый |
| Скоро | До дедлайна ≤ 7 дней | Жёлтый + ⚠️ |
| Просрочен | Дата прошла | Красный + 🔴 |

### 6.8 Аватары
```html
<div class="avatar bg-gradient-to-br from-slate-700 to-slate-500 text-white">
  ИИ
</div>
```
```css
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}
.avatar-lg {
  width: 56px;
  height: 56px;
  font-size: 18px;
}
```

### 6.9 Пункты меню сайдбара
```html
<a href="#" class="sidebar-item active">
  <svg>...</svg>
  Дашборд
</a>
```
```css
.sidebar-item {
  border-radius: 12px;
  padding: 12px 16px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  font-size: 14px;
  color: #475569;
  text-decoration: none;
}
.sidebar-item:hover {
  background: #f1f5f9;
}
.sidebar-item.active {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: white;
}
```

---

## 7. Layout

### 7.1 Основная структура
```
┌─────────────────────────────────────────────────────────────┐
│ SIDEBAR (w-72)                    │ MAIN CONTENT (flex-1)  │
│                                   │                         │
│ ┌─────────────────────────────┐   │ ┌─────────────────────┐ │
│ │ Профиль пользователя        │   │ │ Header              │ │
│ └─────────────────────────────┘   │ └─────────────────────┘ │
│                                   │                         │
│ ┌─────────────────────────────┐   │ ┌─────────────────────┐ │
│ │ Меню                        │   │ │                     │ │
│ │                             │   │ │   Content           │ │
│ │                             │   │ │                     │ │
│ └─────────────────────────────┘   │ └─────────────────────┘ │
│                                   │                         │
│ ┌─────────────────────────────┐   │                         │
│ │ Выйти                       │   │                         │
│ └─────────────────────────────┘   │                         │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Сайдбар
```html
<aside class="w-72 bg-white border-r border-slate-200 min-h-screen flex flex-col">
  <!-- Профиль -->
  <!-- Навигация -->
  <!-- Выход -->
</aside>
```

### 7.3 Основной контент
```html
<main class="flex-1 overflow-auto p-8">
  <!-- Контент страницы -->
</main>
```

---

## 8. Иконки

Используются inline SVG из Heroicons (outline variant):

```html
<!-- Пример: иконка дома -->
<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
</svg>
```

### Часто используемые иконки:
- Дом (дашборд)
- Архив (проекты)
- Документ (задачи)
- Пользователи (исполнители)
- Колокольчик (уведомления)
- График (отчёты)
- Шестерёнка (настройки)
- Выход (выйти)
- Плюс (добавить)
- Корзина (удалить)
- Карандаш (редактировать)
- Глаз (просмотр)

---

## 9. Адаптивность

Прототип пока разрабатывается для desktop (min-width: 1280px).

---

*Этот документ содержит базовые стили. Для деталей смотрите существующие HTML-файлы.*
