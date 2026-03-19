/**
 * Скрипт для страницы обсуждения раздела (06-2-section-discussion.html)
 * Адаптирован для работы с API
 */

let currentSectionId = null;

document.addEventListener('DOMContentLoaded', async () => {
  await initPage({ requireAuth: false, loadProfile: true });
  currentSectionId = getUrlParam('id');
  await loadDiscussion();
  initForm();
});

/**
 * Загрузка обсуждения
 */
async function loadDiscussion() {
  try {
    if (!currentSectionId) {
      UI.showError('#comments-container', 'Не указан ID раздела');
      return;
    }
    
    UI.showLoading('#comments-container');
    
    const data = await API.sections.getDiscussion(currentSectionId);
    renderDiscussion(data.messages || data.items || data);
    updateStats(data.stats);
    
  } catch (error) {
    console.error('Ошибка загрузки обсуждения:', error);
    UI.showError('#comments-container', 'Не удалось загрузить обсуждение');
  }
}

/**
 * Рендер сообщений
 */
function renderDiscussion(messages) {
  const container = document.getElementById('comments-container');
  if (!container) return;
  
  if (!messages || messages.length === 0) {
    UI.showEmpty('#comments-container', 'Нет сообщений', '💬');
    return;
  }
  
  const html = messages.map(msg => renderMessage(msg)).join('');
  container.innerHTML = html;
}

/**
 * Рендер одного сообщения
 */
function renderMessage(message) {
  const filesHtml = message.files?.length > 0 
    ? renderFiles(message.files) 
    : '';
  
  const repliesHtml = message.replies?.length > 0
    ? `<div class="ml-12 mt-4 space-y-4">${message.replies.map(r => renderMessage(r, true)).join('')}</div>`
    : '';
  
  const initials = message.author?.name?.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2) || '?';
  
  return `
    <div class="comment-item" data-message-id="${message.id}">
      <div class="flex gap-4">
        <div class="avatar bg-gradient-to-br from-slate-700 to-slate-500 text-white flex-shrink-0">
          ${initials}
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <span class="font-medium text-slate-800">${message.author?.name || 'Неизвестный'}</span>
            ${message.author?.role ? `<span class="text-xs text-slate-400">${message.author.role}</span>` : ''}
            <span class="text-xs text-slate-400">•</span>
            <span class="text-xs text-slate-400">${formatDateTime(message.createdAt)}</span>
          </div>
          <p class="text-slate-600 leading-relaxed mb-3">${escapeHtml(message.text)}</p>
          ${filesHtml}
          <div class="flex items-center gap-4">
            <button class="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1" onclick="showReplyForm('${message.id}')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              Ответить
            </button>
            ${message.replyCount > 0 ? `<span class="text-xs text-slate-400">${message.replyCount} ответов</span>` : ''}
          </div>
          ${repliesHtml}
          <div id="replyForm-${message.id}" class="reply-form hidden mt-4 ml-0">
            <textarea class="input-field text-sm" rows="2" placeholder="Напишите ответ..." id="replyText-${message.id}"></textarea>
            <div class="flex justify-end gap-2 mt-2">
              <button class="text-xs text-slate-500 hover:text-slate-700" onclick="hideReplyForm('${message.id}')">Отмена</button>
              <button class="btn-primary py-1.5 px-3 text-xs" onclick="sendReply('${message.id}')">Ответить</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Рендер файлов
 */
function renderFiles(files) {
  return `
    <div class="flex flex-wrap gap-2 mb-3">
      ${files.map(file => `
        <div class="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 cursor-pointer">
          <div class="w-8 h-8 ${getFileIconBg(file.mimeType || file.type)} rounded flex items-center justify-center">
            ${getFileIcon(file.mimeType || file.type)}
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
 * Инициализация формы
 */
function initForm() {
  const form = document.getElementById('message-form');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await sendMessage();
  });
  
  // Файлы
  const fileInput = document.getElementById('file-input');
  fileInput?.addEventListener('change', handleFileSelect);
}

/**
 * Отправка сообщения
 */
async function sendMessage() {
  const textarea = document.getElementById('message-text');
  const fileInput = document.getElementById('file-input');
  
  if (!textarea?.value.trim()) {
    UI.toast('Введите текст сообщения', 'error');
    return;
  }
  
  try {
    const text = textarea.value.trim();
    const files = fileInput?.files ? Array.from(fileInput.files) : [];
    
    await API.sections.uploadFile(currentSectionId, { text, files });
    UI.toast('Сообщение отправлено', 'success');
    
    textarea.value = '';
    if (fileInput) fileInput.value = '';
    clearAttachedFiles();
    
    await loadDiscussion();
    
  } catch (error) {
    console.error('Ошибка отправки:', error);
    UI.toast('Ошибка при отправке сообщения', 'error');
  }
}

/**
 * Показать форму ответа
 */
window.showReplyForm = (messageId) => {
  document.querySelectorAll('[id^="replyForm-"]').forEach(form => form.classList.add('hidden'));
  const form = document.getElementById(`replyForm-${messageId}`);
  if (form) {
    form.classList.remove('hidden');
    document.getElementById(`replyText-${messageId}`)?.focus();
  }
};

/**
 * Скрыть форму ответа
 */
window.hideReplyForm = (messageId) => {
  const form = document.getElementById(`replyForm-${messageId}`);
  if (form) {
    form.classList.add('hidden');
    const textarea = document.getElementById(`replyText-${messageId}`);
    if (textarea) textarea.value = '';
  }
};

/**
 * Отправить ответ
 */
window.sendReply = async (parentId) => {
  const textarea = document.getElementById(`replyText-${parentId}`);
  
  if (!textarea?.value.trim()) {
    UI.toast('Введите текст ответа', 'error');
    return;
  }
  
  try {
    await API.sections.uploadFile(currentSectionId, { 
      text: textarea.value.trim(), 
      parentId 
    });
    UI.toast('Ответ отправлен', 'success');
    hideReplyForm(parentId);
    await loadDiscussion();
  } catch (error) {
    UI.toast('Ошибка при отправке ответа', 'error');
  }
};

/**
 * Обработка выбора файлов
 */
function handleFileSelect(e) {
  const files = Array.from(e.target.files);
  const container = document.getElementById('attached-files');
  const list = document.getElementById('files-list');
  
  if (files.length === 0) {
    container?.classList.add('hidden');
    return;
  }
  
  container?.classList.remove('hidden');
  if (list) {
    list.innerHTML = files.map(f => `
      <span class="text-xs bg-slate-100 px-2 py-1 rounded">${f.name}</span>
    `).join('');
  }
}

/**
 * Очистка прикреплённых файлов
 */
function clearAttachedFiles() {
  const container = document.getElementById('attached-files');
  const list = document.getElementById('files-list');
  container?.classList.add('hidden');
  if (list) list.innerHTML = '';
}

/**
 * Обновление статистики
 */
function updateStats(stats) {
  if (!stats) return;
  
  document.getElementById('stat-messages')?.textContent && (document.getElementById('stat-messages').textContent = stats.messages || 0);
  document.getElementById('stat-participants')?.textContent && (document.getElementById('stat-participants').textContent = stats.participants || 0);
  document.getElementById('stat-files')?.textContent && (document.getElementById('stat-files').textContent = stats.files || 0);
}

// Вспомогательные функции
function formatDateTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatFileSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return bytes + ' Б';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' КБ';
  return (bytes / (1024 * 1024)).toFixed(1) + ' МБ';
}

function getFileIcon(mimeType) {
  if (mimeType?.startsWith('image/')) return '🖼️';
  if (mimeType === 'application/pdf' || mimeType === 'pdf') return '📄';
  if (mimeType?.includes('dwg') || mimeType === 'dwg') return '📐';
  return '📁';
}

function getFileIconBg(mimeType) {
  if (mimeType?.startsWith('image/')) return 'bg-green-100';
  if (mimeType === 'application/pdf' || mimeType === 'pdf') return 'bg-red-100';
  if (mimeType?.includes('dwg') || mimeType === 'dwg') return 'bg-blue-100';
  return 'bg-slate-100';
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
