import json
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import Experience
from app.schemas.schemas import ExperienceResponse

router = APIRouter()

def format_exp(e: Experience) -> dict:
    return {
        "id": e.id,
        "company": e.company,
        "role": e.role,
        "period": e.period,
        "location": e.location,
        "is_current": bool(e.is_current),
        "responsibilities": json.loads(e.responsibilities) if e.responsibilities else [],
        "achievements": json.loads(e.achievements) if e.achievements else [],
        "tech_stack": json.loads(e.tech_stack) if e.tech_stack else [],
        "order_index": e.order_index,
    }

@router.get("/", response_model=List[ExperienceResponse])
def get_experiences(db: Session = Depends(get_db)):
    exps = db.query(Experience).order_by(Experience.order_index.asc()).all()
    return [format_exp(e) for e in exps]
