import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import {
  ArrowLeft,
  Download,
  Copy,
  ExternalLink,
  GraduationCap,
  Database,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Publication } from '@/lib/types';

export const revalidate = 0;

async function getPublication(slug: string): Promise<Publication | null> {
  const db = getDb();
  const row = db.prepare('SELECT * FROM publications WHERE slug = ?').get(slug) as any;
  if (!row) return null;

  return {
    ...row,
    featured: Boolean(row.featured),
    key_findings: row.key_findings ? JSON.parse(row.key_findings) : [],
  };
}

export default async function PublicationDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const pub = await getPublication(params.slug);
  if (!pub) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Back button */}
      <Link
        href="/research"
        className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Research & Publications</span>
      </Link>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            {pub.status}
          </span>
          <span className="text-xs font-mono text-zinc-400 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
            {pub.venue} • {pub.year}
          </span>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            {pub.category}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {pub.title}
        </h1>

        <p className="text-sm font-medium text-zinc-300">
          Authors: {pub.authors}
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap gap-3">
          {pub.pdf_url && (
            <a
              href={pub.pdf_url}
              download
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-all inline-flex items-center gap-2 shadow-sm shadow-emerald-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Download Full Paper PDF</span>
            </a>
          )}
          {pub.arxiv_url && (
            <a
              href={pub.arxiv_url}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-semibold transition-all inline-flex items-center gap-2"
            >
              <span>View on arXiv</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Abstract */}
      <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-3">
        <h2 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
          Abstract
        </h2>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          {pub.abstract}
        </p>
      </div>

      {/* Dataset & Benchmark Details */}
      {pub.dataset_details && (
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-cyan-400 shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Experimental Dataset & Benchmark
            </h3>
            <p className="text-xs sm:text-sm text-zinc-200">{pub.dataset_details}</p>
          </div>
        </div>
      )}

      {/* Experimental Methodology */}
      <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-emerald-400" />
          <span>Research Methodology & Experimental Design</span>
        </h2>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
          {pub.methodology}
        </p>
      </div>

      {/* Key Findings */}
      {pub.key_findings && pub.key_findings.length > 0 && (
        <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Key Empirical Results & Observations</span>
          </h2>
          <div className="space-y-3">
            {pub.key_findings.map((f, i) => (
              <div key={i} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-1.5"></span>
                <p className="text-xs text-zinc-300 leading-relaxed">{f}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metrics Badge */}
      {pub.metrics && (
        <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/20">
          <div className="text-xs font-mono text-zinc-300">
            <span className="text-emerald-400 font-semibold uppercase tracking-wider block mb-1">
              Verified Quantitative Performance:
            </span>
            {pub.metrics}
          </div>
        </div>
      )}

      {/* BibTeX Citation Box */}
      {pub.bibtex && (
        <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              BibTeX Citation
            </h3>
          </div>
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 overflow-x-auto font-mono text-xs text-zinc-300">
            <pre>{pub.bibtex}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
