"""
Pydantic схемы для валидации данных
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ==================== Пользователи ====================
class UserBase(BaseModel):
    email: str
    name: str
    role: str  # director, gip, executor, observer


class UserCreate(UserBase):
    password: Optional[str] = None


class User(UserBase):
    created_at: Optional[str] = None
    password_hash: Optional[str] = None


# ==================== Проекты ====================
class ProjectBase(BaseModel):
    name: str
    address: Optional[str] = None
    gip_email: Optional[str] = None
    director_email: Optional[str] = None
    status: str = "active"
    settings: dict = {}


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    gip_email: Optional[str] = None
    director_email: Optional[str] = None
    status: Optional[str] = None
    settings: Optional[dict] = None


class Project(ProjectBase):
    id: str
    created_at: str


class ProjectWithDetails(Project):
    sections: List["Section"] = []
    surveys: List["Survey"] = []
    members: List[str] = []  # emails участников команды


# ==================== Разделы ====================
class SectionBase(BaseModel):
    code: str
    name: str
    cipher: Optional[str] = None
    executor_email: Optional[str] = None
    status: str = "in_progress"


class SectionCreate(SectionBase):
    project_id: str


class SectionUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    cipher: Optional[str] = None
    executor_email: Optional[str] = None
    status: Optional[str] = None


class Section(SectionBase):
    id: str
    project_id: str
    created_at: str


class SectionWithDetails(Section):
    files: List["File"] = []
    messages: List["ChatMessage"] = []
    tasks: List["Task"] = []
    observers: List[str] = []  # emails наблюдателей


# ==================== Изыскания ====================
class SurveyBase(BaseModel):
    type: str  # geology, geodesy, archaeology, ecology, hydrology
    name: str
    executor_email: Optional[str] = None
    status: str = "in_progress"


class SurveyCreate(SurveyBase):
    project_id: str


class SurveyUpdate(BaseModel):
    type: Optional[str] = None
    name: Optional[str] = None
    executor_email: Optional[str] = None
    status: Optional[str] = None


class Survey(SurveyBase):
    id: str
    project_id: str
    created_at: str


class SurveyWithDetails(Survey):
    files: List["File"] = []
    messages: List["ChatMessage"] = []
    observers: List[str] = []  # emails наблюдателей


# ==================== Файлы ====================
class FileBase(BaseModel):
    filename: str
    original_name: str


class FileUpload(BaseModel):
    project_id: str
    section_id: Optional[str] = None
    survey_id: Optional[str] = None


class File(FileBase):
    id: int
    project_id: str
    section_id: Optional[str] = None
    survey_id: Optional[str] = None
    uploaded_at: str
    uploaded_by: str
    checked: bool = False
    errors_count: int = 0
    errors_details: str = "[]"


# ==================== Чат ====================
class ChatMessageBase(BaseModel):
    text: str


class ChatMessageCreate(ChatMessageBase):
    project_id: str
    section_id: Optional[str] = None
    survey_id: Optional[str] = None
    author_email: str


class ChatMessage(ChatMessageBase):
    id: int
    project_id: str
    section_id: Optional[str] = None
    survey_id: Optional[str] = None
    author_email: str
    created_at: str
    author_name: Optional[str] = None


# ==================== Задачи ====================
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    assigned_to: str
    status: str = "open"
    deadline: Optional[str] = None


class TaskCreate(TaskBase):
    project_id: str
    section_id: Optional[str] = None
    survey_id: Optional[str] = None
    assigned_by: str


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    assigned_to: Optional[str] = None
    status: Optional[str] = None
    deadline: Optional[str] = None


class Task(TaskBase):
    id: int
    project_id: str
    section_id: Optional[str] = None
    survey_id: Optional[str] = None
    assigned_by: str
    created_at: str


# ==================== История ====================
class HistoryBase(BaseModel):
    action: str
    field_name: Optional[str] = None
    old_value: Optional[str] = None
    new_value: Optional[str] = None
    details: Optional[str] = None


class HistoryCreate(HistoryBase):
    project_id: str
    section_id: Optional[str] = None
    survey_id: Optional[str] = None
    user_email: str


class History(HistoryBase):
    id: int
    project_id: str
    section_id: Optional[str] = None
    survey_id: Optional[str] = None
    user_email: str
    created_at: str


# ==================== Справочники ====================
class SectionType(BaseModel):
    id: str
    code: str
    name: str
    color: str
    is_active: bool = True


class SurveyType(BaseModel):
    id: str
    code: str
    name: str
    is_active: bool = True


# ==================== Авторизация ====================
class LoginRequest(BaseModel):
    email: str


class LoginResponse(BaseModel):
    token: str
    user: User


# ==================== Статистика ====================
class DashboardStats(BaseModel):
    projects_total: int = 0
    projects_active: int = 0
    projects_expertise: int = 0
    projects_completed: int = 0
    sections_total: int = 0
    sections_in_progress: int = 0
    tasks_total: int = 0
    tasks_open: int = 0
    tasks_overdue: int = 0


# Обновляем forward references
ProjectWithDetails.update_forward_refs()
SectionWithDetails.update_forward_refs()
SurveyWithDetails.update_forward_refs()
