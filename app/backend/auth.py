"""
Простая авторизация по email
Без пароля - для локальной разработки
"""
import secrets
from typing import Optional
from backend.database import get_db_connection
from backend import crud


def create_token(email: str) -> str:
    """Создать токен для пользователя"""
    # В простой версии токен = email + случайная строка
    # В продакшене нужно использовать JWT
    random_part = secrets.token_hex(16)
    return f"{email}:{random_part}"


def verify_token(token: str) -> Optional[str]:
    """Проверить токен и вернуть email"""
    try:
        # Формат: email:random_part
        parts = token.split(":")
        if len(parts) != 2:
            return None
        
        email = parts[0]
        # Проверяем существование пользователя
        user = crud.get_user(email)
        if user:
            return email
        return None
    except Exception:
        return None


def get_user_from_token(token: str) -> Optional[dict]:
    """Получить данные пользователя из токена"""
    email = verify_token(token)
    if email:
        return crud.get_user(email)
    return None


def login(email: str) -> Optional[dict]:
    """
    Вход пользователя по email.
    Если пользователь не существует - создаётся автоматически.
    """
    user = crud.get_user(email)
    
    if not user:
        # Автоматическое создание пользователя при первом входе
        # Определяем роль по домену email
        role = "executor"
        name = email.split("@")[0]
        
        if "director" in email or "direktor" in email:
            role = "director"
            name = "Директор"
        elif "gip" in email:
            role = "gip"
            # Извлекаем имя из email типа gip-ivanov@...
            name_part = email.split("@")[0].replace("gip-", "")
            name = name_part.replace("-", " ").title()
        
        user = crud.create_user(email=email, name=name, role=role)
    
    token = create_token(email)
    return {
        "token": token,
        "user": {
            "email": user["email"],
            "name": user["name"],
            "role": user["role"]
        }
    }


def logout(token: str) -> bool:
    """Выход пользователя (в простой версии ничего не делает)"""
    return True
