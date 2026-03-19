/**
 * Конфигурация API
 *
 * Для подключения к реальному API измените BASE_URL
 * Для разработки без API используйте DEMO_MODE = true
 */

const CONFIG = {
  // URL API сервера (порт 8000 для FastAPI backend)
  BASE_URL: 'http://localhost:8000/api',

  // Таймаут запросов (мс)
  TIMEOUT: 10000,

  // Демо-режим (возвращает моковые данные)
  // Установите false для работы с реальным бэкендом
  DEMO_MODE: false,

  // Заголовки по умолчанию
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
 * Получить параметры из URL
 */
function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(params);
}

/**
 * Получить конкретный параметр из URL
 */
function getUrlParam(name) {
  return getUrlParams()[name];
}

/**
 * Проверка авторизации (опциональная)
 * В demo-режиме возвращает демо-пользователя
 */
async function checkAuth(required = false) {
  if (CONFIG.DEMO_MODE) {
    return {
      id: 1,
      name: 'Иванов Петр Сергеевич',
      email: 'ivanov@company.ru',
      role: 'director',
    };
  }

  const token = getAuthToken();
  if (!token) {
    if (required) {
      window.location.href = '01-login.html';
    }
    return null;
  }

  try {
    const user = await API.auth.getCurrentUser();
    return user;
  } catch (error) {
    console.error('Auth error:', error);
    removeAuthToken();
    if (required) {
      window.location.href = '01-login.html';
    }
    return null;
  }
}

/**
 * Выход из системы
 */
async function logout() {
  try {
    if (!CONFIG.DEMO_MODE) {
      await API.auth.logout();
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
  removeAuthToken();
  window.location.href = '01-login.html';
}
