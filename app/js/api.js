/**
 * API Methods - методы для работы с API
 *
 * Все методы возвращают Promise с данными
 * В demo-режиме возвращают моковые данные из MOCK_DATA
 */

const API = {
  // ==================== Авторизация ====================
  auth: {
    login: (email, password) => api.post('/auth/login', { email, password }),
    logout: () => api.post('/auth/logout'),
    getCurrentUser: () => api.get('/user/profile'),
  },

  // ==================== Проекты ====================
  projects: {
    getList: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return api.get(`/projects${query ? '?' + query : ''}`);
    },

    getById: (id) => api.get(`/projects/${id}`),

    create: (data) => api.post('/projects', data),

    update: (id, data) => api.put(`/projects/${id}`, data),

    delete: (id) => api.delete(`/projects/${id}`),

    // Вкладки проекта
    getDiscussions: (projectId) => api.get(`/projects/${projectId}/discussions`),
    getExpertise: (projectId) => api.get(`/projects/${projectId}/expertise`),
    getHistory: (projectId) => api.get(`/projects/${projectId}/history`),
    getFinances: (projectId) => api.get(`/projects/${projectId}/finances`),
    getTeam: (projectId) => api.get(`/projects/${projectId}/team`),
  },

  // ==================== Разделы проекта ====================
  sections: {
    getList: (projectId) => api.get(`/sections?project_id=${projectId}`),
    getById: (id) => api.get(`/sections/${id}`),
    update: (id, data) => api.put(`/sections/${id}`, data),

    // Вкладки раздела
    getExpertise: (sectionId) => api.get(`/sections/${sectionId}/expertise`),
    getFiles: (sectionId) => api.get(`/sections/${sectionId}/files`),
    getDiscussion: (sectionId) => api.get(`/sections/${sectionId}/discussion`),
    getHistory: (sectionId) => api.get(`/sections/${sectionId}/history`),
    getFinances: (sectionId) => api.get(`/sections/${sectionId}/finances`),

    // Файлы
    uploadFile: (sectionId, formData) => api.post(`/sections/${sectionId}/files`, formData),
    deleteFile: (sectionId, fileId) => api.delete(`/sections/${sectionId}/files/${fileId}`),
  },

  // ==================== Изыскания ====================
  surveys: {
    getList: (projectId) => api.get(`/surveys?project_id=${projectId}`),
    getById: (id) => api.get(`/surveys/${id}`),
    create: (data) => api.post('/surveys', data),
    update: (id, data) => api.put(`/surveys/${id}`, data),

    // Вкладки
    getFinances: (surveyId) => api.get(`/surveys/${surveyId}/finances`),
    getExpertise: (surveyId) => api.get(`/surveys/${surveyId}/expertise`),
  },

  // ==================== Задачи ====================
  tasks: {
    getList: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return api.get(`/tasks${query ? '?' + query : ''}`);
    },

    getById: (id) => api.get(`/tasks/${id}`),
    create: (data) => api.post('/tasks', data),
    update: (id, data) => api.put(`/tasks/${id}`, data),
    delete: (id) => api.delete(`/tasks/${id}`),

    // Подзадачи
    addSubtask: (taskId, data) => api.post(`/tasks/${taskId}/subtasks`, data),
    toggleSubtask: (taskId, subtaskId) => api.patch(`/tasks/${taskId}/subtasks/${subtaskId}/toggle`),
  },

  // ==================== Исполнители ====================
  employees: {
    getList: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return api.get(`/employees${query ? '?' + query : ''}`);
    },

    getById: (id) => api.get(`/employees/${id}`),
    create: (data) => api.post('/employees', data),
    update: (id, data) => api.put(`/employees/${id}`, data),
    delete: (id) => api.delete(`/employees/${id}`),

    // Финансы сотрудника
    getPayments: (employeeId, year) => api.get(`/employees/${employeeId}/payments?year=${year}`),
    getProjects: (employeeId) => api.get(`/employees/${employeeId}/projects`),
  },

  // ==================== Уведомления ====================
  notifications: {
    getList: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return api.get(`/notifications${query ? '?' + query : ''}`);
    },

    markAsRead: (id) => api.put(`/notifications/${id}/read`),
    markAllAsRead: () => api.put('/notifications/read-all'),
    getUnreadCount: () => api.get('/notifications/unread-count'),
  },

  // ==================== Дашборд ====================
  dashboard: {
    getStats: () => api.get('/dashboard/stats'),
    getAttention: () => api.get('/dashboard/attention'),
    getRecentProjects: () => api.get('/dashboard/recent-projects'),
    getMyTasks: () => api.get('/dashboard/my-tasks'),
  },

  // ==================== Финансы ====================
  finances: {
    getContracts: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return api.get(`/contracts${query ? '?' + query : ''}`);
    },

    getContractById: (id) => api.get(`/contracts/${id}`),

    getPayments: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return api.get(`/payments${query ? '?' + query : ''}`);
    },

    getPaymentById: (id) => api.get(`/payments/${id}`),
    createPayment: (data) => api.post('/payments', data),
    updatePayment: (id, data) => api.put(`/payments/${id}`, data),
  },

  // ==================== Экспертиза ====================
  expertise: {
    getList: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return api.get(`/expertise${query ? '?' + query : ''}`);
    },

    getById: (id) => api.get(`/expertise/${id}`),
    create: (data) => api.post('/expertise', data),
    update: (id, data) => api.put(`/expertise/${id}`, data),
    reply: (id, text) => api.post(`/expertise/${id}/replies`, { text }),
    resolve: (id) => api.put(`/expertise/${id}/resolve`),
  },

  // ==================== Справочники ====================
  dictionaries: {
    getSections: () => api.get('/dictionaries/section-types'),
    getSurveys: () => api.get('/dictionaries/survey-types'),
    getExpenseCategories: () => api.get('/dictionaries/expense-categories'),
    getContractorTypes: () => api.get('/dictionaries/contractor-types'),
    getProjectStatuses: () => api.get('/dictionaries/project-statuses'),
    getProjectTypes: () => api.get('/dictionaries/project-types'),
    getTaskPriorities: () => api.get('/dictionaries/task-priorities'),
    getDepartments: () => api.get('/dictionaries/departments'),
    getRoles: () => api.get('/dictionaries/roles'),
    getPositions: () => api.get('/dictionaries/positions'),
  },

  // ==================== Поиск ====================
  search: {
    global: (query) => api.get(`/search?q=${encodeURIComponent(query)}`),
  },
};
