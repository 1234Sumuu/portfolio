import Link from 'next/link';
import { getDb } from '@/lib/db';
import SectionHeading from '@/components/SectionHeading';
import {
  GraduationCap,
  Briefcase,
  Award,
  BookOpen,
  Target,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Mail,
  Heart,
  Flame,
} from 'lucide-react';

export const revalidate = 0;

export default function AboutPage() {
  const db = getDb();
  const experiences = db
    .prepare('SELECT * FROM experiences ORDER BY order_index ASC')
    .all() as any[];

  const researchInterests = [
    'Artificial Intelligence & Machine Learning',
    'Multimodal Computer Vision & Image Processing',
    'Large Language Models (LLMs) & Reasoning',
    'Retrieval-Augmented Generation (RAG) Architectures',
    'AI Agents & Autonomous Workflows',
    'Medical AI & Clinical Decision Support Systems',
    'Explainable AI (XAI) & Interpretability',
    'Parameter-Efficient Deep Learning (LoRA/QLoRA)',
    'Resource-Aware & Energy-Efficient AI (RAEE)',
    'Distributed Systems & Backend Reliability'
  ];

  const engineeringPrinciples = [
    {
      title: 'Reliability Before Novelty',
      desc: 'An AI feature that fails 5% of the time under concurrency is an operational liability. I design resilient fallback cascades, atomic rate limiters, and server-authoritative persistence so services stay bulletproof in production.',
    },
    {
      title: 'Empirical Skepticism & Grounding',
      desc: 'Whether in academic papers or enterprise software, metrics without rigorous calibration, cross-validation, and leak-free splits are misleading. I value honest limitations and uncertainty-aware abstention over hyped claims.',
    },
    {
      title: 'Clean Architecture & Maintainability',
      desc: 'Codebases should outlast individual frameworks. I prioritize decoupled modular boundaries, explicit typing with TypeScript and Pydantic, comprehensive OpenAPI documentation, and containerized Docker topologies.',
    },
    {
      title: 'Discipline & Resilience',
      desc: 'As a competitive Taekwondo Black Belt and national gold medalist, the grit, tactical patience, and relentless practice required on the competition mat directly translate into debugging stubborn memory leaks and training deep neural models.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* 1. Header & Overview */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-8 space-y-6">
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            Professional Biography
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Engineer by Practice, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Researcher by Intellectual Curiosity
            </span>
          </h1>

          <div className="space-y-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
            <p>
              I am a Software Engineer with <strong className="text-white">over 5 years of software engineering experience</strong>, currently serving on the Artificial Intelligence Team at <strong className="text-white">ACI Limited</strong> in Dhaka, Bangladesh.
            </p>
            <p>
              My work focuses on the intersection of <strong className="text-white">deep learning research</strong> and <strong className="text-white">production backend engineering</strong>. Over the past half-decade, I have designed, architected, and deployed scalable microservices, multimodal AI diagnostics, enterprise e-commerce platforms, and legal-tech systems used by hundreds of daily active professionals.
            </p>
            <p>
              In parallel with commercial software development, I actively conduct scientific research. My published and working papers explore parameter-efficient fine-tuning for clinical report generation (LLaMA-XR, accepted in <em>Bioengineering</em>, MDPI), 3D convolutional neural networks with uncertainty-based abstention for thoracic nodule classification, and rights-by-design audits of retrieval-augmented systems (RT4RJ @ JURIX 2026).
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-all"
            >
              Contact Me Directly
            </Link>
            <a
              href="/assets/docs/Sumaiya_Akter_CV.pdf"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-semibold transition-all inline-flex items-center gap-1.5"
            >
              <span>Preview Official CV (PDF)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Profile Card with Photo */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-5 backdrop-blur-sm">
            <div className="aspect-square rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800">
              <img
                src="/assets/images/sumaiya-profile.png"
                alt="Sumaiya Akter"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-white text-base">Sumaiya Akter</h3>
              <p className="text-xs text-emerald-400 font-mono">Software Engineer – AI & Backend</p>
              <p className="text-xs text-zinc-400">Aftabnagar, Dhaka-1212, Bangladesh</p>
            </div>
            <div className="pt-3 border-t border-zinc-800 text-xs space-y-2 text-zinc-400">
              <div className="flex justify-between">
                <span className="text-zinc-500">Email:</span>
                <a href="mailto:sumaiya205.akter@gmail.com" className="text-zinc-200 hover:text-emerald-400">
                  sumaiya205.akter@gmail.com
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Phone:</span>
                <span className="text-zinc-200">+880 1789-531474</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">IELTS Score:</span>
                <span className="text-emerald-400 font-mono">6.5 (L:7.5, S:7.0)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Martial Arts:</span>
                <span className="text-zinc-200">Taekwondo Black Belt</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Education & Academic Background */}
      <section className="space-y-8">
        <SectionHeading
          kicker="Academic Foundations"
          title="Education & Credentials"
          description="Rigorous academic training grounded in computer science, software engineering, and continuous scholarly inquiry."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ULAB Degree Card */}
          <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                2017 – 2021
              </span>
              <span className="text-xs font-mono text-zinc-400">Dhaka, Bangladesh</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">
                Bachelor of Science in Computer Science and Engineering (BSc in CSE)
              </h3>
              <p className="text-xs text-zinc-400 font-medium">
                University of Liberal Arts Bangladesh (ULAB)
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <div className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300">
                CGPA: <strong className="text-emerald-400 font-bold">3.11</strong> / 4.00
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300">
                Conferred: Oct 20, 2021
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed pt-2">
              Core coursework: Data Structures, Algorithms, Discrete Mathematics, Operating Systems, Relational Database Management Systems (RDBMS), Software Engineering, Object-Oriented Programming (Java/C++), and Computer Vision.
            </p>

            <div className="pt-2">
              <a
                href="/assets/docs/Academic_Transcripts_and_Certificates.pdf"
                download
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors inline-flex items-center gap-1"
              >
                <span>View Official Degree & Transcript PDF</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Standardized Test & Academic Certifications */}
          <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Standardized Evaluation
              </span>
              <span className="text-xs font-mono text-zinc-400">International Testing</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">
                IELTS Academic & Technical Badges
              </h3>
              <p className="text-xs text-zinc-400 font-medium">
                British Council / IDP & HackerRank
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800">
                <div className="text-zinc-500 text-[10px]">IELTS Overall:</div>
                <div className="text-emerald-400 font-bold text-sm">6.5 / 9.0</div>
                <div className="text-zinc-400 text-[10px]">Listening: 7.5 | Speaking: 7.0</div>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800">
                <div className="text-zinc-500 text-[10px]">HackerRank:</div>
                <div className="text-amber-400 font-bold text-sm">5-Star SQL Badge</div>
                <div className="text-zinc-400 text-[10px]">Advanced Database Queries</div>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Certification on Thesis Selection & Research Writing (Abartan)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Professional Skills Development Program: &quot;Skills for Career&quot;</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Research Interests */}
      <section className="space-y-8">
        <SectionHeading
          kicker="Scientific Agenda"
          title="Core Research Interests"
          description="The technical problems I am actively investigating and targeting for graduate research and academic collaboration."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {researchInterests.map((interest, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/30 hover:border-zinc-700 flex items-center gap-3 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono text-xs shrink-0">
                {idx + 1}
              </div>
              <span className="text-xs font-semibold text-zinc-200">{interest}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Engineering Principles */}
      <section className="space-y-8">
        <SectionHeading
          kicker="Engineering Mindset"
          title="Engineering & Research Philosophy"
          description="The operating principles that guide my architectural choices and scientific evaluations."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {engineeringPrinciples.map((principle, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 space-y-2.5"
            >
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>{principle.title}</span>
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{principle.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Martial Arts Discipline & Perseverance */}
      <section className="p-8 sm:p-10 rounded-3xl border border-zinc-800 bg-gradient-to-r from-zinc-900/90 via-zinc-900/50 to-zinc-950 p-6 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
              Discipline & Athletic Excellence
            </span>
            <h2 className="text-2xl font-bold text-white">Taekwondo Black Belt & National Competitor</h2>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
            2x National Gold Medalist
          </span>
        </div>

        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-4xl">
          Beyond software engineering and mathematical modeling, martial arts has been a defining pillar of my personal discipline. Training in Taekwondo to achieve a certified <strong className="text-white">Black Belt (1st Dan)</strong> and competing at the national level taught me that breakthrough performance requires thousands of hours of quiet, unglamorous repetition, physical resilience under pressure, and mental clarity when facing difficult challenges.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
            <div className="text-amber-400 font-bold">🥇 Gold Medal (2024)</div>
            <div className="text-zinc-300 font-semibold mt-1">Independence Day Championship</div>
            <div className="text-zinc-500 text-[11px]">Bangladesh Taekwondo Federation</div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
            <div className="text-amber-400 font-bold">🥇 Gold Medal (2024)</div>
            <div className="text-zinc-300 font-semibold mt-1">4th Federation Cup</div>
            <div className="text-zinc-500 text-[11px]">Senior Sparring Division</div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
            <div className="text-amber-400 font-bold">🥉 2x Bronze Medals (2023)</div>
            <div className="text-zinc-300 font-semibold mt-1">4th Wadokai Karate Cup</div>
            <div className="text-zinc-500 text-[11px]">Kata & Kumite Events</div>
          </div>
        </div>
      </section>

      {/* 6. Academic Referees & Mentors */}
      <section className="space-y-8">
        <SectionHeading
          kicker="Verification & Endorsement"
          title="Academic Mentors & Referees"
          description="Senior university faculty who supervised my undergraduate academic journey at ULAB."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-3">
            <div className="space-y-1">
              <h3 className="font-bold text-white text-base">Prof. M. Mofazzal Hossain, PhD, SMIEEE</h3>
              <p className="text-xs text-emerald-400 font-mono">
                Professor and Dean, School of Science and Engineering
              </p>
              <p className="text-xs text-zinc-400">
                University of Liberal Arts Bangladesh (ULAB)
              </p>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              688 Beribadh Road, Mohammadpur, Dhaka-1207, Bangladesh
            </p>
            <div className="pt-2 text-xs font-mono">
              <a
                href="mailto:mofazzal.hossain@ulab.edu.bd"
                className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>mofazzal.hossain@ulab.edu.bd</span>
              </a>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-3">
            <div className="space-y-1">
              <h3 className="font-bold text-white text-base">Muhammad Golam Kibria, Ph.D., SMIEEE</h3>
              <p className="text-xs text-emerald-400 font-mono">
                Professor, Department of Computer Science and Engineering
              </p>
              <p className="text-xs text-zinc-400">
                University of Liberal Arts Bangladesh (ULAB)
              </p>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              School of Science & Engineering, Dhaka, Bangladesh
            </p>
            <div className="pt-2 text-xs font-mono">
              <a
                href="mailto:golam.kibria@ulab.edu.bd"
                className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>golam.kibria@ulab.edu.bd</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
