/**
 * Скрипт для страницы файлов раздела (06-1-section-files.html)
 */

let currentSectionId = null;

document.addEventListener('DOMContentLoaded', async () => {
  await initPage({ requireAuth: false, loadProfile: true });
  currentSectionId = getUrlParam('id');
  await loadFiles();
  initUpload();
});

/**
 * Загрузка файлов
 */
async function loadFiles() {
  try {
    if (!currentSectionId) {
      UI.showError('#files-container', 'Не указан ID раздела');
      return;
    }
    
    UI.showLoading('#files-container');
    
    const data = await API.sections.getFiles(currentSectionId);
    const files = data.files || data.items || data;
    
    renderFiles(files);
    updateStats(files);
    
  } catch (error) {
    console.error('Ошибка загрузки файлов:', error);
    UI.showError('#files-container', 'Не удалось загрузить файлы');
  }
}

/**
 * Рендер файлов
 */
function renderFiles(files) {
  const container = document.getElementById('files-container');
  if (!container) return;
  
  if (!files || files.length === 0) {
    UI.showEmpty('#files-container', 'Файлы не загружены', '📁');
    return;
  }
  
  // Группируем по папкам (опционально)
  const grouped = groupByFolder(files);
  
  const html = Object.entries(grouped).map(([folder, folderFiles]) => {
    return `
      <div class="mb-6">
        ${folder !== 'root' ? `
          <h3 class="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            ${folder}
          </h3>
        ` : ''}
        <div class="space-y-2">
          ${folderFiles.map(file => renderFileItem(file)).join('')}
        </div>
      </div>
    `;
  }).join('');
  
  container.innerHTML = html;
}

/**
 * Рендер файла
 */
function renderFileItem(file) {
  const iconClass = getFileIconClass(file.type || file.mimeType);
  const statusClass = getFileStatusClass(file.status);
  const statusText = getFileStatusText(file.status);
  
  return `
    <div class="file-item flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all" data-file-id="${file.id}">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 ${iconClass} rounded-xl flex items-center justify-center text-xl">
          ${getFileIcon(file.type || file.mimeType)}
        </div>
        <div>
          <p class="font-medium text-slate-800">${file.name}</p>
          <div class="flex items-center gap-3 text-xs text-slate-400 mt-1">
            <span>${formatFileSize(file.size)}</span>
            <span>•</span>
            <span>${file.uploadedBy?.name || file.uploadedBy || 'Неизвестно'}</span>
            <span>•</span>
            <span>${UI.formatDate(file.uploadedAt || file.createdAt)}</span>
            ${file.version ? `<span>•</span><span>v${file.version}</span>` : ''}
          </div>
        </div>
      </div>
      <div class="flex items-center gap-3">
        ${statusClass ? `<span class="badge ${statusClass}">${statusText}</span>` : ''}
        <div class="flex items-center gap-1">
          <button class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" onclick="downloadFile('${file.id}')" title="Скачать">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
          <button class="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" onclick="approveFile('${file.id}')" title="Согласовать">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7" />
            </svg>
          </button>
          <button class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" onclick="deleteFile('${file.id}')" title="Удалить">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Инициализация загрузки
 */
function initUpload() {
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  
  // Drag & Drop
  dropZone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('border-blue-400', 'bg-blue-50');
  });
  
  dropZone?.addEventListener('dragleave', () => {
    dropZone.classList.remove('border-blue-400', 'bg-blue-50');
  });
  
  dropZone?.addEventListener('drop', async (e) => {
    e.preventDefault();
    dropZone.classList.remove('border-blue-400', 'bg-blue-50');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await uploadFiles(files);
    }
  });
  
  // Клик для выбора файлов
  dropZone?.addEventListener('click', () => fileInput?.click());
  
  // Выбор файлов через input
  fileInput?.addEventListener('change', async (e) => {
    if (e.target.files.length > 0) {
      await uploadFiles(e.target.files);
    }
  });
}

/**
 * Загрузка файлов
 */
async function uploadFiles(files) {
  try {
    UI.toast('Загрузка файлов...', 'info');
    
    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('files', file));
    
    await API.sections.uploadFile(currentSectionId, formData);
    UI.toast('Файлы загружены', 'success');
    
    await loadFiles();
    
  } catch (error) {
    console.error('Ошибка загрузки:', error);
    UI.toast('Ошибка при загрузке файлов', 'error');
  }
}

/**
 * Скачать файл
 */
window.downloadFile = (fileId) => {
  const file = document.querySelector(`[data-file-id="${fileId}"]`);
  const fileName = file?.querySelector('.font-medium')?.textContent || 'file';
  UI.toast(`Скачивание ${fileName}...`, 'info');
  // В реальном приложении: window.location.href = `/api/files/${fileId}/download`;
};

/**
 * Согласовать файл
 */
window.approveFile = async (fileId) => {
  try {
    await api.put(`/sections/${currentSectionId}/files/${fileId}/approve`);
    UI.toast('Файл согласован', 'success');
    await loadFiles();
  } catch (error) {
    UI.toast('Ошибка при согласовании', 'error');
  }
};

/**
 * Удалить файл
 */
window.deleteFile = async (fileId) => {
  if (!confirm('Удалить этот файл?')) return;
  
  try {
    await API.sections.deleteFile(currentSectionId, fileId);
    UI.toast('Файл удалён', 'success');
    await loadFiles();
  } catch (error) {
    UI.toast('Ошибка при удалении', 'error');
  }
};

/**
 * Обновление статистики
 */
function updateStats(files) {
  const totalSize = files.reduce((sum, f) => sum + (f.size || 0), 0);
  
  document.getElementById('stat-count')?.textContent && (document.getElementById('stat-count').textContent = files.length);
  document.getElementById('stat-size')?.textContent && (document.getElementById('stat-size').textContent = formatFileSize(totalSize));
}

// Вспомогательные функции
function groupByFolder(files) {
  const groups = { root: [] };
  
  files.forEach(file => {
    const folder = file.folder || file.category || 'root';
    if (!groups[folder]) groups[folder] = [];
    groups[folder].push(file);
  });
  
  // Удаляем пустую root если есть другие папки
  if (groups.root.length === 0 && Object.keys(groups).length > 1) {
    delete groups.root;
  }
  
  return groups;
}

function formatFileSize(bytes) {
  if (!bytes) return '0 Б';
  if (bytes < 1024) return bytes + ' Б';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' КБ';
  return (bytes / (1024 * 1024)).toFixed(1) + ' МБ';
}

function getFileIcon(type) {
  if (!type) return '📁';
  if (type.includes('pdf')) return '📄';
  if (type.includes('dwg') || type.includes('cad')) return '📐';
  if (type.includes('image')) return '🖼️';
  if (type.includes('zip') || type.includes('rar')) return '📦';
  if (type.includes('doc') || type.includes('word')) return '📝';
  if (type.includes('xls') || type.includes('excel')) return '📊';
  return '📁';
}

function getFileIconClass(type) {
  if (!type) return 'bg-slate-100';
  if (type.includes('pdf')) return 'bg-red-100';
  if (type.includes('dwg') || type.includes('cad')) return 'bg-blue-100';
  if (type.includes('image')) return 'bg-green-100';
  if (type.includes('zip') || type.includes('rar')) return 'bg-yellow-100';
  if (type.includes('doc') || type.includes('word')) return 'bg-indigo-100';
  if (type.includes('xls') || type.includes('excel')) return 'bg-emerald-100';
  return 'bg-slate-100';
}

function getFileStatusClass(status) {
  const map = {
    'approved': 'status-completed',
    'rejected': 'status-overdue',
    'pending': 'status-in-progress',
    'draft': 'status-not-started',
  };
  return map[status] || '';
}

function getFileStatusText(status) {
  const map = {
    'approved': 'Согласован',
    'rejected': 'Отклонён',
    'pending': 'На проверке',
    'draft': 'Черновик',
  };
  return map[status] || '';
}
