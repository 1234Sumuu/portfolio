'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Eye, FileText } from 'lucide-react';
import ResumeModal from './ResumeModal';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'ABOUT', href: '#about' },
    { name: 'EXPERIENCE', href: '#experience' },
    { name: 'PROJECTS', href: '#projects' },
    { name: 'SKILLS', href: '#skills' },
    { name: 'RESEARCH', href: '#research' },
    { name: 'AWARDS', href: '#awards' },
    { name: 'CONTACT', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#F4EFE6]/90 backdrop-blur-md border-b border-[#E2DCD2] py-3.5 shadow-sm'
          : 'bg-[#F4EFE6]/70 backdrop-blur-sm py-4 border-b border-[#E2DCD2]/60'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Identity */}
          <Link href="/" className="group flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold tracking-tight text-[#1C1917]">
              SUMAIYA AKTER
            </span>
            <span className="font-script text-lg text-[#8C827A] group-hover:text-[#1C1917] transition-colors">
              portfolio
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs uppercase font-medium tracking-widest text-[#57534E] hover:text-[#1C1917] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action: Preview CV */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => setShowResumeModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1C1917] text-[#F4EFE6] text-xs font-medium tracking-wider uppercase hover:bg-[#292524] transition-all shadow-sm active:scale-95"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview CV</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-[#1C1917] hover:bg-[#EBE5DB] transition-colors"
            aria-label="Toggle Navigation"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {isOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-[#E2DCD2] mt-3 space-y-2 bg-[#F4EFE6]">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block py-2 text-sm uppercase tracking-wider font-medium text-[#1C1917] hover:text-[#8C827A]"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-2">
              <button
                onClick={() => {
                  setShowResumeModal(true);
                  setIsOpen(false);
                }}
                className="inline-flex w-full justify-center items-center gap-2 px-4 py-2.5 rounded-full bg-[#1C1917] text-[#F4EFE6] text-xs font-medium tracking-wider uppercase"
              >
                <Eye className="w-4 h-4" />
                <span>Preview Official CV</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Resume Preview Modal */}
      <ResumeModal
        isOpen={showResumeModal}
        onClose={() => setShowResumeModal(false)}
      />
    </header>
  );
}
