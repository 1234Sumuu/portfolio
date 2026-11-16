import Link from 'next/link';
import { Github, Linkedin, Mail, Phone, MapPin, GraduationCap, FileText, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950 text-zinc-400 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand & Bio */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm">
              SA
            </div>
            <span className="font-semibold text-lg text-zinc-100">Sumaiya Akter</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
            Software Engineer specializing in AI/ML, LLM architectures, multimodal computer vision, and high-reliability backend systems. Bridging cutting-edge academic deep learning with production enterprise applications.
          </p>
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Available for Research & Engineering Roles
            </span>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <a
              href="https://github.com/sumaiyamayra"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com/in/sumaiya-akter"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://scholar.google.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Google Scholar"
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:border-zinc-700 transition-colors"
            >
              <GraduationCap className="w-4 h-4" />
            </a>
            <a
              href="mailto:sumaiya205.akter@gmail.com"
              aria-label="Email"
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:border-zinc-700 transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Core Exploration */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200">Engineering</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/projects" className="hover:text-emerald-400 transition-colors">
                Project Portfolio
              </Link>
            </li>
            <li>
              <Link href="/live" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                <span>Live Applications</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </Link>
            </li>
            <li>
              <Link href="/experience" className="hover:text-emerald-400 transition-colors">
                Career Timeline
              </Link>
            </li>
            <li>
              <Link href="/videos" className="hover:text-emerald-400 transition-colors">
                Technical Demos & Videos
              </Link>
            </li>
            <li>
              <Link href="/certificates" className="hover:text-emerald-400 transition-colors">
                Credentials & Medals
              </Link>
            </li>
          </ul>
        </div>

        {/* Research & Publications */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200">Academic & Research</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/research" className="hover:text-emerald-400 transition-colors">
                Publications & Papers
              </Link>
            </li>
            <li>
              <Link href="/research/llama-xr-radiology-report" className="hover:text-emerald-400 transition-colors">
                LLaMA-XR (MDPI Bioengineering)
              </Link>
            </li>
            <li>
              <Link href="/research/automated-lung-cancer-detection" className="hover:text-emerald-400 transition-colors">
                Lung Cancer 3D CNN Study
              </Link>
            </li>
            <li>
              <Link href="/research/from-statute-to-citizen-legal-ai" className="hover:text-emerald-400 transition-colors">
                Legal AI Audit (RT4RJ JURIX)
              </Link>
            </li>
            <li>
              <a
                href="/assets/docs/Sumaiya_Akter_CV.pdf"
                download
                className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1"
              >
                <span>Download Academic CV</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>

        {/* Contact & Verification */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200">Contact & Base</h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span>Aftabnagar, Dhaka-1212, BD</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <a href="mailto:sumaiya205.akter@gmail.com" className="hover:text-emerald-400">
                sumaiya205.akter@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span>+880 1789-531474</span>
            </li>
            <li className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white"
              >
                <span>Send Collaboration Inquiry</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <p>© {new Date().getFullYear()} Sumaiya Akter. All rights reserved. Built with Next.js, TypeScript & Tailwind CSS.</p>
        <div className="flex items-center gap-4">
          <Link href="/about" className="hover:text-zinc-400">
            About
          </Link>
          <Link href="/contact" className="hover:text-zinc-400">
            Inquiries
          </Link>
          <Link href="/admin" className="hover:text-zinc-400 font-mono text-[11px] flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Admin Portal</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
