import Link from 'next/link';
import { Github, Linkedin, Mail, Phone, MapPin, GraduationCap, ArrowUpRight, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#E2DCD2] bg-[#EBE5DB] text-[#57534E] py-14 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-[#D8D0C3]">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold tracking-tight text-[#1C1917]">
                SUMAIYA AKTER
              </span>
              <span className="font-script text-xl text-[#8C827A]">
                portfolio
              </span>
            </div>
            <p className="text-xs text-[#57534E] mt-2 max-w-md">
              Software Engineer – Backend, AI Team @ ACI Limited. Specializing in production AI systems, LLM workflows, distributed architectures, and healthcare deep learning.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/sumaiyamayra"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-white border border-[#E2DCD2] flex items-center justify-center text-[#1C1917] hover:bg-[#1C1917] hover:text-[#F4EFE6] transition-colors shadow-sm"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com/in/sumaiya-akter"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-white border border-[#E2DCD2] flex items-center justify-center text-[#1C1917] hover:bg-[#1C1917] hover:text-[#F4EFE6] transition-colors shadow-sm"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://scholar.google.com"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-white border border-[#E2DCD2] flex items-center justify-center text-[#1C1917] hover:bg-[#1C1917] hover:text-[#F4EFE6] transition-colors shadow-sm"
              aria-label="Google Scholar"
            >
              <GraduationCap className="w-4 h-4" />
            </a>
            <a
              href="mailto:sumaiya205.akter@gmail.com"
              className="w-10 h-10 rounded-full bg-white border border-[#E2DCD2] flex items-center justify-center text-[#1C1917] hover:bg-[#1C1917] hover:text-[#F4EFE6] transition-colors shadow-sm"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8C827A] gap-4">
          <p>© {new Date().getFullYear()} Sumaiya Akter. Engineered with precision & authenticity.</p>
          <div className="flex items-center gap-6">
            <a href="#about" className="hover:text-[#1C1917] transition-colors">About</a>
            <a href="#projects" className="hover:text-[#1C1917] transition-colors">Projects</a>
            <a href="#research" className="hover:text-[#1C1917] transition-colors">Research</a>
            <a href="#contact" className="hover:text-[#1C1917] transition-colors">Contact</a>
            <Link href="/admin/login" className="hover:text-[#1C1917] transition-colors font-medium">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
