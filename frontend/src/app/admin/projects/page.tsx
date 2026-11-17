'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Search,
  Check,
  X,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Project, ProjectCategory, ProjectStatus } from '@/lib/types';
import { getStatusBadge } from '@/components/ProjectCard';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({});
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.projects) setProjects(data.projects);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenAdd = () => {
    setCurrentProject({
      title: '',
      slug: '',
      tagline: '',
      category: 'AI & Machine Learning',
      status: 'In Development',
      role: 'Software Engineer',
      featured: false,
      order_index: projects.length + 1,
      thumbnail: '/assets/images/doctorj-hero.webp',
      summary: '',
      problem_statement: '',
      solution_overview: '',
      architecture_details: '',
      engineering_challenges: '',
      key_features: ['Feature 1', 'Feature 2'],
      technologies: ['Python', 'FastAPI', 'Docker'],
      measurable_outcomes: '',
      live_url: '',
      github_url: 'https://github.com/sumaiyamayra',
      paper_url: '',
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (p: Project) => {
    setCurrentProject(p);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg('');

    try {
      const isNew = !currentProject.id;
      const url = isNew ? '/api/projects' : `/api/projects/${currentProject.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentProject),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to save project');
      }

      await fetchProjects();
      setIsEditing(false);
      setMsg('Project saved successfully!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Project Portfolio Management</h1>
          <p className="text-xs text-zinc-400">
            Create, update architecture details, configure live URLs, and toggle featured status.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-500/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {msg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
          {msg}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter projects by title or category..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Projects Table */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 bg-zinc-950 border-b border-zinc-800">
              <tr>
                <th className="p-4">Thumbnail</th>
                <th className="p-4">Title & Slug</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">Featured</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="p-4 w-20">
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="w-14 h-10 object-cover rounded-md border border-zinc-800"
                    />
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-white">{p.title}</div>
                    <div className="text-[11px] font-mono text-zinc-500">/{p.slug}</div>
                  </td>
                  <td className="p-4 text-zinc-300 font-mono text-[11px]">{p.category}</td>
                  <td className="p-4">{getStatusBadge(p.status)}</td>
                  <td className="p-4 font-mono">
                    {p.featured ? (
                      <span className="text-emerald-400 font-bold">Yes (Top)</span>
                    ) : (
                      <span className="text-zinc-500">No</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white"
                        title="Edit Project"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h2 className="text-lg font-bold text-white">
                {currentProject.id ? 'Edit Project Specifications' : 'Create New Project'}
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={currentProject.title || ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Slug *</label>
                  <input
                    type="text"
                    required
                    value={currentProject.slug || ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Tagline</label>
                <input
                  type="text"
                  value={currentProject.tagline || ''}
                  onChange={(e) => setCurrentProject({ ...currentProject, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Category</label>
                  <select
                    value={currentProject.category || 'AI & Machine Learning'}
                    onChange={(e) => setCurrentProject({ ...currentProject, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100"
                  >
                    <option value="Healthcare Technology">Healthcare Technology</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="RAG & AI Agents">RAG & AI Agents</option>
                    <option value="Computer Vision">Computer Vision</option>
                    <option value="Enterprise Systems">Enterprise Systems</option>
                    <option value="Generative AI & LLMs">Generative AI & LLMs</option>
                    <option value="Full-Stack Software">Full-Stack Software</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Status</label>
                  <select
                    value={currentProject.status || 'In Development'}
                    onChange={(e) => setCurrentProject({ ...currentProject, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100"
                  >
                    <option value="Live in Production">Live in Production</option>
                    <option value="Production-Ready">Production-Ready</option>
                    <option value="Research Prototype">Research Prototype</option>
                    <option value="In Development">In Development</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Role</label>
                  <input
                    type="text"
                    value={currentProject.role || ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Thumbnail URL</label>
                  <input
                    type="text"
                    value={currentProject.thumbnail || ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, thumbnail: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono text-[11px]"
                  />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-zinc-300 font-medium">
                    <input
                      type="checkbox"
                      checked={Boolean(currentProject.featured)}
                      onChange={(e) => setCurrentProject({ ...currentProject, featured: e.target.checked })}
                      className="rounded bg-zinc-900 border-zinc-800 text-emerald-500 focus:ring-0"
                    />
                    <span>Feature on Homepage</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Summary Overview</label>
                <textarea
                  rows={3}
                  value={currentProject.summary || ''}
                  onChange={(e) => setCurrentProject({ ...currentProject, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Problem Statement</label>
                  <textarea
                    rows={3}
                    value={currentProject.problem_statement || ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, problem_statement: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Engineered Solution</label>
                  <textarea
                    rows={3}
                    value={currentProject.solution_overview || ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, solution_overview: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100"
                  ></textarea>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Architecture Details & Flow</label>
                <textarea
                  rows={3}
                  value={currentProject.architecture_details || ''}
                  onChange={(e) => setCurrentProject({ ...currentProject, architecture_details: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100"
                ></textarea>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Engineering Challenges & Solutions</label>
                <textarea
                  rows={2}
                  value={currentProject.engineering_challenges || ''}
                  onChange={(e) => setCurrentProject({ ...currentProject, engineering_challenges: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Live Application URL</label>
                  <input
                    type="text"
                    value={currentProject.live_url || ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, live_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={currentProject.github_url || ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, github_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Paper URL</label>
                  <input
                    type="text"
                    value={currentProject.paper_url || ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, paper_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
