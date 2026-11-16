import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
  Bookmark
} from 'lucide-react';
import { Publication } from '@/lib/types';

export const revalidate = 0;

async function getPublication(slug: string): Promise<Publication | null> {
  try {
    const db = getDb();
    const row = db.prepare('SELECT * FROM publications WHERE slug = ?').get(slug) as any;
    if (!row) return null;

    return {
      ...row,
      featured: Boolean(row.featured),
      key_findings: row.key_findings ? JSON.parse(row.key_findings) : [],
    };
  } catch (err) {
    console.error('Error fetching publication:', err);
    return null;
  }
}

export default async function PublicationDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const pub = await getPublication(params.slug);
  if (!pub) notFound();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
            Under Review
          </span>
        );
      case 'Published':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
            Published
          </span>
        );
      case 'Accepted':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-300">
            Accepted
          </span>
        );
      case 'Preprint (arXiv)':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-300">
            Preprint
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-100 text-stone-800 border border-stone-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F4EFE6] text-[#1C1917] flex flex-col font-sans selection:bg-[#1C1917] selection:text-[#F4EFE6]">
      {/* Common Sticky Header */}
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Back button */}
        <div className="border-b border-[#E2DCD2] pb-4">
          <Link
            href="/research"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#78716C] hover:text-[#1C1917] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Research &amp; Publications</span>
          </Link>
        </div>

        {/* Paper Header Card */}
        <div className="bento-card p-6 sm:p-10 bg-white border border-[#E2DCD2] space-y-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            {getStatusBadge(pub.status)}
            <span className="text-xs font-mono text-[#57534E] bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#E2DCD2]">
              {pub.venue} • {pub.year}
            </span>
            <span className="text-xs font-mono text-[#8C5035] bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#E2DCD2] font-semibold">
              {pub.category}
            </span>
          </div>

          <h1 className="display-title text-2xl sm:text-3xl lg:text-4xl text-[#1C1917] tracking-tight leading-tight">
            {pub.title}
          </h1>

          <p className="text-xs sm:text-sm font-medium text-[#78716C]">
            <strong>Authors:</strong> {pub.authors}
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap gap-3">
            {pub.arxiv_url && (
              <a
                href={pub.arxiv_url}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#8C5035] text-[#F4EFE6] text-xs font-semibold uppercase tracking-wider transition-all inline-flex items-center gap-2 shadow-sm"
              >
                <span>View on arXiv</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <a
              href="mailto:sumaiya205.akter@gmail.com"
              className="px-5 py-2.5 rounded-full bg-[#FAF8F5] hover:bg-[#EBE5DB] text-[#1C1917] border border-[#E2DCD2] text-xs font-semibold uppercase tracking-wider transition-all inline-flex items-center gap-2"
            >
              <span>Inquire / Request Preprint</span>
            </a>
          </div>
        </div>

        {/* Abstract */}
        <div className="bento-card p-6 sm:p-8 bg-white border border-[#E2DCD2] space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-[#8C5035] font-semibold">
            Abstract &amp; Problem Motivation
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
            {pub.abstract}
          </p>
        </div>

        {/* Dataset & Benchmark Details */}
        {pub.dataset_details && (
          <div className="bento-card p-6 bg-white border border-[#E2DCD2] flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E2DCD2] text-[#8C5035] shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#8C5035] font-semibold">
                Experimental Dataset &amp; Statutory Corpus
              </h3>
              <p className="text-xs sm:text-sm text-[#1C1917] font-medium">{pub.dataset_details}</p>
            </div>
          </div>
        )}

        {/* Experimental Methodology */}
        <div className="bento-card p-6 sm:p-8 bg-white border border-[#E2DCD2] space-y-4">
          <h2 className="display-title text-2xl text-[#1C1917] flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#8C5035]" />
            <span>Research Methodology &amp; Experimental Architecture</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed whitespace-pre-line">
            {pub.methodology}
          </p>
        </div>

        {/* Key Findings */}
        {pub.key_findings && pub.key_findings.length > 0 && (
          <div className="bento-card p-6 sm:p-8 bg-white border border-[#E2DCD2] space-y-4">
            <h2 className="display-title text-2xl text-[#1C1917] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#8C5035]" />
              <span>Key Empirical Results &amp; Quantitative Audit</span>
            </h2>
            <div className="space-y-3">
              {pub.key_findings.map((f, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E2DCD2] flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#8C5035] shrink-0 mt-1.5"></span>
                  <p className="text-xs text-[#57534E] leading-relaxed">{f}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metrics Badge */}
        {pub.metrics && (
          <div className="bento-card p-6 bg-emerald-50/70 border border-emerald-200">
            <div className="text-xs font-mono text-emerald-950">
              <span className="text-emerald-900 font-bold uppercase tracking-wider block mb-1">
                Verified Quantitative Performance:
              </span>
              {pub.metrics}
            </div>
          </div>
        )}

        {/* BibTeX Citation Box */}
        {pub.bibtex && (
          <div className="bento-card p-6 sm:p-8 bg-white border border-[#E2DCD2] space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#8C5035] font-semibold">
              BibTeX Citation
            </h3>
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E2DCD2] overflow-x-auto font-mono text-xs text-[#1C1917]">
              <pre>{pub.bibtex}</pre>
            </div>
          </div>
        )}
      </main>

      {/* Common Footer */}
      <Footer />
    </div>
  );
}
