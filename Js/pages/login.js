/**
 * Скрипт для страницы входа (01-login.html)
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorEl = document.getElementById('error');
  const submitBtn = document.getElementById('submit-btn');
  
  // Проверка: если уже авторизован
  if (getAuthToken()) {
    window.location.href = '02-dashboard.html';
    return;
  }
  
  // Обработка формы
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Валидация
    if (!email || !password) {
      showError('Введите email и пароль');
      return;
    }
    
    if (password.length < 4) {
      showError('Пароль должен быть не менее 4 символов');
      return;
    }
    
    try {
      // Блокируем кнопку
      setLoading(true);
      hideError();
      
      // Вызов API
      const response = await API.auth.login(email, password);
      
      // Сохраняем токен
      if (response.token) {
        setAuthToken(response.token);
      } else if (response.accessToken) {
        setAuthToken(response.accessToken);
      }
      
      // Показываем успех и перенаправляем
      UI.toast('Вход выполнен успешно', 'success');
      
      // Редирект на дашборд или туда, откуда пришли
      setTimeout(() => {
        window.location.href = '02-dashboard.html';
      }, 500);
      
    } catch (error) {
      console.error('Ошибка входа:', error);
      showError(error.message || 'Неверный email или пароль');
    } finally {
      setLoading(false);
    }
  });
  
  // Обработка Enter в поле пароля
  passwordInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      form?.requestSubmit();
    }
  });
  
  function showError(message) {
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.remove('hidden');
    } else {
      UI.toast(message, 'error');
    }
  }
  
  function hideError() {
    if (errorEl) {
      errorEl.classList.add('hidden');
    }
  }
  
  function setLoading(loading) {
    if (submitBtn) {
      submitBtn.disabled = loading;
      submitBtn.innerHTML = loading 
        ? '<span class="animate-spin">⏳</span> Вход...' 
        : 'Войти';
    }
  }
});
