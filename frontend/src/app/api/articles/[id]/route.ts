import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const idOrSlug = params.id;

    let art: any;
    if (!isNaN(Number(idOrSlug))) {
      art = db.prepare('SELECT * FROM articles WHERE id = ?').get(Number(idOrSlug));
    } else {
      art = db.prepare('SELECT * FROM articles WHERE slug = ?').get(idOrSlug);
    }

    if (!art) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const formatted = {
      ...art,
      featured: Boolean(art.featured),
      tags: art.tags ? JSON.parse(art.tags) : [],
    };

    return NextResponse.json({ article: formatted });
  } catch (err: any) {
    console.error('Article GET by ID error:', err);
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = getSessionUser();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const db = getDb();
    const id = Number(params.id);

    const stmt = db.prepare(`
      UPDATE articles SET
        title = ?,
        slug = ?,
        category = ?,
        summary = ?,
        content = ?,
        read_time_minutes = ?,
        published_date = ?,
        tags = ?,
        featured = ?
      WHERE id = ?
    `);

    stmt.run(
      body.title,
      body.slug,
      body.category,
      body.summary,
      body.content,
      body.read_time_minutes,
      body.published_date,
      JSON.stringify(body.tags || []),
      body.featured ? 1 : 0,
      id
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Article PUT error:', err);
    return NextResponse.json({ error: err.message || 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = getSessionUser();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getDb();
    const id = Number(params.id);
    db.prepare('DELETE FROM articles WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Article DELETE error:', err);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
