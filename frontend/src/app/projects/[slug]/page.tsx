import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import { getStatusBadge } from '@/components/ProjectCard';
import {
  ExternalLink,
  Github,
  FileText,
  ArrowLeft,
  Server,
  Layers,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Project } from '@/lib/types';

export const revalidate = 0;

async function getProject(slug: string): Promise<Project | null> {
  const db = getDb();
  const row = db.prepare('SELECT * FROM projects WHERE slug = ?').get(slug) as any;
  if (!row) return null;

  return {
    ...row,
    featured: Boolean(row.featured),
    gallery: row.gallery ? JSON.parse(row.gallery) : [],
    key_features: row.key_features ? JSON.parse(row.key_features) : [],
    technologies: row.technologies ? JSON.parse(row.technologies) : [],
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Back button */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to All Projects</span>
      </Link>

      {/* Hero Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {getStatusBadge(project.status)}
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            {project.category}
          </span>
          <span className="text-xs font-mono text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded-full border border-zinc-800">
            Role: {project.role}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          {project.title}
        </h1>

        <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-3xl">
          {project.tagline}
        </p>

        {/* Action Links */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-500/20"
            >
              <span>Visit Live Production Deployment</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub Repository</span>
            </a>
          )}
          {project.paper_url && (
            <Link
              href={project.paper_url}
              className="px-5 py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Related Research Paper</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main Image Banner */}
      <div className="rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-950">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full max-h-[460px] object-cover object-center"
        />
      </div>

      {/* Technologies Section */}
      <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
          Architecture & Technology Stack
        </h3>
        <div className="flex flex-wrap gap-2">
          {project.technologies?.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-lg text-xs font-mono bg-zinc-950 border border-zinc-800 text-zinc-200"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Problem & Solution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Problem Statement</span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            {project.problem_statement}
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Engineered Solution</span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            {project.solution_overview}
          </p>
        </div>
      </div>

      {/* Key Features */}
      {project.key_features && project.key_features.length > 0 && (
        <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <span>Key Engineering Features</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.key_features.map((feat, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-1.5"></span>
                <p className="text-xs text-zinc-300 leading-relaxed">{feat}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Architecture Details */}
      <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Server className="w-5 h-5 text-cyan-400" />
          <span>System Topology & Architecture Specifications</span>
        </h2>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          {project.architecture_details}
        </p>

        {project.architecture_diagram && (
          <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs overflow-x-auto">
            <div className="text-[11px] text-zinc-500 uppercase tracking-wider mb-2 font-semibold">
              Architecture Dataflow Graph:
            </div>
            <pre className="text-emerald-400/90 whitespace-pre leading-relaxed">
              {project.architecture_diagram}
            </pre>
          </div>
        )}
      </div>

      {/* Engineering Challenges & Solutions */}
      <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-amber-400" />
          <span>Engineering Challenges & Resilience Mechanics</span>
        </h2>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          {project.engineering_challenges}
        </p>
      </div>

      {/* Measurable Outcomes */}
      {project.measurable_outcomes && (
        <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 space-y-2">
          <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
            Measurable Outcomes & Production Benchmarks
          </h3>
          <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
            {project.measurable_outcomes}
          </p>
        </div>
      )}

      {/* Gallery Screenshots */}
      {project.gallery && project.gallery.length > 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Visual Artifacts & Screenshots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.gallery.map((img, idx) => (
              <div key={idx} className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-950">
                <img src={img} alt={`${project.title} screenshot ${idx + 1}`} className="w-full h-64 object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="pt-6 border-t border-zinc-800 flex items-center justify-between">
        <Link
          href="/projects"
          className="text-xs font-semibold text-zinc-400 hover:text-white inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects</span>
        </Link>
        <Link
          href="/contact"
          className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-all"
        >
          Discuss This Project
        </Link>
      </div>
    </div>
  );
}
