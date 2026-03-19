#!/bin/bash
# ========================================
#    ПРОЕКТНОЕ БЮРО - ЗАПУСК (Linux/macOS)
# ========================================

# Переходим в директорию скрипта
cd "$(dirname "$0")"

echo "========================================"
echo "   ПРОЕКТНОЕ БЮРО - ЗАПУСК"
echo "========================================"
echo ""

# [1/5] Проверка Python
echo "[1/5] Проверка Python..."
if ! command -v python3 &> /dev/null; then
    if ! command -v python &> /dev/null; then
        echo "ОШИБКА: Python не установлен!"
        echo "Скачайте с https://python.org"
        exit 1
    fi
    PYTHON_CMD=python
else
    PYTHON_CMD=python3
fi

PYTHON_VERSION=$($PYTHON_CMD --version 2>&1)
echo "Найден $PYTHON_VERSION"

# [2/5] Создание виртуального окружения
echo ""
echo "[2/5] Виртуальное окружение..."
if [ ! -d "venv" ]; then
    echo "Создание venv..."
    $PYTHON_CMD -m venv venv
fi

# Активация venv
source venv/bin/activate

# [3/5] Установка зависимостей
echo ""
echo "[3/5] Установка зависимостей..."
pip install -q -r requirements.txt

# [4/5] Инициализация базы данных
echo ""
echo "[4/5] Инициализация базы данных..."
python -c "from backend.database import init_db; init_db()"

# [5/5] Создание тестовых данных
echo ""
echo "[5/5] Создание тестовых данных..."
python init_test_data.py

echo ""
echo "========================================"
echo "   ЗАПУСК СЕРВЕРА"
echo "========================================"
echo ""
echo "Откройте браузер: http://localhost:8000"
echo ""
echo "Тестовые пользователи:"
echo "  director@bureau.ru         - Директор"
echo "  gip-ivanov@bureau.ru       - ГИП"
echo "  executor-petrov@bureau.ru  - Исполнитель"
echo ""
echo "Для остановки нажмите Ctrl+C"
echo ""
echo "========================================"
echo ""

# Запуск сервера
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
