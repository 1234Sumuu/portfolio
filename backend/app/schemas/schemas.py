from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any
from datetime import datetime

# --- Auth Schemas ---
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

# --- Project Schemas ---
class ProjectBase(BaseModel):
    title: str
    slug: str
    tagline: str
    category: str
    status: str
    role: str
    featured: bool = False
    order_index: int = 0
    thumbnail: str
    gallery: Optional[List[str]] = []
    summary: str
    problem_statement: str
    solution_overview: str
    architecture_details: str
    architecture_diagram: Optional[str] = None
    engineering_challenges: str
    key_features: List[str] = []
    technologies: List[str] = []
    measurable_outcomes: Optional[str] = None
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    paper_url: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    tagline: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    role: Optional[str] = None
    featured: Optional[bool] = None
    order_index: Optional[int] = None
    thumbnail: Optional[str] = None
    gallery: Optional[List[str]] = None
    summary: Optional[str] = None
    problem_statement: Optional[str] = None
    solution_overview: Optional[str] = None
    architecture_details: Optional[str] = None
    architecture_diagram: Optional[str] = None
    engineering_challenges: Optional[str] = None
    key_features: Optional[List[str]] = None
    technologies: Optional[List[str]] = None
    measurable_outcomes: Optional[str] = None
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    paper_url: Optional[str] = None

class ProjectResponse(ProjectBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Publication Schemas ---
class PublicationBase(BaseModel):
    title: str
    slug: str
    authors: str
    venue: str
    year: int
    status: str
    category: str
    abstract: str
    methodology: str
    dataset_details: Optional[str] = None
    key_findings: List[str] = []
    metrics: Optional[str] = None
    pdf_url: Optional[str] = None
    arxiv_url: Optional[str] = None
    doi: Optional[str] = None
    bibtex: Optional[str] = None
    featured: bool = False

class PublicationCreate(PublicationBase):
    pass

class PublicationUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    authors: Optional[str] = None
    venue: Optional[str] = None
    year: Optional[int] = None
    status: Optional[str] = None
    category: Optional[str] = None
    abstract: Optional[str] = None
    methodology: Optional[str] = None
    dataset_details: Optional[str] = None
    key_findings: Optional[List[str]] = None
    metrics: Optional[str] = None
    pdf_url: Optional[str] = None
    arxiv_url: Optional[str] = None
    doi: Optional[str] = None
    bibtex: Optional[str] = None
    featured: Optional[bool] = None

class PublicationResponse(PublicationBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Article Schemas ---
class ArticleBase(BaseModel):
    title: str
    slug: str
    category: str
    summary: str
    content: str
    read_time_minutes: int = 5
    published_date: str
    tags: List[str] = []
    featured: bool = False

class ArticleCreate(ArticleBase):
    pass

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    category: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None
    read_time_minutes: Optional[int] = None
    published_date: Optional[str] = None
    tags: Optional[List[str]] = None
    featured: Optional[bool] = None

class ArticleResponse(ArticleBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Video Schemas ---
class VideoBase(BaseModel):
    title: str
    slug: str
    category: str
    description: str
    video_url: str
    thumbnail_url: str
    duration: str
    topics: List[str] = []
    related_project_slug: Optional[str] = None
    featured: bool = False

class VideoCreate(VideoBase):
    pass

class VideoResponse(VideoBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Experience Schemas ---
class ExperienceBase(BaseModel):
    company: str
    role: str
    period: str
    location: str
    is_current: bool = False
    responsibilities: List[str] = []
    achievements: List[str] = []
    tech_stack: List[str] = []
    order_index: int = 0

class ExperienceResponse(ExperienceBase):
    id: int

    class Config:
        from_attributes = True

# --- Certification Schemas ---
class CertificationBase(BaseModel):
    title: str
    issuer: str
    year: str
    type: str
    description: str
    image_url: Optional[str] = None
    badge: Optional[str] = None
    pdf_url: Optional[str] = None

class CertificationResponse(CertificationBase):
    id: int

    class Config:
        from_attributes = True

# --- Inquiry Schemas ---
class InquiryCreate(BaseModel):
    name: str
    email: EmailStr
    organization: Optional[str] = None
    intent: str
    subject: str
    message: str

class InquiryUpdateStatus(BaseModel):
    status: str

class InquiryResponse(BaseModel):
    id: int
    name: str
    email: str
    organization: Optional[str] = None
    intent: str
    subject: str
    message: str
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Stats Schemas ---
class DashboardStats(BaseModel):
    totalProjects: int
    liveProjects: int
    totalPublications: int
    totalArticles: int
    totalVideos: int
    pendingInquiries: int
    totalInquiries: int

# --- Media Schemas ---
class MediaAssetResponse(BaseModel):
    id: int
    filename: str
    original_name: str
    url: str
    mime_type: str
    size_bytes: int
    folder: str
    alt_text: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
