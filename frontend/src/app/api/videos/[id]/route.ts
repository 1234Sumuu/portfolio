import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

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
    db.prepare('DELETE FROM videos WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Video DELETE error:', err);
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
  }
}
