'use client';

import Link from 'next/link';
import { ExternalLink, Github, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';
import { Project, ProjectStatus } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
  featuredLayout?: boolean;
}

export function getStatusBadge(status: ProjectStatus | string) {
  switch (status) {
    case 'Live in Production':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
          Live in Production
        </span>
      );
    case 'Production-Ready':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-100 text-blue-800 border border-blue-200 shadow-sm">
          Production-Ready
        </span>
      );
    case 'Research Prototype':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-purple-100 text-purple-800 border border-purple-200 shadow-sm">
          Research Prototype
        </span>
      );
    case 'In Development':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-100 text-amber-800 border border-amber-200 shadow-sm">
          In Development
        </span>
      );
    case 'Completed':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-stone-100 text-stone-800 border border-stone-200 shadow-sm">
          Verified Build
        </span>
      );
  }
}

export default function ProjectCard({ project, featuredLayout = false }: ProjectCardProps) {
  const fallbackThumb = '/assets/images/doctorj-hero.png';
  const thumbUrl = project.thumbnail || fallbackThumb;

  return (
    <div
      className={`group relative rounded-2xl border border-[#E2DCD2] bg-white hover:border-[#1C1917] hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden ${
        featuredLayout ? 'lg:grid lg:grid-cols-12 lg:gap-8' : ''
      }`}
    >
      {/* Thumbnail Container */}
      <div
        className={`relative overflow-hidden bg-stone-100 border-b border-[#E2DCD2] ${
          featuredLayout ? 'lg:col-span-6 h-64 lg:h-full min-h-[260px] border-b-0 lg:border-r' : 'aspect-[16/10] w-full'
        }`}
      >
        <img
          src={thumbUrl}
          alt={project.title}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {getStatusBadge(project.status)}
        </div>
      </div>

      {/* Body Content */}
      <div
        className={`p-5 sm:p-6 flex flex-col justify-between flex-grow ${
          featuredLayout ? 'lg:col-span-6 lg:p-8' : ''
        }`}
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#8C5035] font-semibold">
              {project.category}
            </span>
            <span className="text-[10px] text-[#8C827A] font-mono tracking-wide">
              {project.role}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-[#1C1917] group-hover:text-[#8C5035] transition-colors leading-snug">
            <Link href={`/projects/${project.slug}`}>
              {project.title}
            </Link>
          </h3>

          <p className="mt-2 text-xs text-[#57534E] line-clamp-3 leading-relaxed">
            {project.summary}
          </p>

          {/* Technology tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies?.slice(0, featuredLayout ? 7 : 4).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FAF8F5] text-[#57534E] border border-[#E2DCD2]"
              >
                {tech}
              </span>
            ))}
            {project.technologies?.length > (featuredLayout ? 7 : 4) && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono text-[#8C827A] bg-[#FAF8F5]">
                +{project.technologies.length - (featuredLayout ? 7 : 4)} more
              </span>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-[#E2DCD2] flex items-center justify-between gap-3">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1C1917] hover:text-[#8C5035] group-hover:translate-x-1 transition-all"
          >
            <span>Architecture &amp; Specs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center gap-2">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noreferrer"
                title="Live Application Demo"
                className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                title="GitHub Repository"
                className="p-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#EBE5DB] text-[#1C1917] border border-[#E2DCD2] transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
            )}
            {project.paper_url && (
              <Link
                href={project.paper_url}
                title="Research Publication"
                className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
