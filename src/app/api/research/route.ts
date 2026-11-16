import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    const db = getDb();
    let query = 'SELECT * FROM publications WHERE 1=1';
    const params: any[] = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (featured === 'true' || featured === '1') {
      query += ' AND featured = 1';
    }

    query += ' ORDER BY year DESC, id ASC';

    const rows = db.prepare(query).all(...params);
    const formatted = rows.map((r: any) => ({
      ...r,
      featured: Boolean(r.featured),
      key_findings: r.key_findings ? JSON.parse(r.key_findings) : [],
    }));

    return NextResponse.json({ publications: formatted });
  } catch (err: any) {
    console.error('Publications GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch publications' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = getSessionUser();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      title, slug, authors, venue, year, status, category,
      abstract, methodology, dataset_details, key_findings, metrics,
      pdf_url, arxiv_url, doi, bibtex, featured
    } = body;

    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO publications (
        title, slug, authors, venue, year, status, category,
        abstract, methodology, dataset_details, key_findings, metrics,
        pdf_url, arxiv_url, doi, bibtex, featured
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?
      )
    `);

    const result = stmt.run(
      title, slug, authors, venue, year, status, category,
      abstract || '', methodology || '', dataset_details || '',
      JSON.stringify(key_findings || []), metrics || '',
      pdf_url || '', arxiv_url || '', doi || '', bibtex || '', featured ? 1 : 0
    );

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (err: any) {
    console.error('Publication POST error:', err);
    return NextResponse.json({ error: err.message || 'Failed to create publication' }, { status: 500 });
  }
}
