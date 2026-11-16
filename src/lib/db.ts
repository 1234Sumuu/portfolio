import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, 'portfolio.db');

let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!dbInstance) {
    dbInstance = new Database(DB_PATH);
    dbInstance.pragma('journal_mode = WAL');
    dbInstance.pragma('foreign_keys = ON');
    initSchema(dbInstance);
  }
  return dbInstance;
}

function initSchema(db: Database.Database) {
  db.exec(`
    -- Admin Users
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Projects
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      tagline TEXT NOT NULL,
      category TEXT NOT NULL,
      status TEXT NOT NULL,
      role TEXT NOT NULL,
      featured INTEGER DEFAULT 0,
      order_index INTEGER DEFAULT 0,
      thumbnail TEXT NOT NULL,
      gallery TEXT, -- JSON string
      summary TEXT NOT NULL,
      problem_statement TEXT NOT NULL,
      solution_overview TEXT NOT NULL,
      architecture_details TEXT NOT NULL,
      architecture_diagram TEXT,
      engineering_challenges TEXT NOT NULL,
      key_features TEXT NOT NULL, -- JSON string
      technologies TEXT NOT NULL, -- JSON string
      measurable_outcomes TEXT,
      live_url TEXT,
      github_url TEXT,
      paper_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Publications & Research
    CREATE TABLE IF NOT EXISTS publications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      authors TEXT NOT NULL,
      venue TEXT NOT NULL,
      year INTEGER NOT NULL,
      status TEXT NOT NULL,
      category TEXT NOT NULL,
      abstract TEXT NOT NULL,
      methodology TEXT NOT NULL,
      dataset_details TEXT,
      key_findings TEXT NOT NULL, -- JSON string
      metrics TEXT,
      pdf_url TEXT,
      arxiv_url TEXT,
      doi TEXT,
      bibtex TEXT,
      featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Articles & Writing
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      summary TEXT NOT NULL,
      content TEXT NOT NULL,
      read_time_minutes INTEGER DEFAULT 5,
      published_date TEXT NOT NULL,
      tags TEXT NOT NULL, -- JSON string
      featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Videos & Knowledge Sharing
    CREATE TABLE IF NOT EXISTS videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      video_url TEXT NOT NULL,
      thumbnail_url TEXT NOT NULL,
      duration TEXT NOT NULL,
      topics TEXT NOT NULL, -- JSON string
      related_project_slug TEXT,
      featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Work Experience
    CREATE TABLE IF NOT EXISTS experiences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT NOT NULL,
      role TEXT NOT NULL,
      period TEXT NOT NULL,
      location TEXT NOT NULL,
      is_current INTEGER DEFAULT 0,
      responsibilities TEXT NOT NULL, -- JSON string
      achievements TEXT NOT NULL, -- JSON string
      tech_stack TEXT NOT NULL, -- JSON string
      order_index INTEGER DEFAULT 0
    );

    -- Certifications & Achievements
    CREATE TABLE IF NOT EXISTS certifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      issuer TEXT NOT NULL,
      year TEXT NOT NULL,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT,
      badge TEXT,
      pdf_url TEXT
    );

    -- Contact Inquiries
    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      organization TEXT,
      intent TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Media Library Assets
    CREATE TABLE IF NOT EXISTS media_assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      url TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size_bytes INTEGER NOT NULL,
      folder TEXT DEFAULT 'general',
      alt_text TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
    CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
    CREATE INDEX IF NOT EXISTS idx_publications_slug ON publications(slug);
    CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
    CREATE INDEX IF NOT EXISTS idx_videos_slug ON videos(slug);
  `);
}

export default getDb;
