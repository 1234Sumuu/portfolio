import Link from 'next/link';
import { getDb } from '@/lib/db';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ResearchCard from '@/components/ResearchCard';
import {
  GraduationCap,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Database,
  Cpu,
  Layers,
  FileText
} from 'lucide-react';
import { Publication } from '@/lib/types';

export const revalidate = 0;

export default function ResearchPage() {
  let publications: Publication[] = [];
  try {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM publications ORDER BY year DESC, id ASC').all() as any[];

    publications = rows.map((r) => ({
      ...r,
      featured: Boolean(r.featured),
      key_findings: r.key_findings ? JSON.parse(r.key_findings) : [],
    }));
  } catch (err) {
    console.error('Error loading publications:', err);
  }

  const researchThemes = [
    {
      title: 'Multimodal Radiology & Medical AI',
      desc: 'Parameter-efficient fine-tuning (QLoRA) on vision-language models for automated radiology report generation; deep learning segmentation and tissue classification in chronic wound care.',
    },
    {
      title: 'Rights-by-Design & Legal AI Safety',
      desc: 'Bilingual retrieval-augmented legal assistants; empirical audits of fluency vs. statutory evidential grounding; evaluating privacy leakages, transactional memory erasure, and cache-collision vulnerabilities (RT4RJ @ JURIX 2026).',
    },
    {
      title: 'Empirical 3D Deep Learning & Uncertainty',
      desc: 'Benchmarking 3D CNNs (ResNet3D, MSNet3D) vs. handcrafted radiomics; uncertainty-based selective abstention raising diagnostic accuracy; evaluating Grad-CAM++ and Integrated Gradients faithfulness.',
    },
    {
      title: 'Resource-Aware & Energy-Efficient LLMs',
      desc: 'Benchmarking token-level latency, power consumption, and quantization trade-offs across open weights (vLLM, Unsloth, QLoRA) for sustainable deployment.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4EFE6] text-[#1C1917] flex flex-col font-sans selection:bg-[#1C1917] selection:text-[#F4EFE6]">
      {/* Common Sticky Header */}
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-[#E2DCD2] pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#78716C] hover:text-[#1C1917] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Main Portfolio</span>
          </Link>

          <span className="text-xs font-mono text-[#8C5035]">
            Scholarly Contributions
          </span>
        </div>

        {/* Hero Section */}
        <div className="bento-card p-6 sm:p-10 bg-[#EBE5DB] border border-[#E2DCD2]">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white border border-[#E2DCD2] text-[11px] font-semibold tracking-widest uppercase text-[#8C5035] flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Academic Research &amp; Scholarly Publications</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-[#1C1917] text-[#F4EFE6] text-[11px] font-mono font-medium">
                {publications.length} Manuscripts
              </span>
            </div>

            <h1 className="display-title text-4xl sm:text-5xl lg:text-6xl text-[#1C1917] tracking-tight leading-none">
              SCIENTIFIC PUBLICATIONS &amp; PREPRINTS
            </h1>

            <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed max-w-2xl">
              Academic research centered on clinical medical AI, parameter-efficient language model fine-tuning (PEFT/QLoRA), uncertainty-based diagnostic abstention, and safe retrieval-augmented generation (RAG audits). Each manuscript represents empirical experiments with reproducible benchmarks.
            </p>

            <div className="pt-2 flex flex-wrap gap-2.5">
              <a
                href="https://scholar.google.com"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-full bg-white border border-[#E2DCD2] text-xs font-semibold uppercase tracking-wider text-[#1C1917] hover:bg-[#1C1917] hover:text-[#F4EFE6] transition-all inline-flex items-center gap-1.5 shadow-sm"
              >
                <GraduationCap className="w-3.5 h-3.5 text-[#8C5035]" />
                <span>Google Scholar</span>
              </a>
              <a
                href="https://orcid.org"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-full bg-white border border-[#E2DCD2] text-xs font-semibold uppercase tracking-wider text-[#1C1917] hover:bg-[#1C1917] hover:text-[#F4EFE6] transition-all inline-flex items-center gap-1.5 shadow-sm"
              >
                <span>ORCID Profile</span>
              </a>
            </div>
          </div>
        </div>

        {/* Research Programs Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2DCD2]">
            <h2 className="display-title text-2xl text-[#1C1917]">CORE RESEARCH VECTORS</h2>
            <span className="font-script text-lg text-[#8C827A]">Empirical Methodology</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {researchThemes.map((theme, idx) => (
              <div
                key={idx}
                className="bento-card p-5 bg-white border border-[#E2DCD2] flex flex-col justify-between"
              >
                <div>
                  <div className="w-7 h-7 rounded-lg bg-[#FAF8F5] border border-[#E2DCD2] flex items-center justify-center text-[#8C5035] font-mono text-xs font-bold mb-3">
                    0{idx + 1}
                  </div>
                  <h3 className="font-bold text-[#1C1917] text-sm leading-snug mb-2">{theme.title}</h3>
                  <p className="text-xs text-[#57534E] leading-relaxed">{theme.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* All Publications Cards */}
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2DCD2]">
            <div>
              <h2 className="display-title text-2xl text-[#1C1917]">PEER-REVIEWED PAPERS &amp; WORKING MANUSCRIPTS</h2>
              <p className="text-xs text-[#78716C] uppercase tracking-wider mt-0.5">
                Detailed methodologies, statutory corpus benchmarks, and citation BibTeX
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {publications.map((pub) => (
              <ResearchCard key={pub.id} publication={pub} />
            ))}
          </div>
        </section>
      </main>

      {/* Common Footer */}
      <Footer />
    </div>
  );
}
