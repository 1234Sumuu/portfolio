import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import Publication
from app.schemas.schemas import PublicationCreate, PublicationUpdate, PublicationResponse
from app.api.deps import get_current_admin

router = APIRouter()

def format_publication(pub: Publication) -> dict:
    return {
        "id": pub.id,
        "title": pub.title,
        "slug": pub.slug,
        "authors": pub.authors,
        "venue": pub.venue,
        "year": pub.year,
        "status": pub.status,
        "category": pub.category,
        "abstract": pub.abstract,
        "methodology": pub.methodology,
        "dataset_details": pub.dataset_details,
        "key_findings": json.loads(pub.key_findings) if pub.key_findings else [],
        "metrics": pub.metrics,
        "pdf_url": pub.pdf_url,
        "arxiv_url": pub.arxiv_url,
        "doi": pub.doi,
        "bibtex": pub.bibtex,
        "featured": bool(pub.featured),
        "created_at": pub.created_at,
    }

@router.get("/", response_model=List[PublicationResponse])
def get_publications(
    category: Optional[str] = Query(None),
    featured: Optional[bool] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Publication)
    if category and category != "All":
        query = query.filter(Publication.category == category)
    if featured is not None:
        query = query.filter(Publication.featured == featured)
    
    pubs = query.order_by(Publication.year.desc(), Publication.id.asc()).all()
    return [format_publication(p) for p in pubs]

@router.get("/{slug_or_id}", response_model=PublicationResponse)
def get_publication(slug_or_id: str, db: Session = Depends(get_db)):
    if slug_or_id.isdigit():
        pub = db.query(Publication).filter(Publication.id == int(slug_or_id)).first()
    else:
        pub = db.query(Publication).filter(Publication.slug == slug_or_id).first()
    
    if not pub:
        raise HTTPException(status_code=404, detail="Publication not found")
    return format_publication(pub)

@router.post("/", response_model=PublicationResponse, status_code=status.HTTP_201_CREATED)
def create_publication(
    pub_in: PublicationCreate,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin)
):
    existing = db.query(Publication).filter(Publication.slug == pub_in.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")

    pub = Publication(
        title=pub_in.title,
        slug=pub_in.slug,
        authors=pub_in.authors,
        venue=pub_in.venue,
        year=pub_in.year,
        status=pub_in.status,
        category=pub_in.category,
        abstract=pub_in.abstract,
        methodology=pub_in.methodology,
        dataset_details=pub_in.dataset_details,
        key_findings=json.dumps(pub_in.key_findings or []),
        metrics=pub_in.metrics,
        pdf_url=pub_in.pdf_url,
        arxiv_url=pub_in.arxiv_url,
        doi=pub_in.doi,
        bibtex=pub_in.bibtex,
        featured=pub_in.featured,
    )
    db.add(pub)
    db.commit()
    db.refresh(pub)
    return format_publication(pub)

@router.put("/{pub_id}", response_model=PublicationResponse)
def update_publication(
    pub_id: int,
    pub_in: PublicationUpdate,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin)
):
    pub = db.query(Publication).filter(Publication.id == pub_id).first()
    if not pub:
        raise HTTPException(status_code=404, detail="Publication not found")

    update_data = pub_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        if field == "key_findings" and val is not None:
            setattr(pub, field, json.dumps(val))
        else:
            setattr(pub, field, val)
    
    db.commit()
    db.refresh(pub)
    return format_publication(pub)

@router.delete("/{pub_id}")
def delete_publication(
    pub_id: int,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin)
):
    pub = db.query(Publication).filter(Publication.id == pub_id).first()
    if not pub:
        raise HTTPException(status_code=404, detail="Publication not found")
    db.delete(pub)
    db.commit()
    return {"success": True, "message": "Publication deleted successfully"}
