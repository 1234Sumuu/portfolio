import Link from 'next/link';
import { getDb } from '@/lib/db';
import SectionHeading from '@/components/SectionHeading';
import {
  ExternalLink,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Server,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Project } from '@/lib/types';

export const revalidate = 0;

export default function LiveProductsPage() {
  const db = getDb();
  const liveRows = db
    .prepare("SELECT * FROM projects WHERE status = 'Live in Production' ORDER BY order_index ASC")
    .all() as any[];

  const liveProjects: Project[] = liveRows.map((r) => ({
    ...r,
    featured: Boolean(r.featured),
    gallery: r.gallery ? JSON.parse(r.gallery) : [],
    key_features: r.key_features ? JSON.parse(r.key_features) : [],
    technologies: r.technologies ? JSON.parse(r.technologies) : [],
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Verified Deployments in Active Use</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Live Production Applications & Platforms
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
          These applications are not theoretical prototypes or classroom demonstrations. They are live, containerized production systems serving real users across healthcare, agriculture, legal-tech, and commerce with verified high-availability service level agreements (SLAs).
        </p>
      </div>

      {/* Live Applications Showcase */}
      <div className="space-y-16">
        {liveProjects.map((app, idx) => (
          <div
            key={app.id}
            className="p-8 sm:p-10 rounded-3xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-md space-y-8"
          >
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
                    Live In Production
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-xs font-mono text-zinc-400">{app.category}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">{app.title}</h2>
              </div>

              <div className="flex items-center gap-3">
                {app.live_url && (
                  <a
                    href={app.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-all inline-flex items-center gap-1.5 shadow-sm shadow-emerald-500/20"
                  >
                    <span>Launch Live App</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <Link
                  href={`/projects/${app.slug}`}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                >
                  <span>Full Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Split View: Visual Preview & Architecture Highlights */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Screenshot Frame */}
              <div className="lg:col-span-6 rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-950">
                <img
                  src={app.thumbnail}
                  alt={app.title}
                  className="w-full h-72 sm:h-80 object-cover object-top"
                />
              </div>

              {/* Technical Specifications */}
              <div className="lg:col-span-6 space-y-4">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold mb-1">
                    System Purpose & Role
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {app.summary}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold mb-1.5">
                    Production Stack
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {app.technologies?.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-zinc-950 border border-zinc-800 text-zinc-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold mb-2">
                    Key Production Features
                  </h3>
                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    {app.key_features?.slice(0, 3).map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {app.measurable_outcomes && (
                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300">
                    <span className="text-emerald-400 font-semibold">Telemetry & SLA:</span>{' '}
                    {app.measurable_outcomes}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
