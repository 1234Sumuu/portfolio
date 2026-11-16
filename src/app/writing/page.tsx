import Link from 'next/link';
import { getDb } from '@/lib/db';
import SectionHeading from '@/components/SectionHeading';
import {
  BookOpen,
  Clock,
  Calendar,
  ArrowRight,
  Tag,
  Sparkles,
} from 'lucide-react';
import { Article } from '@/lib/types';

export const revalidate = 0;

export default function WritingPage() {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM articles ORDER BY published_date DESC, id DESC').all() as any[];

  const articles: Article[] = rows.map((r) => ({
    ...r,
    featured: Boolean(r.featured),
    tags: r.tags ? JSON.parse(r.tags) : [],
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          Technical Writing & Insights
        </span>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Engineering Articles, Research Guides & Case Studies
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
          Reflections on software architecture, production LLM reliability, modern JavaScript primitives, and systematic frameworks for breaking down academic papers.
        </p>
      </div>

      {/* Articles List */}
      <div className="space-y-6">
        {articles.map((art) => (
          <article
            key={art.id}
            className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm hover:border-zinc-700 hover:shadow-xl transition-all duration-300 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {art.category}
              </span>
              <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {art.published_date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {art.read_time_minutes} min read
                </span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white hover:text-emerald-400 transition-colors">
              <Link href={`/writing/${art.slug}`}>
                {art.title}
              </Link>
            </h2>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-4xl">
              {art.summary}
            </p>

            <div className="pt-3 border-t border-zinc-800/60 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-1.5">
                {art.tags?.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-950 border border-zinc-800 text-zinc-400"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <Link
                href={`/writing/${art.slug}`}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1.5 group"
              >
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
