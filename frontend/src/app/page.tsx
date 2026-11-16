'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Github,
  Linkedin,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Download,
  ArrowUpRight,
  ExternalLink,
  CheckCircle2,
  Send,
  Loader2,
  Copy,
  Check,
  Award,
  Layers,
  Cpu,
  ShieldCheck,
  Brain,
  Code2,
  BookOpen,
  FileText,
  Calendar,
  Building,
  Sparkles,
  Eye,
} from 'lucide-react';
import ResumeModal from '@/components/ResumeModal';
import Footer from '@/components/Footer';

export default function HomePage() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    organization: '',
    intent: 'hire',
    subject: '',
    message: '',
  });
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState('');

  const copyEmail = () => {
    navigator.clipboard.writeText('sumaiya205.akter@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryLoading(true);
    setInquiryError('');
    setInquirySuccess(false);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit inquiry');
      setInquirySuccess(true);
      setInquiryForm({
        name: '',
        email: '',
        organization: '',
        intent: 'hire',
        subject: '',
        message: '',
      });
    } catch (err: any) {
      setInquiryError(err.message || 'Something went wrong. Please reach out via email.');
    } finally {
      setInquiryLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4EFE6] text-[#1C1917] flex flex-col justify-between">
      {/* ========================================================= */}
      {/* TOP HEADER / HERO (Editorial Magazine Aesthetic) */}
      {/* ========================================================= */}
      <section className="pt-6 sm:pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-[#E2DCD2]">
        <div className="max-w-6xl mx-auto">
          {/* Top category label & social icons row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2DCD2]/70 text-xs uppercase tracking-widest text-[#78716C]">
            {/* Scrollable Navigation Tabs */}
            <nav className="flex items-center gap-5 sm:gap-7 overflow-x-auto no-scrollbar py-1 scroll-smooth font-semibold text-[#57534E]">
              <a
                href="#projects"
                className="hover:text-[#1C1917] transition-colors whitespace-nowrap py-1 border-b border-transparent hover:border-[#1C1917]"
              >
                My Work
              </a>
              <a
                href="#experience"
                className="hover:text-[#1C1917] transition-colors whitespace-nowrap py-1 border-b border-transparent hover:border-[#1C1917]"
              >
                Experience
              </a>
              <a
                href="#research"
                className="hover:text-[#1C1917] transition-colors whitespace-nowrap py-1 border-b border-transparent hover:border-[#1C1917]"
              >
                Research
              </a>
              <a
                href="#about"
                className="hover:text-[#1C1917] transition-colors whitespace-nowrap py-1 border-b border-transparent hover:border-[#1C1917]"
              >
                Who Am I
              </a>
              <a
                href="#skills"
                className="hover:text-[#1C1917] transition-colors whitespace-nowrap py-1 border-b border-transparent hover:border-[#1C1917]"
              >
                Skills
              </a>
              <a
                href="#awards"
                className="hover:text-[#1C1917] transition-colors whitespace-nowrap py-1 border-b border-transparent hover:border-[#1C1917]"
              >
                Honors
              </a>
              <a
                href="#contact"
                className="hover:text-[#1C1917] transition-colors whitespace-nowrap py-1 border-b border-transparent hover:border-[#1C1917]"
              >
                Contact
              </a>
            </nav>

            <div className="flex items-center gap-4 self-end sm:self-auto shrink-0">
              <a
                href="https://github.com/1234Sumuu"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#1C1917] transition-colors"
                aria-label="GitHub"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/in/sumaiya-akter"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#1C1917] transition-colors"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://scholar.google.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#1C1917] transition-colors"
                aria-label="Google Scholar"
                title="Google Scholar"
              >
                <GraduationCap className="w-4 h-4" />
              </a>
              <a
                href="mailto:sumaiya205.akter@gmail.com"
                className="hover:text-[#1C1917] transition-colors"
                aria-label="Email"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Hero Headline & Portrait Banner */}
          <div className="pt-10 pb-6 relative">
            <div className="text-center relative">
              <span className="font-script text-4xl sm:text-5xl md:text-6xl text-[#8C5035] block -mb-4 sm:-mb-6 z-10 relative">
                Sumaiya&apos;s
              </span>
              <h1 className="display-title text-7xl sm:text-9xl md:text-[148px] tracking-tight text-[#1C1917] select-none">
                PORTFOLIO
              </h1>
              <div className="flex flex-col sm:flex-row items-center justify-between mt-4 text-xs sm:text-sm text-[#57534E] max-w-5xl mx-auto gap-4">
                <p className="text-left max-w-md font-normal leading-relaxed">
                  5+ years building and deploying production AI systems, multimodal LLM applications, and resilient backend architectures.
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href="#projects"
                    className="px-5 py-2.5 rounded-full bg-[#1C1917] text-[#F4EFE6] text-xs uppercase font-medium tracking-wider hover:bg-[#292524] transition-all shadow-sm"
                  >
                    Explore Systems
                  </a>
                  <button
                    onClick={() => setShowResumeModal(true)}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#1C1917] text-[#1C1917] text-xs uppercase font-medium tracking-wider hover:bg-[#1C1917] hover:text-[#F4EFE6] transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview CV</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Portrait Banner with Real Photograph */}
            <div className="mt-10 relative max-w-5xl mx-auto rounded-3xl overflow-hidden border border-[#E2DCD2] bg-[#EBE5DB] shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-12 items-center">
                {/* Bigger Text Column (8 cols) */}
                <div className="md:col-span-8 p-7 sm:p-10 lg:p-12 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-block px-3 py-1 rounded-full bg-white border border-[#E2DCD2] text-[11px] font-medium tracking-widest uppercase text-[#57534E]">
                      Dhaka, Bangladesh
                    </span>
                    <span className="inline-block px-3 py-1 rounded-full bg-[#8C5035]/10 text-[#8C5035] text-[11px] font-semibold tracking-wider uppercase">
                      5+ Years Experience
                    </span>
                  </div>

                  <div>
                    <h2 className="display-title text-4xl sm:text-5xl lg:text-6xl text-[#1C1917] leading-none tracking-tight">
                      SUMAIYA AKTER
                    </h2>
                    <p className="font-display text-sm sm:text-base uppercase tracking-wider text-[#8C5035] font-semibold mt-2">
                      Software Engineer – AI &amp; Backend @ ACI Limited
                    </p>
                  </div>

                  <p className="text-xs sm:text-[13px] text-[#57534E] leading-relaxed max-w-2xl">
                    Specializing in production AI systems, LLM workflows, and resilient backend architectures using <strong>Python, FastAPI, PostgreSQL, Redis, OpenAI, Gemini, RAG, and Docker</strong>. Medical AI Researcher with publications in <strong>MDPI Bioengineering</strong> and <strong>JURIX</strong>, and <strong>2x National Taekwondo Gold Medalist</strong> (Black Belt).
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/80 border border-[#E2DCD2] text-[#1C1917]">
                      <div className="text-[10px] text-[#78716C] uppercase font-mono tracking-wider">Current Focus</div>
                      <div className="font-bold text-xs mt-0.5">Production AI Systems</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/80 border border-[#E2DCD2] text-[#1C1917]">
                      <div className="text-[10px] text-[#78716C] uppercase font-mono tracking-wider">Core Stack</div>
                      <div className="font-bold text-xs mt-0.5">FastAPI • Redis • Celery</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/80 border border-[#E2DCD2] text-[#1C1917] col-span-2 sm:col-span-1">
                      <div className="text-[10px] text-[#78716C] uppercase font-mono tracking-wider">Research / Honors</div>
                      <div className="font-bold text-xs mt-0.5">Bioengineering • Black Belt</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={copyEmail}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-[#E2DCD2] text-xs font-mono text-[#1C1917] hover:bg-[#F4EFE6] transition-colors shadow-sm"
                    >
                      {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedEmail ? 'Copied Email' : 'sumaiya205.akter@gmail.com'}</span>
                    </button>
                    <button
                      onClick={() => setShowResumeModal(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1C1917] text-[#F4EFE6] text-xs font-medium tracking-wider uppercase hover:bg-[#292524] transition-all shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview CV</span>
                    </button>
                  </div>
                </div>

                {/* Smaller Picture Column (4 cols) */}
                <div className="md:col-span-4 p-4 md:p-6 md:pl-0 flex items-center justify-center">
                  <div className="relative h-72 sm:h-80 md:h-[380px] w-full max-w-[280px] md:max-w-none rounded-2xl overflow-hidden border border-[#E2DCD2] bg-[#E5DFD4] shadow-sm">
                    <Image
                      src="/assets/images/sumaiya-portrait.jpg"
                      alt="Sumaiya Akter - Software Engineer & AI Researcher"
                      fill
                      className="object-cover object-top"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/20 via-transparent to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* BENTO GRID MAIN BODY */}
      {/* ========================================================= */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 space-y-8">

        {/* ROW 1: WHO AM I & QUALIFICATIONS */}
        <div id="about" className="grid grid-cols-1 lg:grid-cols-12 gap-6 scroll-mt-8">
          {/* WHO AM I CARD */}
          <div className="lg:col-span-6 bento-card p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E2DCD2]">
                <h2 className="display-title text-3xl text-[#1C1917]">WHO AM I</h2>
                <span className="font-script text-xl text-[#8C827A]">biography</span>
              </div>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                <div className="sm:col-span-7 space-y-3 text-xs sm:text-[13px] text-[#57534E] leading-relaxed">
                  <p>
                    I am a Software Engineer with <strong>5+ years of software engineering experience</strong> specializing in AI/ML, LLM applications, backend engineering, and production AI systems at <strong>ACI Limited</strong>.
                  </p>
                  <p>
                    I design and deploy intelligent, robust applications using <strong>Python, FastAPI, PostgreSQL, Redis, OpenAI, Gemini, RAG, AI Agents, Docker</strong>, and cloud/on-prem GPU infrastructure.
                  </p>
                  <p>
                    My core technical focus spans API reliability, authentication, idempotency, streaming responses, patient data isolation, and bridging academic deep learning with clinical workflows.
                  </p>
                </div>

                {/* Framed Polaroid Photo */}
                <div className="sm:col-span-5 flex flex-col items-center">
                  <div className="polaroid-frame transform rotate-1 hover:rotate-0 transition-transform duration-300 w-full max-w-[190px]">
                    <div className="relative aspect-square w-full rounded overflow-hidden bg-stone-100">
                      <Image
                        src="/assets/images/sumaiya-portrait.jpg"
                        alt="Sumaiya Akter Polaroid"
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    <p className="font-script text-center text-sm text-[#8C5035] mt-2 leading-tight">
                      Systems Architect. <br />Black Belt. ♡
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E2DCD2] flex items-center justify-between text-xs text-[#78716C]">
              <span>Location: Aftabnagar, Dhaka</span>
              <span className="text-[11px] font-medium text-[#8C5035]">Phone available on request</span>
            </div>
          </div>

          {/* QUALIFICATIONS / CORE TECH CARD */}
          <div id="skills" className="lg:col-span-6 bento-card p-6 sm:p-8 flex flex-col justify-between scroll-mt-8">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E2DCD2]">
                <h2 className="display-title text-3xl text-[#1C1917]">QUALIFICATIONS</h2>
                <span className="font-script text-xl text-[#8C827A]">technical stack</span>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                {/* List of Skills */}
                <div className="sm:col-span-7 space-y-3.5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F4EFE6] border border-[#E2DCD2] flex items-center justify-center shrink-0 mt-0.5 text-[#1C1917]">
                      <Brain className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">AI & LLM Frameworks</h3>
                      <p className="text-[11px] text-[#57534E] leading-snug">
                        LangGraph, LangChain, LlamaIndex, Gemini SDK, PyTorch, LoRA/QLoRA, vLLM, Unsloth, MCP
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F4EFE6] border border-[#E2DCD2] flex items-center justify-center shrink-0 mt-0.5 text-[#1C1917]">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">Backend & Architecture</h3>
                      <p className="text-[11px] text-[#57534E] leading-snug">
                        FastAPI, Python, PostgreSQL, Redis, Celery, Docker, Linux, WebSockets, REST APIs
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F4EFE6] border border-[#E2DCD2] flex items-center justify-center shrink-0 mt-0.5 text-[#1C1917]">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">Security & Reliability</h3>
                      <p className="text-[11px] text-[#57534E] leading-snug">
                        Google OAuth, RBAC, IDOR Prevention, Rate Limiting, Idempotency, Quotas, Data Isolation
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F4EFE6] border border-[#E2DCD2] flex items-center justify-center shrink-0 mt-0.5 text-[#1C1917]">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">Vector DBs & Vision</h3>
                      <p className="text-[11px] text-[#57534E] leading-snug">
                        Qdrant, pgvector, MinIO, 3D CNNs, OpenCV, YOLO, Document AI, OCR
                      </p>
                    </div>
                  </div>
                </div>

                {/* Notebook Paper Note */}
                <div className="sm:col-span-5 notepad-card p-4 rounded-xl flex flex-col justify-between h-full min-h-[190px]">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#8C827A] block">
                      Guiding Principle
                    </span>
                    <p className="font-script text-base text-[#1C1917] mt-3 leading-snug">
                      Good architecture builds real impact. Systems must be reliable, idempotent &amp; production-tested. ♡
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[#F0EAE1] text-[10px] text-[#8C827A]">
                    5+ Yrs Software Engineering
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E2DCD2] flex items-center justify-between text-xs text-[#78716C]">
              <span>Degree: BSc in CSE, ULAB (CGPA 3.11)</span>
              <span>HackerRank 5-Star SQL</span>
            </div>
          </div>
        </div>

        {/* ROW 2: WORK EXPERIENCE (Full Width Bento Card) */}
        <div id="experience" className="bento-card p-6 sm:p-8 scroll-mt-8">
          <div className="flex items-center justify-between pb-4 border-b border-[#E2DCD2]">
            <div>
              <h2 className="display-title text-3xl text-[#1C1917]">WORK EXPERIENCE</h2>
              <p className="text-xs text-[#78716C] uppercase tracking-wider mt-0.5">Chronological Career &amp; Engineering Roles from CV</p>
            </div>
            <span className="font-script text-xl text-[#8C827A]">5+ Years</span>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Role 1: ACI Limited */}
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E2DCD2] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-[#8C5035] font-medium uppercase tracking-wider mb-2">
                  <span>Jan 2026 – Present</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">Current</span>
                </div>
                <h3 className="text-sm font-bold text-[#1C1917]">Software Engineer – Backend (AI Team)</h3>
                <p className="text-xs font-medium text-[#78716C] mb-3">ACI Limited • Dhaka, Bangladesh</p>
                <ul className="text-xs text-[#57534E] space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>Building production AI &amp; backend systems using Python, FastAPI, PostgreSQL, Redis, Docker, and Linux.</li>
                  <li>Developing LLM workflows (OpenAI, Gemini, RAG, AI Agents, streaming, tool calling).</li>
                  <li>Implementing reliability patterns: idempotency, rate limiting, patient data isolation, IDOR prevention, and Celery background jobs.</li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E2DCD2]/70 text-[11px] font-mono text-[#8C827A]">
                FastAPI • Redis • Gemini • Docker
              </div>
            </div>

            {/* Role 2: Elitbuzz */}
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E2DCD2] flex flex-col justify-between">
              <div>
                <div className="text-xs text-[#8C5035] font-medium uppercase tracking-wider mb-2">
                  Jul 2025 – Nov 2025
                </div>
                <h3 className="text-sm font-bold text-[#1C1917]">Zoho Creator Specialist</h3>
                <p className="text-xs font-medium text-[#78716C] mb-3">Elitbuzz • Dhaka, Bangladesh</p>
                <ul className="text-xs text-[#57534E] space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>Developed custom enterprise business applications and automated workflows using Zoho Creator and Deluge scripting.</li>
                  <li>Integrated REST APIs with third-party CRM/ERP platforms.</li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E2DCD2]/70 text-[11px] font-mono text-[#8C827A]">
                Zoho Creator • Deluge • REST APIs
              </div>
            </div>

            {/* Role 3: Lawyer Lagbe BD */}
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E2DCD2] flex flex-col justify-between">
              <div>
                <div className="text-xs text-[#8C5035] font-medium uppercase tracking-wider mb-2">
                  Jul 2024 – Aug 2025
                </div>
                <h3 className="text-sm font-bold text-[#1C1917]">Co-Founder &amp; Technical Lead</h3>
                <p className="text-xs font-medium text-[#78716C] mb-3">Lawyer Lagbe BD • Dhaka, Bangladesh</p>
                <ul className="text-xs text-[#57534E] space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>Led end-to-end development of legal-tech platform to democratize legal aid in Bangladesh.</li>
                  <li>Spearheaded product architecture across Flutter mobile apps, Firebase, and FastAPI backend.</li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E2DCD2]/70 text-[11px] font-mono text-[#8C827A]">
                Flutter • Firebase • FastAPI • AI
              </div>
            </div>

            {/* Role 4: LR Global Bangladesh */}
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E2DCD2] flex flex-col justify-between">
              <div>
                <div className="text-xs text-[#8C5035] font-medium uppercase tracking-wider mb-2">
                  Sep 2022 – May 2024
                </div>
                <h3 className="text-sm font-bold text-[#1C1917]">Software Engineer</h3>
                <p className="text-xs font-medium text-[#78716C] mb-3">LR Global Bangladesh • Dhaka</p>
                <ul className="text-xs text-[#57534E] space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>Delivered full software lifecycle engineering on financial analytics and asset management systems.</li>
                  <li>Maintained features, refactored codebases, resolved defects, and ran test suites.</li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E2DCD2]/70 text-[11px] font-mono text-[#8C827A]">
                Financial Systems • Full Lifecycle
              </div>
            </div>

            {/* Role 5: BD Apps */}
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E2DCD2] flex flex-col justify-between">
              <div>
                <div className="text-xs text-[#8C5035] font-medium uppercase tracking-wider mb-2">
                  Jul 2020 – May 2025
                </div>
                <h3 className="text-sm font-bold text-[#1C1917]">App Developer</h3>
                <p className="text-xs font-medium text-[#78716C] mb-3">BD Apps • Dhaka, Bangladesh</p>
                <ul className="text-xs text-[#57534E] space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>Developed and maintained high-performance Java Android applications.</li>
                  <li>Managed release lifecycles, user-facing performance updates, and platform stability.</li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E2DCD2]/70 text-[11px] font-mono text-[#8C827A]">
                Android • Java • Mobile Releases
              </div>
            </div>

            {/* Role 6: Dokmi Digital Marketing */}
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E2DCD2] flex flex-col justify-between">
              <div>
                <div className="text-xs text-[#8C5035] font-medium uppercase tracking-wider mb-2">
                  Mar 2022 – Jul 2022
                </div>
                <h3 className="text-sm font-bold text-[#1C1917]">Junior Web Application Developer</h3>
                <p className="text-xs font-medium text-[#78716C] mb-3">Dokmi Digital Marketing Agency • Dhaka</p>
                <ul className="text-xs text-[#57534E] space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>Built and maintained responsive web applications and e-commerce portals.</li>
                  <li>Worked with PHP, JavaScript, WordPress, Shopify, HTML, and CSS.</li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E2DCD2]/70 text-[11px] font-mono text-[#8C827A]">
                Web Engineering • PHP • JavaScript
              </div>
            </div>
          </div>
        </div>

        {/* ROW 3: SELECTED PRODUCTION PROJECTS (MY WORK INCLUDES) */}
        <div id="projects" className="bento-card p-6 sm:p-8 scroll-mt-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#E2DCD2] gap-2">
            <div>
              <h2 className="display-title text-3xl text-[#1C1917]">SELECTED PRODUCTION PROJECTS</h2>
              <p className="text-xs text-[#78716C] uppercase tracking-wider mt-0.5">Real AI Applications &amp; Scalable Backends from CV</p>
            </div>
            <span className="font-script text-xl text-[#8C827A]">Production Tested</span>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Project 1: Doctor J */}
            <div className="bento-card p-4 sm:p-5 flex flex-col justify-between bg-white border border-[#E2DCD2]">
              <div>
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-[#E2DCD2] mb-4 bg-stone-100">
                  <Image
                    src="/assets/images/doctorj-hero.png"
                    alt="Doctor J AI Healthcare Platform"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold tracking-wider uppercase">
                    Live in Production
                  </div>
                </div>
                <h3 className="text-base font-bold text-[#1C1917]">Doctor J – AI Healthcare Platform</h3>
                <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
                  Production clinical AI assistant built using FastAPI, PostgreSQL, Redis, Gemini Vision, Next.js 14, and Celery.
                </p>
                <ul className="text-xs text-[#78716C] space-y-1 mt-3 list-disc list-inside">
                  <li>Multimodal medical imaging (X-Ray, MRI, CT) &amp; prescription OCR.</li>
                  <li>Streaming responses, patient data isolation &amp; IDOR protection.</li>
                  <li>5-key rotation manager with 60s cooldown &amp; atomic Lua quotas.</li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E2DCD2] flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#8C827A]">FastAPI • Redis • Gemini</span>
                <a
                  href="https://stage.doctorj.health"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#1C1917] hover:text-[#8C5035]"
                >
                  <span>Live App</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Project 2: AgroGPT */}
            <div className="bento-card p-4 sm:p-5 flex flex-col justify-between bg-white border border-[#E2DCD2]">
              <div>
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-[#E2DCD2] mb-4 bg-stone-100">
                  <Image
                    src="/assets/images/agrogpt-hero.png"
                    alt="AgroGPT Platform"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold tracking-wider uppercase">
                    Live in Production
                  </div>
                </div>
                <h3 className="text-base font-bold text-[#1C1917]">AgroGPT – AI Agriculture Platform</h3>
                <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
                  Production agricultural AI platform featuring crop disease detection, localized Bangla voice interaction, and weather intelligence.
                </p>
                <ul className="text-xs text-[#78716C] space-y-1 mt-3 list-disc list-inside">
                  <li>Multimodal crop disease detection via camera &amp; voice.</li>
                  <li>District-level weather forecasting &amp; market pricing APIs.</li>
                  <li>Optimized for low-bandwidth mobile environments in Bangladesh.</li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E2DCD2] flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#8C827A]">FastAPI • WebSockets • Vision</span>
                <span className="text-xs font-semibold text-[#8C5035]">Production System</span>
              </div>
            </div>

            {/* Project 3: Snap & Get */}
            <div className="bento-card p-4 sm:p-5 flex flex-col justify-between bg-white border border-[#E2DCD2]">
              <div>
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-[#E2DCD2] mb-4 bg-stone-100">
                  <Image
                    src="/assets/images/snap-and-get.png"
                    alt="Snap & Get Visual Product Discovery"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold tracking-wider uppercase">
                    Mobile &amp; Backend
                  </div>
                </div>
                <h3 className="text-base font-bold text-[#1C1917]">Snap &amp; Get – AI Visual Discovery</h3>
                <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
                  Visual search and product discovery application using camera image processing, search APIs, and production mobile workflows.
                </p>
                <ul className="text-xs text-[#78716C] space-y-1 mt-3 list-disc list-inside">
                  <li>Image upload, Gemini feature extraction, product discovery.</li>
                  <li>Merchant price comparison aggregation &amp; asynchronous jobs.</li>
                  <li>Built with MinIO S3, Redis caching, and FastAPI.</li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E2DCD2] flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#8C827A]">Gemini Vision • MinIO • Flutter</span>
                <span className="text-xs font-semibold text-[#8C5035]">Production Tool</span>
              </div>
            </div>

            {/* Project 4: Rxpert Platform */}
            <div className="bento-card p-4 sm:p-5 flex flex-col justify-between bg-white border border-[#E2DCD2]">
              <div>
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-[#E2DCD2] mb-4 bg-stone-100">
                  <Image
                    src="/assets/images/rxpert-fig1_pipeline.png"
                    alt="Rxpert Pharmaceutical Intelligence"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-bold tracking-wider uppercase">
                    Enterprise
                  </div>
                </div>
                <h3 className="text-base font-bold text-[#1C1917]">Rxpert – Pharmaceutical Intelligence</h3>
                <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
                  AI-powered pharmaceutical intelligence platform for formulation matching, Active Pharmaceutical Ingredient (API) selection, and QTPP research.
                </p>
                <ul className="text-xs text-[#78716C] space-y-1 mt-3 list-disc list-inside">
                  <li>Modular backend services for formulation &amp; literature review.</li>
                  <li>Knowledge retrieval, ALCOA+ data integrity, and audit logging.</li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E2DCD2] flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#8C827A]">LangChain • MinIO • PostgreSQL</span>
                <span className="text-xs font-semibold text-[#8C5035]">QTPP Synthesis</span>
              </div>
            </div>

            {/* Project 5: RA Script */}
            <div className="bento-card p-4 sm:p-5 flex flex-col justify-between bg-white border border-[#E2DCD2]">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E2DCD2] flex items-center justify-center text-[#1C1917] mb-4">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-bold tracking-wider uppercase mb-2">
                  Enterprise AI
                </div>
                <h3 className="text-base font-bold text-[#1C1917]">RA Script – Pharmaceutical AI</h3>
                <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
                  AI-powered regulatory affairs platform for pharmaceutical dossier analysis, CTD/eCTD module drafting, and compliance checking.
                </p>
                <ul className="text-xs text-[#78716C] space-y-1 mt-3 list-disc list-inside">
                  <li>LLM-powered document extraction and inconsistency detection.</li>
                  <li>21 CFR Part 11 compliant audit logging &amp; tamper evidence.</li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E2DCD2] flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#8C827A]">FastAPI • LangChain • Celery</span>
                <span className="text-xs font-semibold text-[#8C5035]">eCTD Compliance</span>
              </div>
            </div>

            {/* Project 6: Insta Hygiene & Meeting Interpreter */}
            <div className="bento-card p-4 sm:p-5 flex flex-col justify-between bg-white border border-[#E2DCD2]">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E2DCD2] flex items-center justify-center text-[#1C1917] mb-4">
                  <Code2 className="w-5 h-5" />
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-stone-700 text-white text-[10px] font-bold tracking-wider uppercase mb-2">
                  Production Systems
                </div>
                <h3 className="text-base font-bold text-[#1C1917]">Insta Hygiene &amp; Meeting Interpreter</h3>
                <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
                  Production multi-vendor hygiene e-commerce backend and real-time speech translation meeting assistant.
                </p>
                <ul className="text-xs text-[#78716C] space-y-1 mt-3 list-disc list-inside">
                  <li>Role-based access control, cart persistence, Docker deployment.</li>
                  <li>Real-time bidirectional speech translation via WebSockets &amp; Whisper.</li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E2DCD2] flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#8C827A]">WebSockets • Whisper • Docker</span>
                <span className="text-xs font-semibold text-[#8C5035]">Real-Time Streaming</span>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 4: CASE STUDY: DOCTOR J (From Idea to Impact) */}
        <div className="bento-card p-6 sm:p-10 bg-white border border-[#E2DCD2]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-script text-xl text-[#8C5035]">From Research to Impact</span>
              </div>
              <h2 className="display-title text-4xl sm:text-5xl text-[#1C1917]">
                CASE STUDY: DOCTOR J ARCHITECTURE
              </h2>
              <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                Healthcare AI systems cannot afford downstream downtime, IDOR privacy breaches, or LLM rate-limit saturation. To deploy Doctor J as a reliable clinical diagnostic platform for patients and physicians, I engineered a server-authoritative, fault-tolerant infrastructure:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#57534E] pt-2">
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E2DCD2]">
                  <strong className="text-[#1C1917] block mb-1">5-Key Dynamic Rotation:</strong>
                  Automated fallback with 60-second cooldown prevents quota exhaustion across Gemini vision endpoints.
                </div>
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E2DCD2]">
                  <strong className="text-[#1C1917] block mb-1">Atomic Lua Quotas:</strong>
                  Redis-backed concurrency control prevents race conditions and shields upstream APIs under high traffic.
                </div>
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E2DCD2]">
                  <strong className="text-[#1C1917] block mb-1">Patient Data Isolation:</strong>
                  Google OAuth ID verification with strict owner-scoped session gating eliminates IDOR vulnerabilities.
                </div>
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E2DCD2]">
                  <strong className="text-[#1C1917] block mb-1">Server-Authoritative Stream:</strong>
                  Idempotent message persistence with Celery background OCR workers ensures zero data loss.
                </div>
              </div>

              {/* Verified Outcome Metric Badges (matching reference style) */}
              <div className="grid grid-cols-3 gap-3 pt-4">
                <div className="p-4 rounded-xl bg-[#F4EFE6] border border-[#E2DCD2] text-center">
                  <div className="display-title text-2xl sm:text-3xl text-[#1C1917]">+94.2%</div>
                  <div className="text-[10px] uppercase tracking-wider text-[#78716C] mt-1 font-medium">Diagnostic Faithfulness</div>
                </div>
                <div className="p-4 rounded-xl bg-[#F4EFE6] border border-[#E2DCD2] text-center">
                  <div className="display-title text-2xl sm:text-3xl text-[#1C1917]">&lt;60ms</div>
                  <div className="text-[10px] uppercase tracking-wider text-[#78716C] mt-1 font-medium">p95 Redis Latency</div>
                </div>
                <div className="p-4 rounded-xl bg-[#F4EFE6] border border-[#E2DCD2] text-center">
                  <div className="display-title text-2xl sm:text-3xl text-[#1C1917]">100%</div>
                  <div className="text-[10px] uppercase tracking-wider text-[#78716C] mt-1 font-medium">Idempotent Persistence</div>
                </div>
              </div>
            </div>

            {/* Visual device screen */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-sm rounded-2xl overflow-hidden border border-[#E2DCD2] shadow-lg bg-stone-100">
                <div className="p-3 bg-[#EBE5DB] border-b border-[#E2DCD2] flex items-center justify-between text-xs text-[#57534E]">
                  <span className="font-mono text-[11px]">stage.doctorj.health</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                </div>
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src="/assets/images/doctorj-hero.png"
                    alt="Doctor J Interface"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <p className="font-script text-center text-sm text-[#8C827A] mt-3">
                Live Clinical AI Platform • Production Verified
              </p>
            </div>
          </div>
        </div>

        {/* ROW 5: RESEARCH & PUBLICATIONS */}
        <div id="research" className="bento-card p-6 sm:p-8 scroll-mt-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#E2DCD2] gap-2">
            <div>
              <h2 className="display-title text-3xl text-[#1C1917]">RESEARCH &amp; PUBLICATIONS</h2>
              <p className="text-xs text-[#78716C] uppercase tracking-wider mt-0.5">Academic Contributions &amp; Published Manuscripts from CV</p>
            </div>
            <span className="font-script text-xl text-[#8C827A]">Translational Medical AI</span>
          </div>

          <div className="mt-8 space-y-4">
            {/* Paper 1: LLaMA-XR */}
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E2DCD2] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                    Published • MDPI Bioengineering &amp; arXiv
                  </span>
                  <span className="text-xs text-[#8C827A]">2026</span>
                </div>
                <h3 className="text-base font-bold text-[#1C1917]">
                  LLaMA-XR: A Novel Framework for Radiology Report Generation using LLaMA and QLoRA Fine-Tuning
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  Parameter-Efficient Fine-Tuning (PEFT/QLoRA) on radiology image features to generate clinical radiology reports with high BLEU-4 and clinical efficacy scores.
                </p>
                <p className="text-[11px] text-[#78716C]">
                  <strong>Authors:</strong> Sumaiya Akter, et al. • <strong>Venue:</strong> <em>Bioengineering</em> (MDPI) &amp; arXiv
                </p>
              </div>
              <div className="shrink-0">
                <a
                  href="/assets/docs/Automated_Lung_Cancer_Detection_Paper.pdf"
                  target="_blank"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#1C1917] text-xs font-semibold uppercase tracking-wider text-[#1C1917] hover:bg-[#1C1917] hover:text-[#F4EFE6] transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>View Paper</span>
                </a>
              </div>
            </div>

            {/* Paper 2: Lung Cancer 3D CNN */}
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E2DCD2] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider">
                    Research in Progress
                  </span>
                  <span className="text-xs text-[#8C827A]">2026</span>
                </div>
                <h3 className="text-base font-bold text-[#1C1917]">
                  Automated Lung Cancer Detection Using Deep Learning Techniques
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  Empirical study comparing 3D CNN architectures (ResNet3D, MSNet3D) vs. radiomics on NoduleMNIST3D/LIDC-IDRI (AUROC 0.896). Demonstrates uncertainty-based abstention raising diagnostic accuracy from 85.2% to 91.5% (p=0.002).
                </p>
                <p className="text-[11px] text-[#78716C]">
                  <strong>Authors:</strong> Sumaiya Akter • <strong>Dataset:</strong> MedMNIST3D &amp; LIDC-IDRI
                </p>
              </div>
              <div className="shrink-0">
                <a
                  href="/assets/docs/Automated_Lung_Cancer_Detection_Paper.pdf"
                  target="_blank"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#1C1917] text-xs font-semibold uppercase tracking-wider text-[#1C1917] hover:bg-[#1C1917] hover:text-[#F4EFE6] transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Manuscript</span>
                </a>
              </div>
            </div>

            {/* Paper 3: Wound Analysis */}
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E2DCD2] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold uppercase tracking-wider">
                    arXiv Preprint
                  </span>
                  <span className="text-xs text-[#8C827A]">2026</span>
                </div>
                <h3 className="text-base font-bold text-[#1C1917]">
                  Using Deep Learning for Automated Wound Analysis: Segmentation and Classification in Wound Care
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  Semantic segmentation of wound boundaries combined with tissue classification for granulation, slough, and necrosis.
                </p>
              </div>
              <div className="shrink-0">
                <span className="text-xs font-mono text-[#8C827A]">arXiv Pre-print</span>
              </div>
            </div>

            {/* Paper 4: ChatGPT Benefits and Securities */}
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E2DCD2] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-800 text-[10px] font-bold uppercase tracking-wider">
                    Peer-Reviewed Journal
                  </span>
                  <span className="text-xs text-[#8C827A]">Aug 2023</span>
                </div>
                <h3 className="text-base font-bold text-[#1C1917]">
                  ChatGPT and the Future World: Analysis of ChatGPT Benefits and Securities
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  Comprehensive analytical study published in <em>Global Scientific Journal</em> (Vol. 11, Issue 8, ISSN 2320-9186) investigating cybersecurity, hallucination patterns, and safety guardrails.
                </p>
              </div>
              <div className="shrink-0">
                <span className="text-xs font-mono text-[#8C827A]">GSJ Vol. 11</span>
              </div>
            </div>

            {/* Book: You Are A Flower */}
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E2DCD2] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                    Published Book
                  </span>
                  <span className="text-xs text-[#8C827A]">ISBN: 9789843406249</span>
                </div>
                <h3 className="text-base font-bold text-[#1C1917]">
                  Book: You Are A Flower
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  Authored philosophical and reflective literary book published in Bangladesh.
                </p>
              </div>
              <div className="shrink-0">
                <span className="text-xs font-mono text-[#8C827A]">Published Author</span>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 6: EDUCATION, AWARDS & MARTIAL ARTS HONORS */}
        <div id="awards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 scroll-mt-8">
          {/* Card 1: Education */}
          <div className="bento-card p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E2DCD2] flex items-center justify-center text-[#1C1917] mb-4">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xs uppercase font-medium tracking-wider text-[#8C5035] block mb-1">
                Academic Background
              </span>
              <h3 className="text-lg font-bold text-[#1C1917]">BSc. in Computer Science &amp; Engineering</h3>
              <p className="text-xs text-[#57534E] mt-1">
                <strong>University of Liberal Arts Bangladesh (ULAB)</strong>, Dhaka
              </p>
              <p className="text-xs text-[#78716C] mt-2">
                Apr 2017 – Oct 2021 • <strong>CGPA: 3.11 / 4.00</strong>
              </p>
              <div className="mt-4 pt-3 border-t border-[#E2DCD2] text-xs text-[#57534E] space-y-1">
                <p className="font-semibold text-[#1C1917]">Academic Referees:</p>
                <p>• Prof. M. Mofazzal Hossain, PhD, SMIEEE (Dean, School of Science &amp; Engg.)</p>
                <p>• Prof. Muhammad Golam Kibria, Ph.D., SMIEEE (Professor, Dept. of CSE)</p>
              </div>
            </div>
          </div>

          {/* Card 2: Martial Arts Honors (2x Gold, Black Belt) */}
          <div className="bento-card p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E2DCD2] flex items-center justify-center text-[#1C1917] mb-4">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-xs uppercase font-medium tracking-wider text-[#8C5035] block mb-1">
                Competitive Athletics
              </span>
              <h3 className="text-lg font-bold text-[#1C1917]">National Taekwondo Champion</h3>
              <p className="text-xs text-[#57534E] mt-1 font-semibold">
                Taekwondo Black Belt Holder
              </p>
              <ul className="text-xs text-[#57534E] space-y-2 mt-3 list-none">
                <li className="flex items-center gap-2">
                  <span className="text-amber-600 font-bold">🥇 Gold Medal</span>
                  <span>Independence Day Taekwondo Championship (2024)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-600 font-bold">🥇 Gold Medal</span>
                  <span>4th Federation Cup Taekwondo Competition (2024)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-800 font-bold">🥉 Bronze Medal</span>
                  <span>22nd Victory Day Taekwondo Competition (2023)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-800 font-bold">🥉 2x Bronze</span>
                  <span>4th Bangladesh Wadokai Club Karate (2023)</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E2DCD2] text-[11px] font-script text-[#8C5035]">
              Discipline, resilience, and focus applied to engineering. ♡
            </div>
          </div>

          {/* Card 3: Scores & Leadership */}
          <div className="bento-card p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E2DCD2] flex items-center justify-center text-[#1C1917] mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xs uppercase font-medium tracking-wider text-[#8C5035] block mb-1">
                Credentials &amp; Leadership
              </span>
              <h3 className="text-lg font-bold text-[#1C1917]">IELTS, SQL &amp; Leadership</h3>
              <div className="mt-3 space-y-3 text-xs text-[#57534E]">
                <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E2DCD2]">
                  <strong className="text-[#1C1917] block">IELTS Standardized Score:</strong>
                  <span>Overall Band: <strong>6.5</strong> (Listening: <strong>7.5</strong>, Speaking: <strong>7.0</strong>)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E2DCD2]">
                  <strong className="text-[#1C1917] block">HackerRank 5-Star SQL:</strong>
                  <span>Advanced relational querying &amp; query optimization</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E2DCD2]">
                  <strong className="text-[#1C1917] block">Student Leadership:</strong>
                  <span>Former President, ULAB 1971 History Club • Member, ULAB Computer Society</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E2DCD2] text-[11px] text-[#78716C]">
              Verified by scanned certificates &amp; records.
            </div>
          </div>
        </div>

        {/* ROW 7: INVERTED DARK BENTO CARD (LET'S CONNECT like reference image) */}
        <div id="contact" className="bento-card-dark p-8 sm:p-12 relative overflow-hidden scroll-mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left info column */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="font-script text-2xl text-[#E8DCC4] block mb-1">
                  Let&apos;s create something extraordinary together ♡
                </span>
                <h2 className="display-title text-4xl sm:text-6xl text-white tracking-tight">
                  LET&apos;S CONNECT
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 mt-3 leading-relaxed max-w-lg">
                  Available for Senior AI &amp; Backend Engineering roles, AI consulting, technical collaboration, and fully funded PhD research opportunities.
                </p>
              </div>

              <div className="space-y-3.5 text-xs text-stone-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center shrink-0 text-stone-300">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 block">Direct Email</span>
                    <button
                      onClick={copyEmail}
                      className="text-stone-100 font-mono hover:text-[#E8DCC4] transition-colors flex items-center gap-1.5"
                    >
                      <span>sumaiya205.akter@gmail.com</span>
                      <Copy className="w-3 h-3 text-stone-400" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center shrink-0 text-stone-300">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 block">Direct Phone &amp; WhatsApp</span>
                    <span className="text-stone-300 text-xs">
                      Available on verified request
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center shrink-0 text-stone-300">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 block">Location</span>
                    <span className="text-stone-100">Aftabnagar, Dhaka-1212, Bangladesh</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={() => setShowResumeModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#181614] text-xs uppercase font-bold tracking-wider hover:bg-stone-200 transition-colors shadow-lg"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview Full CV</span>
                </button>
              </div>
            </div>

            {/* Right form column */}
            <div className="lg:col-span-6 bg-stone-900/90 border border-stone-800 rounded-2xl p-6 sm:p-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
                Send a Direct Collaboration Inquiry
              </h3>

              {inquirySuccess ? (
                <div className="p-6 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-300">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Inquiry Transmitted Successfully</span>
                  </div>
                  <p>
                    Thank you for reaching out. Your inquiry has been securely stored in the portfolio system. Sumaiya will respond promptly.
                  </p>
                  <button
                    onClick={() => setInquirySuccess(false)}
                    className="mt-3 px-3 py-1.5 rounded bg-emerald-800 text-white font-medium text-xs hover:bg-emerald-700"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  {inquiryError && (
                    <div className="p-3 rounded-lg bg-red-950/80 border border-red-800 text-red-200 text-xs">
                      {inquiryError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={inquiryForm.name}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                        placeholder="e.g. Dr. Jane Smith"
                        className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none focus:border-stone-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={inquiryForm.email}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                        placeholder="jane@university.edu"
                        className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none focus:border-stone-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1">
                        Organization
                      </label>
                      <input
                        type="text"
                        value={inquiryForm.organization}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, organization: e.target.value })}
                        placeholder="Company / University"
                        className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none focus:border-stone-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1">
                        Purpose
                      </label>
                      <select
                        value={inquiryForm.intent}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, intent: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none focus:border-stone-500"
                      >
                        <option value="hire">Hiring (Senior AI / Backend)</option>
                        <option value="consulting">AI / Backend Consulting</option>
                        <option value="phd">PhD / Research Assistantship</option>
                        <option value="research">Research Collaboration</option>
                        <option value="speaking">Speaking / Mentorship</option>
                        <option value="other">General Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={inquiryForm.subject}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, subject: e.target.value })}
                      placeholder="Opportunity / Project Description"
                      className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none focus:border-stone-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={inquiryForm.message}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                      placeholder="Share details regarding requirements, timelines, or collaboration scope..."
                      className="w-full px-3 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none focus:border-stone-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={inquiryLoading}
                    className="w-full py-2.5 rounded-lg bg-white text-[#181614] font-bold text-xs uppercase tracking-wider hover:bg-stone-200 transition-colors flex items-center justify-center gap-2"
                  >
                    {inquiryLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Transmitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

      </main>

      {/* Dynamic Copyright Footer */}
      <Footer />

      {/* Resume Preview Modal */}
      <ResumeModal
        isOpen={showResumeModal}
        onClose={() => setShowResumeModal(false)}
      />
    </div>
  );
}
