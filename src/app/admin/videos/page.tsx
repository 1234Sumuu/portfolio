'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Video, X, Loader2 } from 'lucide-react';
import { VideoItem } from '@/lib/types';

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Partial<VideoItem>>({});
  const [submitting, setSubmitting] = useState(false);

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/videos');
      const data = await res.json();
      if (data.videos) setVideos(data.videos);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleOpenAdd = () => {
    setCurrentVideo({
      title: '',
      slug: '',
      category: 'AI Walkthrough',
      description: '',
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail_url: '/assets/images/doctorj-hero.png',
      duration: '15:00',
      topics: ['AI', 'System Architecture'],
      related_project_slug: 'doctor-j',
      featured: false,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    try {
      const res = await fetch(`/api/videos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setVideos(videos.filter((v) => v.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentVideo),
      });

      if (!res.ok) throw new Error('Failed to save video');
      await fetchVideos();
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
          <h1 className="text-2xl font-bold text-white">Videos & Knowledge Sharing CMS</h1>
          <p className="text-xs text-zinc-400">
            Embed YouTube videos, technical presentations, and system architecture walkthroughs.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-all flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Video Demo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((vid) => (
          <div key={vid.id} className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="text-emerald-400">{vid.category}</span>
                <span>{vid.duration}</span>
              </div>
              <h3 className="font-bold text-white text-sm">{vid.title}</h3>
              <p className="text-xs text-zinc-400 line-clamp-2">{vid.description}</p>
              <div className="text-[11px] font-mono text-zinc-500 truncate">
                Embed: {vid.video_url}
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex justify-end">
              <button
                onClick={() => handleDelete(vid.id)}
                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-base font-bold text-white">Add Video Walkthrough</h2>
              <button onClick={() => setIsEditing(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={currentVideo.title || ''}
                  onChange={(e) => setCurrentVideo({ ...currentVideo, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Slug *</label>
                <input
                  type="text"
                  required
                  value={currentVideo.slug || ''}
                  onChange={(e) => setCurrentVideo({ ...currentVideo, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Video Embed URL (YouTube or mp4) *</label>
                <input
                  type="text"
                  required
                  value={currentVideo.video_url || ''}
                  onChange={(e) => setCurrentVideo({ ...currentVideo, video_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Duration</label>
                  <input
                    type="text"
                    value={currentVideo.duration || '10:00'}
                    onChange={(e) => setCurrentVideo({ ...currentVideo, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Category</label>
                  <input
                    type="text"
                    value={currentVideo.category || ''}
                    onChange={(e) => setCurrentVideo({ ...currentVideo, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  value={currentVideo.description || ''}
                  onChange={(e) => setCurrentVideo({ ...currentVideo, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
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
                  {submitting ? 'Saving...' : 'Add Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
