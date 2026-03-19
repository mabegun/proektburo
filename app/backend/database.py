"""
База данных SQLite - модели и подключение
"""
import sqlite3
import json
from datetime import datetime
from pathlib import Path
import uuid

# Пути к данным
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DB_PATH = DATA_DIR / "database.sqlite"
FILES_DIR = DATA_DIR / "files"

# Создаём директорию для данных
DATA_DIR.mkdir(exist_ok=True)
FILES_DIR.mkdir(exist_ok=True)


def get_db_connection():
    """Получить подключение к базе данных"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    """Инициализация базы данных - создание таблиц"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Таблица пользователей
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            email TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            role TEXT NOT NULL,
            password_hash TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Таблица проектов
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            address TEXT,
            gip_email TEXT,
            director_email TEXT,
            status TEXT DEFAULT 'active',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            settings TEXT DEFAULT '{}',
            FOREIGN KEY (gip_email) REFERENCES users(email),
            FOREIGN KEY (director_email) REFERENCES users(email)
        )
    """)
    
    # Таблица разделов проекта
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sections (
            id TEXT PRIMARY KEY,
            project_id TEXT NOT NULL,
            code TEXT NOT NULL,
            name TEXT NOT NULL,
            cipher TEXT,
            executor_email TEXT,
            status TEXT DEFAULT 'in_progress',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
            FOREIGN KEY (executor_email) REFERENCES users(email)
        )
    """)
    
    # Таблица изысканий
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS surveys (
            id TEXT PRIMARY KEY,
            project_id TEXT NOT NULL,
            type TEXT NOT NULL,
            name TEXT NOT NULL,
            executor_email TEXT,
            status TEXT DEFAULT 'in_progress',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
            FOREIGN KEY (executor_email) REFERENCES users(email)
        )
    """)
    
    # Таблица файлов
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id TEXT NOT NULL,
            section_id TEXT,
            survey_id TEXT,
            filename TEXT NOT NULL,
            original_name TEXT NOT NULL,
            uploaded_at TEXT DEFAULT CURRENT_TIMESTAMP,
            uploaded_by TEXT NOT NULL,
            checked INTEGER DEFAULT 0,
            errors_count INTEGER DEFAULT 0,
            errors_details TEXT DEFAULT '[]',
            FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
            FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE SET NULL,
            FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE SET NULL,
            FOREIGN KEY (uploaded_by) REFERENCES users(email)
        )
    """)
    
    # Таблица сообщений чата
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS chat_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id TEXT NOT NULL,
            section_id TEXT,
            survey_id TEXT,
            author_email TEXT NOT NULL,
            text TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
            FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE SET NULL,
            FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE SET NULL,
            FOREIGN KEY (author_email) REFERENCES users(email)
        )
    """)
    
    # Таблица задач
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id TEXT NOT NULL,
            section_id TEXT,
            survey_id TEXT,
            title TEXT NOT NULL,
            description TEXT,
            assigned_by TEXT NOT NULL,
            assigned_to TEXT NOT NULL,
            status TEXT DEFAULT 'open',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            deadline TEXT,
            FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
            FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE SET NULL,
            FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE SET NULL,
            FOREIGN KEY (assigned_by) REFERENCES users(email),
            FOREIGN KEY (assigned_to) REFERENCES users(email)
        )
    """)
    
    # Таблица истории изменений
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id TEXT NOT NULL,
            section_id TEXT,
            survey_id TEXT,
            user_email TEXT NOT NULL,
            action TEXT NOT NULL,
            field_name TEXT,
            old_value TEXT,
            new_value TEXT,
            details TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
            FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE SET NULL,
            FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE SET NULL,
            FOREIGN KEY (user_email) REFERENCES users(email)
        )
    """)
    
    # Таблица команды проекта (project_members)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS project_members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id TEXT NOT NULL,
            employee_email TEXT NOT NULL,
            role_in_project TEXT,
            added_by TEXT,
            added_at TEXT DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(project_id, employee_email),
            FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
            FOREIGN KEY (employee_email) REFERENCES users(email),
            FOREIGN KEY (added_by) REFERENCES users(email)
        )
    """)
    
    # Таблица наблюдателей раздела
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS section_observers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            section_id TEXT NOT NULL,
            observer_email TEXT NOT NULL,
            added_at TEXT DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(section_id, observer_email),
            FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
            FOREIGN KEY (observer_email) REFERENCES users(email)
        )
    """)
    
    # Таблица наблюдателей изыскания
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS survey_observers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            survey_id TEXT NOT NULL,
            observer_email TEXT NOT NULL,
            added_at TEXT DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(survey_id, observer_email),
            FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE,
            FOREIGN KEY (observer_email) REFERENCES users(email)
        )
    """)
    
    # Таблица справочника разделов
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS section_types (
            id TEXT PRIMARY KEY,
            code TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            color TEXT DEFAULT '#3b82f6',
            is_active INTEGER DEFAULT 1
        )
    """)
    
    # Таблица справочника изысканий
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS survey_types (
            id TEXT PRIMARY KEY,
            code TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            is_active INTEGER DEFAULT 1
        )
    """)
    
    conn.commit()
    conn.close()
    
    # Заполняем справочники по умолчанию
    _fill_dictionaries()
    
    print("✅ База данных инициализирована:", DB_PATH)


def _fill_dictionaries():
    """Заполнение справочников значениями по умолчанию"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Проверяем, есть ли уже записи
    cursor.execute("SELECT COUNT(*) FROM section_types")
    if cursor.fetchone()[0] == 0:
        # Справочник разделов
        section_types = [
            ("1", "АР", "Архитектурные решения", "#3b82f6"),
            ("2", "ГП", "Генеральный план", "#22c55e"),
            ("3", "КР", "Конструктивные решения", "#f59e0b"),
            ("4", "ОВ", "Отопление и вентиляция", "#8b5cf6"),
            ("5", "ВК", "Водоснабжение и канализация", "#06b6d4"),
            ("6", "ЭОМ", "Электроснабжение и электрооборудование", "#ec4899"),
            ("7", "ПОС", "Проект организации строительства", "#84cc16"),
            ("8", "ПБ", "Пожарная безопасность", "#ef4444"),
            ("9", "НВК", "Наружные сети водоснабжения и канализации", "#14b8a6"),
            ("10", "ТХ", "Технологические решения", "#f97316"),
        ]
        cursor.executemany(
            "INSERT INTO section_types (id, code, name, color) VALUES (?, ?, ?, ?)",
            section_types
        )
    
    cursor.execute("SELECT COUNT(*) FROM survey_types")
    if cursor.fetchone()[0] == 0:
        # Справочник изысканий
        survey_types = [
            ("1", "ИГД", "Инженерно-геодезические изыскания"),
            ("2", "ИГГ", "Инженерно-геологические изыскания"),
            ("3", "ИЭИ", "Инженерно-экологические изыскания"),
            ("4", "ИАДИ", "Инженерно-археологические изыскания"),
            ("5", "ИГМ", "Инженерно-гидрометеорологические изыскания"),
        ]
        cursor.executemany(
            "INSERT INTO survey_types (id, code, name) VALUES (?, ?, ?)",
            survey_types
        )
    
    conn.commit()
    conn.close()


# Helper-функции для работы с данными
def row_to_dict(row):
    """Преобразует sqlite3.Row в словарь"""
    if row is None:
        return None
    return dict(row)


def rows_to_list(rows):
    """Преобразует список sqlite3.Row в список словарей"""
    return [dict(row) for row in rows]


def generate_uuid():
    """Генерация UUID"""
    return str(uuid.uuid4())


def get_current_timestamp():
    """Получение текущей временной метки в ISO формате"""
    return datetime.now().isoformat()
