'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X, Loader2 } from 'lucide-react';
import { Publication } from '@/lib/types';

export default function AdminResearchPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPub, setCurrentPub] = useState<Partial<Publication>>({});
  const [submitting, setSubmitting] = useState(false);

  const fetchPubs = async () => {
    try {
      const res = await fetch('/api/research');
      const data = await res.json();
      if (data.publications) setPublications(data.publications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPubs();
  }, []);

  const handleOpenAdd = () => {
    setCurrentPub({
      title: '',
      slug: '',
      authors: 'Sumaiya Akter, et al.',
      venue: 'Journal / Conference',
      year: new Date().getFullYear(),
      status: 'In Progress',
      category: 'Medical AI',
      abstract: '',
      methodology: '',
      dataset_details: '',
      key_findings: ['Finding 1'],
      metrics: '',
      pdf_url: '',
      arxiv_url: '',
      bibtex: '',
      featured: false,
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (pub: Publication) => {
    setCurrentPub(pub);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this publication?')) return;
    try {
      const res = await fetch(`/api/research/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPublications(publications.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const isNew = !currentPub.id;
      const url = isNew ? '/api/research' : `/api/research/${currentPub.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPub),
      });

      if (!res.ok) throw new Error('Failed to save publication');
      await fetchPubs();
      setIsEditing(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Research & Publications CMS</h1>
          <p className="text-xs text-zinc-400">
            Manage peer-reviewed papers, arXiv preprints, working manuscripts, and BibTeX citations.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-all flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Publication</span>
        </button>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 bg-zinc-950 border-b border-zinc-800">
            <tr>
              <th className="p-4">Title & Venue</th>
              <th className="p-4">Status</th>
              <th className="p-4">Category</th>
              <th className="p-4">Year</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {publications.map((pub) => (
              <tr key={pub.id} className="hover:bg-zinc-800/20 transition-colors">
                <td className="p-4 max-w-md">
                  <div className="font-semibold text-white">{pub.title}</div>
                  <div className="text-zinc-500 text-[11px] font-mono mt-0.5">{pub.venue}</div>
                </td>
                <td className="p-4 font-mono text-emerald-400">{pub.status}</td>
                <td className="p-4 text-zinc-300 font-mono text-[11px]">{pub.category}</td>
                <td className="p-4 font-mono text-zinc-400">{pub.year}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(pub)}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(pub.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
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

      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h2 className="text-lg font-bold text-white">
                {currentPub.id ? 'Edit Publication' : 'Add New Publication'}
              </h2>
              <button onClick={() => setIsEditing(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={currentPub.title || ''}
                  onChange={(e) => setCurrentPub({ ...currentPub, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Slug *</label>
                  <input
                    type="text"
                    required
                    value={currentPub.slug || ''}
                    onChange={(e) => setCurrentPub({ ...currentPub, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Venue *</label>
                  <input
                    type="text"
                    required
                    value={currentPub.venue || ''}
                    onChange={(e) => setCurrentPub({ ...currentPub, venue: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Year</label>
                  <input
                    type="number"
                    value={currentPub.year || 2026}
                    onChange={(e) => setCurrentPub({ ...currentPub, year: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Status</label>
                  <select
                    value={currentPub.status || 'Published'}
                    onChange={(e) => setCurrentPub({ ...currentPub, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100"
                  >
                    <option value="Published">Published</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Preprint (arXiv)">Preprint (arXiv)</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Category</label>
                  <input
                    type="text"
                    value={currentPub.category || ''}
                    onChange={(e) => setCurrentPub({ ...currentPub, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Abstract</label>
                <textarea
                  rows={4}
                  value={currentPub.abstract || ''}
                  onChange={(e) => setCurrentPub({ ...currentPub, abstract: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100"
                ></textarea>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Methodology</label>
                <textarea
                  rows={3}
                  value={currentPub.methodology || ''}
                  onChange={(e) => setCurrentPub({ ...currentPub, methodology: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">PDF URL</label>
                  <input
                    type="text"
                    value={currentPub.pdf_url || ''}
                    onChange={(e) => setCurrentPub({ ...currentPub, pdf_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">arXiv URL</label>
                  <input
                    type="text"
                    value={currentPub.arxiv_url || ''}
                    onChange={(e) => setCurrentPub({ ...currentPub, arxiv_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">BibTeX Citation</label>
                <textarea
                  rows={3}
                  value={currentPub.bibtex || ''}
                  onChange={(e) => setCurrentPub({ ...currentPub, bibtex: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono text-[11px]"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold"
                >
                  {submitting ? 'Saving...' : 'Save Publication'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
