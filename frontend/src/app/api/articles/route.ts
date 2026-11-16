import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM articles ORDER BY published_date DESC, id DESC').all();
    const formatted = rows.map((r: any) => ({
      ...r,
      featured: Boolean(r.featured),
      tags: r.tags ? JSON.parse(r.tags) : [],
    }));

    return NextResponse.json({ articles: formatted });
  } catch (err: any) {
    console.error('Articles GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = getSessionUser();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, slug, category, summary, content, read_time_minutes, published_date, tags, featured } = body;

    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO articles (
        title, slug, category, summary, content, read_time_minutes, published_date, tags, featured
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `);

    const result = stmt.run(
      title, slug, category, summary || '', content || '',
      read_time_minutes || 5, published_date || new Date().toISOString().split('T')[0],
      JSON.stringify(tags || []), featured ? 1 : 0
    );

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (err: any) {
    console.error('Article POST error:', err);
    return NextResponse.json({ error: err.message || 'Failed to create article' }, { status: 500 });
  }
}
