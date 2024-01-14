import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function POST(request: Request): Promise<NextResponse> {

    try {
        const requestBody = await request.json();
        const content = requestBody.content;
        const userid = requestBody.userid;
        if (content && userid) {
            const result = await sql`INSERT INTO post (Content, Userid) VALUES (${content}, ${userid}) RETURNING *`;
            return NextResponse.json({ result }, { status: 200 });
        } else {
            throw new Error('Invalid request body');
        }
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}