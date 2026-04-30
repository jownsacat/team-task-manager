from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Task
from datetime import datetime

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/")
def get_stats(db: Session = Depends(get_db)):
    total = db.query(Task).count()
    todo = db.query(Task).filter(Task.status == "todo").count()
    in_progress = db.query(Task).filter(Task.status == "in_progress").count()
    done = db.query(Task).filter(Task.status == "done").count()
    overdue = db.query(Task).filter(Task.due_date < datetime.utcnow(), Task.status != "done").count()
    return {
        "total": total,
        "todo": todo,
        "in_progress": in_progress,
        "done": done,
        "overdue": overdue
    }