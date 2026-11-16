'use client';

import { useState, useEffect } from 'react';
import { Upload, Copy, Check, FileText, Image as ImageIcon, ExternalLink, Loader2 } from 'lucide-react';
import { MediaAsset } from '@/lib/types';

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const fetchAssets = async () => {
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      if (data.assets) setAssets(data.assets);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'uploads');

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      await fetchAssets();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = (id: number, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Centralized Media Library</h1>
          <p className="text-xs text-zinc-400">
            Upload images, architecture diagrams, and research PDFs to reuse anywhere across pages.
          </p>
        </div>

        <div>
          <label className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-500/20">
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>{uploading ? 'Uploading...' : 'Upload Asset'}</span>
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,.pdf"
            />
          </label>
        </div>
      </div>

      {/* Grid of assets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {assets.map((asset) => {
          const isPdf = asset.url.endsWith('.pdf');
          const isCopied = copiedId === asset.id;

          return (
            <div
              key={asset.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden flex flex-col justify-between"
            >
              <div className="h-40 w-full bg-zinc-950 flex items-center justify-center overflow-hidden border-b border-zinc-800 relative group">
                {isPdf ? (
                  <div className="flex flex-col items-center gap-2 text-zinc-500">
                    <FileText className="w-10 h-10 text-emerald-400" />
                    <span className="text-[10px] font-mono">PDF Document</span>
                  </div>
                ) : (
                  <img
                    src={asset.url}
                    alt={asset.alt_text || asset.original_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                )}
                <a
                  href={asset.url}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-zinc-300 hover:text-white backdrop-blur-sm"
                  title="Open Full File"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-4 space-y-2 text-xs">
                <div className="font-semibold text-white truncate" title={asset.original_name}>
                  {asset.original_name}
                </div>
                <div className="text-[11px] font-mono text-zinc-500 flex justify-between">
                  <span>{(asset.size_bytes / 1024).toFixed(0)} KB</span>
                  <span className="uppercase">{asset.folder}</span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => copyUrl(asset.id, asset.url)}
                    className="w-full py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-[11px] font-mono text-zinc-300 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">URL Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Public URL</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
