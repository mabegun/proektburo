/**
 * Конфигурация API
 * Замените BASE_URL на адрес вашего API
 */
const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api', // или https://your-api.com/api
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

/**
 * Получить токен из localStorage
 */
function getAuthToken() {
  return localStorage.getItem('authToken');
}

/**
 * Сохранить токен в localStorage
 */
function setAuthToken(token) {
  localStorage.setItem('authToken', token);
}

/**
 * Удалить токен (при выходе)
 */
function removeAuthToken() {
  localStorage.removeItem('authToken');
}

/**
 * Получить текущие параметры из URL (query params)
 */
function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(params);
}

/**
 * Получить конкретный параметр из URL
 */
function getUrlParam(name) {
  const params = getUrlParams();
  return params[name];
}
