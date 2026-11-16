from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import Project, Publication, Article, Video, Inquiry
from app.schemas.schemas import DashboardStats
from app.api.deps import get_current_admin

router = APIRouter()

@router.get("/", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin)
):
    total_projects = db.query(Project).count()
    live_projects = db.query(Project).filter(Project.status == "Live in Production").count()
    total_pubs = db.query(Publication).count()
    total_articles = db.query(Article).count()
    total_videos = db.query(Video).count()
    pending_inquiries = db.query(Inquiry).filter(Inquiry.status == "new").count()
    total_inquiries = db.query(Inquiry).count()

    return {
        "totalProjects": total_projects,
        "liveProjects": live_projects,
        "totalPublications": total_pubs,
        "totalArticles": total_articles,
        "totalVideos": total_videos,
        "pendingInquiries": pending_inquiries,
        "totalInquiries": total_inquiries,
    }
