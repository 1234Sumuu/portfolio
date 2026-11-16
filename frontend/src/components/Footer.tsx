'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Github, Linkedin, Mail, ArrowUp, GraduationCap } from 'lucide-react';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-[#E2DCD2] bg-[#ECE5DB] text-[#57534E] py-14 px-4 sm:px-6 lg:px-8 mt-16 transition-colors">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-[#DCD3C5]">
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-extrabold tracking-tight text-[#1C1917]">
                SUMAIYA AKTER
              </span>
              <span className="font-script text-2xl text-[#8C5035]">
                portfolio
              </span>
            </div>
            <p className="text-xs text-[#57534E] max-w-lg leading-relaxed">
              Software Engineer (Backend &amp; AI Team) @ <strong>ACI Limited</strong>. Taekwondo Black Belt &amp; 2x National Champion. Medical AI Researcher with publications in MDPI Bioengineering &amp; JURIX.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-[#78716C]">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Available for Senior AI / Distributed Backend Roles</span>
            </div>
          </div>

          {/* Social Links & Back to top */}
          <div className="flex items-center gap-2.5">
            <a
              href="https://github.com/1234Sumuu"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-white border border-[#E2DCD2] flex items-center justify-center text-[#1C1917] hover:bg-[#1C1917] hover:text-[#F4EFE6] transition-all shadow-sm hover:scale-105"
              aria-label="GitHub"
              title="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com/in/sumaiya-akter"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-white border border-[#E2DCD2] flex items-center justify-center text-[#1C1917] hover:bg-[#1C1917] hover:text-[#F4EFE6] transition-all shadow-sm hover:scale-105"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://scholar.google.com"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-white border border-[#E2DCD2] flex items-center justify-center text-[#1C1917] hover:bg-[#1C1917] hover:text-[#F4EFE6] transition-all shadow-sm hover:scale-105"
              aria-label="Google Scholar"
              title="Google Scholar"
            >
              <GraduationCap className="w-4 h-4" />
            </a>
            <a
              href="mailto:sumaiya205.akter@gmail.com"
              className="w-10 h-10 rounded-full bg-white border border-[#E2DCD2] flex items-center justify-center text-[#1C1917] hover:bg-[#1C1917] hover:text-[#F4EFE6] transition-all shadow-sm hover:scale-105"
              aria-label="Email"
              title="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
            <button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full bg-[#1C1917] text-[#F4EFE6] border border-[#1C1917] flex items-center justify-center hover:bg-[#8C5035] transition-all shadow-sm hover:scale-105 ml-1"
              aria-label="Scroll to top"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Section with Dynamic Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#78716C] gap-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-3 text-center sm:text-left">
            <p className="font-medium text-[#1C1917]">
              © {currentYear} Sumaiya Akter. All rights reserved.
            </p>
            <span className="hidden sm:inline text-[#D8D0C3]">•</span>
            <p className="text-[11px] text-[#8C827A]">
              Engineered with Next.js, FastAPI &amp; Editorial Typography
            </p>
          </div>

          <div className="flex items-center gap-5 text-xs">
            <a href="#about" className="hover:text-[#1C1917] transition-colors">About</a>
            <a href="#experience" className="hover:text-[#1C1917] transition-colors">Experience</a>
            <a href="#work" className="hover:text-[#1C1917] transition-colors">Projects</a>
            <a href="#research" className="hover:text-[#1C1917] transition-colors">Research</a>
            <a href="#contact" className="hover:text-[#1C1917] transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
