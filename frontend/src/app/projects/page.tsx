'use client';

import { useState, useEffect, useMemo } from 'react';
import ProjectCard from '@/components/ProjectCard';
import SectionHeading from '@/components/SectionHeading';
import { Search, Filter, Layers, CheckCircle2 } from 'lucide-react';
import { Project } from '@/lib/types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const categories = [
    'All',
    'Live Production',
    'Healthcare Technology',
    'AI & Machine Learning',
    'RAG & AI Agents',
    'Computer Vision',
    'Enterprise Systems',
    'Generative AI & LLMs',
    'Full-Stack Software'
  ];

  const statuses = [
    'All',
    'Live in Production',
    'Production-Ready',
    'Research Prototype',
    'In Development',
    'Completed'
  ];

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (data.projects) setProjects(data.projects);
      })
      .catch((err) => console.error('Error fetching projects:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        search === '' ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.summary.toLowerCase().includes(search.toLowerCase()) ||
        p.technologies?.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      const matchCategory =
        selectedCategory === 'All' ||
        (selectedCategory === 'Live Production' ? p.status === 'Live in Production' : p.category === selectedCategory);

      const matchStatus =
        selectedStatus === 'All' || p.status === selectedStatus;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [projects, search, selectedCategory, selectedStatus]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          Complete Engineering Portfolio
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Production Systems, AI Architectures & Research Prototypes
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
          Every project below reflects verified technical work developed throughout my 5+ years of software engineering—ranging from live clinical hospital assistants (Doctor J) and agricultural multimodal platforms (AgroGPT) to patentable pharmaceutical intelligence and legal-tech systems.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-4 p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by project name, description, or technology (e.g. FastAPI, Gemini, QLoRA, Docker)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
          />
        </div>

        {/* Categories Bar */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
            Category Filter:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-zinc-950 font-semibold shadow-sm shadow-emerald-500/20'
                    : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-2 pt-2 border-t border-zinc-800/60">
          <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
            Status Filter:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {statuses.map((stat) => (
              <button
                key={stat}
                onClick={() => setSelectedStatus(stat)}
                className={`px-3 py-1 rounded-md text-[11px] font-mono transition-all ${
                  selectedStatus === stat
                    ? 'bg-zinc-200 text-zinc-950 font-semibold'
                    : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {stat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
        <span>Showing {filteredProjects.length} of {projects.length} verified projects</span>
        {(search || selectedCategory !== 'All' || selectedStatus !== 'All') && (
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
              setSelectedStatus('All');
            }}
            className="text-emerald-400 hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 rounded-2xl bg-zinc-900/40 animate-pulse border border-zinc-800"></div>
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/20">
          <p className="text-zinc-400 text-sm">No projects matched your active filters.</p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
              setSelectedStatus('All');
            }}
            className="px-4 py-2 rounded-lg bg-emerald-500 text-zinc-950 text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
