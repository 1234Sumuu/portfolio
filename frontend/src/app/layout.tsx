import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
        url: '/assets/images/sumaiya-portrait.jpg',
        width: 612,
        height: 917,
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
    images: ['/assets/images/sumaiya-portrait.jpg'],
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
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-black">
        <Navbar />
        <main className="flex-grow pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
