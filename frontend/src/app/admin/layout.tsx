import { cookies } from 'next/headers';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const token = cookieStore.get('sumaiya_admin_token')?.value;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      {token && <AdminSidebar />}
      <div className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
