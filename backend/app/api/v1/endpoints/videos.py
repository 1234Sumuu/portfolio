import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import Video
from app.schemas.schemas import VideoCreate, VideoResponse
from app.api.deps import get_current_admin

router = APIRouter()

def format_video(v: Video) -> dict:
    return {
        "id": v.id,
        "title": v.title,
        "slug": v.slug,
        "category": v.category,
        "description": v.description,
        "video_url": v.video_url,
        "thumbnail_url": v.thumbnail_url,
        "duration": v.duration,
        "topics": json.loads(v.topics) if v.topics else [],
        "related_project_slug": v.related_project_slug,
        "featured": bool(v.featured),
        "created_at": v.created_at,
    }

@router.get("/", response_model=List[VideoResponse])
def get_videos(db: Session = Depends(get_db)):
    videos = db.query(Video).order_by(Video.id.asc()).all()
    return [format_video(v) for v in videos]

@router.post("/", response_model=VideoResponse, status_code=status.HTTP_201_CREATED)
def create_video(
    v_in: VideoCreate,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin)
):
    v = Video(
        title=v_in.title,
        slug=v_in.slug,
        category=v_in.category,
        description=v_in.description,
        video_url=v_in.video_url,
        thumbnail_url=v_in.thumbnail_url,
        duration=v_in.duration,
        topics=json.dumps(v_in.topics or []),
        related_project_slug=v_in.related_project_slug,
        featured=v_in.featured,
    )
    db.add(v)
    db.commit()
    db.refresh(v)
    return format_video(v)

@router.delete("/{video_id}")
def delete_video(
    video_id: int,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin)
):
    v = db.query(Video).filter(Video.id == video_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Video not found")
    db.delete(v)
    db.commit()
    return {"success": True, "message": "Video deleted successfully"}
