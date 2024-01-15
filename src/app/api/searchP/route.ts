import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 

export async function GET() {

    try {
        const result = await sql`SELECT Post.PostId, Post.Content, Usuario.UserId, Usuario.Name, Usuario.Username
        FROM Post
        JOIN Usuario ON Post.UserId = Usuario.UserId`;
        return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });

    }
}