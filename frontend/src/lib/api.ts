/**
 * API Client for Sumaiya Akter Portfolio
 * Connects Frontend (Next.js) to Backend (FastAPI REST API)
 *
 * In Vercel Multi-Service deployments:
 * - Server functions resolve internal service binding: process.env.BACKEND_URL
 * - Client browser requests use relative public rewrites: /api/v1
 * - Local development falls back to process.env.NEXT_PUBLIC_API_URL or http://localhost:8063/api/v1
 */

import {
  Project,
  Publication,
  Article,
  VideoItem,
  Experience,
  Certification,
  Inquiry,
  MediaAsset,
} from './types';

class ApiClient {
  private customBase?: string;

  constructor(customBase?: string) {
    this.customBase = customBase;
  }

  public getBaseUrl(): string {
    if (this.customBase) {
      return this.customBase;
    }
    // 1. Vercel internal service binding injected at runtime into the calling service
    if (process.env.BACKEND_URL) {
      const internalUrl = process.env.BACKEND_URL.replace(/\/$/, '');
      return `${internalUrl}/api/v1`;
    }
    // 2. Client-side execution in browser (routed via Vercel public rewrite /api/(.*))
    if (typeof window !== 'undefined') {
      return '/api/v1';
    }
    // 3. Local development fallback
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8063/api/v1';
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const base = this.getBaseUrl();
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${base}${cleanEndpoint}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> || {}),
    };

    try {
      const res = await fetch(url, {
        ...options,
        headers,
        // Cache settings for next.js SSR
        next: { revalidate: 60 },
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.detail || `HTTP ${res.status}: ${res.statusText}`);
      }

      return await res.json();
    } catch (err: any) {
      console.warn(`[API Client] Error fetching ${url}:`, err.message);
      throw err;
    }
  }

  // Projects
  async getProjects(params?: { category?: string; status?: string; featured?: boolean }): Promise<Project[]> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.status) query.set('status', params.status);
    if (params?.featured !== undefined) query.set('featured', String(params.featured));
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<Project[]>(`/projects/${qs}`);
  }

  async getProjectBySlug(slug: string): Promise<Project> {
    return this.request<Project>(`/projects/${slug}`);
  }

  // Research / Publications
  async getPublications(params?: { category?: string; status?: string; featured?: boolean }): Promise<Publication[]> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.status) query.set('status', params.status);
    if (params?.featured !== undefined) query.set('featured', String(params.featured));
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<Publication[]>(`/research/${qs}`);
  }

  async getPublicationBySlug(slug: string): Promise<Publication> {
    return this.request<Publication>(`/research/${slug}`);
  }

  // Articles
  async getArticles(params?: { category?: string; featured?: boolean }): Promise<Article[]> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.featured !== undefined) query.set('featured', String(params.featured));
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<Article[]>(`/articles/${qs}`);
  }

  async getArticleBySlug(slug: string): Promise<Article> {
    return this.request<Article>(`/articles/${slug}`);
  }

  // Videos
  async getVideos(params?: { category?: string; featured?: boolean }): Promise<VideoItem[]> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.featured !== undefined) query.set('featured', String(params.featured));
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<VideoItem[]>(`/videos/${qs}`);
  }

  // Experiences
  async getExperiences(): Promise<Experience[]> {
    return this.request<Experience[]>('/experiences/');
  }

  // Certifications
  async getCertifications(type?: string): Promise<Certification[]> {
    const qs = type ? `?cert_type=${encodeURIComponent(type)}` : '';
    return this.request<Certification[]>(`/certifications/${qs}`);
  }

  // Stats
  async getStats(): Promise<{
    projects_count: number;
    publications_count: number;
    articles_count: number;
    videos_count: number;
    certifications_count: number;
    inquiries_count: number;
    unread_inquiries: number;
  }> {
    return this.request('/stats/');
  }

  // Inquiries
  async submitInquiry(data: {
    name: string;
    email: string;
    organization?: string;
    intent: string;
    subject: string;
    message: string;
  }): Promise<{ message: string; id: number }> {
    return this.request('/inquiries/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Auth
  async login(credentials: { email: string; password: string }): Promise<{ access_token: string; token_type: string; user: any }> {
    const base = this.getBaseUrl();
    const res = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Login failed');
    }
    return res.json();
  }

  async getMe(): Promise<{ id: number; email: string; role: string }> {
    return this.request('/auth/me');
  }
}

export const api = new ApiClient();
export default api;
