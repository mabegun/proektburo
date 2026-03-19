/**
 * API Client — клиент для запросов к API
 */

const APIClient = {
  _cache: new Map(),
  
  /**
   * GET запрос
   */
  async get(endpoint, params = {}) {
    const url = new URL(`${CONFIG.BASE_URL}${endpoint}`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    
    // Проверка кэша
    const cacheKey = url.toString();
    const cached = this._cache.get(cacheKey);
    if (cached && Date.now() - cached.time < CONFIG.CACHE_TTL) {
      if (CONFIG.DEBUG) console.log('[API] Cache hit:', cacheKey);
      return cached.data;
    }
    
    return this._request(url.toString(), { method: 'GET' }, cacheKey);
  },
  
  /**
   * POST запрос
   */
  async post(endpoint, data = {}) {
    const url = `${CONFIG.BASE_URL}${endpoint}`;
    return this._request(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * PUT запрос
   */
  async put(endpoint, data = {}) {
    const url = `${CONFIG.BASE_URL}${endpoint}`;
    return this._request(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * DELETE запрос
   */
  async delete(endpoint) {
    const url = `${CONFIG.BASE_URL}${endpoint}`;
    return this._request(url, { method: 'DELETE' });
  },
  
  /**
   * Загрузка файла
   */
  async upload(endpoint, formData) {
    const url = `${CONFIG.BASE_URL}${endpoint}`;
    return this._request(url, {
      method: 'POST',
      body: formData,
      // Не устанавливаем Content-Type, браузер сам установит с boundary
    });
  },
  
  /**
   * Базовый метод запроса
   */
  async _request(url, options, cacheKey = null) {
    const token = localStorage.getItem(CONFIG.TOKEN_KEY);
    
    const headers = {
      ...options.headers,
    };
    
    // Добавляем Content-Type для JSON запросов
    if (options.body && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    
    // Добавляем токен авторизации
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (CONFIG.DEBUG) {
      console.log('[API] Request:', options.method || 'GET', url);
    }
    
    let lastError;
    for (let attempt = 0; attempt < CONFIG.RETRY_COUNT; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);
        
        const response = await fetch(url, {
          ...options,
          headers,
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const error = await this._parseError(response);
          throw error;
        }
        
        const data = await response.json();
        
        if (CONFIG.DEBUG) {
          console.log('[API] Response:', url, data);
        }
        
        // Сохраняем в кэш
        if (cacheKey) {
          this._cache.set(cacheKey, { data, time: Date.now() });
        }
        
        return data;
        
      } catch (error) {
        lastError = error;
        
        // Не повторяем для ошибок авторизации и валидации
        if (error.status === 401 || error.status === 400 || error.status === 403) {
          throw error;
        }
        
        if (CONFIG.DEBUG) {
          console.warn(`[API] Attempt ${attempt + 1} failed:`, error.message);
        }
        
        if (attempt < CONFIG.RETRY_COUNT - 1) {
          await this._sleep(CONFIG.RETRY_DELAY * (attempt + 1));
        }
      }
    }
    
    throw lastError;
  },
  
  /**
   * Парсинг ошибки
   */
  async _parseError(response) {
    let message = `HTTP ${response.status}`;
    let errors = [];
    
    try {
      const data = await response.json();
      message = data.message || message;
      errors = data.errors || [];
    } catch (e) {
      // Не удалось распарсить JSON
    }
    
    const error = new Error(message);
    error.status = response.status;
    error.errors = errors;
    
    return error;
  },
  
  /**
   * Задержка
   */
  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  
  /**
   * Очистка кэша
   */
  clearCache() {
    this._cache.clear();
  },
  
  /**
   * Инвалидация кэша по паттерну
   */
  invalidateCache(pattern) {
    for (const key of this._cache.keys()) {
      if (key.includes(pattern)) {
        this._cache.delete(key);
      }
    }
  },
};

// Удобные методы для конкретных endpoints
const API = {
  // Авторизация
  auth: {
    login: (email, password) => APIClient.post('/auth/login', { email, password }),
    logout: () => {
      localStorage.removeItem(CONFIG.TOKEN_KEY);
      APIClient.clearCache();
    },
    getCurrentUser: () => APIClient.get('/user/profile'),
  },
  
  // Дашборд
  dashboard: {
    getStats: () => APIClient.get('/dashboard/stats'),
    getAttention: () => APIClient.get('/dashboard/attention'),
  },
  
  // Проекты
  projects: {
    getList: (params) => APIClient.get('/projects', params),
    getById: (id) => APIClient.get(`/projects/${id}`),
    create: (data) => APIClient.post('/projects', data),
    update: (id, data) => APIClient.put(`/projects/${id}`, data),
    getDiscussion: (id) => APIClient.get(`/projects/${id}/discussion`),
    getExpertise: (id) => APIClient.get(`/projects/${id}/expertise`),
    getHistory: (id) => APIClient.get(`/projects/${id}/history`),
    getFinances: (id) => APIClient.get(`/projects/${id}/finances`),
  },
  
  // Разделы
  sections: {
    getById: (id) => APIClient.get(`/sections/${id}`),
    getFiles: (id) => APIClient.get(`/sections/${id}/files`),
    getDiscussion: (id) => APIClient.get(`/sections/${id}/discussion`),
    getFinances: (id) => APIClient.get(`/sections/${id}/finances`),
    getExpertise: (id) => APIClient.get(`/sections/${id}/expertise`),
    getHistory: (id) => APIClient.get(`/sections/${id}/history`),
    addComment: (id, text) => APIClient.post(`/sections/${id}/comments`, { text }),
  },
  
  // Изыскания
  surveys: {
    getList: (params) => APIClient.get('/surveys', params),
    getById: (id) => APIClient.get(`/surveys/${id}`),
    create: (data) => APIClient.post('/surveys', data),
    getFinances: (id) => APIClient.get(`/surveys/${id}/finances`),
    getExpertise: (id) => APIClient.get(`/surveys/${id}/expertise`),
  },
  
  // Задачи
  tasks: {
    getList: (params) => APIClient.get('/tasks', params),
    getById: (id) => APIClient.get(`/tasks/${id}`),
    create: (data) => APIClient.post('/tasks', data),
    update: (id, data) => APIClient.put(`/tasks/${id}`, data),
  },
  
  // Сотрудники
  employees: {
    getList: (params) => APIClient.get('/employees', params),
    getById: (id) => APIClient.get(`/employees/${id}`),
    create: (data) => APIClient.post('/employees', data),
    update: (id, data) => APIClient.put(`/employees/${id}`, data),
  },
  
  // Уведомления
  notifications: {
    getList: (params) => APIClient.get('/notifications', params),
    getUnreadCount: () => APIClient.get('/notifications/unread-count'),
    markAsRead: (id) => APIClient.put(`/notifications/${id}/read`),
    markAllAsRead: () => APIClient.put('/notifications/read-all'),
  },
  
  // Экспертиза
  expertise: {
    getList: (params) => APIClient.get('/expertise', params),
    getById: (id) => APIClient.get(`/expertise/${id}`),
    create: (data) => APIClient.post('/expertise', data),
    update: (id, data) => APIClient.put(`/expertise/${id}`, data),
    addReply: (id, text) => APIClient.post(`/expertise/${id}/replies`, { text }),
    getStats: () => APIClient.get('/expertise/stats'),
  },
  
  // Справочники
  dictionaries: {
    getSections: () => APIClient.get('/dictionaries/sections'),
    getSurveys: () => APIClient.get('/dictionaries/surveys'),
    getExpenses: () => APIClient.get('/dictionaries/expenses'),
    getContractorTypes: () => APIClient.get('/dictionaries/contractor-types'),
  },
  
  // Поиск
  search: {
    global: (query, types, limit = 8) => APIClient.get('/search', { q: query, types, limit }),
  },
  
  // Файлы
  files: {
    upload: (file, entityType, entityId) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('entityType', entityType);
      formData.append('entityId', entityId);
      return APIClient.upload('/files/upload', formData);
    },
    delete: (id) => APIClient.delete(`/files/${id}`),
  },
  
  // Календарь
  calendar: {
    getEvents: (params) => APIClient.get('/calendar/events', params),
    getDeadlines: (params) => APIClient.get('/calendar/deadlines', params),
  },
  
  // Отчёты
  reports: {
    getProjects: () => APIClient.get('/reports/projects'),
    getEmployees: () => APIClient.get('/reports/employees'),
  },
};

// Экспорт
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { APIClient, API };
}
