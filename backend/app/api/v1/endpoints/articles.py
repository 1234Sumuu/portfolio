import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import Article
from app.schemas.schemas import ArticleCreate, ArticleUpdate, ArticleResponse
from app.api.deps import get_current_admin

router = APIRouter()

def format_article(a: Article) -> dict:
    return {
        "id": a.id,
        "title": a.title,
        "slug": a.slug,
        "category": a.category,
        "summary": a.summary,
        "content": a.content,
        "read_time_minutes": a.read_time_minutes,
        "published_date": a.published_date,
        "tags": json.loads(a.tags) if a.tags else [],
        "featured": bool(a.featured),
        "created_at": a.created_at,
    }

@router.get("/", response_model=List[ArticleResponse])
def get_articles(db: Session = Depends(get_db)):
    arts = db.query(Article).order_by(Article.published_date.desc(), Article.id.desc()).all()
    return [format_article(a) for a in arts]

@router.get("/{slug_or_id}", response_model=ArticleResponse)
def get_article(slug_or_id: str, db: Session = Depends(get_db)):
    if slug_or_id.isdigit():
        a = db.query(Article).filter(Article.id == int(slug_or_id)).first()
    else:
        a = db.query(Article).filter(Article.slug == slug_or_id).first()
    
    if not a:
        raise HTTPException(status_code=404, detail="Article not found")
    return format_article(a)

@router.post("/", response_model=ArticleResponse, status_code=status.HTTP_201_CREATED)
def create_article(
    art_in: ArticleCreate,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin)
):
    existing = db.query(Article).filter(Article.slug == art_in.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")

    a = Article(
        title=art_in.title,
        slug=art_in.slug,
        category=art_in.category,
        summary=art_in.summary,
        content=art_in.content,
        read_time_minutes=art_in.read_time_minutes,
        published_date=art_in.published_date,
        tags=json.dumps(art_in.tags or []),
        featured=art_in.featured,
    )
    db.add(a)
    db.commit()
    db.refresh(a)
    return format_article(a)

@router.put("/{art_id}", response_model=ArticleResponse)
def update_article(
    art_id: int,
    art_in: ArticleUpdate,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin)
):
    a = db.query(Article).filter(Article.id == art_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Article not found")

    update_data = art_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        if field == "tags" and val is not None:
            setattr(a, field, json.dumps(val))
        else:
            setattr(a, field, val)
    
    db.commit()
    db.refresh(a)
    return format_article(a)

@router.delete("/{art_id}")
def delete_article(
    art_id: int,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin)
):
    a = db.query(Article).filter(Article.id == art_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Article not found")
    db.delete(a)
    db.commit()
    return {"success": True, "message": "Article deleted successfully"}
