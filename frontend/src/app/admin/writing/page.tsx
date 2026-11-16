'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X, Loader2 } from 'lucide-react';
import { Article } from '@/lib/types';

export default function AdminWritingPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Partial<Article>>({});
  const [submitting, setSubmitting] = useState(false);

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      if (data.articles) setArticles(data.articles);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleOpenAdd = () => {
    setCurrentArticle({
      title: '',
      slug: '',
      category: 'Production AI Systems',
      summary: '',
      content: '',
      read_time_minutes: 5,
      published_date: new Date().toISOString().split('T')[0],
      tags: ['Engineering', 'AI'],
      featured: false,
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (art: Article) => {
    setCurrentArticle(art);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setArticles(articles.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const isNew = !currentArticle.id;
      const url = isNew ? '/api/articles' : `/api/articles/${currentArticle.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentArticle),
      });

      if (!res.ok) throw new Error('Failed to save article');
      await fetchArticles();
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
          <h1 className="text-2xl font-bold text-white">Articles & Technical Writing CMS</h1>
          <p className="text-xs text-zinc-400">
            Publish, edit, and categorize technical tutorials, architecture case studies, and research guides.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-all flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 bg-zinc-950 border-b border-zinc-800">
            <tr>
              <th className="p-4">Title & Slug</th>
              <th className="p-4">Category</th>
              <th className="p-4">Date</th>
              <th className="p-4">Read Time</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {articles.map((art) => (
              <tr key={art.id} className="hover:bg-zinc-800/20 transition-colors">
                <td className="p-4 max-w-md">
                  <div className="font-semibold text-white">{art.title}</div>
                  <div className="text-[11px] font-mono text-zinc-500 mt-0.5">/{art.slug}</div>
                </td>
                <td className="p-4 text-emerald-400 font-mono text-[11px]">{art.category}</td>
                <td className="p-4 font-mono text-zinc-400">{art.published_date}</td>
                <td className="p-4 font-mono text-zinc-400">{art.read_time_minutes} min</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(art)}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(art.id)}
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
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h2 className="text-lg font-bold text-white">
                {currentArticle.id ? 'Edit Article' : 'Draft New Article'}
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
                  value={currentArticle.title || ''}
                  onChange={(e) => setCurrentArticle({ ...currentArticle, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Slug *</label>
                  <input
                    type="text"
                    required
                    value={currentArticle.slug || ''}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Category</label>
                  <input
                    type="text"
                    value={currentArticle.category || ''}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Summary</label>
                <textarea
                  rows={2}
                  value={currentArticle.summary || ''}
                  onChange={(e) => setCurrentArticle({ ...currentArticle, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100"
                ></textarea>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Content (Markdown)</label>
                <textarea
                  rows={10}
                  value={currentArticle.content || ''}
                  onChange={(e) => setCurrentArticle({ ...currentArticle, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono text-xs leading-relaxed"
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
                  {submitting ? 'Publishing...' : 'Save Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
