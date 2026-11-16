'use client';

import { useEffect } from 'react';
import { X, Download, ExternalLink, FileText } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl?: string;
  title?: string;
}

export default function ResumeModal({
  isOpen,
  onClose,
  pdfUrl = '/assets/docs/Sumaiya_Akter_CV.pdf',
  title = 'Sumaiya Akter — Official Curriculum Vitae',
}: ResumeModalProps) {
  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl h-[88vh] bg-[#F4EFE6] border border-[#E2DCD2] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-white border-b border-[#E2DCD2]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E2DCD2] flex items-center justify-center text-[#1C1917]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[#1C1917] tracking-tight">
                {title}
              </h3>
              <p className="text-[11px] text-[#78716C]">
                Software Engineer (AI &amp; Backend) • 3 Pages
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Open in New Tab */}
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E2DCD2] bg-white text-xs font-medium text-[#1C1917] hover:bg-[#F4EFE6] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Full Screen</span>
            </a>

            {/* Download Option INSIDE the preview */}
            <a
              href={pdfUrl}
              download="Sumaiya_Akter_CV.pdf"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1C1917] text-[#F4EFE6] text-xs font-semibold uppercase tracking-wider hover:bg-[#292524] transition-all shadow-sm active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-200 text-[#57534E] hover:text-[#1C1917] transition-colors ml-1"
              aria-label="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Embedded PDF viewer */}
        <div className="flex-1 bg-stone-200 relative">
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=0`}
            className="w-full h-full border-0"
            title="Resume PDF Preview"
          />
        </div>

        {/* Modal Footer / Mobile notice */}
        <div className="px-4 py-2.5 bg-white border-t border-[#E2DCD2] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#78716C] gap-2">
          <span>Official 3-page CV of Sumaiya Akter • Last updated 2026</span>
          <div className="flex items-center gap-2">
            <span className="sm:hidden">PDF not rendering?</span>
            <a
              href={pdfUrl}
              download="Sumaiya_Akter_CV.pdf"
              className="sm:hidden underline font-bold text-[#1C1917]"
            >
              Download direct PDF
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
