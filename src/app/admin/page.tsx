import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import {
  FolderGit2,
  GraduationCap,
  FileText,
  Video,
  Inbox,
  ArrowUpRight,
  Activity,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';

export const revalidate = 0;

export default function AdminDashboardPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('sumaiya_admin_token')?.value;

  if (!token) {
    redirect('/admin/login');
  }

  const db = getDb();
  const totalProjects = (db.prepare('SELECT COUNT(*) as c FROM projects').get() as any).c;
  const liveProjects = (db.prepare("SELECT COUNT(*) as c FROM projects WHERE status = 'Live in Production'").get() as any).c;
  const totalPubs = (db.prepare('SELECT COUNT(*) as c FROM publications').get() as any).c;
  const totalArticles = (db.prepare('SELECT COUNT(*) as c FROM articles').get() as any).c;
  const totalVideos = (db.prepare('SELECT COUNT(*) as c FROM videos').get() as any).c;
  const pendingInquiries = (db.prepare("SELECT COUNT(*) as c FROM inquiries WHERE status = 'new'").get() as any).c;
  const totalInquiries = (db.prepare('SELECT COUNT(*) as c FROM inquiries').get() as any).c;

  const recentInquiries = db.prepare('SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 5').all() as any[];

  const stats = [
    { label: 'Total Projects', value: totalProjects, sub: `${liveProjects} Live in Production`, href: '/admin/projects', icon: <FolderGit2 className="w-5 h-5 text-emerald-400" /> },
    { label: 'Research Papers', value: totalPubs, sub: 'MDPI, arXiv & JURIX', href: '/admin/research', icon: <GraduationCap className="w-5 h-5 text-cyan-400" /> },
    { label: 'Published Articles', value: totalArticles, sub: 'Technical insights & guides', href: '/admin/writing', icon: <FileText className="w-5 h-5 text-purple-400" /> },
    { label: 'Video Demos', value: totalVideos, sub: 'System walkthroughs', href: '/admin/videos', icon: <Video className="w-5 h-5 text-amber-400" /> },
    { label: 'Pending Inquiries', value: pendingInquiries, sub: `${totalInquiries} Total Received`, href: '/admin/inquiries', icon: <Inbox className="w-5 h-5 text-rose-400" /> },
  ];

  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
            CMS Command Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Portfolio Management Dashboard
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Logged in as <strong className="text-zinc-200">sumaiya205.akter@gmail.com</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-500/20"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Manage Projects</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((s, idx) => (
          <Link
            key={idx}
            href={s.href}
            className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all space-y-3 group block"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                {s.icon}
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
            </div>

            <div>
              <div className="text-2xl font-bold font-mono text-white tracking-tight">
                {s.value}
              </div>
              <div className="text-xs font-semibold text-zinc-300 mt-0.5">{s.label}</div>
              <div className="text-[10px] text-zinc-500 mt-0.5 font-mono">{s.sub}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Inquiries List */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Recent Inbound Inquiries</h2>
            <p className="text-xs text-zinc-400">Collaboration and hiring messages received through contact forms</p>
          </div>
          <Link
            href="/admin/inquiries"
            className="text-xs font-mono text-emerald-400 hover:underline"
          >
            View All Inquiries →
          </Link>
        </div>

        {recentInquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 border-b border-zinc-800">
                <tr>
                  <th className="pb-3 font-semibold">Name & Email</th>
                  <th className="pb-3 font-semibold">Intent</th>
                  <th className="pb-3 font-semibold">Subject</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {recentInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3">
                      <div className="font-semibold text-white">{inq.name}</div>
                      <div className="text-zinc-500 text-[11px] font-mono">{inq.email}</div>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-950 border border-zinc-800 text-emerald-400">
                        {inq.intent}
                      </span>
                    </td>
                    <td className="py-3 text-zinc-300 max-w-xs truncate">
                      {inq.subject}
                    </td>
                    <td className="py-3 font-mono text-zinc-500 text-[11px]">
                      {inq.created_at?.slice(0, 10)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          inq.status === 'new'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : inq.status === 'replied'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {inq.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-zinc-500">
            No inquiries received yet.
          </div>
        )}
      </div>

      {/* Quick CMS Action Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          href="/admin/projects"
          className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 hover:border-emerald-500/40 hover:bg-zinc-900/60 transition-all space-y-2 block group"
        >
          <FolderGit2 className="w-6 h-6 text-emerald-400 mb-2" />
          <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">
            Manage Projects
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Create, update architectures, add live deployment URLs, and edit technical details across all 14 projects.
          </p>
        </Link>

        <Link
          href="/admin/research"
          className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 hover:border-cyan-500/40 hover:bg-zinc-900/60 transition-all space-y-2 block group"
        >
          <GraduationCap className="w-6 h-6 text-cyan-400 mb-2" />
          <h3 className="font-bold text-white text-base group-hover:text-cyan-400 transition-colors">
            Manage Research
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Add manuscripts, upload PDFs, update peer-reviewed publication statuses, and manage BibTeX citations.
          </p>
        </Link>

        <Link
          href="/admin/media"
          className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 hover:border-purple-500/40 hover:bg-zinc-900/60 transition-all space-y-2 block group"
        >
          <Inbox className="w-6 h-6 text-purple-400 mb-2" />
          <h3 className="font-bold text-white text-base group-hover:text-purple-400 transition-colors">
            Media Library
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Upload new screenshots, diagram PNGs, and certificates to reuse across the entire digital portfolio.
          </p>
        </Link>
      </div>
    </div>
  );
}
