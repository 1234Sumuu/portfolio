import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Github, ArrowRight, Activity, FileText } from 'lucide-react';
import { Project, ProjectStatus } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
  featuredLayout?: boolean;
}

export function getStatusBadge(status: ProjectStatus | string) {
  switch (status) {
    case 'Live in Production':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Live in Production
        </span>
      );
    case 'Production-Ready':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          Production-Ready
        </span>
      );
    case 'Research Prototype':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-purple-500/10 text-purple-400 border border-purple-500/30">
          Research Prototype
        </span>
      );
    case 'In Development':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
          In Development
        </span>
      );
    case 'Completed':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">
          Completed
        </span>
      );
  }
}

export default function ProjectCard({ project, featuredLayout = false }: ProjectCardProps) {
  return (
    <div
      className={`group relative rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-sm overflow-hidden hover:border-zinc-700 hover:shadow-xl hover:shadow-black/40 transition-all duration-300 flex flex-col ${
        featuredLayout ? 'lg:grid lg:grid-cols-12 lg:gap-8' : ''
      }`}
    >
      {/* Thumbnail */}
      <div
        className={`relative overflow-hidden bg-zinc-950 ${
          featuredLayout ? 'lg:col-span-6 h-64 lg:h-full min-h-[260px]' : 'h-52 w-full'
        }`}
      >
        <img
          src={project.thumbnail || '/assets/images/doctorj-hero.png'}
          alt={project.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {getStatusBadge(project.status)}
        </div>
      </div>

      {/* Body */}
      <div
        className={`p-6 flex flex-col justify-between flex-grow ${
          featuredLayout ? 'lg:col-span-6 lg:p-8' : ''
        }`}
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
              {project.category}
            </span>
            <span className="text-[11px] text-zinc-500 font-mono">
              {project.role}
            </span>
          </div>

          <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
            <Link href={`/projects/${project.slug}`}>
              {project.title}
            </Link>
          </h3>

          <p className="mt-2 text-xs text-zinc-400 line-clamp-3 leading-relaxed">
            {project.summary}
          </p>

          {/* Technology tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies?.slice(0, featuredLayout ? 7 : 5).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800/80 text-zinc-300 border border-zinc-700/50"
              >
                {tech}
              </span>
            ))}
            {project.technologies?.length > (featuredLayout ? 7 : 5) && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono text-zinc-500">
                +{project.technologies.length - (featuredLayout ? 7 : 5)}
              </span>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center justify-between gap-3">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors group-hover:translate-x-1 transition-transform"
          >
            <span>View Architecture & Case Study</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center gap-2">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noreferrer"
                title="Live Application Demo"
                className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
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
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
            )}
            {project.paper_url && (
              <Link
                href={project.paper_url}
                title="Research Publication"
                className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 transition-colors"
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
