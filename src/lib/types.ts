export type ProjectCategory = 
  | 'Live Production'
  | 'AI & Machine Learning'
  | 'Generative AI & LLMs'
  | 'RAG & AI Agents'
  | 'Healthcare Technology'
  | 'Computer Vision'
  | 'Full-Stack Software'
  | 'Research Prototype'
  | 'Enterprise Systems'
  | 'Ongoing Research';

export type ProjectStatus = 
  | 'Live in Production'
  | 'Production-Ready'
  | 'Completed'
  | 'Research Prototype'
  | 'In Development'
  | 'Archived';

export interface Project {
  id: number;
  title: string;
  slug: string;
  tagline: string;
  category: ProjectCategory;
  status: ProjectStatus;
  role: string;
  featured: boolean;
  order_index: number;
  thumbnail: string;
  gallery?: string[]; // JSON array
  summary: string;
  problem_statement: string;
  solution_overview: string;
  architecture_details: string;
  architecture_diagram?: string;
  engineering_challenges: string;
  key_features: string[]; // JSON array
  technologies: string[]; // JSON array
  measurable_outcomes?: string;
  live_url?: string;
  github_url?: string;
  paper_url?: string;
  created_at: string;
  updated_at: string;
}

export type ResearchStatus = 
  | 'Published'
  | 'Accepted'
  | 'Under Review'
  | 'Preprint (arXiv)'
  | 'In Progress';

export interface Publication {
  id: number;
  title: string;
  slug: string;
  authors: string;
  venue: string;
  year: number;
  status: ResearchStatus;
  category: string;
  abstract: string;
  methodology: string;
  dataset_details?: string;
  key_findings: string[]; // JSON array
  metrics?: string;
  pdf_url?: string;
  arxiv_url?: string;
  doi?: string;
  bibtex?: string;
  featured: boolean;
  created_at: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  category: string;
  summary: string;
  content: string;
  read_time_minutes: number;
  published_date: string;
  tags: string[]; // JSON array
  featured: boolean;
  created_at: string;
}

export interface VideoItem {
  id: number;
  title: string;
  slug: string;
  category: string;
  description: string;
  video_url: string; // YouTube embed or local video
  thumbnail_url: string;
  duration: string;
  topics: string[]; // JSON array
  related_project_slug?: string;
  featured: boolean;
  created_at: string;
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  period: string;
  location: string;
  is_current: boolean;
  responsibilities: string[]; // JSON array
  achievements: string[]; // JSON array
  tech_stack: string[]; // JSON array
  order_index: number;
}

export interface SkillCategory {
  category: string;
  description: string;
  skills: Array<{
    name: string;
    level?: string;
    highlight?: boolean;
  }>;
}

export interface Certification {
  id: number;
  title: string;
  issuer: string;
  year: string;
  type: 'Martial Arts' | 'Academic' | 'Professional' | 'Competition' | 'Achievement';
  description: string;
  image_url?: string;
  badge?: string;
  pdf_url?: string;
}

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  organization?: string;
  intent: 'hire' | 'consulting' | 'research' | 'phd' | 'speaking' | 'other';
  subject: string;
  message: string;
  status: 'new' | 'reviewed' | 'replied' | 'archived';
  created_at: string;
}

export interface MediaAsset {
  id: number;
  filename: string;
  original_name: string;
  url: string;
  mime_type: string;
  size_bytes: number;
  folder: string;
  alt_text?: string;
  created_at: string;
}

export interface AdminUser {
  id: number;
  email: string;
  role: string;
  created_at: string;
}
