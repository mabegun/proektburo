"""
Скрипт инициализации тестовых данных
Запускается отдельно для создания тестовой базы
"""
import sys
from pathlib import Path

# Добавляем родительскую директорию в path для импортов
sys.path.insert(0, str(Path(__file__).parent))

from backend.database import init_db
from backend.test_data import create_test_data

if __name__ == "__main__":
    print("=" * 60)
    print("   ИНИЦИАЛИЗАЦИЯ ТЕСТОВЫХ ДАННЫХ")
    print("=" * 60)
    print()
    
    # Инициализация БД
    init_db()
    
    # Создание тестовых данных
    create_test_data()
    
    print()
    print("=" * 60)
    print("   ГОТОВО!")
    print("=" * 60)
    print()
    print("Теперь запустите сервер командой:")
    print("  python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000")
    print()
    print("Или используйте файл run.bat")
    print()
