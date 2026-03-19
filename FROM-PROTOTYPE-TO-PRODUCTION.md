# План перехода от прототипа к production

> Дорожная карта превращения HTML-прототипа в работающее веб-приложение

---

## ✅ Что уже сделано

### Backend (FastAPI)
| Компонент | Статус |
|-----------|--------|
| API сервер | ✅ 50+ endpoints |
| SQLite БД | ✅ 13 таблиц |
| Авторизация | ✅ По email |
| Тестовые данные | ✅ |
| CORS | ✅ |

### Frontend (Vanilla JS)
| Компонент | Статус |
|-----------|--------|
| Прототип | ✅ 41 HTML страница |
| API скрипты | ✅ api.js, api-client.js |
| UI helpers | ✅ ui-helpers.js, shared.js |
| API интеграция | 🔄 1 страница готова |

### Запуск
```bash
cd app
./run.sh        # Linux/macOS
run.bat         # Windows
```

http://localhost:8000

---

## 1. Этапы разработки

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   ПРОТОТИП      │ ──►│   FRONTEND      │ ──►│   BACKEND       │ ──►│   PRODUCTION    │
│   (HTML/CSS)    │    │   (React/Vue)   │    │   (API+DB)      │    │   (Deploy)      │
│                 │    │                 │    │                 │    │                 │
│ • Визуализация  │    │ • Компоненты    │    │ • База данных   │    │ • Сервер        │
│ • Сценарии      │    │ • Состояние     │    │ • API endpoints │    │ • Домен         │
│ • Согласование  │    │ • Роутинг       │    │ • Авторизация   │    │ • HTTPS         │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
     1-2 недели            2-3 недели            3-4 недели            1 неделя
```

---

## 2. Что у нас есть (Прототип)

### Готово ✅
| Компонент | Файлы | Статус |
|-----------|-------|--------|
| UI всех страниц | 14 HTML файлов | ✅ |
| Дизайн-система | UI-GUIDELINES.md | ✅ |
| Архитектура данных | ARCHITECTURE.md | ✅ |
| Бэклог фич | IDEAS.md | ✅ |
| Контекст проекта | PROJECT-CONTEXT.md | ✅ |

### Нужно будет ⚠️
| Компонент | Описание |
|-----------|----------|
| Frontend-фреймворк | React/Vue/Next.js |
| Backend | Node.js/Python/Go |
| База данных | PostgreSQL/MySQL/MongoDB |
| Авторизация | JWT/OAuth |
| Файловое хранилище | S3/Local |
| Деплой | VPS/Cloud |

---

## 3. Выбор стека

### 3.1 Рекомендуемый стек для проектного бюро

| Слой | Технология | Почему |
|------|------------|--------|
| **Frontend** | Next.js 15 + React | SSR, SEO, файловый роутинг |
| **UI** | Tailwind CSS + shadcn/ui | Совпадает с прототипом |
| **Backend** | Next.js API Routes | Единый репозиторий |
| **База данных** | PostgreSQL + Prisma | Типизация, миграции |
| **Авторизация** | NextAuth.js | Готовое решение |
| **Файлы** | Local → S3 | Простота начала |
| **Деплой** | Vercel / VPS | Бесплатно для начала |

### 3.2 Альтернативы

| Если нужно | Стек |
|------------|------|
| Микросервисы | React + Node.js (отдельно) |
| Python-команда | React + FastAPI/Django |
| Enterprise | React + Java Spring |
| Быстрый MVP | React + Firebase |

---

## 4. Порядок разработки

### Фаза 1: Подготовка Frontend (неделя 1-2)

```
1. Создать Next.js проект
   npx create-next-app@latest prokb-app

2. Установить зависимости
   - Tailwind CSS (уже настроен в create-next-app)
   - Prisma (для типизации)
   - NextAuth.js (авторизация)

3. Перенести дизайн-систему
   - Скопировать CSS из прототипа
   - Создать компоненты (Button, Card, Input...)

4. Перенести страницы
   - Каждый HTML → React-компонент
   - Разбить на переиспользуемые части
```

### Фаза 2: База данных (неделя 2-3)

```
1. Спроектировать схему по ARCHITECTURE.md
2. Создать Prisma schema
3. Написать миграции
4. Заполнить справочники
5. Создать тестовые данные
```

### Фаза 3: Backend API (неделя 3-5)

```
1. Авторизация (NextAuth.js)
   - Логин/логаут
   - Роли пользователей
   - Сессии

2. CRUD для сущностей
   - Projects
   - Sections
   - Employees
   - Files

3. Бизнес-логика
   - Права доступа
   - Статусы и переходы
   - Уведомления

4. Файловое хранилище
   - Загрузка файлов
   - Скачивание файлов
   - Удаление файлов
```

### Фаза 4: Интеграция (неделя 5-6)

```
1. Подключить Frontend к API
2. Реализовать формы
3. Обработка ошибок
4. Загрузка состояний
```

### Фаза 5: Деплой (неделя 6-7)

```
1. Настроить environment variables
2. Миграции на production DB
3. Деплой на Vercel/VPS
4. Настроить домен
5. HTTPS сертификат
```

---

## 5. Как не сломать

### 5.1 Принципы

| Принцип | Как применить |
|---------|---------------|
| **Итеративность** | Одна фича за раз, тестируем, потом следующая |
| **Версионирование** | Git ветки для каждой фичи, merge в main только после тестов |
| **Документация** | Обновлять ARCHITECTURE.md при изменениях схемы |
| **Тесты** | Писать тесты на критичную логику (права доступа, статусы) |

### 5.2 Стратегия ветвления

```
main (production)
  │
  ├── develop (разработка)
  │     │
  │     ├── feature/auth
  │     ├── feature/projects
  │     ├── feature/sections
  │     └── feature/files
  │
  └── hotfix/* (срочные исправления)
```

### 5.3 Правила коммитов

```
feat: добавить страницу проектов
fix: исправить ошибку авторизации
docs: обновить документацию API
refactor: переписать компонент карточки
test: добавить тесты для прав доступа
```

---

## 6. Архитектура production-приложения

### 6.1 Структура проекта (Next.js)

```
prokb-app/
├── src/
│   ├── app/                    # Страницы (App Router)
│   │   ├── (auth)/             # Группа авторизации
│   │   │   ├── login/
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/        # Группа авторизованных
│   │   │   ├── projects/
│   │   │   ├── sections/
│   │   │   └── layout.tsx
│   │   ├── api/                # Backend API
│   │   │   ├── auth/[...nextauth]/
│   │   │   ├── projects/
│   │   │   ├── sections/
│   │   │   └── files/
│   │   ├── layout.tsx
│   │   └── page.tsx            # Дашборд
│   │
│   ├── components/             # React-компоненты
│   │   ├── ui/                 # Базовые (Button, Card...)
│   │   ├── layout/             # Layout (Sidebar, Header...)
│   │   └── features/           # Фичи (ProjectCard, SectionForm...)
│   │
│   ├── lib/                    # Утилиты
│   │   ├── prisma.ts           # DB клиент
│   │   ├── auth.ts             # Авторизация
│   │   └── permissions.ts      # Права доступа
│   │
│   └── types/                  # TypeScript типы
│       └── index.ts
│
├── prisma/
│   ├── schema.prisma           # Схема БД
│   └── migrations/             # Миграции
│
├── public/                     # Статика
├── .env                        # Переменные окружения
└── package.json
```

### 6.2 Prisma Schema (пример)

```prisma
// prisma/schema.prisma

model Project {
  id          String   @id @default(cuid())
  code        String   @unique          // Шифр
  name        String
  status      ProjectStatus @default(IN_PROGRESS)
  deadline    DateTime?
  inputText   String?                   // Вводные данные
  
  sections    Section[]
  surveys     Survey[]
  expenses    Expense[]
  comments    Comment[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("projects")
}

model Section {
  id            String   @id @default(cuid())
  projectId     String
  project       Project  @relation(fields: [projectId], references: [id])
  
  sectionTypeId String
  sectionType   SectionType @relation(fields: [sectionTypeId], references: [id])
  
  status        SectionStatus @default(NOT_STARTED)
  
  responsibleId String
  responsible   Employee  @relation("Responsible", fields: [responsibleId], references: [id])
  
  coExecutors   CoExecutor[]
  observers     Observer[]
  
  files         File[]
  comments      Comment[]
  expertiseComments ExpertiseComment[]
  
  @@map("sections")
}

model Employee {
  id          String   @id @default(cuid())
  firstName   String
  lastName    String
  middleName  String
  email       String   @unique
  role        UserRole @default(EMPLOYEE)
  
  sectionsResponsible Section[]  @relation("Responsible")
  sectionsCoExec      CoExecutor[]
  sectionsObserver    Observer[]
  
  @@map("employees")
}

// ... остальные модели по ARCHITECTURE.md
```

---

## 7. Безопасность

### 7.1 Авторизация

```typescript
// src/lib/auth.ts
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        // Проверка логина/пароля
      }
    })
  ],
  callbacks: {
    async session({ session, user }) {
      // Добавить роль в сессию
      return session
    }
  }
})
```

### 7.2 Проверка прав на сервере

```typescript
// src/lib/permissions.ts
export async function canEditSection(userId: string, sectionId: string) {
  const section = await prisma.section.findUnique({
    where: { id: sectionId },
    include: { 
      responsible: true, 
      coExecutors: true,
      project: { include: { createdBy: true } }
    }
  })
  
  const user = await prisma.employee.findUnique({
    where: { id: userId }
  })
  
  // ГИП может всё
  if (user.role === 'GIP' || user.role === 'DIRECTOR') return true
  
  // Ответственный может редактировать
  if (section.responsibleId === userId) return true
  
  // Соисполнитель может частично
  if (section.coExecutors.some(c => c.employeeId === userId)) {
    return { canUpload: true, canDeleteOwn: true }
  }
  
  return false
}
```

### 7.3 Защита API routes

```typescript
// src/app/api/sections/[id]/route.ts
import { auth } from "@/lib/auth"
import { canEditSection } from "@/lib/permissions"

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  const canEdit = await canEditSection(session.user.id, params.id)
  if (!canEdit) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }
  
  // Логика обновления...
}
```

---

## 8. Миграция данных

### 8.1 Если есть данные из других систем

```typescript
// scripts/migrate-data.ts

async function migrateProjects() {
  const oldProjects = await fetchOldData()
  
  for (const project of oldProjects) {
    await prisma.project.create({
      data: {
        code: project.code,
        name: project.name,
        status: mapStatus(project.status),
        // ...
      }
    })
  }
}
```

### 8.2 Начальные справочники

```typescript
// prisma/seed.ts

async function main() {
  // Разделы
  await prisma.sectionType.createMany({
    data: [
      { shortName: "АР", fullName: "Архитектурные решения", color: "#3b82f6" },
      { shortName: "ГП", fullName: "Генеральный план", color: "#22c55e" },
      // ... из справочника
    ]
  })
  
  // Категории расходов
  await prisma.expenseCategory.createMany({
    data: [
      { name: "Командировки" },
      { name: "Материалы" },
      // ...
    ]
  })
}
```

---

## 9. Деплой

### 9.1 Vercel (рекомендуется для начала)

```
1. Push код в GitHub
2. Подключить репозиторий в Vercel
3. Настроить переменные окружения:
   - DATABASE_URL
   - NEXTAUTH_SECRET
   - NEXTAUTH_URL
4. Деплой автоматически при push в main
```

### 9.2 VPS (для production)

```
1. Арендовать VPS (Hetzner, Timeweb, Selectel)
2. Установить Docker
3. Настроить PostgreSQL
4. Настроить Nginx + Let's Encrypt
5. Запустить контейнеры
```

### 9.3 docker-compose.yml (пример)

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/prokb
    depends_on:
      - db
  
  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=prokb

volumes:
  postgres_data:
```

---

## 10. Чек-лист перед production

### Безопасность
- [ ] Авторизация работает на всех защищённых страницах
- [ ] API возвращает 401 для неавторизованных
- [ ] API возвращает 403 для недостатка прав
- [ ] Пароли хешируются (bcrypt)
- [ ] HTTPS включён
- [ ] Секреты в переменных окружения (не в коде)

### Данные
- [ ] Миграции применены
- [ ] Справочники заполнены
- [ ] Бэкапы настроены
- [ ] Тестовые данные удалены

### Производительность
- [ ] Изображения оптимизированы
- [ ] База проиндексирована
- [ ] Кеширование настроено

### Мониторинг
- [ ] Логи собираются
- [ ] Ошибки отслеживаются (Sentry)
- [ ] Uptime мониторинг

---

## 11. План на ближайшее время

### После завершения прототипа:

1. **Создать репозиторий production-версии**
   ```
   Имя: prokb-app
   Стек: Next.js 15 + Prisma + PostgreSQL
   ```

2. **Перенести документацию**
   - PROJECT-CONTEXT.md
   - ARCHITECTURE.md
   - IDEAS.md (только нереализованное)
   - UI-GUIDELINES.md

3. **Начать разработку по фазам**
   - Неделя 1-2: Frontend (перенос из прототипа)
   - Неделя 2-3: База данных
   - Неделя 3-5: Backend API
   - Неделя 5-6: Интеграция
   - Неделя 6-7: Деплой

---

*Этот файл описывает путь от прототипа к работающему приложению.*
