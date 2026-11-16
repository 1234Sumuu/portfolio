import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM videos ORDER BY id ASC').all();
    const formatted = rows.map((r: any) => ({
      ...r,
      featured: Boolean(r.featured),
      topics: r.topics ? JSON.parse(r.topics) : [],
    }));

    return NextResponse.json({ videos: formatted });
  } catch (err: any) {
    console.error('Videos GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = getSessionUser();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, slug, category, description, video_url, thumbnail_url, duration, topics, related_project_slug, featured } = body;

    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO videos (
        title, slug, category, description, video_url, thumbnail_url, duration, topics, related_project_slug, featured
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `);

    const result = stmt.run(
      title, slug, category, description || '', video_url,
      thumbnail_url || '/assets/images/rxpert-fig2_litreview.png',
      duration || '10:00', JSON.stringify(topics || []),
      related_project_slug || '', featured ? 1 : 0
    );

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (err: any) {
    console.error('Video POST error:', err);
    return NextResponse.json({ error: err.message || 'Failed to create video' }, { status: 500 });
  }
}
