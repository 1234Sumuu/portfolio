import Link from 'next/link';
import { getDb } from '@/lib/db';
import ResearchCard from '@/components/ResearchCard';
import SectionHeading from '@/components/SectionHeading';
import {
  GraduationCap,
  Download,
  BookOpen,
  Database,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
  Eye,
} from 'lucide-react';
import { Publication } from '@/lib/types';

export const revalidate = 0;

export default function ResearchPage() {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM publications ORDER BY year DESC, id ASC').all() as any[];

  const publications: Publication[] = rows.map((r) => ({
    ...r,
    featured: Boolean(r.featured),
    key_findings: r.key_findings ? JSON.parse(r.key_findings) : [],
  }));

  const researchThemes = [
    {
      title: 'Multimodal Radiology & Medical AI',
      desc: 'Parameter-efficient fine-tuning (QLoRA) on vision-language models for automated radiology report generation; deep learning segmentation and tissue classification in chronic wound care.',
    },
    {
      title: 'Empirical 3D Deep Learning & Uncertainty',
      desc: 'Benchmarking 3D CNNs (ResNet3D, MSNet3D) vs. handcrafted radiomics; uncertainty-based selective abstention raising diagnostic accuracy; evaluating Grad-CAM++ and Integrated Gradients faithfulness.',
    },
    {
      title: 'Rights-by-Design & Legal AI Safety',
      desc: 'Bilingual retrieval-augmented legal assistants; empirical audits of fluency vs. statutory evidential grounding; evaluating privacy leakages, transactional memory erasure, and cache-collision vulnerabilities.',
    },
    {
      title: 'Resource-Aware & Energy-Efficient LLMs',
      desc: 'Benchmarking token-level latency, power consumption, and quantization trade-offs across open weights (vLLM, Unsloth, QLoRA) for sustainable deployment.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Research & Scholarly Publications</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Scientific Publications, Preprints & Working Manuscripts
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            My academic inquiry centers on clinical medical computer vision, parameter-efficient language model fine-tuning, uncertainty-based diagnostic abstention, and safe retrieval-augmented generation. Each paper represents empirical experiments with open datasets, ablation studies, and reproducible methodologies.
          </p>
        </div>

        {/* Academic Profiles & CV Button */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="p-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Academic Profiles & Identifiers
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <a
                href="https://scholar.google.com"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
              >
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Google Scholar</span>
              </a>
              <a
                href="https://orcid.org"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
              >
                <span>ORCID Profile</span>
              </a>
            </div>
            <div className="pt-1">
              <a
                href="/assets/docs/Sumaiya_Akter_CV.pdf"
                target="_blank"
                rel="noreferrer"
                className="w-full px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-all inline-flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Academic CV (PDF)</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Research Pillars */}
      <section className="space-y-6">
        <SectionHeading
          kicker="Research Vectors"
          title="Active Research Programs"
          description="Areas of ongoing scholarly investigation targeted for graduate collaboration and funded PhD research."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {researchThemes.map((theme, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 space-y-3"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold">
                0{idx + 1}
              </div>
              <h3 className="font-bold text-white text-base leading-snug">{theme.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{theme.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* All Publications Cards */}
      <section className="space-y-6">
        <SectionHeading
          kicker="Published Literature"
          title="Papers, Preprints & Registered Monograph"
          description="Detailed overview of research contributions with quantitative evaluation metrics, dataset benchmarks, and BibTeX citations."
        />

        <div className="space-y-6">
          {publications.map((pub) => (
            <ResearchCard key={pub.id} publication={pub} />
          ))}
        </div>
      </section>
    </div>
  );
}
