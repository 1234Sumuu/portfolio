from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import Inquiry
from app.schemas.schemas import InquiryCreate, InquiryUpdateStatus, InquiryResponse
from app.api.deps import get_current_admin

router = APIRouter()

@router.post("/", response_model=InquiryResponse, status_code=status.HTTP_201_CREATED)
def submit_inquiry(inq_in: InquiryCreate, db: Session = Depends(get_db)):
    inquiry = Inquiry(
        name=inq_in.name,
        email=inq_in.email,
        organization=inq_in.organization,
        intent=inq_in.intent,
        subject=inq_in.subject,
        message=inq_in.message,
        status="new",
    )
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)
    return inquiry

@router.get("/", response_model=List[InquiryResponse])
def get_inquiries(
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin)
):
    inquiries = db.query(Inquiry).order_by(Inquiry.created_at.desc()).all()
    return inquiries

@router.patch("/{inquiry_id}", response_model=InquiryResponse)
def update_inquiry_status(
    inquiry_id: int,
    status_update: InquiryUpdateStatus,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin)
):
    inq = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not inq:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    inq.status = status_update.status
    db.commit()
    db.refresh(inq)
    return inq

@router.delete("/{inquiry_id}")
def delete_inquiry(
    inquiry_id: int,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin)
):
    inq = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not inq:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    db.delete(inq)
    db.commit()
    return {"success": True, "message": "Inquiry deleted"}
