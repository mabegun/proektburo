/**
 * Конфигурация API для интеграции
 */

const CONFIG = {
  // Базовый URL API
  BASE_URL: 'http://localhost:3000/api',
  
  // Таймаут запросов (мс)
  TIMEOUT: 30000,
  
  // Включить логирование запросов
  DEBUG: true,
  
  // Ключ для хранения токена в localStorage
  TOKEN_KEY: 'authToken',
  
  // Время жизни кэша (мс) - 5 минут
  CACHE_TTL: 5 * 60 * 1000,
  
  // Количество повторных попыток при ошибке
  RETRY_COUNT: 3,
  
  // Задержка между повторными попытками (мс)
  RETRY_DELAY: 1000,
};

// Экспорт
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
