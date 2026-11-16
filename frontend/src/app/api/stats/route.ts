import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  const session = getSessionUser();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getDb();
    const totalProjects = (db.prepare('SELECT COUNT(*) as count FROM projects').get() as any).count;
    const liveProjects = (db.prepare("SELECT COUNT(*) as count FROM projects WHERE status = 'Live in Production'").get() as any).count;
    const totalPublications = (db.prepare('SELECT COUNT(*) as count FROM publications').get() as any).count;
    const totalArticles = (db.prepare('SELECT COUNT(*) as count FROM articles').get() as any).count;
    const totalVideos = (db.prepare('SELECT COUNT(*) as count FROM videos').get() as any).count;
    const pendingInquiries = (db.prepare("SELECT COUNT(*) as count FROM inquiries WHERE status = 'new'").get() as any).count;
    const totalInquiries = (db.prepare('SELECT COUNT(*) as count FROM inquiries').get() as any).count;

    return NextResponse.json({
      stats: {
        totalProjects,
        liveProjects,
        totalPublications,
        totalArticles,
        totalVideos,
        pendingInquiries,
        totalInquiries,
      }
    });
  } catch (err: any) {
    console.error('Stats GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}
