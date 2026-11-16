'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Github, Linkedin, GraduationCap, Mail, Eye, FolderKanban } from 'lucide-react';
import ResumeModal from './ResumeModal';

export default function Header() {
  const pathname = usePathname();
  const [showResumeModal, setShowResumeModal] = useState(false);

  // Helper for hash links depending on whether we are on the homepage or another page
  const getHref = (hash: string) => {
    return pathname === '/' ? hash : `/${hash}`;
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#F4EFE6]/90 backdrop-blur-md border-b border-[#E2DCD2]/80 shadow-[0_2px_12px_rgba(28,25,23,0.03)] transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-3.5 gap-4">
            {/* Brand / Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group shrink-0"
              title="Sumaiya Akter Portfolio"
            >
              <div className="w-8 h-8 rounded-full bg-[#1C1917] text-[#F4EFE6] flex items-center justify-center font-display font-bold text-sm group-hover:bg-[#8C5035] transition-colors">
                SA
              </div>
              <div className="hidden sm:block">
                <span className="font-display font-bold text-sm tracking-tight text-[#1C1917] block leading-none">
                  SUMAIYA AKTER
                </span>
                <span className="text-[10px] text-[#8C827A] font-mono tracking-wider uppercase">
                  AI &amp; Backend Engineer
                </span>
              </div>
            </Link>

            {/* Scrollable Navigation Tabs */}
            <nav className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-1 scroll-smooth font-semibold text-xs uppercase tracking-widest text-[#57534E]">
              <Link
                href={getHref('#projects')}
                className={`hover:text-[#1C1917] transition-colors whitespace-nowrap py-1 border-b ${
                  pathname === '/' ? 'border-transparent hover:border-[#1C1917]' : 'border-transparent hover:border-[#1C1917]'
                }`}
              >
                My Work
              </Link>
              <Link
                href="/projects"
                className={`inline-flex items-center gap-1 hover:text-[#1C1917] transition-colors whitespace-nowrap py-1 border-b ${
                  pathname === '/projects'
                    ? 'text-[#8C5035] border-[#8C5035] font-bold'
                    : 'border-transparent hover:border-[#1C1917]'
                }`}
              >
                <FolderKanban className="w-3.5 h-3.5" />
                <span>All Projects</span>
              </Link>
              <Link
                href={getHref('#experience')}
                className="hover:text-[#1C1917] transition-colors whitespace-nowrap py-1 border-b border-transparent hover:border-[#1C1917]"
              >
                Experience
              </Link>
              <Link
                href={getHref('#research')}
                className="hover:text-[#1C1917] transition-colors whitespace-nowrap py-1 border-b border-transparent hover:border-[#1C1917]"
              >
                Research
              </Link>
              <Link
                href={getHref('#about')}
                className="hover:text-[#1C1917] transition-colors whitespace-nowrap py-1 border-b border-transparent hover:border-[#1C1917]"
              >
                Who Am I
              </Link>
              <Link
                href={getHref('#skills')}
                className="hover:text-[#1C1917] transition-colors whitespace-nowrap py-1 border-b border-transparent hover:border-[#1C1917]"
              >
                Skills
              </Link>
              <Link
                href={getHref('#awards')}
                className="hover:text-[#1C1917] transition-colors whitespace-nowrap py-1 border-b border-transparent hover:border-[#1C1917]"
              >
                Honors
              </Link>
              <Link
                href={getHref('#contact')}
                className="hover:text-[#1C1917] transition-colors whitespace-nowrap py-1 border-b border-transparent hover:border-[#1C1917]"
              >
                Contact
              </Link>
            </nav>

            {/* Social Icons & Preview CV */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <a
                href="https://github.com/1234Sumuu"
                target="_blank"
                rel="noreferrer"
                className="text-[#78716C] hover:text-[#1C1917] transition-colors p-1"
                aria-label="GitHub"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/in/sumaiya-akter"
                target="_blank"
                rel="noreferrer"
                className="text-[#78716C] hover:text-[#1C1917] transition-colors p-1"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://scholar.google.com"
                target="_blank"
                rel="noreferrer"
                className="text-[#78716C] hover:text-[#1C1917] transition-colors p-1"
                aria-label="Google Scholar"
                title="Google Scholar"
              >
                <GraduationCap className="w-4 h-4" />
              </a>
              <a
                href="mailto:sumaiya205.akter@gmail.com"
                className="text-[#78716C] hover:text-[#1C1917] transition-colors p-1"
                aria-label="Email"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>

              <button
                onClick={() => setShowResumeModal(true)}
                className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#1C1917] text-[#1C1917] text-[11px] uppercase font-semibold tracking-wider hover:bg-[#1C1917] hover:text-[#F4EFE6] transition-all ml-1 shadow-sm active:scale-95"
              >
                <Eye className="w-3 h-3" />
                <span>Preview CV</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* CV Preview Modal */}
      <ResumeModal
        isOpen={showResumeModal}
        onClose={() => setShowResumeModal(false)}
      />
    </>
  );
}
