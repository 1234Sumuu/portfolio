import Link from 'next/link';
import { getDb } from '@/lib/db';
import ProjectCard from '@/components/ProjectCard';
import ResearchCard from '@/components/ResearchCard';
import SectionHeading from '@/components/SectionHeading';
import InquiryForm from '@/components/InquiryForm';
import {
  ArrowRight,
  Download,
  Terminal,
  Cpu,
  Brain,
  ShieldCheck,
  Award,
  Sparkles,
  Layers,
  Database,
  ExternalLink,
  GraduationCap,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { Project, Publication } from '@/lib/types';

export const revalidate = 0; // Dynamic server-side rendering

async function getHomeData() {
  const db = getDb();

  const featuredProjects = db
    .prepare("SELECT * FROM projects WHERE featured = 1 ORDER BY order_index ASC LIMIT 3")
    .all() as any[];

  const liveProjects = db
    .prepare("SELECT * FROM projects WHERE status = 'Live in Production' ORDER BY order_index ASC LIMIT 4")
    .all() as any[];

  const featuredPubs = db
    .prepare("SELECT * FROM publications WHERE featured = 1 ORDER BY year DESC LIMIT 3")
    .all() as any[];

  const parseJsonFields = (p: any): Project => ({
    ...p,
    featured: Boolean(p.featured),
    gallery: p.gallery ? JSON.parse(p.gallery) : [],
    key_features: p.key_features ? JSON.parse(p.key_features) : [],
    technologies: p.technologies ? JSON.parse(p.technologies) : [],
  });

  const parsePubFields = (pub: any): Publication => ({
    ...pub,
    featured: Boolean(pub.featured),
    key_findings: pub.key_findings ? JSON.parse(pub.key_findings) : [],
  });

  return {
    featuredProjects: featuredProjects.map(parseJsonFields),
    liveProjects: liveProjects.map(parseJsonFields),
    featuredPubs: featuredPubs.map(parsePubFields),
  };
}

export default async function HomePage() {
  const { featuredProjects, liveProjects, featuredPubs } = await getHomeData();

  const metricHighlights = [
    { label: 'Software Engineering', value: '5+ Years', sub: 'Backend & Production AI' },
    { label: 'Production AI Deployments', value: '14+ Systems', sub: 'Medical, Agri & Enterprise' },
    { label: 'Academic Publications', value: '6 Papers', sub: 'MDPI, arXiv & JURIX' },
    { label: 'Martial Arts Excellence', value: 'Black Belt', sub: '2x National Taekwondo Gold' },
  ];

  const focusPillars = [
    {
      icon: <Brain className="w-6 h-6 text-emerald-400" />,
      title: 'Multimodal AI & LLM Systems',
      description: 'Designing agentic workflows, vision pipelines for X-ray/CT diagnostics, and low-latency streaming assistants with multi-key failover and atomic rate limits.',
    },
    {
      icon: <Database className="w-6 h-6 text-teal-400" />,
      title: 'High-Reliability Backend Architecture',
      description: 'Building idempotent, server-authoritative REST and WebSocket services using FastAPI, PostgreSQL, Redis, Celery, and Docker with zero-data-loss guarantees.',
    },
    {
      icon: <Cpu className="w-6 h-6 text-cyan-400" />,
      title: 'Empirical Deep Learning Research',
      description: 'Investigating 3D CNNs, radiomics feature fusion, uncertainty-based clinical abstention, and parameter-efficient fine-tuning (QLoRA) on medical benchmarks.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-indigo-400" />,
      title: 'Enterprise Security & Compliance',
      description: 'Engineering IDOR-shielded data isolation, 21 CFR Part 11 audit trails, ALCOA+ data integrity, and privacy-first statutory RAG architectures.',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative pt-8 pb-16 overflow-hidden bg-grid-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Text & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Software Engineer – Backend & Artificial Intelligence</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Intelligent AI Systems</span> & Rigorous Academic Research
              </h1>

              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl">
                I am <span className="text-white font-semibold">Sumaiya Akter</span>. With 5+ years of software engineering experience, I architect production AI platforms (Doctor J, AgroGPT) and conduct empirical research in medical computer vision, large language models, and rights-by-design AI safety.
              </p>

              {/* Status Pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400">
                <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800">
                  📍 Dhaka, Bangladesh
                </span>
                <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-emerald-400">
                  ⚡ Open to Global AI Roles & Funded PhD
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/contact"
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-2"
                >
                  <span>Hire Me / Work With Me</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/research"
                  className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white font-semibold text-sm transition-all border border-zinc-800 active:scale-95 flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  <span>Explore Research</span>
                </Link>

                <a
                  href="/assets/docs/Sumaiya_Akter_CV.pdf"
                  download
                  className="px-4 py-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 text-zinc-300 hover:text-white text-sm font-medium transition-all border border-zinc-800/60 flex items-center gap-1.5"
                  title="Download Official CV"
                >
                  <Download className="w-4 h-4" />
                  <span>CV</span>
                </a>
              </div>
            </div>

            {/* Right Column: Authentic Professional Portrait Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group w-full max-w-sm">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 blur-xl opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative rounded-2xl border border-zinc-800/80 bg-zinc-900/90 overflow-hidden shadow-2xl backdrop-blur-md">
                  <div className="h-80 sm:h-96 w-full relative overflow-hidden bg-zinc-950">
                    <img
                      src="/assets/images/sumaiya-portrait.jpg"
                      alt="Sumaiya Akter - Professional Portrait"
                      className="w-full h-full object-cover object-top filter contrast-[1.02] group-hover:scale-102 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>
                  </div>

                  {/* Portrait Caption & Badges */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-white text-base">Sumaiya Akter</h3>
                        <p className="text-xs text-zinc-400">Software Engineer – AI Team @ ACI Ltd</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Verified
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-800/60 text-[11px] font-mono text-zinc-400">
                      <div>
                        <span className="text-zinc-500">Degree:</span> BSc in CSE (ULAB)
                      </div>
                      <div>
                        <span className="text-zinc-500">IELTS:</span> 6.5 / 9.0
                      </div>
                      <div>
                        <span className="text-zinc-500">HackerRank:</span> 5-Star SQL
                      </div>
                      <div>
                        <span className="text-zinc-500">Taekwondo:</span> Black Belt
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Strip */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-sm">
            {metricHighlights.map((m, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
                  {m.value}
                </div>
                <div className="text-xs font-semibold text-emerald-400">{m.label}</div>
                <div className="text-[11px] text-zinc-500">{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Pillars of Core Expertise */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Core Competencies"
          title="Bridging Theoretical AI with Production Engineering"
          description="A rare intersection of production backend reliability and scientific deep learning experimentation."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {focusPillars.map((p, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all duration-300 space-y-4"
            >
              <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 w-fit">
                {p.icon}
              </div>
              <h3 className="font-bold text-white text-base">{p.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Live Production Systems */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Production Showcase"
          title="Mission-Critical AI Products Deployed at Scale"
          description="Real production applications engineered for healthcare, agriculture, and commerce with verified uptime and real-world impact."
          linkText="View All 14 Projects"
          linkHref="/projects"
        />

        <div className="space-y-8">
          {featuredProjects.map((project, idx) => (
            <ProjectCard key={project.id} project={project} featuredLayout={true} />
          ))}
        </div>
      </section>

      {/* 4. Academic Research & Publications */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Academic Rigor"
          title="Peer-Reviewed Publications & Clinical AI Research"
          description="Rigorous experimental papers covering parameter-efficient LLM radiology generation, 3D CT nodule classification, and rights-by-design legal AI."
          linkText="Explore Complete Research Portfolio"
          linkHref="/research"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {featuredPubs.map((pub) => (
            <ResearchCard key={pub.id} publication={pub} />
          ))}
        </div>
      </section>

      {/* 5. Production Reliability Architecture Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/60 to-zinc-950/80 backdrop-blur-md space-y-8">
          <div className="max-w-2xl space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              System Resilience In Practice
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              How I Engineer Zero-Loss Production AI Gateways
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Real-world systems fail when third-party AI APIs throttle or drop connections. Here is the architectural paradigm deployed across Doctor J and AgroGPT:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2.5">
              <div className="font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>5-Key Rotation Manager</span>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                Automatic round-robin failover with an isolated 60-second quarantine cooldown pool upon receiving HTTP 429 rate limit errors from upstream model providers.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2.5">
              <div className="font-mono text-teal-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                <span>Atomic Lua Quotas</span>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                Race-condition-proof Redis token increment and rate limiting executed atomically via single Lua scripts to protect infrastructure budgets.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2.5">
              <div className="font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>Server-Authoritative SSE</span>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                Database message records are allocated pre-stream and buffered in Redis during generation, ensuring partial streams are never corrupted by client disconnects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Direct Collaboration & Inquiries Form */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/50 p-8 sm:p-12 backdrop-blur-md">
          <SectionHeading
            kicker="Initiate Collaboration"
            title="Let's Build Impactful Technology Together"
            description="Whether you are an international hiring manager, a startup founder needing production AI engineering, or a university research lab seeking a PhD student / Research Assistant."
            align="center"
          />

          <InquiryForm />
        </div>
      </section>
    </div>
  );
}
