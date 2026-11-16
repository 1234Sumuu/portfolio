import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import path from 'path';
import fs from 'fs';

export async function GET() {
  try {
    const db = getDb();
    const assets = db.prepare('SELECT * FROM media_assets ORDER BY created_at DESC').all();
    return NextResponse.json({ assets });
  } catch (err: any) {
    console.error('Media GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch media assets' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = getSessionUser();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'uploads';
    const altText = (formData.get('alt_text') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, safeFilename);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeFilename}`;
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO media_assets (filename, original_name, url, mime_type, size_bytes, folder, alt_text)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      safeFilename,
      file.name,
      publicUrl,
      file.type,
      file.size,
      folder,
      altText
    );

    return NextResponse.json({
      success: true,
      asset: {
        id: result.lastInsertRowid,
        url: publicUrl,
        filename: safeFilename,
      }
    });
  } catch (err: any) {
    console.error('Media upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
