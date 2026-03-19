/**
 * Mock Data - демо данные для работы без API
 *
 * Используется когда CONFIG.DEMO_MODE = true
 */

const MOCK_DATA = {
  // Текущий пользователь
  currentUser: {
    id: 1,
    name: 'Директоров Директор Д.',
    email: 'director@bureau.ru',
    role: 'director',
  },

  // Проекты
  projects: [
    {
      id: 1,
      code: '2025-001',
      name: 'ЖК "Северное сияние"',
      address: 'г. Москва, ул. Ленина, д. 45',
      type: 'new-construction',
      status: 'in-progress',
      customer: 'ООО "СтройИнвест"',
      startDate: '2025-01-15',
      deadline: '2025-06-30',
      area: 15000,
      floors: 12,
      description: 'Многоквартирный жилой комплекс с подземной парковкой',
      progress: 33,
      sections: [
        { id: 1, code: 'АР', name: 'Архитектурные решения', status: 'done', responsible: 'Петров А.И.', color: '#3b82f6' },
        { id: 2, code: 'ГП', name: 'Генеральный план', status: 'done', responsible: 'Сидоров К.М.', color: '#10b981' },
        { id: 3, code: 'КР', name: 'Конструктивные решения', status: 'in-progress', responsible: 'Козлов Д.В.', color: '#f59e0b' },
        { id: 4, code: 'ОВ', name: 'Отопление и вентиляция', status: 'not-started', responsible: null, color: '#8b5cf6' },
        { id: 5, code: 'ВК', name: 'Водоснабжение и канализация', status: 'not-started', responsible: null, color: '#06b6d4' },
        { id: 6, code: 'ЭОМ', name: 'Электроснабжение', status: 'not-started', responsible: null, color: '#eab308' },
      ],
      surveys: [
        { id: 1, code: 'ИГД', name: 'Инженерно-геодезические', status: 'done', responsible: 'Иванов П.С.', progress: 100 },
        { id: 2, code: 'ИГИ', name: 'Инженерно-геологические', status: 'in-progress', responsible: 'Петров А.И.', progress: 60 },
        { id: 3, code: 'ИЭИ', name: 'Инженерно-экологические', status: 'not-started', responsible: null, progress: 0 },
      ],
      team: [
        { id: 1, name: 'Петров А.И.', role: 'ГИП' },
        { id: 2, name: 'Сидоров К.М.', role: 'Инженер' },
        { id: 3, name: 'Козлов Д.В.', role: 'Конструктор' },
      ],
      files: [
        { id: 1, name: 'ТЗ_на_проектирование.pdf', type: 'pdf', size: 2500000, uploadedBy: 'Иванов П.С.', uploadedAt: '2025-01-20' },
        { id: 2, name: 'ГП_Стадия_П.dwg', type: 'dwg', size: 15000000, uploadedBy: 'Сидоров К.М.', uploadedAt: '2025-02-10' },
      ],
    },
    {
      id: 2,
      code: '2025-002',
      name: 'Реконструкция адм. здания',
      address: 'г. Москва, ул. Мира, д. 12',
      type: 'reconstruction',
      status: 'in-progress',
      customer: 'Администрация г. Москвы',
      startDate: '2025-02-01',
      deadline: '2025-04-15',
      area: 3500,
      floors: 4,
      description: 'Реконструкция административного здания под современный офисный центр',
      progress: 33,
      sections: [
        { id: 4, code: 'АР', name: 'Архитектурные решения', status: 'in-progress', responsible: 'Петров А.И.', color: '#3b82f6' },
        { id: 5, code: 'ГП', name: 'Генеральный план', status: 'review', responsible: 'Сидоров К.М.', color: '#10b981' },
        { id: 6, code: 'КР', name: 'Конструктивные решения', status: 'not-started', responsible: null, color: '#f59e0b' },
      ],
      surveys: [
        { id: 4, code: 'ИГД', name: 'Инженерно-геодезические', status: 'done', responsible: 'Иванов П.С.', progress: 100 },
        { id: 5, code: 'ИГИ', name: 'Инженерно-геологические', status: 'in-progress', responsible: 'Петров А.И.', progress: 45 },
      ],
      team: [
        { id: 1, name: 'Петров А.И.', role: 'ГИП' },
        { id: 2, name: 'Сидоров К.М.', role: 'Инженер' },
      ],
      files: [],
    },
    {
      id: 3,
      code: '2025-003',
      name: 'Кап. ремонт школы №15',
      address: 'г. Москва, ул. Школьная, д. 8',
      type: 'renovation',
      status: 'in-progress',
      customer: 'Департамент образования',
      startDate: '2024-10-01',
      deadline: '2025-03-01',
      area: 5200,
      floors: 3,
      description: 'Капитальный ремонт здания школы с модернизацией учебных помещений',
      progress: 75,
      sections: [
        { id: 7, code: 'АР', name: 'Архитектурные решения', status: 'done', responsible: 'Петров А.И.', color: '#3b82f6' },
        { id: 8, code: 'ГП', name: 'Генеральный план', status: 'done', responsible: 'Сидоров К.М.', color: '#10b981' },
        { id: 9, code: 'КР', name: 'Конструктивные решения', status: 'done', responsible: 'Козлов Д.В.', color: '#f59e0b' },
        { id: 10, code: 'ОВ', name: 'Отопление и вентиляция', status: 'in-progress', responsible: 'Васильев П.П.', color: '#8b5cf6' },
      ],
      surveys: [
        { id: 6, code: 'ИГД', name: 'Инженерно-геодезические', status: 'done', responsible: 'Иванов П.С.', progress: 100 },
      ],
      team: [
        { id: 1, name: 'Петров А.И.', role: 'ГИП' },
        { id: 3, name: 'Козлов Д.В.', role: 'Конструктор' },
        { id: 4, name: 'Васильев П.П.', role: 'Инженер ОВ' },
      ],
      files: [],
    },
  ],

  // Задачи
  tasks: [
    { id: 1, title: 'Согласовать отступы с заказчиком', project: 'ЖК "Северное сияние"', priority: 'critical', status: 'in-progress', deadline: '2025-03-20', assignee: 'Петров А.И.' },
    { id: 2, title: 'Проверить чертежи ГП', project: 'ЖК "Северное сияние"', priority: 'high', status: 'pending', deadline: '2025-03-18', assignee: 'Сидоров К.М.' },
    { id: 3, title: 'Подготовить смету по КР', project: 'Реконструкция адм. здания', priority: 'medium', status: 'pending', deadline: '2025-03-25', assignee: 'Козлов Д.В.' },
    { id: 4, title: 'Загрузить результаты ИГИ', project: 'ЖК "Северное сияние"', priority: 'low', status: 'completed', deadline: '2025-03-10', assignee: 'Петров А.И.' },
  ],

  // Сотрудники (синхронизировано с backend/test_data.py)
  employees: [
    { id: 1, name: 'Директоров Директор Д.', email: 'director@bureau.ru', role: 'director', position: 'Директор', department: 'Руководство', phone: '+7 (495) 111-11-11', active: true, contractorType: 'employee', projectsCount: 3, payments: { paid: 850000, total: 1000000, progress: 85 } },
    { id: 2, name: 'Иванов Иван И.', email: 'gip-ivanov@bureau.ru', role: 'gip', position: 'ГИП', department: 'Проектирование', phone: '+7 (495) 222-22-22', active: true, contractorType: 'employee', projectsCount: 3, payments: { paid: 520000, total: 680000, progress: 76 } },
    { id: 3, name: 'Петров Петр П.', email: 'executor-petrov@bureau.ru', role: 'executor', position: 'Архитектор', department: 'Проектирование', phone: '+7 (495) 333-33-33', active: true, contractorType: 'employee', projectsCount: 2, payments: { paid: 340000, total: 450000, progress: 75 } },
    { id: 4, name: 'Сидоров Сидор С.', email: 'executor-sidorov@bureau.ru', role: 'executor', position: 'Конструктор', department: 'Конструкторы', phone: '+7 (495) 444-44-44', active: true, contractorType: 'employee', projectsCount: 2, payments: { paid: 280000, total: 380000, progress: 74 } },
    { id: 5, name: 'Кузнецов Кузьма К.', email: 'observer-kuznetsov@bureau.ru', role: 'observer', position: 'Наблюдатель', department: 'Контроль', phone: '+7 (495) 555-55-55', active: true, contractorType: 'employee', projectsCount: 1, payments: { paid: 0, total: 0, progress: 0 } },
  ],

  // Уведомления
  notifications: [
    { id: 1, type: 'expertise', title: 'Замечание требует ответа', description: '№127 по разделу АР', link: '06-4-section-expertise.html?id=127', read: false, createdAt: '2025-03-16T10:00:00Z' },
    { id: 2, type: 'task', title: 'Дедлайн через 2 дня', description: 'ИГИ — Инженерно-геологические', link: '14-survey-detail.html?id=2', read: false, createdAt: '2025-03-16T07:00:00Z' },
    { id: 3, type: 'task', title: 'Новая задача', description: 'Проверить чертежи ГП', link: '07-tasks-list.html', read: false, createdAt: '2025-03-15T12:00:00Z' },
    { id: 4, type: 'file', title: 'Файл согласован', description: 'АР_Стадия П.pdf', link: '06-1-section-files.html', read: true, createdAt: '2025-03-14T09:00:00Z' },
  ],

  // Статистика дашборда
  dashboardStats: {
    projects: { total: 3, inProgress: 3, completed: 0 },
    sections: { total: 13, done: 7, inProgress: 4, review: 1 },
    tasks: { total: 4, overdue: 1, my: 2 },
    finances: { month: 2500000, year: 15000000 },
  },

  // События требующие внимания
  attentionItems: [
    { id: 1, type: 'overdue-project', priority: 'critical', title: 'Просрочен дедлайн проекта', description: 'Кап. ремонт школы №15', badge: '📅 14 дней просрочки', link: '04-project-detail.html?id=3' },
    { id: 2, type: 'pending-review', priority: 'critical', title: 'Замечания на проверке', description: '3 замечания ждут согласования', badge: 'ГИП не проверил', link: '06-4-section-expertise.html?id=1' },
    { id: 3, type: 'overdue-payment', priority: 'warning', title: 'Просрочена оплата счёта', description: 'Реконструкция адм. здания', badge: '💰 50 000 ₽ не оплачено', link: '04-5-project-finances.html?id=2' },
    { id: 4, type: 'deadline-soon', priority: 'warning', title: 'Дедлайн изыскания скоро', description: 'ИГИ — Инженерно-геологические', badge: '📅 через 2 дня', link: '14-survey-detail.html?id=2' },
    { id: 5, type: 'deadline-soon', priority: 'warning', title: 'Дедлайн раздела скоро', description: 'АР — Архитектурные решения', badge: '📅 через 5 дней', link: '06-section-detail.html?id=2' },
    { id: 6, type: 'missing-documents', priority: 'info', title: 'Не загружены документы', description: '5 выплат без закрывающих документов', badge: '📋 Требуют внимания', link: '04-5-project-finances.html?id=1' },
  ],

  // Справочники
  dictionaries: {
    sectionTypes: [
      { id: 1, code: 'АР', name: 'Архитектурные решения', color: '#3b82f6', active: true },
      { id: 2, code: 'ГП', name: 'Генеральный план', color: '#10b981', active: true },
      { id: 3, code: 'КР', name: 'Конструктивные решения', color: '#f59e0b', active: true },
      { id: 4, code: 'ОВ', name: 'Отопление и вентиляция', color: '#8b5cf6', active: true },
      { id: 5, code: 'ВК', name: 'Водоснабжение и канализация', color: '#06b6d4', active: true },
      { id: 6, code: 'ЭОМ', name: 'Электроснабжение', color: '#eab308', active: true },
      { id: 7, code: 'ГС', name: 'Газоснабжение', color: '#f97316', active: true },
      { id: 8, code: 'ТХ', name: 'Технологические решения', color: '#ec4899', active: false },
      { id: 9, code: 'ПОС', name: 'Проект организации строительства', color: '#14b8a6', active: true },
      { id: 10, code: 'ПОД', name: 'Проект организации демонтажа', color: '#6366f1', active: true },
    ],
    surveyTypes: [
      { id: 1, code: 'ИГД', name: 'Инженерно-геодезические изыскания', color: '#22c55e', active: true },
      { id: 2, code: 'ИГИ', name: 'Инженерно-геологические изыскания', color: '#8b5cf6', active: true },
      { id: 3, code: 'ИЭИ', name: 'Инженерно-экологические изыскания', color: '#06b6d4', active: true },
      { id: 4, code: 'ИАДИ', name: 'Инженерно-археологические изыскания', color: '#f59e0b', active: true },
    ],
    expenseCategories: [
      { id: 1, code: 'travel', name: 'Командировки', description: 'Расходы на командировки исполнителей', active: true },
      { id: 2, code: 'materials', name: 'Материалы', description: 'Расходные материалы и канцелярия', active: true },
      { id: 3, code: 'contractors', name: 'Подрядчики', description: 'Оплата услуг сторонних организаций', active: true },
      { id: 4, code: 'transport', name: 'Транспорт', description: 'Транспортные расходы и ГСМ', active: true },
      { id: 5, code: 'communication', name: 'Связь', description: 'Интернет, телефония, почтовые услуги', active: true },
      { id: 6, code: 'other', name: 'Прочее', description: 'Другие расходы, не вошедшие в категории', active: true },
    ],
    contractorTypes: [
      { id: 1, code: 'ooo', name: 'ООО — Организация', shortName: 'ООО', description: 'Юридическое лицо — организация. Полный комплект документов для бухгалтерии.', requiredDocuments: ['contract', 'act', 'invoice', 'upd', 'payment_order'], optionalDocuments: [], active: true },
      { id: 2, code: 'ip', name: 'ИП — Индивидуальный предприниматель', shortName: 'ИП', description: 'Индивидуальный предприниматель. Упрощённый комплект документов по сравнению с ООО.', requiredDocuments: ['contract', 'act', 'invoice', 'payment_order'], optionalDocuments: ['invoice_vat'], active: true },
      { id: 3, code: 'self_employed', name: 'Самозанятый — Налогоплательщик НПД', shortName: 'СЗ', description: 'Физическое лицо, применяющее специальный налоговый режим НПД.', requiredDocuments: ['my_tax_check'], optionalDocuments: ['contract', 'act'], active: true },
      { id: 4, code: 'individual', name: 'Физлицо — Договор ГПХ', shortName: 'ГПХ', description: 'Физическое лицо по договору гражданско-правового характера.', requiredDocuments: ['contract', 'act'], optionalDocuments: [], active: true },
      { id: 5, code: 'employee', name: 'Сотрудник — Штатный работник', shortName: 'ШТ', description: 'Штатный сотрудник организации. Выплата через зарплату/аванс.', requiredDocuments: [], optionalDocuments: [], active: true },
    ],
    projectStatuses: [
      { code: 'not-started', name: 'Не начат' },
      { code: 'in-progress', name: 'В работе' },
      { code: 'review', name: 'На согласовании' },
      { code: 'completed', name: 'Завершён' },
    ],
    projectTypes: [
      { code: 'new-construction', name: 'Новое строительство' },
      { code: 'reconstruction', name: 'Реконструкция' },
      { code: 'renovation', name: 'Капитальный ремонт' },
      { code: 'modernization', name: 'Техническое перевооружение' },
    ],
    departments: [
      { code: 'management', name: 'Руководство' },
      { code: 'architecture', name: 'Архитектурный' },
      { code: 'structural', name: 'Конструктивный' },
      { code: 'engineering', name: 'Инженерный (ОВ, ВК, ЭОМ)' },
      { code: 'estimating', name: 'Сметный' },
      { code: 'accounting', name: 'Бухгалтерия' },
    ],
    roles: [
      { code: 'director', name: 'Директор' },
      { code: 'gip', name: 'ГИП' },
      { code: 'engineer', name: 'Инженер' },
      { code: 'architect', name: 'Архитектор' },
      { code: 'constructor', name: 'Конструктор' },
      { code: 'accountant', name: 'Бухгалтер' },
    ],
    positions: [
      { code: 'director', name: 'Директор' },
      { code: 'gip', name: 'ГИП' },
      { code: 'architect', name: 'Архитектор' },
      { code: 'engineer-gp', name: 'Инженер ГП' },
      { code: 'engineer-ov', name: 'Инженер ОВ' },
      { code: 'engineer-vk', name: 'Инженер ВК' },
      { code: 'engineer-eom', name: 'Инженер ЭОМ' },
      { code: 'constructor', name: 'Конструктор' },
      { code: 'accountant', name: 'Бухгалтер' },
    ],
    priorities: [
      { value: 'critical', label: 'Критичный' },
      { value: 'high', label: 'Высокий' },
      { value: 'medium', label: 'Средний' },
      { value: 'low', label: 'Низкий' },
    ],
  },
};

/**
 * Получить моковые данные по endpoint
 */
MOCK_DATA.getMockResponse = function(endpoint) {
  // Dashboard
  if (endpoint === '/dashboard/stats') return this.dashboardStats;
  if (endpoint === '/dashboard/attention') return this.attentionItems;
  if (endpoint === '/dashboard/recent-projects') return this.projects.slice(0, 3);
  if (endpoint === '/dashboard/my-tasks') return this.tasks.filter(t => t.status !== 'completed');

  // Projects
  if (endpoint === '/projects') return { items: this.projects, total: this.projects.length };
  if (endpoint.match(/^\/projects\/\d+$/)) {
    const id = parseInt(endpoint.split('/')[2]);
    return this.projects.find(p => p.id === id) || null;
  }
  
  // Project team
  if (endpoint.match(/^\/projects\/\d+\/team$/)) {
    const id = parseInt(endpoint.split('/')[2]);
    const project = this.projects.find(p => p.id === id);
    return project?.team || [];
  }

  // Tasks
  if (endpoint === '/tasks') return { items: this.tasks, total: this.tasks.length };

  // Employees
  if (endpoint === '/employees') return { items: this.employees, total: this.employees.length };
  if (endpoint.match(/^\/employees\/\d+$/)) {
    const id = parseInt(endpoint.split('/')[2]);
    return this.employees.find(e => e.id === id) || null;
  }
  if (endpoint === '/employees/payments/summary') {
    return {
      paid: 2560000,
      inProgress: 730000,
      awaitingDocs: 280000,
      overdue: 0,
      employeesCount: 6,
      pendingCount: 4,
      awaitingDocsCount: 2,
      overdueCount: 0
    };
  }

  // Notifications
  if (endpoint === '/notifications') return { items: this.notifications, total: this.notifications.length };
  if (endpoint === '/notifications/unread-count') return { count: this.notifications.filter(n => !n.read).length };

  // Dictionaries
  if (endpoint === '/dictionaries/section-types') return this.dictionaries.sectionTypes;
  if (endpoint === '/dictionaries/survey-types') return this.dictionaries.surveyTypes;
  if (endpoint === '/dictionaries/expense-categories') return this.dictionaries.expenseCategories;
  if (endpoint === '/dictionaries/contractor-types') return this.dictionaries.contractorTypes;
  if (endpoint === '/dictionaries/project-statuses') return this.dictionaries.projectStatuses;
  if (endpoint === '/dictionaries/project-types') return this.dictionaries.projectTypes;
  if (endpoint === '/dictionaries/task-priorities') return this.dictionaries.priorities;
  if (endpoint === '/dictionaries/departments') return this.dictionaries.departments;
  if (endpoint === '/dictionaries/roles') return this.dictionaries.roles;
  if (endpoint === '/dictionaries/positions') return this.dictionaries.positions;

  // Auth
  if (endpoint === '/user/profile') return this.currentUser;

  // Sections
  if (endpoint.match(/^\/sections\/\d+$/)) {
    const id = parseInt(endpoint.split('/')[2]);
    // Находим раздел в проектах
    for (const project of this.projects) {
      const section = project.sections?.find(s => s.id === id);
      if (section) {
        return {
          ...section,
          projectId: project.id,
          projectName: project.name,
          files: project.files || [],
          status: section.status,
        };
      }
    }
    return null;
  }
  
  // Section discussion
  if (endpoint.match(/^\/sections\/\d+\/discussion$/)) {
    return {
      messages: [
        { id: 1, text: 'Необходимо согласовать отступы от границ участка', createdAt: '2025-03-15T10:00:00Z', author: { id: 1, name: 'Иванов П.С.', role: 'ГИП' }, files: [], replies: [], replyCount: 0 },
        { id: 2, text: 'Чертежи обновлены, загрузил новую версию', createdAt: '2025-03-16T14:30:00Z', author: { id: 2, name: 'Петров А.И.', role: 'Инженер' }, files: [{ name: 'АР_План_v2.dwg', size: 5000000 }], replies: [], replyCount: 1 },
      ],
      stats: { messages: 5, participants: 3, files: 2 },
    };
  }
  
  // Section history
  if (endpoint.match(/^\/sections\/\d+\/history$/)) {
    return {
      events: [
        { id: 1, type: 'file_upload', createdAt: new Date().toISOString(), author: { name: 'Петров А.И.' }, data: { fileName: 'АР_План_v2.dwg', fileSize: '5.0 МБ' } },
        { id: 2, type: 'status_change', createdAt: new Date(Date.now() - 86400000).toISOString(), author: { name: 'Иванов П.С.' }, data: { oldStatus: 'Не начат', newStatus: 'В работе' } },
        { id: 3, type: 'file_approve', createdAt: new Date(Date.now() - 172800000).toISOString(), author: { name: 'Иванов П.С.' }, data: { fileName: 'АР_Фасады.pdf' } },
      ],
      stats: { total: 10, files: 4, status: 2, participants: 1 },
    };
  }
  
  // Section files
  if (endpoint.match(/^\/sections\/\d+\/files$/)) {
    return {
      files: [
        { id: 1, name: 'АР_План_этажа.pdf', type: 'pdf', size: 2500000, uploadedBy: 'Иванов П.С.', uploadedAt: '2025-03-10', status: 'approved' },
        { id: 2, name: 'АР_Фасады.dwg', type: 'dwg', size: 8000000, uploadedBy: 'Петров А.И.', uploadedAt: '2025-03-12', status: 'pending' },
        { id: 3, name: 'АР_Разрезы.pdf', type: 'pdf', size: 1800000, uploadedBy: 'Сидоров К.М.', uploadedAt: '2025-03-14', status: 'approved' },
      ],
    };
  }
  
  // Section expertise
  if (endpoint.match(/^\/sections\/\d+\/expertise$/)) {
    return {
      items: [
        { id: 1, number: '127', text: 'Не указаны отметки высот на разрезе', status: 'in-progress', priority: 'high', assignee: { name: 'Петров А.И.' }, deadline: '2025-03-20', repliesCount: 2 },
        { id: 2, number: '128', text: 'Необходимо добавить узел примыкания кровли', status: 'created', priority: 'medium', assignee: { name: 'Сидоров К.М.' }, deadline: '2025-03-25', repliesCount: 0 },
      ],
      stats: { total: 2, created: 1, inProgress: 1, review: 0, closed: 0 },
    };
  }
  
  // Surveys
  if (endpoint.match(/^\/surveys\/\d+$/)) {
    const id = parseInt(endpoint.split('/')[2]);
    for (const project of this.projects) {
      const survey = project.surveys?.find(s => s.id === id);
      if (survey) {
        return {
          ...survey,
          projectId: project.id,
          projectName: project.name,
          contractor: { name: 'Изыскатель ООО "ГеоПроект"', type: 'ooo', inn: '7712345678', contact: '+7 (495) 111-22-33' },
          contract: { id: 1, code: 'ИГД-2025-001', date: '2025-01-10', budget: 500000, paid: 250000 },
          files: [],
          observers: [],
          comments: [],
        };
      }
    }
    return null;
  }
  
  // Survey finances
  if (endpoint.match(/^\/surveys\/\d+\/finances$/)) {
    return {
      payments: [
        { id: 1, name: 'Аванс 50%', date: '2025-02-15', amount: 250000, status: 'paid', employeeName: 'Изыскатель ООО "ГеоПроект"', contractorType: 'ooo' },
      ],
      totalPayments: 1,
      paid: 250000,
      pending: 0,
    };
  }
  
  // Survey expertise
  if (endpoint.match(/^\/surveys\/\d+\/expertise$/)) {
    return { items: [], stats: { total: 0 } };
  }
  
  // Expertise
  if (endpoint === '/expertise') {
    return {
      items: [
        { id: 1, number: '127', text: 'Не указаны отметки высот', status: 'in-progress', priority: 'high', sectionCode: 'АР', assignee: { name: 'Петров А.И.' }, deadline: '2025-03-20' },
      ],
      total: 1,
    };
  }
  
  if (endpoint.match(/^\/expertise\/\d+$/)) {
    return {
      id: 1,
      number: '127',
      text: 'Не указаны отметки высот на разрезе здания. Требуется уточнить абсолютные отметки пола первого этажа и планировочные отметки территории.',
      status: 'in-progress',
      priority: 'high',
      sectionCode: 'АР',
      assignee: { id: 2, name: 'Петров А.И.' },
      deadline: '2025-03-20',
      file: { name: 'Замечание_127.pdf', size: 150000, url: '#' },
    };
  }
  
  // Contracts
  if (endpoint === '/contracts') {
    return {
      items: [
        { id: 1, code: 'ИГД-2025-001', date: '2025-01-10', amount: 500000, status: 'active', contractor: { name: 'Изыскатель ООО "ГеоПроект"' } },
      ],
      total: 1,
    };
  }
  
  if (endpoint.match(/^\/contracts\/\d+$/)) {
    return {
      id: 1,
      code: 'ИГД-2025-001',
      date: '2025-01-10',
      amount: 500000,
      status: 'active',
      type: 'survey',
      contractor: { id: 1, name: 'Изыскатель ООО "ГеоПроект"', inn: '7712345678' },
      sections: [],
      surveys: [{ id: 1, code: 'ИГД', name: 'Инженерно-геодезические', status: 'done', color: '#22c55e' }],
      payments: [
        { id: 1, name: 'Аванс 50%', date: '2025-02-15', amount: 250000, status: 'paid' },
      ],
      documents: [
        { id: 1, name: 'Договор ИГД-2025-001.pdf', type: 'contract', uploadedAt: '2025-01-10', url: '#' },
      ],
    };
  }
  
  // Payments
  if (endpoint === '/payments') {
    return {
      items: [
        { id: 1, number: 'ПЛ-2025-001', date: '2025-02-15', amount: 250000, status: 'paid', employeeName: 'Изыскатель ООО "ГеоПроект"', contractorType: 'ooo' },
      ],
      total: 1,
    };
  }
  
  if (endpoint.match(/^\/payments\/\d+$/)) {
    return {
      id: 1,
      number: 'ПЛ-2025-001',
      date: '2025-02-15',
      amount: 250000,
      status: 'paid',
      employeeName: 'Изыскатель ООО "ГеоПроект"',
      contractorType: 'ooo',
      documentsTotal: 4,
      documentsUploaded: 4,
      documents: [
        { type: 'договор', name: 'Договор.pdf', uploadedAt: '2025-01-10', url: '#' },
        { type: 'акт', name: 'Акт.pdf', uploadedAt: '2025-02-15', url: '#' },
        { type: 'счёт', name: 'Счёт.pdf', uploadedAt: '2025-02-14', url: '#' },
        { type: 'платёжное поручение', name: 'ПП.pdf', uploadedAt: '2025-02-15', url: '#' },
      ],
      history: [
        { description: 'Выплата создана', createdAt: '2025-02-10T10:00:00Z' },
        { description: 'Документы загружены', createdAt: '2025-02-14T15:00:00Z' },
        { description: 'Выплата утверждена', createdAt: '2025-02-15T09:00:00Z' },
      ],
    };
  }
  
  // Contractors
  if (endpoint === '/contractors') {
    return [
      { id: 1, name: 'Изыскатель ООО "ГеоПроект"', type: 'ooo', inn: '7712345678' },
      { id: 2, name: 'ИП Сидоров А.В.', type: 'ip', inn: '772345678901' },
    ];
  }
  
  // Expertise stats
  if (endpoint === '/expertise/stats/summary') {
    return { total: 15, created: 3, inProgress: 5, review: 2, closed: 5 };
  }
  
  if (endpoint === '/expertise/stats/by-employee') {
    return [
      { name: 'Петров А.И.', total: 5, inProgress: 2, closed: 3 },
      { name: 'Сидоров К.М.', total: 4, inProgress: 2, closed: 2 },
      { name: 'Козлов Д.В.', total: 3, inProgress: 1, closed: 2 },
    ];
  }
  
  if (endpoint === '/expertise/stats/by-section') {
    return [
      { code: 'АР', name: 'Архитектурные решения', color: '#3b82f6', total: 5, closed: 3 },
      { code: 'КР', name: 'Конструктивные решения', color: '#f59e0b', total: 4, closed: 2 },
    ];
  }
  
  if (endpoint === '/expertise/stats/top-speed') {
    return [
      { name: 'Козлов Д.В.', avgDays: 1.5 },
      { name: 'Петров А.И.', avgDays: 2.3 },
    ];
  }

  // Default
  console.warn(`Mock data not found for: ${endpoint}`);
  return null;
};

/**
 * Обработка POST запросов (для авторизации)
 */
MOCK_DATA.handlePost = function(endpoint, data) {
  // Login
  if (endpoint === '/auth/login') {
    const { email, password } = data;
    // Проверяем email (пароль любой от 4 символов)
    const user = this.employees.find(e => e.email === email);
    if (user) {
      return {
        success: true,
        token: 'demo-token-' + user.id,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      };
    }
    // Если пользователь не найден, возвращаем директора по умолчанию
    console.log('Пользователь не найден:', email, '- используется директор по умолчанию');
    return {
      success: true,
      token: 'demo-token-1',
      user: this.currentUser
    };
  }

  // Logout
  if (endpoint === '/auth/logout') {
    return { success: true };
  }

  // Create project
  if (endpoint === '/projects') {
    const newProject = {
      id: this.projects.length + 1,
      code: data.code || `2025-${String(this.projects.length + 1).padStart(3, '0')}`,
      name: data.name,
      address: data.address || '',
      type: data.type || 'new-construction',
      status: data.status || 'not-started',
      customer: data.customer || '',
      startDate: data.startDate || null,
      deadline: data.deadline || null,
      area: data.area || 0,
      floors: data.floors || 0,
      description: data.description || '',
      progress: 0,
      sections: [],
      surveys: [],
      team: [],
      files: [],
    };
    this.projects.push(newProject);
    return newProject;
  }

  // Create task
  if (endpoint === '/tasks') {
    const newTask = {
      id: this.tasks.length + 1,
      title: data.title,
      project: data.projectName || '',
      priority: data.priority || 'medium',
      status: 'pending',
      deadline: data.deadline || null,
      assignee: data.assigneeName || '',
    };
    this.tasks.push(newTask);
    return newTask;
  }

  // Create employee
  if (endpoint === '/employees') {
    const newEmployee = {
      id: this.employees.length + 1,
      name: data.name,
      email: data.email,
      role: data.role || 'engineer',
      position: data.position || '',
      department: data.department || '',
      phone: data.phone || '',
      active: true,
      contractorType: data.contractorType || 'employee',
      projectsCount: 0,
      payments: { paid: 0, total: 0, progress: 0 },
    };
    this.employees.push(newEmployee);
    return newEmployee;
  }

  console.warn(`Mock POST not found for: ${endpoint}`);
  return { success: false, message: 'Not implemented' };
};

/**
 * Обработка PUT запросов
 */
MOCK_DATA.handlePut = function(endpoint, data) {
  // Mark notification as read
  const readMatch = endpoint.match(/^\/notifications\/(\d+)\/read$/);
  if (readMatch) {
    const id = parseInt(readMatch[1]);
    const notif = this.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      return { success: true };
    }
    return { success: false, message: 'Notification not found' };
  }

  // Mark all notifications as read
  if (endpoint === '/notifications/read-all') {
    this.notifications.forEach(n => n.read = true);
    return { success: true };
  }

  console.warn(`Mock PUT not found for: ${endpoint}`);
  return { success: false, message: 'Not implemented' };
};
