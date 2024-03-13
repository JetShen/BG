import  { NextRequest, NextResponse } from 'next/server';
import { GetClient } from '@/client/mysql';
import { put } from '@vercel/blob';

const supportedImageFormats: string[] = ['image/jpeg', 'image/png', 'image/gif'];

export async function POST(req: NextRequest ): Promise<NextResponse>  {
  try {
    const body = await req.formData();
    const file = body.get('file') as Blob;
    const id = body.get('id') as string;
    const idValue = parseInt(id, 10);

    if (!file || !id) {
      return NextResponse.json({ error: 'Invalid Request' }, { status: 400 });
    }

    if (!supportedImageFormats.includes(file.type)) { // this validation should be done at the front end. 
      return NextResponse.json({ error: 'Unsupported Image Format' }, { status: 400 });
    }

    const client = await GetClient();
    if (!client) {
        return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
    }

    const blob = await put((file as File).name, file as Blob, { access: 'public' });

    const result = await client.query(
        'INSERT INTO Media (PostId, MediaName, Url) VALUES (?, ?, ?)',
        [idValue, (file as File).name, blob.url]
    );

    return NextResponse.json({  url: blob.url  }, { status: 200 });
  } catch (error:any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
