import { NextResponse } from 'next/server';
 import { put } from '@vercel/blob';

export async function POST(request: Request): Promise<NextResponse> {
    const body = await request.formData();
    const file = body.get('file') as File;
    if (!file.name) {
        return NextResponse.json({ error: 'Invalid Request!' }, { status: 400 });
    }

    try {
        console.log('Uploading', body);
        const blob = await put(file.name, file, {
            access: 'public',
        });

        return NextResponse.json({ url: blob.url }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 400 }, 
        );
    }
}