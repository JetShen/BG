import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET() {

    try {
        const result = await sql`SELECT Post.PostId, Post.Content, UserTest.UserId, UserTest.Name, UserTest.Username
        FROM Post
        JOIN UserTest ON Post.UserId = UserTest.UserId`;
        return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });

    }
}