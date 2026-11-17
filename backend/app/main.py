import os
from urllib.parse import unquote
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse

from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1.router import api_router

# Create database tables if they do not exist
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Notice: Table creation skipped or handled externally: {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Production REST API powering Sumaiya Akter's Personal Digital Identity, Project Portfolio, and Academic Research Portal.",
    openapi_url="/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static media uploads directory
try:
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    if os.path.exists(settings.UPLOAD_DIR):
        app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")
except Exception as e:
    print(f"Notice: Upload directory mount skipped: {e}")

# Frontend static assets (pre-rendered Next.js pages, CSS/JS chunks & media)
STATIC_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")

@app.get("/_next/image")
def next_image_proxy(url: str = ""):
    if not url:
        return Response(status_code=400)
    clean_url = unquote(url).lstrip("/")
    target = os.path.join(STATIC_DIR, clean_url)
    if os.path.exists(target) and os.path.isfile(target):
        return FileResponse(target)
    alt = os.path.join(STATIC_DIR, "assets", clean_url)
    if os.path.exists(alt) and os.path.isfile(alt):
        return FileResponse(alt)
    return Response(status_code=404)

@app.get("/assets/{file_path:path}")
def serve_assets(file_path: str):
    clean_path = unquote(file_path).lstrip("/")
    target = os.path.join(STATIC_DIR, "assets", clean_path)
    if os.path.exists(target) and os.path.isfile(target):
        return FileResponse(target)
    return Response(status_code=404)

if os.path.exists(STATIC_DIR):
    next_static = os.path.join(STATIC_DIR, "_next")
    if os.path.exists(next_static):
        app.mount("/_next", StaticFiles(directory=next_static), name="next_static")

    assets_static = os.path.join(STATIC_DIR, "assets")
    if os.path.exists(assets_static):
        app.mount("/assets", StaticFiles(directory=assets_static), name="assets_static")

# Include API Router under both /api/v1 and /api for versatile routing
app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(api_router, prefix="/api")

@app.get("/health", tags=["System"])
@app.get("/api/health", tags=["System"])
def healthcheck():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
    }

@app.get("/api", tags=["System"])
def api_root():
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "api_v1": settings.API_V1_STR,
    }

@app.get("/", response_class=HTMLResponse, tags=["Web"])
def serve_home():
    index_path = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path, media_type="text/html")
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "api_v1": settings.API_V1_STR,
    }

@app.get("/projects", response_class=HTMLResponse, tags=["Web"])
def serve_projects():
    projects_path = os.path.join(STATIC_DIR, "projects.html")
    if os.path.exists(projects_path):
        return FileResponse(projects_path, media_type="text/html")
    index_path = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path, media_type="text/html")
    return {"detail": "Not Found"}

@app.get("/research", response_class=HTMLResponse, tags=["Web"])
def serve_research():
    research_path = os.path.join(STATIC_DIR, "research.html")
    if os.path.exists(research_path):
        return FileResponse(research_path, media_type="text/html")
    index_path = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path, media_type="text/html")
    return {"detail": "Not Found"}

@app.get("/contact", response_class=HTMLResponse, tags=["Web"])
def serve_contact():
    contact_path = os.path.join(STATIC_DIR, "contact.html")
    if os.path.exists(contact_path):
        return FileResponse(contact_path, media_type="text/html")
    index_path = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path, media_type="text/html")
    return {"detail": "Not Found"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
