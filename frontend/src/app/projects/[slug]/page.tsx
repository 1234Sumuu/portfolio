import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getStatusBadge } from '@/components/ProjectCard';
import {
  ExternalLink,
  Github,
  FileText,
  ArrowLeft,
  Server,
  Layers,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  FolderKanban
} from 'lucide-react';
import { Project } from '@/lib/types';

export const revalidate = 0;

async function getProject(slug: string): Promise<Project | null> {
  try {
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
  } catch (err) {
    console.error('Error fetching project slug:', err);
    return null;
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  return (
    <div className="min-h-screen bg-[#F4EFE6] text-[#1C1917] flex flex-col font-sans selection:bg-[#1C1917] selection:text-[#F4EFE6]">
      {/* Common Sticky Header */}
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-[#E2DCD2] pb-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#78716C] hover:text-[#1C1917] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Projects</span>
          </Link>

          <span className="text-xs font-mono text-[#8C5035]">
            Archive ID: {project.slug}
          </span>
        </div>

        {/* Hero Header Card */}
        <div className="bento-card p-6 sm:p-10 bg-white border border-[#E2DCD2] space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {getStatusBadge(project.status)}
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#8C5035] bg-[#FAF8F5] px-2.5 py-1 rounded-full border border-[#E2DCD2] font-semibold">
              {project.category}
            </span>
            <span className="text-[11px] font-mono text-[#57534E] bg-[#FAF8F5] px-2.5 py-1 rounded-full border border-[#E2DCD2]">
              Role: {project.role}
            </span>
          </div>

          <h1 className="display-title text-3xl sm:text-4xl lg:text-5xl text-[#1C1917] tracking-tight leading-tight">
            {project.title}
          </h1>

          <p className="text-sm sm:text-base text-[#57534E] leading-relaxed max-w-3xl">
            {project.tagline}
          </p>

          {/* Action Links */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#292524] text-[#F4EFE6] font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>Live Deployment</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-full bg-[#FAF8F5] hover:bg-[#EBE5DB] text-[#1C1917] border border-[#E2DCD2] text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Repository</span>
              </a>
            )}
            {project.paper_url && (
              <Link
                href={project.paper_url}
                className="px-5 py-2.5 rounded-full bg-[#8C5035]/10 hover:bg-[#8C5035]/20 text-[#8C5035] border border-[#8C5035]/30 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Related Research Paper</span>
              </Link>
            )}
          </div>
        </div>

        {/* Main Image Banner */}
        <div className="rounded-2xl border border-[#E2DCD2] overflow-hidden bg-stone-100 shadow-sm">
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full max-h-[480px] object-cover object-top"
          />
        </div>

        {/* Technologies Section */}
        <div className="bento-card p-6 bg-white border border-[#E2DCD2] space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#8C5035] font-semibold">
            Architecture &amp; Core Technology Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies?.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-lg text-xs font-mono bg-[#FAF8F5] border border-[#E2DCD2] text-[#1C1917] font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Problem & Solution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bento-card p-6 bg-white border border-[#E2DCD2] space-y-3">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Problem Statement</span>
            </div>
            <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
              {project.problem_statement}
            </p>
          </div>

          <div className="bento-card p-6 bg-white border border-[#E2DCD2] space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Engineered Solution</span>
            </div>
            <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
              {project.solution_overview}
            </p>
          </div>
        </div>

        {/* Key Features */}
        {project.key_features && project.key_features.length > 0 && (
          <div className="bento-card p-6 sm:p-8 bg-white border border-[#E2DCD2] space-y-4">
            <h2 className="display-title text-2xl text-[#1C1917] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#8C5035]" />
              <span>Key Engineering Features</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.key_features.map((feat, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E2DCD2] flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#8C5035] shrink-0 mt-1.5"></span>
                  <p className="text-xs text-[#57534E] leading-relaxed">{feat}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* System Architecture Details */}
        <div className="bento-card p-6 sm:p-8 bg-white border border-[#E2DCD2] space-y-6">
          <h2 className="display-title text-2xl text-[#1C1917] flex items-center gap-2">
            <Server className="w-5 h-5 text-[#8C5035]" />
            <span>System Topology &amp; Architecture Specifications</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
            {project.architecture_details}
          </p>

          {project.architecture_diagram && (
            <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E2DCD2] font-mono text-xs overflow-x-auto">
              <div className="text-[11px] text-[#8C827A] uppercase tracking-wider mb-2 font-semibold">
                Architecture Dataflow Graph:
              </div>
              <pre className="text-[#1C1917] whitespace-pre leading-relaxed font-mono">
                {project.architecture_diagram}
              </pre>
            </div>
          )}
        </div>

        {/* Engineering Challenges & Solutions */}
        <div className="bento-card p-6 sm:p-8 bg-white border border-[#E2DCD2] space-y-4">
          <h2 className="display-title text-2xl text-[#1C1917] flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#8C5035]" />
            <span>Engineering Challenges &amp; Resilience Mechanics</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
            {project.engineering_challenges}
          </p>
        </div>

        {/* Measurable Outcomes */}
        {project.measurable_outcomes && (
          <div className="bento-card p-6 bg-emerald-50/70 border border-emerald-200 space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-900 font-bold">
              Measurable Outcomes &amp; Production Benchmarks
            </h3>
            <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed font-medium">
              {project.measurable_outcomes}
            </p>
          </div>
        )}

        {/* Gallery Screenshots */}
        {project.gallery && project.gallery.length > 1 && (
          <div className="space-y-4">
            <h2 className="display-title text-2xl text-[#1C1917]">Visual Artifacts &amp; Screenshots</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.gallery.map((img, idx) => (
                <div key={idx} className="rounded-xl border border-[#E2DCD2] overflow-hidden bg-stone-100 shadow-sm">
                  <img src={img} alt={`${project.title} screenshot ${idx + 1}`} className="w-full h-64 object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="pt-6 border-t border-[#E2DCD2] flex items-center justify-between">
          <Link
            href="/projects"
            className="text-xs font-semibold text-[#57534E] hover:text-[#1C1917] inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Projects</span>
          </Link>
          <a
            href="mailto:sumaiya205.akter@gmail.com"
            className="px-6 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#8C5035] text-[#F4EFE6] font-semibold text-xs uppercase tracking-wider transition-all"
          >
            Discuss This System
          </a>
        </div>
      </main>

      {/* Common Footer */}
      <Footer />
    </div>
  );
}
