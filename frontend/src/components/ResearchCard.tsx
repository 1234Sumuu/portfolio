'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, Download, Copy, Check, ExternalLink, Bookmark, Sparkles } from 'lucide-react';
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
            Under Review
          </span>
        );
      case 'Published':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
            Published
          </span>
        );
      case 'Accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-300 shadow-sm">
            Accepted
          </span>
        );
      case 'Preprint (arXiv)':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-300 shadow-sm">
            Preprint
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-300 shadow-sm">
            In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-800 border border-stone-300 shadow-sm">
            {status}
          </span>
        );
    }
  };

  return (
    <article className="bento-card p-6 sm:p-8 bg-white border border-[#E2DCD2] hover:border-[#1C1917] hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Meta Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            {getStatusBadge(publication.status)}
            <span className="text-xs font-mono text-[#57534E] bg-[#FAF8F5] px-2.5 py-0.5 rounded-full border border-[#E2DCD2]">
              {publication.venue} • {publication.year}
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#8C5035] font-semibold uppercase tracking-wider">
            {publication.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-[#1C1917] leading-snug hover:text-[#8C5035] transition-colors">
          <Link href={`/research/${publication.slug}`}>
            {publication.title}
          </Link>
        </h3>

        {/* Authors */}
        <p className="mt-2 text-xs font-medium text-[#78716C]">
          {publication.authors}
        </p>

        {/* Abstract */}
        <p className="mt-4 text-xs text-[#57534E] leading-relaxed line-clamp-4">
          {publication.abstract}
        </p>

        {/* Dataset Details */}
        {publication.dataset_details && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FAF8F5] border border-[#E2DCD2] text-[11px] font-mono text-[#57534E]">
            <span className="text-[#8C827A] font-semibold">Benchmark Corpus:</span> {publication.dataset_details}
          </div>
        )}

        {/* Key Findings */}
        {publication.key_findings && publication.key_findings.length > 0 && (
          <div className="mt-4 space-y-1.5">
            <p className="text-[11px] font-mono uppercase tracking-wider text-[#8C5035] font-semibold">
              Key Empirical Findings:
            </p>
            <ul className="space-y-1">
              {publication.key_findings.slice(0, 2).map((finding, idx) => (
                <li key={idx} className="text-xs text-[#57534E] flex items-start gap-2">
                  <span className="text-[#8C5035] font-bold">•</span>
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Quantitative Metrics Badge */}
        {publication.metrics && (
          <div className="mt-4 p-3 rounded-xl bg-[#FAF8F5] border border-[#E2DCD2]">
            <div className="text-[11px] font-mono text-[#57534E]">
              <span className="text-[#8C5035] font-bold">Empirical Metrics:</span> {publication.metrics}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-6 pt-5 border-t border-[#E2DCD2] flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/research/${publication.slug}`}
          className="text-xs font-semibold text-[#1C1917] hover:text-[#8C5035] transition-colors inline-flex items-center gap-1"
        >
          <span>Methodology &amp; Abstract</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <div className="flex items-center gap-2">
          {publication.arxiv_url && (
            <a
              href={publication.arxiv_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-[#FAF8F5] hover:bg-[#EBE5DB] text-[#1C1917] border border-[#E2DCD2] transition-colors"
            >
              <span>arXiv</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          {publication.bibtex && (
            <button
              onClick={copyBibtex}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono text-[#57534E] bg-[#FAF8F5] hover:bg-[#EBE5DB] border border-[#E2DCD2] transition-colors"
              title="Copy BibTeX Citation"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'BibTeX'}</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
