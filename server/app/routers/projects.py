from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Project, ProjectMember
from ..schemas import ProjectCreate, AddMember

router = APIRouter(prefix="/projects", tags=["projects"])

@router.post("/")
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    new_project = Project(name=project.name, creator_id=1)  # replace 1 with current user later
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    member = ProjectMember(project_id=new_project.id, user_id=new_project.creator_id, role="admin")
    db.add(member)
    db.commit()
    return new_project

@router.get("/")
def get_projects(db: Session = Depends(get_db)):
    return db.query(Project).all()

@router.post("/{project_id}/members")
def add_member(project_id: int, member: AddMember, db: Session = Depends(get_db)):
    new_member = ProjectMember(project_id=project_id, user_id=member.user_id, role=member.role)
    db.add(new_member)
    db.commit()
    return {"message": "Member added"}