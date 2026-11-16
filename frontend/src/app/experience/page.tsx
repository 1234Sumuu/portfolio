import Link from 'next/link';
import { getDb } from '@/lib/db';
import SectionHeading from '@/components/SectionHeading';
import {
  Briefcase,
  Calendar,
  MapPin,
  CheckCircle2,
  Award,
  Layers,
  Code,
  Cpu,
  Database,
  ShieldCheck,
  Server,
  Terminal,
} from 'lucide-react';
import { Experience } from '@/lib/types';

export const revalidate = 0;

export default function ExperiencePage() {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM experiences ORDER BY order_index ASC').all() as any[];

  const experiences: Experience[] = rows.map((r) => ({
    ...r,
    is_current: Boolean(r.is_current),
    responsibilities: r.responsibilities ? JSON.parse(r.responsibilities) : [],
    achievements: r.achievements ? JSON.parse(r.achievements) : [],
    tech_stack: r.tech_stack ? JSON.parse(r.tech_stack) : [],
  }));

  const skillDomains = [
    {
      category: 'AI & Machine Learning Frameworks',
      icon: <Cpu className="w-4 h-4 text-emerald-400" />,
      skills: ['LangGraph', 'LangChain', 'LlamaIndex', 'Gemini ADK', 'PyTorch', 'YOLO', 'OpenCV', 'Scikit-Learn']
    },
    {
      category: 'LLM & Agent Systems',
      icon: <Terminal className="w-4 h-4 text-cyan-400" />,
      skills: ['OpenAI', 'Gemini Flash/Pro', 'RAG Pipelines', 'AI Agents', 'Agentic Workflows', 'Prompt Engineering', 'Context Engineering', 'Function Calling', 'LoRA / QLoRA', 'Unsloth', 'MCP', 'vLLM']
    },
    {
      category: 'Generative & Multimodal AI',
      icon: <Layers className="w-4 h-4 text-purple-400" />,
      skills: ['Vision-Language Models', 'Image Understanding', 'Document AI & OCR', 'Multimodal Reasoning', 'Conversational AI', 'AI Evaluation & Benchmarking']
    },
    {
      category: 'Backend & Languages',
      icon: <Code className="w-4 h-4 text-blue-400" />,
      skills: ['Python', 'FastAPI', 'Django', 'TypeScript', 'JavaScript', 'Node.js', 'Laravel', 'Java', 'C/C++', 'PHP', 'REST APIs', 'WebSockets', 'Microservices', 'System Design']
    },
    {
      category: 'Vector DBs & Relational Data',
      icon: <Database className="w-4 h-4 text-teal-400" />,
      skills: ['Qdrant', 'PostgreSQL', 'pgvector', 'Redis', 'SQLAlchemy', 'Alembic', 'MongoDB', 'MySQL', 'MinIO S3']
    },
    {
      category: 'Distributed Systems & Architecture',
      icon: <Server className="w-4 h-4 text-indigo-400" />,
      skills: ['Asynchronous Processing', 'Celery', 'RabbitMQ', 'Caching & Invalidation', 'Rate Limiting & Quotas', 'Background Workers', 'Connection Pooling', 'Event-Driven Architecture', 'Idempotency Patterns']
    },
    {
      category: 'Authentication & Security',
      icon: <ShieldCheck className="w-4 h-4 text-rose-400" />,
      skills: ['JWT', 'OAuth 2.0', 'Google Identity Auth', 'Role-Based Access Control (RBAC)', 'Owner-Scoped Access', 'IDOR Prevention', '21 CFR Part 11 Audit Trails', 'Secure Secrets Management']
    },
    {
      category: 'DevOps & AI Serving Infrastructure',
      icon: <Cpu className="w-4 h-4 text-amber-400" />,
      skills: ['Docker', 'Docker Compose', 'GitHub Actions CI/CD', 'Git', 'Linux / Bash', 'Nginx', 'AWS', 'GCP', 'On-Prem GPU Serving', 'Prometheus', 'Grafana', 'Quantization (4-bit/8-bit)']
    },
    {
      category: 'Frontend & Web Development',
      icon: <Layers className="w-4 h-4 text-sky-400" />,
      skills: ['ReactJS', 'Next.js 14/15', 'Vue.js', 'Tailwind CSS', 'Redux / Zustand', 'HTML5', 'CSS3 / SCSS', 'PWA']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          Career Trajectory
        </span>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Professional Work Experience & Technical Expertise
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
          Over 5 years of progressive software engineering—evolving from low-level systems and mobile applications to full-stack platforms, scalable microservices, and enterprise production AI systems.
        </p>
      </div>

      {/* Experience Timeline */}
      <section className="space-y-8">
        <SectionHeading
          kicker="Timeline"
          title="Career Journey (2020 – Present)"
          description="A chronological record of engineering positions, core deliverables, and organizational achievements."
        />

        <div className="relative border-l border-zinc-800 ml-4 sm:ml-6 space-y-12">
          {experiences.map((exp, idx) => (
            <div key={exp.id} className="relative pl-8 sm:pl-10 group">
              {/* Timeline marker */}
              <div
                className={`absolute -left-2.5 top-1.5 w-5 h-5 rounded-full border-2 transition-all ${
                  exp.is_current
                    ? 'border-emerald-500 bg-emerald-500/20'
                    : 'border-zinc-700 bg-zinc-950 group-hover:border-zinc-500'
                }`}
              >
                {exp.is_current && (
                  <span className="absolute inset-1 rounded-full bg-emerald-400 animate-ping opacity-75"></span>
                )}
              </div>

              {/* Experience Card */}
              <div className="p-6 sm:p-8 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-sm space-y-4 hover:border-zinc-700 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/60 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                      {exp.is_current && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          Current Role
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-emerald-400 mt-0.5">
                      {exp.company}
                    </div>
                  </div>

                  <div className="text-xs font-mono text-zinc-400 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                      {exp.period}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                      {exp.location}
                    </span>
                  </div>
                </div>

                {/* Responsibilities */}
                <div className="space-y-2">
                  <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                    Core Engineering Contributions:
                  </div>
                  <ul className="space-y-1.5">
                    {exp.responsibilities?.map((item, i) => (
                      <li key={i} className="text-xs text-zinc-300 flex items-start gap-2.5">
                        <span className="text-emerald-500 text-sm leading-none mt-0.5">•</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Achievements */}
                {exp.achievements && exp.achievements.length > 0 && (
                  <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1.5">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" />
                      <span>Measurable Impact:</span>
                    </div>
                    <ul className="space-y-1">
                      {exp.achievements.map((ach, i) => (
                        <li key={i} className="text-xs text-zinc-300 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tech Stack Tags */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {exp.tech_stack?.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-zinc-800/80 text-zinc-300 border border-zinc-700/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categorized Skills Section */}
      <section className="space-y-8">
        <SectionHeading
          kicker="Technical Arsenal"
          title="Categorized Technical Expertise"
          description="A comprehensive mapping of verified technologies, frameworks, and architectural paradigms without artificial percentage metrics."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillDomains.map((domain, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 space-y-4 hover:border-zinc-700 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                    {domain.icon}
                  </div>
                  <h3 className="font-bold text-white text-sm">{domain.category}</h3>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {domain.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-md text-xs font-mono bg-zinc-950 border border-zinc-800 text-zinc-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
