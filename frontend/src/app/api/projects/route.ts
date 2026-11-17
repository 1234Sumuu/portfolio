import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    const db = getDb();
    let query = 'SELECT * FROM projects WHERE 1=1';
    const params: any[] = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (featured === 'true' || featured === '1') {
      query += ' AND featured = 1';
    }

    if (search) {
      query += ' AND (title LIKE ? OR summary LIKE ? OR technologies LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    query += ' ORDER BY order_index ASC, id ASC';

    const rows = db.prepare(query).all(...params);

    const formatted = rows.map((r: any) => ({
      ...r,
      featured: Boolean(r.featured),
      gallery: r.gallery ? JSON.parse(r.gallery) : [],
      key_features: r.key_features ? JSON.parse(r.key_features) : [],
      technologies: r.technologies ? JSON.parse(r.technologies) : [],
    }));

    return NextResponse.json({ projects: formatted });
  } catch (err: any) {
    console.error('Projects GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
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
      title, slug, tagline, category, status, role, featured, order_index,
      thumbnail, gallery, summary, problem_statement, solution_overview,
      architecture_details, architecture_diagram, engineering_challenges,
      key_features, technologies, measurable_outcomes, live_url, github_url, paper_url
    } = body;

    if (!title || !slug || !category || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO projects (
        title, slug, tagline, category, status, role, featured, order_index,
        thumbnail, gallery, summary, problem_statement, solution_overview,
        architecture_details, architecture_diagram, engineering_challenges,
        key_features, technologies, measurable_outcomes, live_url, github_url, paper_url
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?, ?, ?
      )
    `);

    const result = stmt.run(
      title,
      slug,
      tagline || '',
      category,
      status,
      role || 'Software Engineer',
      featured ? 1 : 0,
      order_index || 0,
      thumbnail || '/assets/images/doctorj-hero.webp',
      JSON.stringify(gallery || []),
      summary || '',
      problem_statement || '',
      solution_overview || '',
      architecture_details || '',
      architecture_diagram || '',
      engineering_challenges || '',
      JSON.stringify(key_features || []),
      JSON.stringify(technologies || []),
      measurable_outcomes || '',
      live_url || '',
      github_url || '',
      paper_url || ''
    );

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (err: any) {
    console.error('Project POST error:', err);
    return NextResponse.json({ error: err.message || 'Failed to create project' }, { status: 500 });
  }
}
