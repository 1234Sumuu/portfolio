from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import Certification
from app.schemas.schemas import CertificationResponse

router = APIRouter()

@router.get("/", response_model=List[CertificationResponse])
def get_certifications(db: Session = Depends(get_db)):
    certs = db.query(Certification).order_by(Certification.id.asc()).all()
    return certs
