import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET() {
  const session = getSessionUser();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const db = getDb();
  const user = db.prepare('SELECT id, email, role, created_at FROM admin_users WHERE id = ?').get(session.userId) as any;

  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user,
  });
}
