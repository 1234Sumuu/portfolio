import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = getSessionUser();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { status } = await req.json();
    const db = getDb();
    const id = Number(params.id);

    db.prepare('UPDATE inquiries SET status = ? WHERE id = ?').run(status, id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Inquiry PATCH error:', err);
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
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
    db.prepare('DELETE FROM inquiries WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Inquiry DELETE error:', err);
    return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 });
  }
}
