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

    let project: any;
    if (!isNaN(Number(idOrSlug))) {
      project = db.prepare('SELECT * FROM projects WHERE id = ?').get(Number(idOrSlug));
    } else {
      project = db.prepare('SELECT * FROM projects WHERE slug = ?').get(idOrSlug);
    }

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const formatted = {
      ...project,
      featured: Boolean(project.featured),
      gallery: project.gallery ? JSON.parse(project.gallery) : [],
      key_features: project.key_features ? JSON.parse(project.key_features) : [],
      technologies: project.technologies ? JSON.parse(project.technologies) : [],
    };

    return NextResponse.json({ project: formatted });
  } catch (err: any) {
    console.error('Project GET by ID/slug error:', err);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
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
      UPDATE projects SET
        title = ?,
        slug = ?,
        tagline = ?,
        category = ?,
        status = ?,
        role = ?,
        featured = ?,
        order_index = ?,
        thumbnail = ?,
        gallery = ?,
        summary = ?,
        problem_statement = ?,
        solution_overview = ?,
        architecture_details = ?,
        architecture_diagram = ?,
        engineering_challenges = ?,
        key_features = ?,
        technologies = ?,
        measurable_outcomes = ?,
        live_url = ?,
        github_url = ?,
        paper_url = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      body.title,
      body.slug,
      body.tagline || '',
      body.category,
      body.status,
      body.role || 'Software Engineer',
      body.featured ? 1 : 0,
      body.order_index || 0,
      body.thumbnail,
      JSON.stringify(body.gallery || []),
      body.summary || '',
      body.problem_statement || '',
      body.solution_overview || '',
      body.architecture_details || '',
      body.architecture_diagram || '',
      body.engineering_challenges || '',
      JSON.stringify(body.key_features || []),
      JSON.stringify(body.technologies || []),
      body.measurable_outcomes || '',
      body.live_url || '',
      body.github_url || '',
      body.paper_url || '',
      id
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Project PUT error:', err);
    return NextResponse.json({ error: err.message || 'Failed to update project' }, { status: 500 });
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
    db.prepare('DELETE FROM projects WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Project DELETE error:', err);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
