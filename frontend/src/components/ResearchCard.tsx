'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, Download, Copy, Check, ExternalLink, Bookmark } from 'lucide-react';
import { Publication } from '@/lib/types';

interface ResearchCardProps {
  publication: Publication;
}

export default function ResearchCard({ publication }: ResearchCardProps) {
  const [copied, setCopied] = useState(false);

  const copyBibtex = () => {
    if (!publication.bibtex) return;
    navigator.clipboard.writeText(publication.bibtex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Accepted':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/30';
      case 'Preprint (arXiv)':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'In Progress':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <article className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-sm p-6 sm:p-8 hover:border-zinc-700 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Meta Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-medium border ${getStatusColor(publication.status)}`}>
              {publication.status}
            </span>
            <span className="text-xs font-mono text-zinc-400 bg-zinc-800/60 px-2 py-0.5 rounded border border-zinc-700/40">
              {publication.venue} • {publication.year}
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400">
            {publication.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white leading-snug hover:text-emerald-400 transition-colors">
          <Link href={`/research/${publication.slug}`}>
            {publication.title}
          </Link>
        </h3>

        {/* Authors */}
        <p className="mt-2 text-xs font-medium text-zinc-400">
          {publication.authors}
        </p>

        {/* Abstract */}
        <p className="mt-4 text-xs text-zinc-400 leading-relaxed line-clamp-4">
          {publication.abstract}
        </p>

        {/* Dataset Details */}
        {publication.dataset_details && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-950/60 border border-zinc-800 text-[11px] font-mono text-zinc-400">
            <span className="text-zinc-500">Benchmark:</span> {publication.dataset_details}
          </div>
        )}

        {/* Key Findings */}
        {publication.key_findings && publication.key_findings.length > 0 && (
          <div className="mt-4 space-y-1.5">
            <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">Key Empirical Findings:</p>
            <ul className="space-y-1">
              {publication.key_findings.slice(0, 2).map((finding, idx) => (
                <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2">
                  <span className="text-emerald-500 text-sm leading-none">•</span>
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Quantitative Metrics Badge */}
        {publication.metrics && (
          <div className="mt-4 p-3 rounded-xl bg-zinc-950 border border-zinc-800/80">
            <div className="text-[11px] font-mono text-zinc-400">
              <span className="text-emerald-400 font-semibold">Metrics:</span> {publication.metrics}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-6 pt-5 border-t border-zinc-800/60 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/research/${publication.slug}`}
          className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors inline-flex items-center gap-1"
        >
          <span>Read Full Methodology</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <div className="flex items-center gap-2">
          {publication.pdf_url && (
            <a
              href={publication.pdf_url}
              download
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </a>
          )}

          {publication.arxiv_url && (
            <a
              href={publication.arxiv_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
            >
              <span>arXiv</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          {publication.bibtex && (
            <button
              onClick={copyBibtex}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-300 bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/60 transition-colors"
              title="Copy BibTeX Citation"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'BibTeX'}</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
