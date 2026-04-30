from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Auth
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Projects
class ProjectCreate(BaseModel):
    name: str

class AddMember(BaseModel):
    user_id: int
    role: str = "member"

# Tasks
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: Optional[str] = "medium"
    assigned_to: Optional[int] = None
    project_id: int

class TaskUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    assigned_to: Optional[int] = None