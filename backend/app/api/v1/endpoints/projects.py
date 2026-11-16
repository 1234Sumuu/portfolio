import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.core.database import get_db
from app.models.models import Project
from app.schemas.schemas import ProjectCreate, ProjectUpdate, ProjectResponse
from app.api.deps import get_current_admin

router = APIRouter()

def format_project(p: Project) -> dict:
    return {
        "id": p.id,
        "title": p.title,
        "slug": p.slug,
        "tagline": p.tagline,
        "category": p.category,
        "status": p.status,
        "role": p.role,
        "featured": bool(p.featured),
        "order_index": p.order_index,
        "thumbnail": p.thumbnail,
        "gallery": json.loads(p.gallery) if p.gallery else [],
        "summary": p.summary,
        "problem_statement": p.problem_statement,
        "solution_overview": p.solution_overview,
        "architecture_details": p.architecture_details,
        "architecture_diagram": p.architecture_diagram,
        "engineering_challenges": p.engineering_challenges,
        "key_features": json.loads(p.key_features) if p.key_features else [],
        "technologies": json.loads(p.technologies) if p.technologies else [],
        "measurable_outcomes": p.measurable_outcomes,
        "live_url": p.live_url,
        "github_url": p.github_url,
        "paper_url": p.paper_url,
        "created_at": p.created_at,
        "updated_at": p.updated_at,
    }

@router.get("/", response_model=List[ProjectResponse])
def get_projects(
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    featured: Optional[bool] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Project)
    if category and category != "All":
        query = query.filter(Project.category == category)
    if status and status != "All":
        query = query.filter(Project.status == status)
    if featured is not None:
        query = query.filter(Project.featured == featured)
    if search:
        s = f"%{search}%"
        query = query.filter(
            or_(
                Project.title.ilike(s),
                Project.summary.ilike(s),
                Project.technologies.ilike(s)
            )
        )
    
    projects = query.order_index_by(Project.order_index.asc(), Project.id.asc()) if hasattr(query, 'order_index_by') else query.order_by(Project.order_index.asc(), Project.id.asc()).all()
    return [format_project(p) for p in projects]

@router.get("/{slug_or_id}", response_model=ProjectResponse)
def get_project(slug_or_id: str, db: Session = Depends(get_db)):
    if slug_or_id.isdigit():
        p = db.query(Project).filter(Project.id == int(slug_or_id)).first()
    else:
        p = db.query(Project).filter(Project.slug == slug_or_id).first()
    
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    return format_project(p)

@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project_in: ProjectCreate,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin)
):
    existing = db.query(Project).filter(Project.slug == project_in.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")

    p = Project(
        title=project_in.title,
        slug=project_in.slug,
        tagline=project_in.tagline,
        category=project_in.category,
        status=project_in.status,
        role=project_in.role,
        featured=project_in.featured,
        order_index=project_in.order_index,
        thumbnail=project_in.thumbnail,
        gallery=json.dumps(project_in.gallery or []),
        summary=project_in.summary,
        problem_statement=project_in.problem_statement,
        solution_overview=project_in.solution_overview,
        architecture_details=project_in.architecture_details,
        architecture_diagram=project_in.architecture_diagram,
        engineering_challenges=project_in.engineering_challenges,
        key_features=json.dumps(project_in.key_features or []),
        technologies=json.dumps(project_in.technologies or []),
        measurable_outcomes=project_in.measurable_outcomes,
        live_url=project_in.live_url,
        github_url=project_in.github_url,
        paper_url=project_in.paper_url,
    )
    db.add(p)
    db.commit()
    db.refresh(p)
    return format_project(p)

@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    project_in: ProjectUpdate,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin)
):
    p = db.query(Project).filter(Project.id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")

    update_data = project_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        if field in ("gallery", "key_features", "technologies") and val is not None:
            setattr(p, field, json.dumps(val))
        else:
            setattr(p, field, val)
    
    db.commit()
    db.refresh(p)
    return format_project(p)

@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin)
):
    p = db.query(Project).filter(Project.id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(p)
    db.commit()
    return {"success": True, "message": "Project deleted successfully"}
