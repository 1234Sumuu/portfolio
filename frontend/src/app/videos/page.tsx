import Link from 'next/link';
import { getDb } from '@/lib/db';
import SectionHeading from '@/components/SectionHeading';
import {
  Play,
  Video,
  Clock,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { VideoItem } from '@/lib/types';

export const revalidate = 0;

export default function VideosPage() {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM videos ORDER BY id ASC').all() as any[];

  const videos: VideoItem[] = rows.map((r) => ({
    ...r,
    featured: Boolean(r.featured),
    topics: r.topics ? JSON.parse(r.topics) : [],
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          Knowledge Sharing & Demos
        </span>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Technical Demos, Video Walkthroughs & Lectures
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
          In-depth video demonstrations of production systems, architecture discussions, pharmacological AI pipelines, and agricultural voice streaming systems.
        </p>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {videos.map((vid) => (
          <div
            key={vid.id}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm overflow-hidden hover:border-zinc-700 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Video Thumbnail / Player Frame */}
              <div className="relative aspect-video w-full bg-zinc-950 overflow-hidden group">
                <img
                  src={vid.thumbnail_url}
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/90 text-zinc-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-zinc-950 ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/80 font-mono text-[11px] text-zinc-200">
                  {vid.duration}
                </div>
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 font-mono text-[10px] text-emerald-400">
                  {vid.category}
                </div>
              </div>

              {/* Video Details */}
              <div className="p-6 space-y-3">
                <h3 className="text-lg font-bold text-white leading-snug">
                  {vid.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {vid.description}
                </p>

                {/* Topics */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {vid.topics?.map((topic) => (
                    <span
                      key={topic}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-950 border border-zinc-800 text-zinc-300"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            {vid.related_project_slug && (
              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between">
                  <Link
                    href={`/projects/${vid.related_project_slug}`}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1.5"
                  >
                    <span>Inspect Related Project Architecture</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
