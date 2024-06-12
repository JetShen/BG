import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { put } from '@vercel/blob';

const supportedImageFormats: string[] = ['image/jpeg', 'image/png', 'image/gif'];

// This is the route for the register page
export async function POST(request: Request): Promise<NextResponse> {
    try {
        const client = await sql.connect();
        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }

        const requestBody = await request.formData();
        const name = requestBody.get('name') as string;
        const username = requestBody.get('username') as string;
        const email = requestBody.get('email') as string;
        const password = requestBody.get('password') as string;
        const file = requestBody.get('pfp') as Blob;

        if (!username || !email || !password || !name || !file) {
            return NextResponse.json({ error: 'Invalid Request!' }, { status: 400 });
        }
        
        try {
            const blob = await put((file as File).name, file as Blob, { access: 'public' });
            const result = await client.query(
                'INSERT INTO "User" ("Name", "Username", "Email", "Password", "ProfilePicture") VALUES ($1, $2, $3, $4, $5)',
                [name, username, email, password, blob.url]
            );
            return NextResponse.json({ message: 'User Registered Successfully' }, { status: 200 });
        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
