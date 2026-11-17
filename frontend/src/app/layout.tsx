import type { Metadata } from 'next';
import { Inter, Oswald, Caveat } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-script',
  weight: ['400', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3063'),
  title: 'Sumaiya Akter | AI Engineer, Software Architect & AI Researcher',
  description: 'Personal portfolio, research publications, production AI systems, and engineering case studies of Sumaiya Akter. Specializing in LLMs, multimodal computer vision, distributed backend systems, and healthcare AI.',
  keywords: [
    'Sumaiya Akter', 'Sumaiya Mayra', 'AI Engineer', 'Backend Software Engineer',
    'AI Researcher', 'FastAPI', 'PostgreSQL', 'Redis', 'Gemini Vision', 'LLM Architect',
    'RAG Systems', 'Medical AI', 'Doctor J', 'AgroGPT', 'LLaMA-XR', 'ULAB', 'PhD Candidate'
  ],
  authors: [{ name: 'Sumaiya Akter' }],
  creator: 'Sumaiya Akter',
  openGraph: {
    title: 'Sumaiya Akter | AI Engineer, Software Architect & Researcher',
    description: 'Explore production AI applications (Doctor J, AgroGPT, Snap&Get) and peer-reviewed medical AI research by Sumaiya Akter.',
    url: 'https://sumaiya-portfolio.com',
    siteName: 'Sumaiya Akter Portfolio',
    images: [
      {
        url: '/assets/images/sumaiya-portrait.webp',
        width: 935,
        height: 1024,
        alt: 'Sumaiya Akter',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sumaiya Akter | AI Engineer & Researcher',
    description: 'Production AI systems, multimodal computer vision, and academic research publications.',
    images: ['/assets/images/sumaiya-portrait.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable} ${caveat.variable}`}>
      <body className="min-h-screen bg-[#F5F1E8] text-[#1C1917] font-sans antialiased selection:bg-[#1C1917] selection:text-[#F5F1E8]">
        {children}
      </body>
    </html>
  );
}
