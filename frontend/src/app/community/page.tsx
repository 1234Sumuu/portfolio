import Link from 'next/link';
import SectionHeading from '@/components/SectionHeading';
import {
  Users,
  Presentation,
  Award,
  BookOpen,
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function CommunityPage() {
  const leadershipRoles = [
    {
      title: 'President – ULAB 1971 History Club',
      organization: 'University of Liberal Arts Bangladesh (ULAB)',
      period: '2020 – 2021',
      description: 'Elected to lead the prestigious university student leadership society. Spearheaded cultural exhibitions, student research forums, historical documentation symposiums, and inter-university collaborative summits.',
      tags: ['Student Leadership', 'Event Management', 'Public Speaking']
    },
    {
      title: 'Active Member – ULAB Computer Society',
      organization: 'Department of Computer Science & Engineering, ULAB',
      period: '2018 – 2021',
      description: 'Organized competitive programming contests, intra-university hackathons, peer algorithmic tutoring sessions, and technical seminars for freshman computer science students.',
      tags: ['Hackathons', 'Peer Tutoring', 'Competitive Programming']
    },
    {
      title: 'Campus Ambassador & Dhaka North Zone Coordinator',
      organization: 'Intelligent Minds Community Platform',
      period: '2019 – 2021',
      description: 'Coordinated youth leadership workshops, skill development training camps, and campus recruitment outreach across 6 major universities in the Dhaka North zone.',
      tags: ['Youth Mentorship', 'Regional Coordination', 'Workshops']
    }
  ];

  const workshops = [
    {
      title: 'Demystifying Large Language Models: From Prompting to RAG',
      venue: 'Tech Mentorship Circle, Dhaka',
      audience: 'Junior Engineers & University Researchers',
      year: '2025',
      summary: 'Delivered an interactive technical masterclass breaking down tokenization, vector search with pgvector, and latency mitigation in production FastAPI applications.'
    },
    {
      title: 'Practical Computer Vision & Medical Diagnostics',
      venue: 'ULAB CSE Department Seminar Series',
      audience: 'Undergraduate Researchers & Faculty',
      year: '2024',
      summary: 'Presented deep learning approaches to automated wound segmentation and thoracic X-ray report generation with hands-on PyTorch demonstrations.'
    },
    {
      title: 'Modern Backend Architecture: Fast, Resilient, Containerized',
      venue: 'Developer Community Meetup',
      audience: 'Full-Stack Developers',
      year: '2023',
      summary: 'Conducted live architectural walkthrough demonstrating how to prevent race conditions using Redis Lua scripts, implement Docker Compose healthchecks, and manage PostgreSQL migrations.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          Leadership & Mentorship
        </span>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Speaking, Workshops & Community Contributions
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
          Sharing technical knowledge, mentoring emerging developers, and actively fostering student leadership across university organizations and engineering forums.
        </p>
      </div>

      {/* Leadership Section */}
      <section className="space-y-6">
        <SectionHeading
          kicker="Civic & Campus Leadership"
          title="Organizational & Student Leadership"
          description="Elected and appointed leadership positions demonstrating team stewardship, event execution, and community impact."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leadershipRoles.map((role, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                    {role.period}
                  </span>
                  <Users className="w-4 h-4 text-zinc-500" />
                </div>

                <h3 className="font-bold text-white text-base leading-snug">
                  {role.title}
                </h3>

                <p className="text-xs font-medium text-emerald-400">
                  {role.organization}
                </p>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  {role.description}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-800/60 flex flex-wrap gap-1.5">
                {role.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-950 border border-zinc-800 text-zinc-400"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Workshops Section */}
      <section className="space-y-6">
        <SectionHeading
          kicker="Knowledge Dissemination"
          title="Technical Workshops & Academic Lectures"
          description="Lectures delivered on production AI systems, multimodal computer vision, and resilient backend design."
        />

        <div className="space-y-4">
          {workshops.map((w, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300">
                    {w.year}
                  </span>
                  <span className="text-xs font-mono text-emerald-400">
                    {w.venue}
                  </span>
                </div>
                <h3 className="font-bold text-white text-lg">{w.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{w.summary}</p>
              </div>

              <div className="text-xs font-mono text-zinc-500 bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-800 shrink-0">
                Audience: <strong className="text-zinc-300">{w.audience}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Speaking Invite CTA */}
      <section className="p-8 sm:p-12 rounded-3xl border border-zinc-800 bg-gradient-to-r from-emerald-950/30 via-zinc-900/60 to-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Invite Me to Speak or Conduct an AI Workshop</h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
            I regularly speak on production LLM architecture, multimodal medical AI, and rights-by-design legal systems for universities and tech summits.
          </p>
        </div>
        <Link
          href="/contact"
          className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-all shrink-0"
        >
          Submit Speaking Inquiry
        </Link>
      </section>
    </div>
  );
}
