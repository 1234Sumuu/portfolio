import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  Share2,
  BookOpen,
} from 'lucide-react';
import { Article } from '@/lib/types';

export const revalidate = 0;

async function getArticle(slug: string): Promise<Article | null> {
  const db = getDb();
  const row = db.prepare('SELECT * FROM articles WHERE slug = ?').get(slug) as any;
  if (!row) return null;

  return {
    ...row,
    featured: Boolean(row.featured),
    tags: row.tags ? JSON.parse(row.tags) : [],
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Back button */}
      <Link
        href="/writing"
        className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to All Articles</span>
      </Link>

      {/* Article Header */}
      <div className="space-y-4 border-b border-zinc-800 pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {article.category}
          </span>
          <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {article.published_date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.read_time_minutes} min read
            </span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {article.title}
        </h1>

        <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-light">
          {article.summary}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {article.tags?.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Article Prose Content */}
      <div className="prose prose-invert prose-zinc max-w-none text-zinc-300 text-sm sm:text-base leading-relaxed space-y-6">
        <div className="whitespace-pre-line leading-relaxed font-sans">
          {article.content}
        </div>
      </div>

      {/* Author Footer */}
      <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 mt-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src="/assets/images/sumaiya-profile.webp"
            alt="Sumaiya Akter"
            className="w-14 h-14 rounded-full object-cover border border-zinc-700"
          />
          <div>
            <h4 className="font-bold text-white text-sm">Written by Sumaiya Akter</h4>
            <p className="text-xs text-zinc-400">
              Software Engineer – Artificial Intelligence Team @ ACI Limited
            </p>
          </div>
        </div>

        <Link
          href="/contact"
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-all shrink-0"
        >
          Discuss Article or Topic
        </Link>
      </div>
    </div>
  );
}
