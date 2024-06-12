import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
    const client = await sql.connect();
    if (!client) {
        return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
    }
    try {

        const requestBody = await request.json();
        const content = requestBody.content;
        const postid = requestBody.PostID;
        const userid = requestBody.UserID;

        if (!content || !userid || !postid) {
            return NextResponse.json({ error: 'Invalid Request!' }, { status: 400 });
        }

        const result = await client.query(
            'INSERT INTO "Post" ("Content", "ParentPostId", "UserId") VALUES ($1, $2, $3) RETURNING *',
            [content, postid, userid]
        );

        return NextResponse.json({ result: result.rows }, { status: 200 });
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    } finally {
        if (client) {
            client.release();
        }
    }
}
