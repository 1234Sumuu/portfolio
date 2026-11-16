import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  const session = getSessionUser();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getDb();
    const inquiries = db.prepare('SELECT * FROM inquiries ORDER BY created_at DESC').all();
    return NextResponse.json({ inquiries });
  } catch (err: any) {
    console.error('Inquiries GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, organization, intent, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO inquiries (name, email, organization, intent, subject, message)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      name.trim(),
      email.trim().toLowerCase(),
      (organization || '').trim(),
      intent || 'hire',
      (subject || 'General Inquiry').trim(),
      message.trim()
    );

    return NextResponse.json({
      success: true,
      id: result.lastInsertRowid,
      message: 'Inquiry received successfully. I will get back to you shortly!'
    });
  } catch (err: any) {
    console.error('Inquiry POST error:', err);
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}
