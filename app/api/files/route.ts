import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const file = searchParams.get('file');
    if (file) {
      const filePath = path.join(DATA_DIR, file);
      if (!fs.existsSync(filePath)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json({ content: fs.readFileSync(filePath, 'utf8') });
    }
    return NextResponse.json(fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.md')));
  } catch (err) { return NextResponse.json({ error: 'Errore' }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  try {
    const { filename, content } = await req.json();
    const safeName = filename.endsWith('.md') ? filename : `${filename}.md`;
    fs.writeFileSync(path.join(DATA_DIR, safeName), content, 'utf8');
    return NextResponse.json({ success: true });
  } catch (err) { return NextResponse.json({ error: 'Errore' }, { status: 500 }); }
}

export async function PATCH(req: NextRequest) {
  try {
    const { oldName, newName } = await req.json();
    const safeNewName = newName.endsWith('.md') ? newName : `${newName}.md`;
    fs.renameSync(path.join(DATA_DIR, oldName), path.join(DATA_DIR, safeNewName));
    return NextResponse.json({ success: true });
  } catch (err) { return NextResponse.json({ error: 'Errore' }, { status: 500 }); }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const file = searchParams.get('file');
    if (file) {
      fs.unlinkSync(path.join(DATA_DIR, file));
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'No file' }, { status: 400 });
  } catch (err) { return NextResponse.json({ error: 'Errore' }, { status: 500 }); }
}
