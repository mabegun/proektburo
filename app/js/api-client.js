/**
 * API Client - HTTP клиент для запросов к API
 *
 * Поддерживает:
 * - Demo-режим с моковыми данными
 * - Автоматическую авторизацию
 * - Обработку ошибок
 * - Кэширование GET запросов
 */

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.cache = new Map();
  }

  /**
   * Базовый метод для запросов
   */
  async request(endpoint, options = {}) {
    // Demo-режим - возвращаем моковые данные
    if (CONFIG.DEMO_MODE) {
      return this.getMockData(endpoint, options.method || 'GET');
    }

    const url = `${this.baseURL}${endpoint}`;
    const token = getAuthToken();

    const config = {
      ...options,
      headers: {
        ...CONFIG.HEADERS,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    // Для multipart/form-data удаляем Content-Type (браузер установит автоматически)
    if (options.body instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          removeAuthToken();
          window.location.href = '01-login.html';
          throw new Error('Unauthorized');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Превышен таймаут запроса');
      }
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  /**
   * GET запрос с кэшированием
   */
  async get(endpoint, useCache = true) {
    if (useCache && this.cache.has(endpoint)) {
      return this.cache.get(endpoint);
    }

    const result = await this.request(endpoint, { method: 'GET' });

    if (useCache) {
      this.cache.set(endpoint, result);
    }

    return result;
  }

  /**
   * POST запрос
   */
  async post(endpoint, data) {
    this.cache.clear(); // Сброс кэша при изменении данных
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT запрос
   */
  async put(endpoint, data) {
    this.cache.clear();
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * PATCH запрос
   */
  async patch(endpoint, data) {
    this.cache.clear();
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE запрос
   */
  async delete(endpoint) {
    this.cache.clear();
    return this.request(endpoint, { method: 'DELETE' });
  }

  /**
   * Очистка кэша
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Моковые данные для demo-режима
   */
  getMockData(endpoint, method) {
    console.log(`[Demo API] ${method} ${endpoint}`);

    // Имитация задержки сети
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_DATA.getMockResponse(endpoint));
      }, 100);
    });
  }
}

// Создаём экземпляр
const api = new ApiClient(CONFIG.BASE_URL);
