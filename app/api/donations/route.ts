import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const dataDir = path.join(process.cwd(), 'data');
    const dataPath = path.join(dataDir, 'donations.json');

    // ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    let existing: Array<Record<string, unknown>> = [];
    if (fs.existsSync(dataPath)) {
      const raw = await fs.promises.readFile(dataPath, 'utf8');
      try {
        existing = JSON.parse(raw || '[]');
      } catch (err) {
        console.error('donations.json parse error', err);
        existing = [];
      }
    }

    const id = Date.now();
    const entry = {
      id,
      ...body,
      createdAt: new Date().toISOString(),
    };

    existing.push(entry);

    await fs.promises.writeFile(dataPath, JSON.stringify(existing, null, 2), 'utf8');

    return NextResponse.json({ success: true, entry }, { status: 201 });
  } catch (err) {
    console.error('donations POST error', err);
    return NextResponse.json({ error: 'Failed to save donation application' }, { status: 500 });
  }
}
