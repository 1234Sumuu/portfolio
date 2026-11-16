'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/ProjectCard';
import { Search, ChevronLeft, ChevronRight, Layers, ArrowLeft, Filter, Sparkles, FolderKanban } from 'lucide-react';
import { Project } from '@/lib/types';

const ITEMS_PER_PAGE = 6;

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    'All',
    'Healthcare Technology',
    'AI & Machine Learning',
    'Enterprise Systems',
    'Computer Vision',
    'Generative AI & LLMs',
    'Full-Stack Software'
  ];

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (data.projects && Array.isArray(data.projects)) {
          setProjects(data.projects);
        }
      })
      .catch((err) => console.error('Error fetching projects:', err))
      .finally(() => setLoading(false));
  }, []);

  // Filter projects by category and search
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        search === '' ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.summary.toLowerCase().includes(search.toLowerCase()) ||
        p.tagline.toLowerCase().includes(search.toLowerCase()) ||
        p.technologies?.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      const matchCategory =
        selectedCategory === 'All' || p.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [projects, search, selectedCategory]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredProjects.length);
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 320, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F4EFE6] text-[#1C1917] flex flex-col font-sans selection:bg-[#1C1917] selection:text-[#F4EFE6]">
      {/* Common Sticky Header */}
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-[#E2DCD2] pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#78716C] hover:text-[#1C1917] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Main Portfolio</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-mono text-[#8C5035]">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Verified Document Repository</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bento-card p-6 sm:p-10 bg-[#EBE5DB] border border-[#E2DCD2]">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white border border-[#E2DCD2] text-[11px] font-semibold tracking-widest uppercase text-[#8C5035]">
                Engineering Archives
              </span>
              <span className="px-3 py-1 rounded-full bg-[#1C1917] text-[#F4EFE6] text-[11px] font-mono font-medium">
                {projects.length || 27} Verified Systems
              </span>
            </div>

            <h1 className="display-title text-4xl sm:text-5xl lg:text-6xl text-[#1C1917] tracking-tight leading-none">
              ALL PRODUCTION PROJECTS
            </h1>

            <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed max-w-2xl">
              Authentic engineering systems developed across 5+ years of software architecture—ranging from live clinical hospital platforms (<strong>Doctor J</strong>) and agricultural vision assistants (<strong>AgroGPT</strong>) to pharmaceutical regulatory AI (<strong>RA Script</strong>, <strong>RxPERT</strong>), enterprise ERPs, and distributed pipelines.
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bento-card p-5 sm:p-6 bg-white border border-[#E2DCD2] space-y-4 shadow-sm">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#8C827A] absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by system title, tech stack (FastAPI, Redis, Gemini, Docker), or problem domain..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E2DCD2] text-xs sm:text-sm text-[#1C1917] placeholder-[#8C827A] focus:outline-none focus:border-[#1C1917] transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-3 text-xs text-[#8C827A] hover:text-[#1C1917]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Categories Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#8C827A] shrink-0 font-semibold mr-1">
              Category:
            </span>
            {categories.map((cat) => {
              const count = cat === 'All' 
                ? projects.length 
                : projects.filter(p => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#1C1917] text-[#F4EFE6] shadow-sm'
                      : 'bg-[#FAF8F5] text-[#57534E] hover:text-[#1C1917] border border-[#E2DCD2]'
                  }`}
                >
                  {cat} {count > 0 && <span className="opacity-70 text-[10px]">({count})</span>}
                </button>
              );
            })}
          </div>

          {/* Status Bar / Active Stats */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-[#78716C] pt-2 border-t border-[#E2DCD2]/70 font-mono gap-2">
            <span>
              Showing {filteredProjects.length === 0 ? 0 : startIndex + 1}–{endIndex} of {filteredProjects.length} systems
              {selectedCategory !== 'All' && ` in "${selectedCategory}"`}
            </span>
            {(search || selectedCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('All');
                }}
                className="text-[#8C5035] hover:underline font-semibold"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-[#EBE5DB]/60 animate-pulse border border-[#E2DCD2]"></div>
            ))}
          </div>
        ) : currentProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProjects.map((project) => (
              <ProjectCard key={project.id || project.slug} project={project} />
            ))}
          </div>
        ) : (
          <div className="bento-card py-16 text-center space-y-4 bg-white border border-[#E2DCD2]">
            <p className="text-[#57534E] text-sm">
              No systems matched your search criteria: &quot;<strong>{search}</strong>&quot;
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
              }}
              className="px-5 py-2 rounded-full bg-[#1C1917] text-[#F4EFE6] text-xs font-semibold uppercase tracking-wider hover:bg-[#8C5035] transition-all"
            >
              Reset Search &amp; Show All
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="bento-card p-4 sm:p-5 bg-white border border-[#E2DCD2] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-mono text-[#78716C]">
              Page <span className="font-bold text-[#1C1917]">{currentPage}</span> of{' '}
              <span className="font-bold text-[#1C1917]">{totalPages}</span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Previous Page Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  currentPage === 1
                    ? 'border-[#E2DCD2] text-[#A8A29E] cursor-not-allowed bg-[#FAF8F5]'
                    : 'border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-[#F4EFE6] active:scale-95'
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              {/* Page Number Buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-mono font-semibold transition-all ${
                    currentPage === pageNum
                      ? 'bg-[#1C1917] text-[#F4EFE6] shadow-sm'
                      : 'bg-[#FAF8F5] text-[#57534E] hover:bg-[#EBE5DB] border border-[#E2DCD2]'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              {/* Next Page Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  currentPage === totalPages
                    ? 'border-[#E2DCD2] text-[#A8A29E] cursor-not-allowed bg-[#FAF8F5]'
                    : 'border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-[#F4EFE6] active:scale-95'
                }`}
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Common Footer */}
      <Footer />
    </div>
  );
}
