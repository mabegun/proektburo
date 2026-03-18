/**
 * Страница обсуждения раздела
 * Файл: Js/pages/section-discussion.js
 * 
 * Логика работы:
 * 1. Загрузка списка сообщений из API
 * 2. Создание новых сообщений (основные и ответы)
 * 3. Прикрепление файлов к сообщениям
 * 4. Отображение дерева ответов
 */

// ============================================================================
// API ФУНКЦИИ
// ============================================================================

/**
 * Загрузка обсуждения раздела
 * 
 * API Endpoint: GET /api/sections/:id/discussion
 * 
 * Query параметры:
 * - page: номер страницы (по умолчанию 1)
 * - limit: количество сообщений на странице (по умолчанию 50)
 * 
 * Ответ:
 * {
 *   success: true,
 *   data: {
 *     messages: [
 *       {
 *         id: "msg_001",
 *         text: "Текст сообщения",
 *         createdAt: "2025-03-18T14:32:00Z",
 *         author: {
 *           id: "usr_001",
 *           name: "Иванов П.С.",
 *           role: "ГИП",
 *           avatar: "И",
 *           avatarColor: "from-slate-700 to-slate-500"
 *         },
 *         files: [
 *           {
 *             id: "file_001",
 *             name: "АР_План_этажа.pdf",
 *             size: 1843200,
 *             mimeType: "application/pdf",
 *             url: "/uploads/..."
 *           }
 *         ],
 *         replies: [
 *           {
 *             id: "msg_002",
 *             text: "Текст ответа",
 *             createdAt: "2025-03-18T15:10:00Z",
 *             author: { ... },
 *             files: [ ... ]
 *           }
 *         ],
 *         replyCount: 2
 *       }
 *     ],
 *     total: 24,
 *     page: 1,
 *     limit: 50,
 *     stats: {
 *       messages: 24,
 *       participants: 5,
 *       files: 8
 *     }
 *   }
 * }
 */
async function loadDiscussion(sectionId, page = 1, limit = 50) {
  try {
    const response = await apiClient.get(`/api/sections/${sectionId}/discussion?page=${page}&limit=${limit}`);
    
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error || 'Ошибка загрузки обсуждения');
    }
  } catch (error) {
    console.error('Ошибка загрузки обсуждения:', error);
    throw error;
  }
}

/**
 * Создание нового сообщения
 * 
 * API Endpoint: POST /api/sections/:id/discussion
 * 
 * Тело запроса (multipart/form-data):
 * {
 *   text: "Текст сообщения",           // Обязательно
 *   parentId: "msg_001",               // Опционально - ID родительского сообщения для ответа
 *   files: [File, File, ...]           // Опционально - массив файлов
 * }
 * 
 * Ответ:
 * {
 *   success: true,
 *   data: {
 *     message: {
 *       id: "msg_new",
 *       text: "Текст сообщения",
 *       createdAt: "2025-03-18T16:00:00Z",
 *       author: { ... },
 *       files: [ ... ],
 *       replies: [],
 *       replyCount: 0
 *     }
 *   }
 * }
 */
async function createMessage(sectionId, text, parentId = null, files = []) {
  try {
    // Формируем FormData для отправки файлов
    const formData = new FormData();
    formData.append('text', text);
    
    if (parentId) {
      formData.append('parentId', parentId);
    }
    
    // Добавляем файлы
    files.forEach((file, index) => {
      formData.append(`files`, file);
    });
    
    const response = await apiClient.post(`/api/sections/${sectionId}/discussion`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    if (response.success) {
      return response.data.message;
    } else {
      throw new Error(response.error || 'Ошибка создания сообщения');
    }
  } catch (error) {
    console.error('Ошибка создания сообщения:', error);
    throw error;
  }
}

/**
 * Редактирование сообщения
 * 
 * API Endpoint: PUT /api/sections/:id/discussion/:messageId
 * 
 * Тело запроса:
 * {
 *   text: "Обновлённый текст сообщения"
 * }
 */
async function updateMessage(sectionId, messageId, text) {
  try {
    const response = await apiClient.put(`/api/sections/${sectionId}/discussion/${messageId}`, { text });
    
    if (response.success) {
      return response.data.message;
    } else {
      throw new Error(response.error || 'Ошибка редактирования сообщения');
    }
  } catch (error) {
    console.error('Ошибка редактирования сообщения:', error);
    throw error;
  }
}

/**
 * Удаление сообщения
 * 
 * API Endpoint: DELETE /api/sections/:id/discussion/:messageId
 * 
 * Ответ:
 * {
 *   success: true,
 *   data: { deleted: true }
 * }
 */
async function deleteMessage(sectionId, messageId) {
  try {
    const response = await apiClient.delete(`/api/sections/${sectionId}/discussion/${messageId}`);
    
    if (response.success) {
      return true;
    } else {
      throw new Error(response.error || 'Ошибка удаления сообщения');
    }
  } catch (error) {
    console.error('Ошибка удаления сообщения:', error);
    throw error;
  }
}

// ============================================================================
// РЕНДЕРИНГ
// ============================================================================

/**
 * Рендеринг одного сообщения
 * @param {Object} message - данные сообщения
 * @param {boolean} isReply - является ли ответом
 * @returns {string} - HTML разметка
 */
function renderMessage(message, isReply = false) {
  const avatarSize = isReply ? 'text-xs' : '';
  const avatarWidth = isReply ? 'width: 32px; height: 32px;' : '';
  const textSize = isReply ? 'text-sm' : '';
  
  // Рендеринг файлов
  const filesHtml = message.files && message.files.length > 0 
    ? renderFiles(message.files) 
    : '';
  
  // Рендеринг ответов
  const repliesHtml = message.replies && message.replies.length > 0
    ? `<div class="comment-replies">
        ${message.replies.map(reply => renderMessage(reply, true)).join('')}
       </div>`
    : '';
  
  return `
    <div class="comment-item" data-message-id="${message.id}">
      <div class="flex gap-4">
        <div class="avatar bg-gradient-to-br ${message.author.avatarColor || 'from-slate-700 to-slate-500'} text-white flex-shrink-0 ${avatarSize}" style="${avatarWidth}">
          ${message.author.avatar || message.author.name.charAt(0)}
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <span class="font-medium text-slate-800 ${textSize}">${message.author.name}</span>
            ${message.author.role ? `<span class="text-xs text-slate-400">${message.author.role}</span>` : ''}
            <span class="text-xs text-slate-400">•</span>
            <span class="text-xs text-slate-400">${formatDateTime(message.createdAt)}</span>
          </div>
          <p class="text-slate-600 ${textSize} leading-relaxed mb-3">
            ${escapeHtml(message.text)}
          </p>
          ${filesHtml}
          <div class="flex items-center gap-4">
            <button class="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1" onclick="showReplyForm('${message.id}')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              Ответить
            </button>
            ${!isReply ? `
              <span class="text-xs text-slate-400">
                ${message.replyCount > 0 ? `${message.replyCount} ответов` : ''}
              </span>
            ` : ''}
          </div>
          ${repliesHtml}
          ${renderReplyForm(message.id, isReply)}
        </div>
      </div>
    </div>
  `;
}

/**
 * Рендеринг прикреплённых файлов
 * @param {Array} files - массив файлов
 * @returns {string} - HTML разметка
 */
function renderFiles(files) {
  if (!files || files.length === 0) return '';
  
  return `
    <div class="flex flex-wrap gap-2 mb-3">
      ${files.map(file => `
        <div class="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 cursor-pointer">
          <div class="w-8 h-8 ${getFileIconBg(file.mimeType)} rounded flex items-center justify-center">
            ${getFileIcon(file.mimeType)}
          </div>
          <div>
            <p class="text-xs font-medium text-slate-700">${file.name}</p>
            <p class="text-xs text-slate-400">${formatFileSize(file.size)}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Рендеринг формы ответа
 * @param {string} messageId - ID сообщения
 * @param {boolean} isNested - вложенная ли форма
 * @returns {string} - HTML разметка
 */
function renderReplyForm(messageId, isNested = false) {
  return `
    <div id="replyForm-${messageId}" class="${isNested ? 'reply-form' : ''} reply-form-hidden" style="${isNested ? '' : 'margin-left: 52px; margin-top: 12px;'}">
      <div class="flex gap-3">
        <div class="avatar bg-gradient-to-br from-slate-700 to-slate-500 text-white flex-shrink-0 text-xs" style="width: 32px; height: 32px;">
          ${getCurrentUserAvatar()}
        </div>
        <div class="flex-1">
          <textarea class="input-field text-sm" rows="2" placeholder="Напишите ответ..." id="replyText-${messageId}"></textarea>
          <div class="flex items-center justify-between mt-2">
            <label class="text-slate-400 hover:text-slate-600 cursor-pointer">
              <input type="file" class="hidden" multiple id="replyFiles-${messageId}">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </label>
            <div class="flex items-center gap-2">
              <button class="text-xs text-slate-500 hover:text-slate-700" onclick="hideReplyForm('${messageId}')">Отмена</button>
              <button class="btn-primary py-1.5 px-3 text-xs" onclick="sendReply('${messageId}')">Ответить</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================================

/**
 * Форматирование даты и времени
 */
function formatDateTime(dateStr) {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${day}.${month}.${year}, ${hours}:${minutes}`;
}

/**
 * Форматирование размера файла
 */
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' Б';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' КБ';
  return (bytes / (1024 * 1024)).toFixed(1) + ' МБ';
}

/**
 * Получение иконки файла по MIME-типу
 */
function getFileIcon(mimeType) {
  if (mimeType?.startsWith('image/')) {
    return '<svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" /></svg>';
  }
  if (mimeType === 'application/pdf') {
    return '<svg class="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" /></svg>';
  }
  return '<svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" /></svg>';
}

/**
 * Получение цвета фона иконки файла
 */
function getFileIconBg(mimeType) {
  if (mimeType?.startsWith('image/')) return 'bg-green-100';
  if (mimeType === 'application/pdf') return 'bg-red-100';
  return 'bg-blue-100';
}

/**
 * Экранирование HTML
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Получение аватара текущего пользователя
 */
function getCurrentUserAvatar() {
  // Получаем из localStorage или из контекста
  return 'И'; // Временно
}

// ============================================================================
// ИНТЕРАКТИВНОСТЬ
// ============================================================================

/**
 * Показать форму ответа
 */
function showReplyForm(messageId) {
  // Скрываем все открытые формы
  document.querySelectorAll('.reply-form, [id^="replyForm-"]').forEach(form => {
    if (form.id?.startsWith('replyForm-')) {
      form.classList.add('reply-form-hidden');
    }
  });
  
  // Показываем нужную форму
  const form = document.getElementById(`replyForm-${messageId}`);
  if (form) {
    form.classList.remove('reply-form-hidden');
    const textarea = document.getElementById(`replyText-${messageId}`);
    if (textarea) textarea.focus();
  }
}

/**
 * Скрыть форму ответа
 */
function hideReplyForm(messageId) {
  const form = document.getElementById(`replyForm-${messageId}`);
  if (form) {
    form.classList.add('reply-form-hidden');
    const textarea = document.getElementById(`replyText-${messageId}`);
    if (textarea) textarea.value = '';
  }
}

/**
 * Отправить ответ на сообщение
 */
async function sendReply(messageId) {
  const sectionId = getSectionId();
  const textarea = document.getElementById(`replyText-${messageId}`);
  const fileInput = document.getElementById(`replyFiles-${messageId}`);
  
  if (!textarea || !textarea.value.trim()) {
    alert('Введите текст ответа');
    return;
  }
  
  const text = textarea.value.trim();
  const files = fileInput?.files ? Array.from(fileInput.files) : [];
  
  try {
    const message = await createMessage(sectionId, text, messageId, files);
    
    // Добавляем новый ответ в DOM
    addReplyToDOM(messageId, message);
    
    // Скрываем форму
    hideReplyForm(messageId);
    
  } catch (error) {
    alert('Ошибка отправки ответа: ' + error.message);
  }
}

/**
 * Отправить новое сообщение (не ответ)
 */
async function sendMessage() {
  const sectionId = getSectionId();
  const textarea = document.getElementById('messageText');
  const fileInput = document.getElementById('fileInput');
  
  if (!textarea || !textarea.value.trim()) {
    alert('Введите текст сообщения');
    return;
  }
  
  const text = textarea.value.trim();
  const files = fileInput?.files ? Array.from(fileInput.files) : [];
  
  try {
    const message = await createMessage(sectionId, text, null, files);
    
    // Добавляем новое сообщение в DOM
    addMessageToDOM(message);
    
    // Очищаем форму
    textarea.value = '';
    if (fileInput) fileInput.value = '';
    clearAttachedFiles();
    
  } catch (error) {
    alert('Ошибка отправки сообщения: ' + error.message);
  }
}

/**
 * Добавить ответ в DOM
 */
function addReplyToDOM(parentId, message) {
  const parentItem = document.querySelector(`[data-message-id="${parentId}"]`);
  if (!parentItem) return;
  
  // Находим или создаём контейнер для ответов
  let repliesContainer = parentItem.querySelector('.comment-replies');
  if (!repliesContainer) {
    repliesContainer = document.createElement('div');
    repliesContainer.className = 'comment-replies';
    parentItem.querySelector('.flex-1').appendChild(repliesContainer);
  }
  
  // Добавляем ответ перед формой ответа
  const replyForm = parentItem.querySelector('[id^="replyForm-"]');
  const replyHtml = renderMessage(message, true);
  
  if (replyForm) {
    replyForm.insertAdjacentHTML('beforebegin', replyHtml);
  } else {
    repliesContainer.insertAdjacentHTML('beforeend', replyHtml);
  }
}

/**
 * Добавить сообщение в DOM
 */
function addMessageToDOM(message) {
  const container = document.getElementById('commentsContainer');
  if (!container) return;
  
  // Удаляем сообщение "нет сообщений" если есть
  const emptyMessage = container.querySelector('.text-center');
  if (emptyMessage) {
    emptyMessage.remove();
  }
  
  // Добавляем сообщение в конец
  const messageHtml = renderMessage(message, false);
  container.insertAdjacentHTML('beforeend', messageHtml);
}

/**
 * Получить ID раздела из URL
 */
function getSectionId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id') || 'demo';
}

/**
 * Очистить прикреплённые файлы
 */
function clearAttachedFiles() {
  const container = document.getElementById('attachedFiles');
  const list = document.getElementById('attachedFilesList');
  const counter = document.getElementById('fileCount');
  
  if (container) container.classList.add('hidden');
  if (list) list.innerHTML = '';
  if (counter) {
    counter.classList.add('hidden');
    counter.textContent = '0 файлов';
  }
}

// ============================================================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================================================

let currentSectionId = null;

/**
 * Инициализация страницы
 */
async function init() {
  currentSectionId = getSectionId();
  
  if (currentSectionId === 'demo') {
    console.log('Демо-режим: используем статичные данные');
    return;
  }
  
  try {
    const data = await loadDiscussion(currentSectionId);
    
    // Рендерим сообщения
    const container = document.getElementById('commentsContainer');
    if (container && data.messages) {
      container.innerHTML = data.messages
        .map(msg => renderMessage(msg, false))
        .join('');
    }
    
    // Обновляем статистику
    if (data.stats) {
      updateStats(data.stats);
    }
    
  } catch (error) {
    console.error('Ошибка инициализации:', error);
    
    const container = document.getElementById('commentsContainer');
    if (container) {
      container.innerHTML = `
        <div class="text-center py-12 text-red-500">
          <p>Ошибка загрузки обсуждения</p>
          <button onclick="init()" class="btn-secondary mt-4">Повторить</button>
        </div>
      `;
    }
  }
}

/**
 * Обновление статистики
 */
function updateStats(stats) {
  // Обновляем счётчики в боковой панели
  const elements = {
    'statMessages': stats.messages,
    'statParticipants': stats.participants,
    'statFiles': stats.files
  };
  
  Object.entries(elements).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', init);
