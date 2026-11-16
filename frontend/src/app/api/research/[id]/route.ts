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

    let pub: any;
    if (!isNaN(Number(idOrSlug))) {
      pub = db.prepare('SELECT * FROM publications WHERE id = ?').get(Number(idOrSlug));
    } else {
      pub = db.prepare('SELECT * FROM publications WHERE slug = ?').get(idOrSlug);
    }

    if (!pub) {
      return NextResponse.json({ error: 'Publication not found' }, { status: 404 });
    }

    const formatted = {
      ...pub,
      featured: Boolean(pub.featured),
      key_findings: pub.key_findings ? JSON.parse(pub.key_findings) : [],
    };

    return NextResponse.json({ publication: formatted });
  } catch (err: any) {
    console.error('Publication GET by ID error:', err);
    return NextResponse.json({ error: 'Failed to fetch publication' }, { status: 500 });
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
      UPDATE publications SET
        title = ?,
        slug = ?,
        authors = ?,
        venue = ?,
        year = ?,
        status = ?,
        category = ?,
        abstract = ?,
        methodology = ?,
        dataset_details = ?,
        key_findings = ?,
        metrics = ?,
        pdf_url = ?,
        arxiv_url = ?,
        doi = ?,
        bibtex = ?,
        featured = ?
      WHERE id = ?
    `);

    stmt.run(
      body.title,
      body.slug,
      body.authors,
      body.venue,
      body.year,
      body.status,
      body.category,
      body.abstract,
      body.methodology,
      body.dataset_details,
      JSON.stringify(body.key_findings || []),
      body.metrics,
      body.pdf_url,
      body.arxiv_url,
      body.doi,
      body.bibtex,
      body.featured ? 1 : 0,
      id
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Publication PUT error:', err);
    return NextResponse.json({ error: err.message || 'Failed to update publication' }, { status: 500 });
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
    db.prepare('DELETE FROM publications WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Publication DELETE error:', err);
    return NextResponse.json({ error: 'Failed to delete publication' }, { status: 500 });
  }
}
