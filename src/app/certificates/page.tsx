import Link from 'next/link';
import { getDb } from '@/lib/db';
import SectionHeading from '@/components/SectionHeading';
import {
  Award,
  GraduationCap,
  ExternalLink,
  Download,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Certification } from '@/lib/types';

export const revalidate = 0;

export default function CertificatesPage() {
  const db = getDb();
  const certifications = db
    .prepare('SELECT * FROM certifications ORDER BY id ASC')
    .all() as Certification[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          Verified Credentials
        </span>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Certifications, Athletic Medals & Academic Honors
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
          Authentic academic credentials, certified martial arts achievements (Taekwondo Black Belt & National Gold Medals), standardized testing results, and professional software certifications.
        </p>

        <div className="pt-2">
          <a
            href="/assets/docs/Academic_Transcripts_and_Certificates.pdf"
            download
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-all inline-flex items-center gap-2 shadow-sm shadow-emerald-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Complete Official Transcripts & Scans (PDF)</span>
          </a>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert) => (
          <div
            key={cert.id}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm overflow-hidden hover:border-zinc-700 transition-all flex flex-col justify-between"
          >
            {/* Scanned Image Preview if available */}
            {cert.image_url ? (
              <div className="h-48 w-full bg-zinc-950 overflow-hidden relative group">
                <img
                  src={cert.image_url}
                  alt={cert.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>
                {cert.badge && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                    {cert.badge}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-32 w-full bg-zinc-950 flex items-center justify-center p-6 border-b border-zinc-800">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Award className="w-6 h-6" />
                </div>
              </div>
            )}

            {/* Details */}
            <div className="p-6 space-y-3 flex-grow flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
                  <span className="text-emerald-400 font-semibold">{cert.type}</span>
                  <span>{cert.year}</span>
                </div>

                <h3 className="font-bold text-white text-base leading-snug">
                  {cert.title}
                </h3>

                <p className="text-xs font-medium text-zinc-300">
                  Issuer: {cert.issuer}
                </p>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  {cert.description}
                </p>
              </div>

              {cert.pdf_url && (
                <div className="pt-4 border-t border-zinc-800/60">
                  <a
                    href={cert.pdf_url}
                    download
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Download Scanned Certificate PDF</span>
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
