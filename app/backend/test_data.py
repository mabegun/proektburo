"""
Создание тестовых данных для демонстрации системы
"""
from backend.database import init_db, get_db_connection, generate_uuid
from backend import crud


def create_test_data():
    """Создать тестовые данные"""
    print("🔄 Создание тестовых данных...")
    
    # Инициализируем БД
    init_db()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Проверяем, есть ли уже пользователи
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] > 0:
        print("⚠️ База данных уже содержит данные. Очистите перед повторным запуском.")
        conn.close()
        return
    
    # ==================== 1. Пользователи ====================
    print("📝 Создание пользователей...")
    
    users = [
        ("director@bureau.ru", "Директоров Директор Д.", "director"),
        ("gip-ivanov@bureau.ru", "Иванов Иван И.", "gip"),
        ("executor-petrov@bureau.ru", "Петров Петр П.", "executor"),
        ("executor-sidorov@bureau.ru", "Сидоров Сидор С.", "executor"),
        ("observer-kuznetsov@bureau.ru", "Кузнецов Кузьма К.", "observer"),
    ]
    
    for email, name, role in users:
        crud.create_user(email=email, name=name, role=role)
        print(f"  ✓ {email} ({role})")
    
    # ==================== 2. Проект 1 - Жилой дом на Ленина ====================
    print("\n📝 Создание проекта 1 - Жилой дом на Ленина...")
    
    project1 = crud.create_project(
        name="Жилой дом на Ленина",
        address="г. Москва, ул. Ленина, д. 5",
        gip_email="gip-ivanov@bureau.ru",
        director_email="director@bureau.ru",
        status="active"
    )
    print(f"  ✓ Проект создан: {project1['id']}")
    
    # Добавляем ГИПа в команду
    crud.add_project_member(project1["id"], "gip-ivanov@bureau.ru", "ГИП", "director@bureau.ru")
    
    # Раздел АР
    section_ar = crud.create_section(
        project_id=project1["id"],
        code="АР",
        name="Архитектурные решения",
        cipher="АР.12.34",
        executor_email="executor-petrov@bureau.ru",
        status="in_progress"
    )
    print(f"  ✓ Раздел АР создан")
    
    # Добавляем Петрова в команду
    crud.add_project_member(project1["id"], "executor-petrov@bureau.ru", "Архитектор АР", "gip-ivanov@bureau.ru")
    
    # Раздел КР
    section_kr = crud.create_section(
        project_id=project1["id"],
        code="КР",
        name="Конструктивные решения",
        cipher="КР.05.02",
        executor_email="executor-sidorov@bureau.ru",
        status="checking"
    )
    print(f"  ✓ Раздел КР создан")
    
    # Добавляем Сидорова в команду
    crud.add_project_member(project1["id"], "executor-sidorov@bureau.ru", "Конструктор КР", "gip-ivanov@bureau.ru")
    
    # Добавляем наблюдателя в раздел КР
    crud.add_section_observer(section_kr["id"], "observer-kuznetsov@bureau.ru")
    print(f"  ✓ Наблюдатель добавлен в раздел КР")
    
    # Изыскания - Геология
    survey_geo = crud.create_survey(
        project_id=project1["id"],
        type="geology",
        name="Инженерно-геологические изыскания",
        executor_email="executor-petrov@bureau.ru",
        status="in_progress"
    )
    print(f"  ✓ Изыскание Геология создано")
    
    # Изыскания - Геодезия
    survey_geo2 = crud.create_survey(
        project_id=project1["id"],
        type="geodesy",
        name="Инженерно-геодезические изыскания",
        executor_email="executor-sidorov@bureau.ru",
        status="done"
    )
    print(f"  ✓ Изыскание Геодезия создано")
    
    # Добавляем наблюдателя в изыскание
    crud.add_survey_observer(survey_geo["id"], "observer-kuznetsov@bureau.ru")
    
    # ==================== 3. Проект 2 - Офис на Пушкина ====================
    print("\n📝 Создание проекта 2 - Офис на Пушкина...")
    
    project2 = crud.create_project(
        name="Офис на Пушкина",
        address="г. Санкт-Петербург, ул. Пушкина, д. 10",
        gip_email="gip-ivanov@bureau.ru",
        director_email="director@bureau.ru",
        status="expertise"
    )
    print(f"  ✓ Проект создан: {project2['id']}")
    
    crud.add_project_member(project2["id"], "gip-ivanov@bureau.ru", "ГИП", "director@bureau.ru")
    
    # Раздел ОВ
    crud.create_section(
        project_id=project2["id"],
        code="ОВ",
        name="Отопление и вентиляция",
        cipher="ОВ.03.15",
        executor_email="executor-petrov@bureau.ru",
        status="in_progress"
    )
    print(f"  ✓ Раздел ОВ создан")
    
    # Раздел ВК
    crud.create_section(
        project_id=project2["id"],
        code="ВК",
        name="Водоснабжение и канализация",
        cipher="ВК.04.08",
        executor_email="executor-sidorov@bureau.ru",
        status="in_progress"
    )
    print(f"  ✓ Раздел ВК создан")
    
    # Раздел ЭО
    crud.create_section(
        project_id=project2["id"],
        code="ЭОМ",
        name="Электроснабжение и электрооборудование",
        cipher="ЭО.06.12",
        executor_email="executor-petrov@bureau.ru",
        status="correction"
    )
    print(f"  ✓ Раздел ЭОМ создан")
    
    # ==================== 4. Проект 3 - Склад в Казани ====================
    print("\n📝 Создание проекта 3 - Склад в Казани...")
    
    project3 = crud.create_project(
        name="Склад в Казани",
        address="г. Казань, ул. Промышленная, д. 1",
        gip_email="gip-ivanov@bureau.ru",
        director_email="director@bureau.ru",
        status="completed"
    )
    print(f"  ✓ Проект создан: {project3['id']}")
    
    crud.add_project_member(project3["id"], "gip-ivanov@bureau.ru", "ГИП", "director@bureau.ru")
    
    # ==================== 5. Чат сообщения ====================
    print("\n💬 Создание сообщений чата...")
    
    # Чат в проекте 1
    chat_messages = [
        (project1["id"], section_ar["id"], None, "gip-ivanov@bureau.ru", "Петров П.П., проверьте пожалуйста штамп на плане"),
        (project1["id"], section_ar["id"], None, "executor-petrov@bureau.ru", "Хорошо, исправлю до конца дня"),
        (project1["id"], section_ar["id"], None, "executor-petrov@bureau.ru", "Исправил, загрузил новую версию"),
    ]
    
    for proj_id, sec_id, surv_id, email, text in chat_messages:
        crud.create_chat_message(proj_id, email, text, sec_id, surv_id)
    print(f"  ✓ Создано {len(chat_messages)} сообщений")
    
    # ==================== 6. Задачи ====================
    print("\n📋 Создание задач...")
    
    task1 = crud.create_task(
        project_id=project1["id"],
        section_id=section_ar["id"],
        title="Исправить штамп на стр. 5",
        description="Неверно указан шифр раздела в штампе",
        assigned_by="gip-ivanov@bureau.ru",
        assigned_to="executor-petrov@bureau.ru",
        status="open",
        deadline="2026-03-25"
    )
    print(f"  ✓ Задача 1 создана")
    
    task2 = crud.create_task(
        project_id=project1["id"],
        section_id=section_kr["id"],
        title="Согласовать узлы с архитектором",
        description="Нужно проверить стыковку с разделом АР",
        assigned_by="gip-ivanov@bureau.ru",
        assigned_to="executor-sidorov@bureau.ru",
        status="in_progress",
        deadline="2026-03-20"
    )
    print(f"  ✓ Задача 2 создана")
    
    # ==================== 7. История изменений ====================
    print("\n📜 Создание истории изменений...")
    
    history_items = [
        (project1["id"], None, None, "director@bureau.ru", "project_created", None, None, None, "Создан проект 'Жилой дом на Ленина'"),
        (project1["id"], section_ar["id"], None, "gip-ivanov@bureau.ru", "section_created", None, None, None, "Создан раздел АР"),
        (project1["id"], section_kr["id"], None, "gip-ivanov@bureau.ru", "section_created", None, None, None, "Создан раздел КР"),
        (project1["id"], section_ar["id"], None, "executor-petrov@bureau.ru", "chat_message", None, None, None, "Сообщение в чат раздела АР"),
        (project1["id"], section_ar["id"], None, "gip-ivanov@bureau.ru", "task_created", None, None, None, "Создана задача: Исправить штамп на стр. 5"),
        (project1["id"], None, None, "gip-ivanov@bureau.ru", "member_added", None, None, None, "Добавлен наблюдатель Кузнецов К.К."),
    ]
    
    for proj_id, sec_id, surv_id, email, action, field, old, new, details in history_items:
        crud.create_history(proj_id, email, action, sec_id, surv_id, field, old, new, details)
    print(f"  ✓ Создано {len(history_items)} записей истории")
    
    conn.close()
    
    print("\n✅ Тестовые данные успешно созданы!")
    print("\n📧 Тестовые пользователи:")
    print("  director@bureau.ru - Директор (полный доступ)")
    print("  gip-ivanov@bureau.ru - ГИП (свои проекты)")
    print("  executor-petrov@bureau.ru - Исполнитель (раздел АР)")
    print("  executor-sidorov@bureau.ru - Исполнитель (раздел КР)")
    print("  observer-kuznetsov@bureau.ru - Наблюдатель (только чтение)")
    print("\n🏗️ Проекты:")
    print("  1. Жилой дом на Ленина (active) - 2 раздела, 2 изыскания")
    print("  2. Офис на Пушкина (expertise) - 3 раздела")
    print("  3. Склад в Казани (completed) - завершённый проект")


if __name__ == "__main__":
    create_test_data()
