'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FolderGit2,
  GraduationCap,
  FileText,
  Video,
  Inbox,
  Image as ImageIcon,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Projects CMS', href: '/admin/projects', icon: <FolderGit2 className="w-4 h-4" /> },
    { name: 'Research Papers', href: '/admin/research', icon: <GraduationCap className="w-4 h-4" /> },
    { name: 'Articles & Blog', href: '/admin/writing', icon: <FileText className="w-4 h-4" /> },
    { name: 'Videos CMS', href: '/admin/videos', icon: <Video className="w-4 h-4" /> },
    { name: 'Inquiries', href: '/admin/inquiries', icon: <Inbox className="w-4 h-4" /> },
    { name: 'Media Library', href: '/admin/media', icon: <ImageIcon className="w-4 h-4" /> },
  ];

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col justify-between p-4 min-h-screen shrink-0">
      <div className="space-y-6">
        {/* Brand */}
        <div className="flex items-center gap-3 px-2 pt-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm">
            SA
          </div>
          <div>
            <div className="font-bold text-sm text-white">Admin CMS</div>
            <div className="text-[10px] text-zinc-500 font-mono">Portfolio Control Panel</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  active
                    ? 'bg-emerald-500 text-zinc-950 font-semibold shadow-sm shadow-emerald-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer controls */}
      <div className="pt-4 border-t border-zinc-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
        >
          <span>View Live Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
