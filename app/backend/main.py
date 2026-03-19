"""
FastAPI приложение - основные роуты API
"""
from fastapi import FastAPI, HTTPException, Depends, Header, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional, List
from pathlib import Path
import shutil
import json

from backend.database import init_db, FILES_DIR
from backend import crud, auth, schemas

# Создаём приложение
app = FastAPI(
    title="Project Bureau API",
    description="API для системы управления проектным бюро",
    version="1.0.0"
)

# CORS для локальной разработки
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Монтируем статику для отдачи файлов
app.mount("/files", StaticFiles(directory=str(FILES_DIR)), name="files")

# Монтируем статику для JS/CSS
STATIC_DIR = Path(__file__).parent.parent / "js"
if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")


# ==================== Зависимости ====================
async def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    """Получить текущего пользователя из токена"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Требуется авторизация")
    
    # Убираем "Bearer " если есть
    token = authorization.replace("Bearer ", "")
    user = auth.get_user_from_token(token)
    
    if not user:
        raise HTTPException(status_code=401, detail="Неверный токен")
    
    return user


# ==================== Инициализация ====================
@app.on_event("startup")
async def startup_event():
    """Инициализация БД при запуске"""
    init_db()
    print("🚀 Сервер запущен!")


# ==================== Авторизация ====================
@app.post("/api/auth/login", response_model=schemas.LoginResponse)
async def login(login_data: schemas.LoginRequest):
    """Вход по email"""
    result = auth.login(login_data.email)
    if not result:
        raise HTTPException(status_code=400, detail="Ошибка входа")
    return result


@app.post("/api/auth/logout")
async def logout():
    """Выход из системы"""
    return {"success": True}


@app.get("/api/user/profile")
async def get_profile(current_user: dict = Depends(get_current_user)):
    """Получить профиль текущего пользователя"""
    return current_user


# ==================== Проекты ====================
@app.get("/api/projects")
async def get_projects(current_user: dict = Depends(get_current_user)):
    """Получить список проектов"""
    projects = crud.get_all_projects()
    
    # Фильтрация по роли
    if current_user["role"] == "executor":
        projects = crud.get_projects_by_user(current_user["email"], current_user["role"])
    
    # Добавляем разделы и изыскания к каждому проекту
    projects_with_details = []
    for project in projects:
        project_detail = {
            **project,
            "sections": crud.get_sections_by_project(project["id"]),
            "surveys": crud.get_surveys_by_project(project["id"]),
            "members": [m["employee_email"] for m in crud.get_project_members(project["id"])]
        }
        projects_with_details.append(project_detail)
    
    return {"items": projects_with_details, "total": len(projects_with_details)}


@app.post("/api/projects")
async def create_project(project: schemas.ProjectCreate, current_user: dict = Depends(get_current_user)):
    """Создать проект"""
    # Проверка прав - только director или gip
    if current_user["role"] not in ["director", "gip"]:
        raise HTTPException(status_code=403, detail="Нет прав на создание проекта")
    
    new_project = crud.create_project(
        name=project.name,
        address=project.address,
        gip_email=project.gip_email or current_user["email"],
        director_email=project.director_email,
        status=project.status,
        settings=project.settings
    )
    
    # Добавляем ГИПа в команду проекта
    if new_project.get("gip_email"):
        crud.add_project_member(
            project_id=new_project["id"],
            employee_email=new_project["gip_email"],
            role_in_project="ГИП",
            added_by=current_user["email"]
        )
    
    # Запись в историю
    crud.create_history(
        project_id=new_project["id"],
        user_email=current_user["email"],
        action="project_created",
        details=f"Создан проект '{new_project['name']}'"
    )
    
    return new_project


@app.get("/api/projects/{project_id}")
async def get_project(project_id: str, current_user: dict = Depends(get_current_user)):
    """Получить детали проекта"""
    project = crud.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Проект не найден")
    
    # Получаем разделы и изыскания
    sections = crud.get_sections_by_project(project_id)
    surveys = crud.get_surveys_by_project(project_id)
    members = crud.get_project_members(project_id)
    
    return {
        **project,
        "sections": sections,
        "surveys": surveys,
        "members": [m["employee_email"] for m in members]
    }


@app.put("/api/projects/{project_id}")
async def update_project(project_id: str, project_data: schemas.ProjectUpdate, 
                         current_user: dict = Depends(get_current_user)):
    """Обновить проект"""
    project = crud.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Проект не найден")
    
    # Проверка прав
    if current_user["role"] not in ["director", "gip"]:
        raise HTTPException(status_code=403, detail="Нет прав на редактирование проекта")
    
    update_data = {k: v for k, v in project_data.model_dump().items() if v is not None}
    updated = crud.update_project(project_id, **update_data)
    
    # Запись в историю
    crud.create_history(
        project_id=project_id,
        user_email=current_user["email"],
        action="project_updated",
        details=f"Обновлены данные проекта"
    )
    
    return updated


@app.delete("/api/projects/{project_id}")
async def delete_project(project_id: str, current_user: dict = Depends(get_current_user)):
    """Удалить проект"""
    if current_user["role"] != "director":
        raise HTTPException(status_code=403, detail="Только директор может удалять проекты")
    
    success = crud.delete_project(project_id)
    return {"success": success}


# ==================== Разделы ====================
@app.post("/api/projects/{project_id}/sections")
async def create_section(project_id: str, section: schemas.SectionCreate, 
                         current_user: dict = Depends(get_current_user)):
    """Создать раздел в проекте"""
    project = crud.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Проект не найден")
    
    new_section = crud.create_section(
        project_id=project_id,
        code=section.code,
        name=section.name,
        cipher=section.cipher,
        executor_email=section.executor_email,
        status=section.status
    )
    
    # Добавляем исполнителя в команду проекта
    if section.executor_email:
        crud.add_project_member(
            project_id=project_id,
            employee_email=section.executor_email,
            role_in_project=f"Исполнитель {section.code}",
            added_by=current_user["email"]
        )
    
    # Запись в историю
    crud.create_history(
        project_id=project_id,
        section_id=new_section["id"],
        user_email=current_user["email"],
        action="section_created",
        details=f"Создан раздел {section.code}"
    )
    
    return new_section


@app.get("/api/sections/{section_id}")
async def get_section(section_id: str, current_user: dict = Depends(get_current_user)):
    """Получить детали раздела"""
    section = crud.get_section(section_id)
    if not section:
        raise HTTPException(status_code=404, detail="Раздел не найден")
    
    # Получаем связанные данные
    files = crud.get_files_by_section(section_id)
    messages = crud.get_chat_messages(section["project_id"], section_id=section_id)
    tasks = crud.get_tasks_by_project(section["project_id"])
    tasks = [t for t in tasks if t.get("section_id") == section_id]
    observers = crud.get_section_observers(section_id)
    
    return {
        **section,
        "files": files,
        "messages": messages,
        "tasks": tasks,
        "observers": observers
    }


@app.put("/api/sections/{section_id}")
async def update_section(section_id: str, section_data: schemas.SectionUpdate,
                         current_user: dict = Depends(get_current_user)):
    """Обновить раздел"""
    section = crud.get_section(section_id)
    if not section:
        raise HTTPException(status_code=404, detail="Раздел не найден")
    
    update_data = {k: v for k, v in section_data.model_dump().items() if v is not None}
    updated = crud.update_section(section_id, **update_data)
    
    return updated


@app.delete("/api/sections/{section_id}")
async def delete_section(section_id: str, current_user: dict = Depends(get_current_user)):
    """Удалить раздел"""
    if current_user["role"] != "director":
        raise HTTPException(status_code=403, detail="Только директор может удалять разделы")
    
    success = crud.delete_section(section_id)
    return {"success": success}


@app.post("/api/sections/{section_id}/observers/{observer_email}")
async def add_observer(section_id: str, observer_email: str, 
                       current_user: dict = Depends(get_current_user)):
    """Добавить наблюдателя раздела"""
    success = crud.add_section_observer(section_id, observer_email)
    return {"success": success}


@app.delete("/api/sections/{section_id}/observers/{observer_email}")
async def remove_observer(section_id: str, observer_email: str,
                          current_user: dict = Depends(get_current_user)):
    """Удалить наблюдателя раздела"""
    success = crud.remove_section_observer(section_id, observer_email)
    return {"success": success}


# ==================== Изыскания ====================
@app.post("/api/projects/{project_id}/surveys")
async def create_survey(project_id: str, survey: schemas.SurveyCreate,
                        current_user: dict = Depends(get_current_user)):
    """Создать изыскание в проекте"""
    project = crud.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Проект не найден")
    
    new_survey = crud.create_survey(
        project_id=project_id,
        type=survey.type,
        name=survey.name,
        executor_email=survey.executor_email,
        status=survey.status
    )
    
    # Добавляем исполнителя в команду проекта
    if survey.executor_email:
        crud.add_project_member(
            project_id=project_id,
            employee_email=survey.executor_email,
            role_in_project=f"Исполнитель {survey.type}",
            added_by=current_user["email"]
        )
    
    return new_survey


@app.get("/api/surveys/{survey_id}")
async def get_survey(survey_id: str, current_user: dict = Depends(get_current_user)):
    """Получить детали изыскания"""
    survey = crud.get_survey(survey_id)
    if not survey:
        raise HTTPException(status_code=404, detail="Изыскание не найдено")
    
    files = crud.get_files_by_survey(survey_id)
    messages = crud.get_chat_messages(survey["project_id"], survey_id=survey_id)
    observers = crud.get_survey_observers(survey_id)
    
    return {
        **survey,
        "files": files,
        "messages": messages,
        "observers": observers
    }


@app.put("/api/surveys/{survey_id}")
async def update_survey(survey_id: str, survey_data: schemas.SurveyUpdate,
                        current_user: dict = Depends(get_current_user)):
    """Обновить изыскание"""
    survey = crud.get_survey(survey_id)
    if not survey:
        raise HTTPException(status_code=404, detail="Изыскание не найдено")
    
    update_data = {k: v for k, v in survey_data.model_dump().items() if v is not None}
    updated = crud.update_survey(survey_id, **update_data)
    
    return updated


@app.delete("/api/surveys/{survey_id}")
async def delete_survey(survey_id: str, current_user: dict = Depends(get_current_user)):
    """Удалить изыскание"""
    if current_user["role"] != "director":
        raise HTTPException(status_code=403, detail="Только директор может удалять изыскания")
    
    success = crud.delete_survey(survey_id)
    return {"success": success}


@app.post("/api/surveys/{survey_id}/observers/{observer_email}")
async def add_survey_observer(survey_id: str, observer_email: str,
                               current_user: dict = Depends(get_current_user)):
    """Добавить наблюдателя изыскания"""
    success = crud.add_survey_observer(survey_id, observer_email)
    return {"success": success}


@app.delete("/api/surveys/{survey_id}/observers/{observer_email}")
async def remove_survey_observer(survey_id: str, observer_email: str,
                                  current_user: dict = Depends(get_current_user)):
    """Удалить наблюдателя изыскания"""
    success = crud.remove_survey_observer(survey_id, observer_email)
    return {"success": success}


# ==================== Файлы ====================
@app.post("/api/upload")
async def upload_file(
    project_id: str = Form(...),
    section_id: Optional[str] = Form(None),
    survey_id: Optional[str] = Form(None),
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Загрузить файл"""
    # Создаём папку для проекта
    project_dir = FILES_DIR / project_id
    project_dir.mkdir(exist_ok=True)
    
    # Если есть раздел или изыскание - создаём подпапку
    entity_id = section_id or survey_id
    if entity_id:
        entity_dir = project_dir / entity_id
        entity_dir.mkdir(exist_ok=True)
    else:
        entity_dir = project_dir
    
    # Сохраняем файл с уникальным именем
    import uuid
    file_ext = Path(file.filename).suffix
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = entity_dir / unique_filename
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Создаём запись в БД
    db_file = crud.create_file(
        project_id=project_id,
        filename=unique_filename,
        original_name=file.filename,
        uploaded_by=current_user["email"],
        section_id=section_id,
        survey_id=survey_id
    )
    
    # Запись в историю
    crud.create_history(
        project_id=project_id,
        section_id=section_id,
        survey_id=survey_id,
        user_email=current_user["email"],
        action="file_uploaded",
        details=f"Загружен файл {file.filename}"
    )
    
    return db_file


@app.get("/api/files/{file_id}")
async def get_file(file_id: int, current_user: dict = Depends(get_current_user)):
    """Получить информацию о файле"""
    file = crud.get_file(file_id)
    if not file:
        raise HTTPException(status_code=404, detail="Файл не найден")
    return file


@app.delete("/api/files/{file_id}")
async def delete_file(file_id: int, current_user: dict = Depends(get_current_user)):
    """Удалить файл"""
    file = crud.get_file(file_id)
    if not file:
        raise HTTPException(status_code=404, detail="Файл не найден")
    
    # Удаляем физический файл
    file_path = FILES_DIR / file["project_id"] / (file["section_id"] or "") / file["filename"]
    if file_path.exists():
        file_path.unlink()
    
    # Удаляем запись из БД
    success = crud.delete_file(file_id)
    return {"success": success}


@app.get("/api/files/{file_id}/download")
async def download_file(file_id: int):
    """Скачать файл"""
    file = crud.get_file(file_id)
    if not file:
        raise HTTPException(status_code=404, detail="Файл не найден")
    
    file_path = FILES_DIR / file["project_id"] / (file["section_id"] or "") / file["filename"]
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Файл не найден на диске")
    
    return FileResponse(
        file_path,
        media_type="application/octet-stream",
        filename=file["original_name"]
    )


# ==================== Чат ====================
@app.post("/api/chat")
async def create_message(message: schemas.ChatMessageCreate,
                         current_user: dict = Depends(get_current_user)):
    """Отправить сообщение в чат"""
    new_message = crud.create_chat_message(
        project_id=message.project_id,
        section_id=message.section_id,
        survey_id=message.survey_id,
        author_email=current_user["email"],
        text=message.text
    )
    
    # Запись в историю
    crud.create_history(
        project_id=message.project_id,
        section_id=message.section_id,
        survey_id=message.survey_id,
        user_email=current_user["email"],
        action="chat_message",
        details=f"Сообщение в чат"
    )
    
    return new_message


@app.get("/api/projects/{project_id}/chat")
async def get_project_chat(project_id: str, current_user: dict = Depends(get_current_user)):
    """Получить чат проекта"""
    messages = crud.get_chat_messages(project_id)
    return {"items": messages}


@app.get("/api/sections/{section_id}/chat")
async def get_section_chat(section_id: str, current_user: dict = Depends(get_current_user)):
    """Получить чат раздела"""
    section = crud.get_section(section_id)
    if not section:
        raise HTTPException(status_code=404, detail="Раздел не найден")
    
    messages = crud.get_chat_messages(section["project_id"], section_id=section_id)
    return {"items": messages}


# ==================== Задачи ====================
@app.post("/api/tasks")
async def create_task(task: schemas.TaskCreate,
                      current_user: dict = Depends(get_current_user)):
    """Создать задачу"""
    new_task = crud.create_task(
        project_id=task.project_id,
        section_id=task.section_id,
        survey_id=task.survey_id,
        title=task.title,
        description=task.description,
        assigned_by=current_user["email"],
        assigned_to=task.assigned_to,
        status=task.status,
        deadline=task.deadline
    )
    
    # Запись в историю
    crud.create_history(
        project_id=task.project_id,
        section_id=task.section_id,
        survey_id=task.survey_id,
        user_email=current_user["email"],
        action="task_created",
        details=f"Создана задача: {task.title}"
    )
    
    return new_task


@app.get("/api/tasks")
async def get_tasks(project_id: Optional[str] = None, 
                    current_user: dict = Depends(get_current_user)):
    """Получить задачи"""
    if project_id:
        tasks = crud.get_tasks_by_project(project_id)
    else:
        tasks = crud.get_tasks_by_user(current_user["email"])
    
    return {"items": tasks, "total": len(tasks)}


@app.put("/api/tasks/{task_id}")
async def update_task(task_id: int, task_data: schemas.TaskUpdate,
                      current_user: dict = Depends(get_current_user)):
    """Обновить задачу"""
    task = crud.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Задача не найдена")
    
    update_data = {k: v for k, v in task_data.model_dump().items() if v is not None}
    updated = crud.update_task(task_id, **update_data)
    
    return updated


@app.delete("/api/tasks/{task_id}")
async def delete_task(task_id: int, current_user: dict = Depends(get_current_user)):
    """Удалить задачу"""
    success = crud.delete_task(task_id)
    return {"success": success}


# ==================== История ====================
@app.get("/api/projects/{project_id}/history")
async def get_project_history(project_id: str, current_user: dict = Depends(get_current_user)):
    """Получить историю проекта"""
    history = crud.get_history_by_project(project_id)
    return {"items": history}


@app.get("/api/sections/{section_id}/history")
async def get_section_history(section_id: str, current_user: dict = Depends(get_current_user)):
    """Получить историю раздела"""
    section = crud.get_section(section_id)
    if not section:
        raise HTTPException(status_code=404, detail="Раздел не найден")
    
    history = crud.get_history_by_project(section["project_id"], section_id=section_id)
    return {"items": history}


# ==================== Дашборд ====================
@app.get("/api/dashboard/stats")
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    """Получить статистику для дашборда"""
    projects = crud.get_all_projects()
    all_tasks = []
    
    # Считаем статистику
    stats = {
        "projects": {
            "total": len(projects),
            "active": len([p for p in projects if p.get("status") == "active"]),
            "expertise": len([p for p in projects if p.get("status") == "expertise"]),
            "completed": len([p for p in projects if p.get("status") == "completed"])
        },
        "sections": {
            "total": 0,
            "in_progress": 0
        },
        "tasks": {
            "total": 0,
            "open": 0,
            "overdue": 0
        }
    }
    
    # Считаем разделы
    for project in projects:
        sections = crud.get_sections_by_project(project["id"])
        stats["sections"]["total"] += len(sections)
        stats["sections"]["in_progress"] += len([s for s in sections if s.get("status") == "in_progress"])
    
    # Задачи пользователя
    if current_user["role"] in ["director", "gip"]:
        for project in projects:
            all_tasks.extend(crud.get_tasks_by_project(project["id"]))
    else:
        all_tasks = crud.get_tasks_by_user(current_user["email"])
    
    stats["tasks"]["total"] = len(all_tasks)
    stats["tasks"]["open"] = len([t for t in all_tasks if t.get("status") == "open"])
    
    return stats


# ==================== Сотрудники ====================
@app.get("/api/employees")
async def get_employees(current_user: dict = Depends(get_current_user)):
    """Получить список сотрудников"""
    employees = crud.get_all_users()
    
    # Убираем password_hash
    for employee in employees:
        employee.pop('password_hash', None)
    
    return {"items": employees, "total": len(employees)}


# ==================== Справочники ====================
@app.get("/api/dictionaries/sections")
async def get_section_types():
    """Получить типы разделов"""
    return crud.get_section_types()


@app.get("/api/dictionaries/surveys")
async def get_survey_types():
    """Получить типы изысканий"""
    return crud.get_survey_types()


# ==================== Инициализация тестовых данных ====================
@app.get("/api/init-test-data")
async def init_test_data():
    """Создать тестовые данные"""
    from backend.test_data import create_test_data
    create_test_data()
    return {"success": True, "message": "Тестовые данные созданы"}


# ==================== Отдача HTML страниц ====================
@app.get("/")
async def root():
    """Главная страница - редирект на дашборд"""
    return FileResponse(Path(__file__).parent.parent / "pages" / "02-dashboard.html")


@app.get("/{path:path}")
async def serve_frontend(path: str):
    """Отдавать HTML файлы фронтенда"""
    # Маппинг путей к файлам
    file_mapping = {
        "": "02-dashboard.html",
        "login": "01-login.html",
        "dashboard": "02-dashboard.html",
        "projects": "03-projects-list.html",
        "project": "04-project-detail.html",
        "project-create": "05-project-create.html",
        "section": "06-section-detail.html",
        "tasks": "07-tasks-list.html",
        "task-create": "08-task-create.html",
        "employees": "09-employees-list.html",
        "employee-create": "10-employee-create.html",
        "notifications": "11-notifications.html",
        "settings": "13-settings.html",
    }
    
    # Определяем имя файла
    filename = file_mapping.get(path.split("/")[0], path)
    if not filename.endswith(".html"):
        filename += ".html"
    
    file_path = Path(__file__).parent.parent / "pages" / filename
    
    if file_path.exists():
        return FileResponse(file_path)
    
    raise HTTPException(status_code=404, detail="Страница не найдена")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
