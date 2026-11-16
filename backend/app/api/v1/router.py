from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    projects,
    research,
    articles,
    videos,
    experiences,
    certifications,
    inquiries,
    stats,
    media,
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(projects.router, prefix="/projects", tags=["Projects"])
api_router.include_router(research.router, prefix="/research", tags=["Research & Publications"])
api_router.include_router(articles.router, prefix="/articles", tags=["Articles & Writing"])
api_router.include_router(videos.router, prefix="/videos", tags=["Videos"])
api_router.include_router(experiences.router, prefix="/experiences", tags=["Experience"])
api_router.include_router(certifications.router, prefix="/certifications", tags=["Certifications"])
api_router.include_router(inquiries.router, prefix="/inquiries", tags=["Inquiries"])
api_router.include_router(stats.router, prefix="/stats", tags=["Dashboard Statistics"])
api_router.include_router(media.router, prefix="/media", tags=["Media Library"])
