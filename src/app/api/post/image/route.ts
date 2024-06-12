import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { put } from '@vercel/blob';

const supportedImageFormats: string[] = ['image/jpeg', 'image/png', 'image/gif'];

export async function POST(req: NextRequest): Promise<NextResponse> {
    console.log('POST /api/post/image');
    const client = await sql.connect();
    if (!client) {
        return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
    }
    const body = await req.formData();
    const file = body.get('file') as Blob;
    const id = body.get('id') as string;
    const idValue = parseInt(id, 10);

    try {
        if (!file || !id) {
            return NextResponse.json({ error: 'Invalid Request' }, { status: 400 });
        }

        if (!supportedImageFormats.includes(file.type)) {
            return NextResponse.json({ error: 'Unsupported Image Format' }, { status: 400 });
        }

        const blob = await put((file as File).name, file as Blob, { access: 'public' });

        const result = await client.query(
            'INSERT INTO "Media" ("PostId", "MediaName", "Url") VALUES ($1, $2, $3)',
            [idValue, (file as File).name, blob.url]
        );

        return NextResponse.json({ url: blob.url }, { status: 200 });
    } catch (error: any) {
        await client.query('DELETE FROM "Post" WHERE "PostId" = $1', [idValue]);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        client.release();
    }
}
