import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 

export async function GET() {
    try {
        const result = await sql`SELECT post.postId, post.Content, usuario.UserId, usuario.Name, usuario.Username
        FROM post
        JOIN usuario ON post.UserId = usuario.UserId`;
        return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });

    }
}