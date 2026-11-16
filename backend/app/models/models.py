from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from app.core.database import Base

class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="admin", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    tagline = Column(Text, nullable=False)
    category = Column(String(100), index=True, nullable=False)
    status = Column(String(100), index=True, nullable=False)
    role = Column(String(100), nullable=False)
    featured = Column(Boolean, default=False)
    order_index = Column(Integer, default=0)
    thumbnail = Column(String(500), nullable=False)
    gallery = Column(Text, nullable=True)  # JSON serialized string
    summary = Column(Text, nullable=False)
    problem_statement = Column(Text, nullable=False)
    solution_overview = Column(Text, nullable=False)
    architecture_details = Column(Text, nullable=False)
    architecture_diagram = Column(Text, nullable=True)
    engineering_challenges = Column(Text, nullable=False)
    key_features = Column(Text, nullable=False)  # JSON serialized string
    technologies = Column(Text, nullable=False)  # JSON serialized string
    measurable_outcomes = Column(Text, nullable=True)
    live_url = Column(String(500), nullable=True)
    github_url = Column(String(500), nullable=True)
    paper_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Publication(Base):
    __tablename__ = "publications"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(500), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    authors = Column(String(500), nullable=False)
    venue = Column(String(255), nullable=False)
    year = Column(Integer, nullable=False)
    status = Column(String(100), nullable=False)
    category = Column(String(100), nullable=False)
    abstract = Column(Text, nullable=False)
    methodology = Column(Text, nullable=False)
    dataset_details = Column(Text, nullable=True)
    key_findings = Column(Text, nullable=False)  # JSON serialized string
    metrics = Column(Text, nullable=True)
    pdf_url = Column(String(500), nullable=True)
    arxiv_url = Column(String(500), nullable=True)
    doi = Column(String(255), nullable=True)
    bibtex = Column(Text, nullable=True)
    featured = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    category = Column(String(100), nullable=False)
    summary = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    read_time_minutes = Column(Integer, default=5)
    published_date = Column(String(50), nullable=False)
    tags = Column(Text, nullable=False)  # JSON serialized string
    featured = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Video(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    video_url = Column(String(500), nullable=False)
    thumbnail_url = Column(String(500), nullable=False)
    duration = Column(String(50), nullable=False)
    topics = Column(Text, nullable=False)  # JSON serialized string
    related_project_slug = Column(String(255), nullable=True)
    featured = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Experience(Base):
    __tablename__ = "experiences"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    company = Column(String(255), nullable=False)
    role = Column(String(255), nullable=False)
    period = Column(String(100), nullable=False)
    location = Column(String(100), nullable=False)
    is_current = Column(Boolean, default=False)
    responsibilities = Column(Text, nullable=False)  # JSON serialized string
    achievements = Column(Text, nullable=False)      # JSON serialized string
    tech_stack = Column(Text, nullable=False)        # JSON serialized string
    order_index = Column(Integer, default=0)

class Certification(Base):
    __tablename__ = "certifications"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    issuer = Column(String(255), nullable=False)
    year = Column(String(50), nullable=False)
    type = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    image_url = Column(String(500), nullable=True)
    badge = Column(String(100), nullable=True)
    pdf_url = Column(String(500), nullable=True)

class Inquiry(Base):
    __tablename__ = "inquiries"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    organization = Column(String(255), nullable=True)
    intent = Column(String(100), nullable=False)
    subject = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String(50), default="new", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class MediaAsset(Base):
    __tablename__ = "media_assets"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    filename = Column(String(255), nullable=False)
    original_name = Column(String(255), nullable=False)
    url = Column(String(500), nullable=False)
    mime_type = Column(String(100), nullable=False)
    size_bytes = Column(Integer, nullable=False)
    folder = Column(String(100), default="general")
    alt_text = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
