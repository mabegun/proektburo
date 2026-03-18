/**
 * Скрипт для страницы обсуждения проекта (04-1-project-discussion.html)
 */

document.addEventListener('DOMContentLoaded', async () => {
  await checkAuth();
  await loadDiscussion();
  initActions();
});

/**
 * Проверка авторизации
 */
async function checkAuth() {
  if (!getAuthToken()) {
    window.location.href = '01-login.html';
  }
  
  try {
    const user = await API.auth.getCurrentUser();
    updateUserProfile(user);
  } catch (error) {
    removeAuthToken();
    window.location.href = '01-login.html';
  }
}

/**
 * Обновление профиля в сайдбаре
 */
function updateUserProfile(user) {
  const profileEl = document.querySelector('.sidebar-profile');
  if (!profileEl) return;
  
  const initials = UI.getInitials(user.name);
  const role = getUserRoleText(user.role);
  
  profileEl.innerHTML = `
    <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
      <div class="avatar bg-gradient-to-br from-slate-700 to-slate-500 text-white">${initials}</div>
      <div class="flex-1 min-w-0">
        <p class="font-semibold text-slate-800 truncate">${user.name}</p>
        <p class="text-xs text-slate-500">${role}</p>
      </div>
    </div>
  `;
}

function getUserRoleText(role) {
  const map = {
    'director': 'Директор',
    'gip': 'ГИП',
    'employee': 'Сотрудник',
  };
  return map[role] || role;
}

/**
 * Загрузка обсуждения
 */
async function loadDiscussion() {
  try {
    const projectId = getUrlParam('id');
    if (!projectId) {
      UI.showError('#discussion-content', 'Не указан ID проекта');
      return;
    }
    
    UI.showLoading('#discussion-content');
    
    const [comments, project] = await Promise.all([
      api.get(`/projects/${projectId}/discussions`),
      API.projects.getById(projectId),
    ]);
    
    renderDiscussion(comments, project);
    
  } catch (error) {
    console.error('Ошибка загрузки обсуждения:', error);
    UI.showError('#discussion-content', 'Не удалось загрузить обсуждение');
  }
}

/**
 * Рендер обсуждения
 */
function renderDiscussion(comments, project) {
  // Статистика
  renderDiscussionStats(comments);
  
  // Комментарии
  renderComments(comments);
}

/**
 * Рендер статистики
 */
function renderDiscussionStats(comments) {
  const container = document.getElementById('discussion-stats');
  if (!container) return;
  
  const total = comments.length;
  const unread = comments.filter(c => !c.read).length;
  const withFiles = comments.filter(c => c.file).length;
  const myComments = comments.filter(c => c.isMy).length;
  
  container.innerHTML = `
    <div class="grid grid-cols-4 gap-4">
      <div class="card-static p-4">
        <div class="text-sm text-slate-500 mb-1">Всего</div>
        <div class="text-2xl font-bold text-slate-800">${total}</div>
        <div class="text-xs text-slate-400 mt-1">комментариев</div>
      </div>
      <div class="card-static p-4">
        <div class="text-sm text-slate-500 mb-1">Непрочитанные</div>
        <div class="text-2xl font-bold text-blue-600">${unread}</div>
        <div class="text-xs text-slate-400 mt-1">новых</div>
      </div>
      <div class="card-static p-4">
        <div class="text-sm text-slate-500 mb-1">С файлами</div>
        <div class="text-2xl font-bold text-amber-600">${withFiles}</div>
        <div class="text-xs text-slate-400 mt-1">вложений</div>
      </div>
      <div class="card-static p-4">
        <div class="text-sm text-slate-500 mb-1">Мои</div>
        <div class="text-2xl font-bold text-green-600">${myComments}</div>
        <div class="text-xs text-slate-400 mt-1">комментариев</div>
      </div>
    </div>
  `;
}

/**
 * Рендер комментариев
 */
function renderComments(comments) {
  const container = document.getElementById('comments-list');
  if (!container) return;
  
  if (comments.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 text-slate-400">
        <div class="text-6xl mb-4">💬</div>
        <p class="text-lg font-medium">Комментариев пока нет</p>
        <p class="text-sm mt-2">Будьте первым — начните обсуждение!</p>
      </div>
    `;
    return;
  }
  
  // Группируем комментарии по веткам
  const threads = groupCommentsByThread(comments);
  
  const html = threads.map(thread => renderCommentThread(thread, comments)).join('');
  
  container.innerHTML = html;
}

/**
 * Группировка комментариев по веткам
 */
function groupCommentsByThread(comments) {
  const threads = [];
  const commentMap = new Map(comments.map(c => [c.id, { ...c, replies: [] }]));
  
  comments.forEach(comment => {
    if (comment.parentId) {
      const parent = commentMap.get(comment.parentId);
      if (parent) {
        parent.replies.push(comment);
      }
    } else {
      threads.push(commentMap.get(comment.id));
    }
  });
  
  return threads;
}

/**
 * Рендер ветки комментариев
 */
function renderCommentThread(thread, allComments) {
  return `
    <div class="mb-6">
      ${renderCommentItem(thread)}
      ${thread.replies.length > 0 ? `
        <div class="ml-12 mt-4 space-y-4">
          ${thread.replies.map(reply => renderCommentItem(reply)).join('')}
        </div>
      ` : ''}
      <div class="ml-12 mt-4">
        <button class="text-sm text-blue-600 hover:text-blue-700 font-medium" onclick="showReplyForm(${thread.id})">
          Ответить
        </button>
      </div>
      <div id="reply-form-${thread.id}" class="ml-12 mt-4 hidden">
        ${renderReplyForm(thread.id)}
      </div>
    </div>
  `;
}

/**
 * Рендер комментария
 */
function renderCommentItem(comment) {
  const isMy = comment.isMy;
  const timeAgo = formatCommentTime(comment.createdAt);
  
  return `
    <div class="card p-4 ${!comment.read ? 'bg-blue-50 border-blue-200' : ''}">
      <div class="flex items-start gap-3">
        <div class="avatar w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 text-white flex-shrink-0">
          ${UI.getInitials(comment.author.name)}
        </div>
        <div class="flex-1">
          <div class="flex items-center justify-between mb-2">
            <div>
              <p class="font-semibold text-slate-800">${comment.author.name}</p>
              <p class="text-xs text-slate-400">${timeAgo}</p>
            </div>
            ${isMy ? `
              <div class="flex gap-2">
                <button class="text-slate-400 hover:text-blue-600 text-xs" onclick="editComment(${comment.id})">
                  Редактировать
                </button>
                <button class="text-slate-400 hover:text-red-600 text-xs" onclick="deleteComment(${comment.id})">
                  Удалить
                </button>
              </div>
            ` : ''}
          </div>
          
          <p class="text-sm text-slate-700 mb-3">${comment.text}</p>
          
          ${comment.file ? `
            <div class="mb-3 p-3 bg-white rounded-lg border border-slate-200">
              <div class="flex items-center gap-3">
                ${UI.getEntityIcon('file', 'w-8 h-8 text-slate-600')}
                <div class="flex-1">
                  <p class="text-sm font-medium text-slate-700">${comment.file.name}</p>
                  <p class="text-xs text-slate-400">${formatFileSize(comment.file.size)}</p>
                </div>
                <a href="${comment.file.url}" download class="text-slate-400 hover:text-blue-600">
                  ${UI.getEntityIcon('file', 'w-5 h-5')}
                </a>
              </div>
            </div>
          ` : ''}
          
          ${comment.editedAt ? `
            <p class="text-xs text-slate-400 italic">Изменён ${formatCommentTime(comment.editedAt)}</p>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

/**
 * Рендер формы ответа
 */
function renderReplyForm(parentId) {
  return `
    <div class="card p-4">
      <textarea 
        id="reply-text-${parentId}"
        class="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors resize-y"
        rows="3"
        placeholder="Напишите ответ..."
      ></textarea>
      <div class="flex items-center justify-between mt-3">
        <label class="btn-secondary text-sm py-2 px-3 cursor-pointer">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          Прикрепить файл
          <input type="file" class="hidden" onchange="handleFileSelect(event, ${parentId})">
        </label>
        <div class="flex gap-2">
          <button class="btn-secondary text-sm py-2 px-3" onclick="hideReplyForm(${parentId})">
            Отмена
          </button>
          <button class="btn-primary text-sm py-2 px-3" onclick="submitReply(${parentId})">
            Ответить
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Инициализация действий
 */
function initActions() {
  // Отправка комментария
  const commentForm = document.getElementById('comment-form');
  commentForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = e.target.querySelector('textarea')?.value.trim();
    
    if (text) {
      try {
        const projectId = getUrlParam('id');
        await api.post(`/projects/${projectId}/discussions`, { text });
        UI.toast('Комментарий добавлен', 'success');
        e.target.reset();
        loadDiscussion();
      } catch (error) {
        UI.toast('Ошибка при отправке комментария', 'error');
      }
    }
  });
}

// Глобальные функции
window.showReplyForm = (parentId) => {
  document.getElementById(`reply-form-${parentId}`)?.classList.remove('hidden');
};

window.hideReplyForm = (parentId) => {
  document.getElementById(`reply-form-${parentId}`)?.classList.add('hidden');
};

window.submitReply = async (parentId) => {
  const text = document.getElementById(`reply-text-${parentId}`)?.value.trim();
  
  if (text) {
    try {
      const projectId = getUrlParam('id');
      await api.post(`/projects/${projectId}/discussions`, { text, parentId });
      UI.toast('Ответ добавлен', 'success');
      loadDiscussion();
    } catch (error) {
      UI.toast('Ошибка при отправке ответа', 'error');
    }
  }
};

window.editComment = async (commentId) => {
  // Реализация редактирования
  UI.toast('Функция редактирования в разработке', 'info');
};

window.deleteComment = async (commentId) => {
  if (!confirm('Вы уверены, что хотите удалить этот комментарий?')) return;
  
  try {
    const projectId = getUrlParam('id');
    await api.delete(`/projects/${projectId}/discussions/${commentId}`);
    UI.toast('Комментарий удалён', 'success');
    loadDiscussion();
  } catch (error) {
    UI.toast('Ошибка при удалении комментария', 'error');
  }
};

window.handleFileSelect = (event, parentId) => {
  const file = event.target.files[0];
  if (file) {
    UI.toast(`Файл выбран: ${file.name}`, 'info');
    // Здесь будет логика загрузки файла
  }
};

// Вспомогательные функции
function formatCommentTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Только что';
  if (minutes < 60) return `${minutes} мин. назад`;
  if (hours < 24) return `${hours} ${UI.declension(hours, ['час', 'часа', 'часов'])} назад`;
  if (days < 7) return `${days} ${UI.declension(days, ['день', 'дня', 'дней'])} назад`;
  
  return UI.formatDate(dateString);
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
