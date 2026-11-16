import Link from 'next/link';
import InquiryForm from '@/components/InquiryForm';
import SectionHeading from '@/components/SectionHeading';
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  GraduationCap,
  Download,
  ShieldCheck,
  Clock,
  Sparkles,
  Eye,
} from 'lucide-react';

export default function ContactPage() {
  const contactChannels = [
    {
      icon: <Mail className="w-5 h-5 text-emerald-400" />,
      label: 'Direct Email',
      value: 'sumaiya205.akter@gmail.com',
      href: 'mailto:sumaiya205.akter@gmail.com',
      sub: 'Replies within 24 hours',
    },
    {
      icon: <Phone className="w-5 h-5 text-teal-400" />,
      label: 'Phone & WhatsApp',
      value: 'Available upon verified request',
      href: '#inquiry-form',
      sub: 'Shared upon initial collaboration contact',
    },
    {
      icon: <MapPin className="w-5 h-5 text-cyan-400" />,
      label: 'Current Location',
      value: 'Aftabnagar, Dhaka-1212',
      href: '#',
      sub: 'Bangladesh (Open to Global Relocation & Remote)',
    },
  ];

  const onlineProfiles = [
    {
      name: 'Google Scholar',
      sub: 'Citations & Papers',
      icon: <GraduationCap className="w-4 h-4 text-emerald-400" />,
      href: 'https://scholar.google.com',
    },
    {
      name: 'GitHub',
      sub: '@sumaiyamayra',
      icon: <Github className="w-4 h-4 text-zinc-300" />,
      href: 'https://github.com/sumaiyamayra',
    },
    {
      name: 'LinkedIn',
      sub: 'Professional Network',
      icon: <Linkedin className="w-4 h-4 text-blue-400" />,
      href: 'https://linkedin.com/in/sumaiya-akter',
    },
    {
      name: 'ORCID Record',
      sub: 'Verified Researcher ID',
      icon: <ShieldCheck className="w-4 h-4 text-purple-400" />,
      href: 'https://orcid.org',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          Get In Touch
        </span>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Let’s Discuss AI Engineering, Consulting & PhD Collaborations
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
          Whether you are evaluating candidates for senior backend/AI engineering roles, planning a research collaboration, exploring advisory consulting, or considering my profile for a funded PhD / Research Assistantship.
        </p>
      </div>

      {/* Grid: Contact Information & Interactive Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Direct Contact Info & Profiles */}
        <div className="lg:col-span-5 space-y-8">
          {/* Contact Direct Cards */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Direct Contact Details
            </h2>
            <div className="space-y-3">
              {contactChannels.map((c, idx) => (
                <a
                  key={idx}
                  href={c.href}
                  className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all flex items-start gap-4 block"
                >
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 shrink-0">
                    {c.icon}
                  </div>
                  <div>
                    <div className="text-xs font-mono text-zinc-400">{c.label}</div>
                    <div className="font-bold text-white text-sm mt-0.5">{c.value}</div>
                    <div className="text-[11px] text-zinc-400 mt-1">{c.sub}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Research & Developer Profiles */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Research & Developer Profiles
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {onlineProfiles.map((p, idx) => (
                <a
                  key={idx}
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all space-y-1 block"
                >
                  <div className="flex items-center gap-2">
                    {p.icon}
                    <span className="font-semibold text-xs text-white">{p.name}</span>
                  </div>
                  <div className="text-[11px] font-mono text-zinc-400">{p.sub}</div>
                </a>
              ))}
            </div>
          </div>

          {/* CV Download Box */}
          <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-950/10 space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Official Academic & Engineering CV</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Complete verified 3-page curriculum vitae covering all production projects, publications, education at ULAB, and martial arts championships.
            </p>
            <a
              href="/assets/docs/Sumaiya_Akter_CV.pdf"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-all inline-flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>Preview Official CV (PDF)</span>
            </a>
          </div>
        </div>

        {/* Right Column: Multi-Intent Inquiry Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md space-y-6">
          <div className="space-y-2 border-b border-zinc-800 pb-5">
            <h2 className="text-2xl font-bold text-white">Send Collaboration Transmission</h2>
            <p className="text-xs text-zinc-400">
              Select your collaboration intent below. Submissions are stored securely and trigger an immediate notification.
            </p>
          </div>

          <InquiryForm />
        </div>
      </div>
    </div>
  );
}
