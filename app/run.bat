@echo off
chcp 65001 >nul
echo ========================================
echo    ПРОЕКТНОЕ БЮРО - ЗАПУСК
echo ========================================
echo.

cd /d "%~dp0"

echo [1/5] Проверка Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ОШИБКА: Python не установлен!
    echo Скачайте с https://python.org
    pause
    exit /b 1
)

echo [2/5] Виртуальное окружение...
if not exist "venv" (
    echo Создание venv...
    python -m venv venv
)

call venv\Scripts\activate.bat

echo [3/5] Установка зависимостей...
pip install -q -r requirements.txt

echo [4/5] Инициализация базы данных...
python -c "from backend.database import init_db; init_db()"

echo [5/5] Создание тестовых данных...
python init_test_data.py

echo.
echo ========================================
echo    ЗАПУСК СЕРВЕРА
echo ========================================
echo.
echo Откройте браузер: http://localhost:8000
echo.
echo Тестовые пользователи:
echo   director@bureau.ru         - Директор
echo   gip-ivanov@bureau.ru       - ГИП
echo   executor-petrov@bureau.ru  - Исполнитель
echo.
echo Для остановки нажмите Ctrl+C
echo.
echo ========================================
echo.

python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

pause
