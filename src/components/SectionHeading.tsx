import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface SectionHeadingProps {
  kicker?: string;
  title: string;
  description?: string;
  linkText?: string;
  linkHref?: string;
  align?: 'left' | 'center';
}

export default function SectionHeading({
  kicker,
  title,
  description,
  linkText,
  linkHref,
  align = 'left'
}: SectionHeadingProps) {
  return (
    <div className={`mb-12 ${align === 'center' ? 'text-center max-w-2xl mx-auto' : 'max-w-3xl'}`}>
      {kicker && (
        <span className="inline-block text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold mb-2 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
          {kicker}
        </span>
      )}
      <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 ${align === 'center' ? 'sm:justify-center' : ''}`}>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
          {title}
        </h2>
        {linkText && linkHref && (
          <Link
            href={linkHref}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors shrink-0 group"
          >
            <span>{linkText}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>
      {description && (
        <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
