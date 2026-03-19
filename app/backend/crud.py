"""
CRUD операции для работы с базой данных
"""
from backend.database import (
    get_db_connection, row_to_dict, rows_to_list, 
    generate_uuid, get_current_timestamp
)
from typing import List, Optional, Dict, Any


# ==================== Пользователи ====================
def get_user(email: str) -> Optional[Dict]:
    """Получить пользователя по email"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    result = row_to_dict(cursor.fetchone())
    conn.close()
    return result


def get_all_users() -> List[Dict]:
    """Получить всех пользователей"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users ORDER BY name")
    result = rows_to_list(cursor.fetchall())
    conn.close()
    return result


def create_user(email: str, name: str, role: str, password_hash: Optional[str] = None) -> Dict:
    """Создать пользователя"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO users (email, name, role, password_hash) VALUES (?, ?, ?, ?)",
        (email, name, role, password_hash)
    )
    conn.commit()
    result = get_user(email)
    conn.close()
    return result


def update_user(email: str, **kwargs) -> Optional[Dict]:
    """Обновить данные пользователя"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    fields = []
    values = []
    for key, value in kwargs.items():
        if key in ['name', 'role', 'password_hash']:
            fields.append(f"{key} = ?")
            values.append(value)
    
    if fields:
        values.append(email)
        cursor.execute(f"UPDATE users SET {', '.join(fields)} WHERE email = ?", values)
        conn.commit()
    
    result = get_user(email)
    conn.close()
    return result


# ==================== Проекты ====================
def get_project(project_id: str) -> Optional[Dict]:
    """Получить проект по ID"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM projects WHERE id = ?", (project_id,))
    result = row_to_dict(cursor.fetchone())
    conn.close()
    return result


def get_all_projects() -> List[Dict]:
    """Получить все проекты"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT p.*, 
               (SELECT COUNT(*) FROM sections WHERE project_id = p.id) as sections_count,
               (SELECT COUNT(*) FROM surveys WHERE project_id = p.id) as surveys_count
        FROM projects p 
        ORDER BY p.created_at DESC
    """)
    result = rows_to_list(cursor.fetchall())
    conn.close()
    return result


def get_projects_by_user(email: str, role: str) -> List[Dict]:
    """Получить проекты пользователя по роли"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if role == 'director':
        cursor.execute("SELECT * FROM projects ORDER BY created_at DESC")
    elif role == 'gip':
        cursor.execute("SELECT * FROM projects WHERE gip_email = ? ORDER BY created_at DESC", (email,))
    else:
        # Executor - проекты где он исполнитель в разделах или изысканиях
        cursor.execute("""
            SELECT DISTINCT p.* FROM projects p
            LEFT JOIN sections s ON p.id = s.project_id AND s.executor_email = ?
            LEFT JOIN surveys sv ON p.id = sv.project_id AND sv.executor_email = ?
            WHERE s.id IS NOT NULL OR sv.id IS NOT NULL
            ORDER BY p.created_at DESC
        """, (email, email))
    
    result = rows_to_list(cursor.fetchall())
    conn.close()
    return result


def create_project(name: str, address: Optional[str] = None, 
                   gip_email: Optional[str] = None, 
                   director_email: Optional[str] = None,
                   status: str = "active",
                   settings: Dict = None) -> Dict:
    """Создать проект"""
    project_id = generate_uuid()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO projects (id, name, address, gip_email, director_email, status, settings) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (project_id, name, address, gip_email, director_email, status, 
         __import__('json').dumps(settings or {}))
    )
    conn.commit()
    result = get_project(project_id)
    conn.close()
    return result


def update_project(project_id: str, **kwargs) -> Optional[Dict]:
    """Обновить данные проекта"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    fields = []
    values = []
    for key, value in kwargs.items():
        if key in ['name', 'address', 'gip_email', 'director_email', 'status', 'settings']:
            fields.append(f"{key} = ?")
            if key == 'settings':
                value = __import__('json').dumps(value)
            values.append(value)
    
    if fields:
        values.append(project_id)
        cursor.execute(f"UPDATE projects SET {', '.join(fields)} WHERE id = ?", values)
        conn.commit()
    
    result = get_project(project_id)
    conn.close()
    return result


def delete_project(project_id: str) -> bool:
    """Удалить проект"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM projects WHERE id = ?", (project_id,))
    conn.commit()
    affected = cursor.rowcount
    conn.close()
    return affected > 0


# ==================== Разделы ====================
def get_section(section_id: str) -> Optional[Dict]:
    """Получить раздел по ID"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM sections WHERE id = ?", (section_id,))
    result = row_to_dict(cursor.fetchone())
    conn.close()
    return result


def get_sections_by_project(project_id: str) -> List[Dict]:
    """Получить все разделы проекта"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM sections WHERE project_id = ? ORDER BY code",
        (project_id,)
    )
    result = rows_to_list(cursor.fetchall())
    conn.close()
    return result


def create_section(project_id: str, code: str, name: str, 
                   cipher: Optional[str] = None,
                   executor_email: Optional[str] = None,
                   status: str = "in_progress") -> Dict:
    """Создать раздел"""
    section_id = generate_uuid()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO sections (id, project_id, code, name, cipher, executor_email, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (section_id, project_id, code, name, cipher, executor_email, status)
    )
    conn.commit()
    result = get_section(section_id)
    conn.close()
    return result


def update_section(section_id: str, **kwargs) -> Optional[Dict]:
    """Обновить данные раздела"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    fields = []
    values = []
    for key, value in kwargs.items():
        if key in ['code', 'name', 'cipher', 'executor_email', 'status']:
            fields.append(f"{key} = ?")
            values.append(value)
    
    if fields:
        values.append(section_id)
        cursor.execute(f"UPDATE sections SET {', '.join(fields)} WHERE id = ?", values)
        conn.commit()
    
    result = get_section(section_id)
    conn.close()
    return result


def delete_section(section_id: str) -> bool:
    """Удалить раздел"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM sections WHERE id = ?", (section_id,))
    conn.commit()
    affected = cursor.rowcount
    conn.close()
    return affected > 0


# ==================== Изыскания ====================
def get_survey(survey_id: str) -> Optional[Dict]:
    """Получить изыскание по ID"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM surveys WHERE id = ?", (survey_id,))
    result = row_to_dict(cursor.fetchone())
    conn.close()
    return result


def get_surveys_by_project(project_id: str) -> List[Dict]:
    """Получить все изыскания проекта"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM surveys WHERE project_id = ? ORDER BY type",
        (project_id,)
    )
    result = rows_to_list(cursor.fetchall())
    conn.close()
    return result


def create_survey(project_id: str, type: str, name: str,
                  executor_email: Optional[str] = None,
                  status: str = "in_progress") -> Dict:
    """Создать изыскание"""
    survey_id = generate_uuid()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO surveys (id, project_id, type, name, executor_email, status) VALUES (?, ?, ?, ?, ?, ?)",
        (survey_id, project_id, type, name, executor_email, status)
    )
    conn.commit()
    result = get_survey(survey_id)
    conn.close()
    return result


def update_survey(survey_id: str, **kwargs) -> Optional[Dict]:
    """Обновить данные изыскания"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    fields = []
    values = []
    for key, value in kwargs.items():
        if key in ['type', 'name', 'executor_email', 'status']:
            fields.append(f"{key} = ?")
            values.append(value)
    
    if fields:
        values.append(survey_id)
        cursor.execute(f"UPDATE surveys SET {', '.join(fields)} WHERE id = ?", values)
        conn.commit()
    
    result = get_survey(survey_id)
    conn.close()
    return result


def delete_survey(survey_id: str) -> bool:
    """Удалить изыскание"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM surveys WHERE id = ?", (survey_id,))
    conn.commit()
    affected = cursor.rowcount
    conn.close()
    return affected > 0


# ==================== Файлы ====================
def get_file(file_id: int) -> Optional[Dict]:
    """Получить файл по ID"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM files WHERE id = ?", (file_id,))
    result = row_to_dict(cursor.fetchone())
    conn.close()
    return result


def get_files_by_section(section_id: str) -> List[Dict]:
    """Получить файлы раздела"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM files WHERE section_id = ? ORDER BY uploaded_at DESC",
        (section_id,)
    )
    result = rows_to_list(cursor.fetchall())
    conn.close()
    return result


def get_files_by_survey(survey_id: str) -> List[Dict]:
    """Получить файлы изыскания"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM files WHERE survey_id = ? ORDER BY uploaded_at DESC",
        (survey_id,)
    )
    result = rows_to_list(cursor.fetchall())
    conn.close()
    return result


def get_files_by_project(project_id: str) -> List[Dict]:
    """Получить файлы проекта"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM files WHERE project_id = ? ORDER BY uploaded_at DESC",
        (project_id,)
    )
    result = rows_to_list(cursor.fetchall())
    conn.close()
    return result


def create_file(project_id: str, filename: str, original_name: str,
                uploaded_by: str, section_id: Optional[str] = None,
                survey_id: Optional[str] = None) -> Dict:
    """Создать запись файла"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """INSERT INTO files (project_id, section_id, survey_id, filename, original_name, uploaded_by) 
           VALUES (?, ?, ?, ?, ?, ?)""",
        (project_id, section_id, survey_id, filename, original_name, uploaded_by)
    )
    conn.commit()
    file_id = cursor.lastrowid
    result = get_file(file_id)
    conn.close()
    return result


def update_file(file_id: int, **kwargs) -> Optional[Dict]:
    """Обновить данные файла"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    fields = []
    values = []
    for key, value in kwargs.items():
        if key in ['checked', 'errors_count', 'errors_details']:
            fields.append(f"{key} = ?")
            if key == 'errors_details':
                value = __import__('json').dumps(value) if isinstance(value, list) else value
            values.append(value)
    
    if fields:
        values.append(file_id)
        cursor.execute(f"UPDATE files SET {', '.join(fields)} WHERE id = ?", values)
        conn.commit()
    
    result = get_file(file_id)
    conn.close()
    return result


def delete_file(file_id: int) -> bool:
    """Удалить файл"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM files WHERE id = ?", (file_id,))
    conn.commit()
    affected = cursor.rowcount
    conn.close()
    return affected > 0


# ==================== Чат ====================
def get_chat_messages(project_id: str, section_id: Optional[str] = None, 
                      survey_id: Optional[str] = None) -> List[Dict]:
    """Получить сообщения чата"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if section_id:
        cursor.execute("""
            SELECT cm.*, u.name as author_name 
            FROM chat_messages cm
            LEFT JOIN users u ON cm.author_email = u.email
            WHERE cm.project_id = ? AND cm.section_id = ?
            ORDER BY cm.created_at ASC
        """, (project_id, section_id))
    elif survey_id:
        cursor.execute("""
            SELECT cm.*, u.name as author_name 
            FROM chat_messages cm
            LEFT JOIN users u ON cm.author_email = u.email
            WHERE cm.project_id = ? AND cm.survey_id = ?
            ORDER BY cm.created_at ASC
        """, (project_id, survey_id))
    else:
        cursor.execute("""
            SELECT cm.*, u.name as author_name 
            FROM chat_messages cm
            LEFT JOIN users u ON cm.author_email = u.email
            WHERE cm.project_id = ?
            ORDER BY cm.created_at ASC
        """, (project_id,))
    
    result = rows_to_list(cursor.fetchall())
    conn.close()
    return result


def create_chat_message(project_id: str, author_email: str, text: str,
                        section_id: Optional[str] = None,
                        survey_id: Optional[str] = None) -> Dict:
    """Создать сообщение в чате"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """INSERT INTO chat_messages (project_id, section_id, survey_id, author_email, text) 
           VALUES (?, ?, ?, ?, ?)""",
        (project_id, section_id, survey_id, author_email, text)
    )
    conn.commit()
    message_id = cursor.lastrowid
    
    # Получаем сообщение с именем автора
    cursor.execute("""
        SELECT cm.*, u.name as author_name 
        FROM chat_messages cm
        LEFT JOIN users u ON cm.author_email = u.email
        WHERE cm.id = ?
    """, (message_id,))
    result = row_to_dict(cursor.fetchone())
    conn.commit()
    conn.close()
    return result


# ==================== Задачи ====================
def get_task(task_id: int) -> Optional[Dict]:
    """Получить задачу по ID"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
    result = row_to_dict(cursor.fetchone())
    conn.close()
    return result


def get_tasks_by_project(project_id: str) -> List[Dict]:
    """Получить задачи проекта"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM tasks WHERE project_id = ? ORDER BY created_at DESC",
        (project_id,)
    )
    result = rows_to_list(cursor.fetchall())
    conn.close()
    return result


def get_tasks_by_user(email: str) -> List[Dict]:
    """Получить задачи пользователя"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM tasks WHERE assigned_to = ? ORDER BY created_at DESC",
        (email,)
    )
    result = rows_to_list(cursor.fetchall())
    conn.close()
    return result


def create_task(project_id: str, title: str, assigned_by: str, assigned_to: str,
                description: Optional[str] = None, status: str = "open",
                deadline: Optional[str] = None, section_id: Optional[str] = None,
                survey_id: Optional[str] = None) -> Dict:
    """Создать задачу"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """INSERT INTO tasks (project_id, section_id, survey_id, title, description, 
           assigned_by, assigned_to, status, deadline) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (project_id, section_id, survey_id, title, description, 
         assigned_by, assigned_to, status, deadline)
    )
    conn.commit()
    task_id = cursor.lastrowid
    result = get_task(task_id)
    conn.close()
    return result


def update_task(task_id: int, **kwargs) -> Optional[Dict]:
    """Обновить задачу"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    fields = []
    values = []
    for key, value in kwargs.items():
        if key in ['title', 'description', 'assigned_to', 'status', 'deadline']:
            fields.append(f"{key} = ?")
            values.append(value)
    
    if fields:
        values.append(task_id)
        cursor.execute(f"UPDATE tasks SET {', '.join(fields)} WHERE id = ?", values)
        conn.commit()
    
    result = get_task(task_id)
    conn.close()
    return result


def delete_task(task_id: int) -> bool:
    """Удалить задачу"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    conn.commit()
    affected = cursor.rowcount
    conn.close()
    return affected > 0


# ==================== История ====================
def get_history_by_project(project_id: str, section_id: Optional[str] = None,
                           survey_id: Optional[str] = None) -> List[Dict]:
    """Получить историю изменений"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if section_id:
        cursor.execute("""
            SELECT h.*, u.name as user_name 
            FROM history h
            LEFT JOIN users u ON h.user_email = u.email
            WHERE h.project_id = ? AND h.section_id = ?
            ORDER BY h.created_at DESC
            LIMIT 50
        """, (project_id, section_id))
    elif survey_id:
        cursor.execute("""
            SELECT h.*, u.name as user_name 
            FROM history h
            LEFT JOIN users u ON h.user_email = u.email
            WHERE h.project_id = ? AND h.survey_id = ?
            ORDER BY h.created_at DESC
            LIMIT 50
        """, (project_id, survey_id))
    else:
        cursor.execute("""
            SELECT h.*, u.name as user_name 
            FROM history h
            LEFT JOIN users u ON h.user_email = u.email
            WHERE h.project_id = ?
            ORDER BY h.created_at DESC
            LIMIT 50
        """, (project_id,))
    
    result = rows_to_list(cursor.fetchall())
    conn.close()
    return result


def create_history(project_id: str, user_email: str, action: str,
                   section_id: Optional[str] = None,
                   survey_id: Optional[str] = None,
                   field_name: Optional[str] = None,
                   old_value: Optional[str] = None,
                   new_value: Optional[str] = None,
                   details: Optional[str] = None) -> Dict:
    """Создать запись в истории"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """INSERT INTO history (project_id, section_id, survey_id, user_email, action, 
           field_name, old_value, new_value, details) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (project_id, section_id, survey_id, user_email, action, 
         field_name, old_value, new_value, details)
    )
    conn.commit()
    history_id = cursor.lastrowid
    
    cursor.execute("SELECT * FROM history WHERE id = ?", (history_id,))
    result = row_to_dict(cursor.fetchone())
    conn.close()
    return result


# ==================== Команда проекта ====================
def get_project_members(project_id: str) -> List[Dict]:
    """Получить команду проекта"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT pm.*, u.name, u.role 
        FROM project_members pm
        LEFT JOIN users u ON pm.employee_email = u.email
        WHERE pm.project_id = ?
        ORDER BY pm.added_at DESC
    """, (project_id,))
    result = rows_to_list(cursor.fetchall())
    conn.close()
    return result


def add_project_member(project_id: str, employee_email: str, 
                       role_in_project: Optional[str] = None,
                       added_by: Optional[str] = None) -> bool:
    """Добавить участника в команду проекта"""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """INSERT INTO project_members (project_id, employee_email, role_in_project, added_by) 
               VALUES (?, ?, ?, ?)""",
            (project_id, employee_email, role_in_project, added_by)
        )
        conn.commit()
        result = True
    except sqlite3.IntegrityError:
        result = False  # Уже в команде
    conn.close()
    return result


def remove_project_member(project_id: str, employee_email: str) -> bool:
    """Удалить участника из команды проекта"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM project_members WHERE project_id = ? AND employee_email = ?",
        (project_id, employee_email)
    )
    conn.commit()
    affected = cursor.rowcount
    conn.close()
    return affected > 0


# ==================== Наблюдатели разделов ====================
def get_section_observers(section_id: str) -> List[str]:
    """Получить emails наблюдателей раздела"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT observer_email FROM section_observers WHERE section_id = ?",
        (section_id,)
    )
    result = [row['observer_email'] for row in cursor.fetchall()]
    conn.close()
    return result


def add_section_observer(section_id: str, observer_email: str) -> bool:
    """Добавить наблюдателя раздела"""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO section_observers (section_id, observer_email) VALUES (?, ?)",
            (section_id, observer_email)
        )
        conn.commit()
        result = True
    except sqlite3.IntegrityError:
        result = False
    conn.close()
    return result


def remove_section_observer(section_id: str, observer_email: str) -> bool:
    """Удалить наблюдателя раздела"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM section_observers WHERE section_id = ? AND observer_email = ?",
        (section_id, observer_email)
    )
    conn.commit()
    affected = cursor.rowcount
    conn.close()
    return affected > 0


# ==================== Наблюдатели изысканий ====================
def get_survey_observers(survey_id: str) -> List[str]:
    """Получить emails наблюдателей изыскания"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT observer_email FROM survey_observers WHERE survey_id = ?",
        (survey_id,)
    )
    result = [row['observer_email'] for row in cursor.fetchall()]
    conn.close()
    return result


def add_survey_observer(survey_id: str, observer_email: str) -> bool:
    """Добавить наблюдателя изыскания"""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO survey_observers (survey_id, observer_email) VALUES (?, ?)",
            (survey_id, observer_email)
        )
        conn.commit()
        result = True
    except sqlite3.IntegrityError:
        result = False
    conn.close()
    return result


def remove_survey_observer(survey_id: str, observer_email: str) -> bool:
    """Удалить наблюдателя изыскания"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM survey_observers WHERE survey_id = ? AND observer_email = ?",
        (survey_id, observer_email)
    )
    conn.commit()
    affected = cursor.rowcount
    conn.close()
    return affected > 0


# ==================== Справочники ====================
def get_section_types() -> List[Dict]:
    """Получить типы разделов"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM section_types WHERE is_active = 1 ORDER BY code")
    result = rows_to_list(cursor.fetchall())
    conn.close()
    return result


def get_survey_types() -> List[Dict]:
    """Получить типы изысканий"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM survey_types WHERE is_active = 1 ORDER BY code")
    result = rows_to_list(cursor.fetchall())
    conn.close()
    return result
