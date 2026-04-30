from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app import models
from app.database import get_db


router = APIRouter()


@router.get("/")
def dashboard(db: Session = Depends(get_db)):
    projects = db.query(func.count(models.Project.id)).scalar() or 0
    tasks = db.query(func.count(models.Task.id)).scalar() or 0
    return {"projects": projects, "tasks": tasks}

