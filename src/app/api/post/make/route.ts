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
        const userid = requestBody.userid;
        const topicId = requestBody.topicId;

        if (!content || !userid) {
            return NextResponse.json({ error: 'Invalid Request!' }, { status: 400 });
        }

        let result;
        if (topicId !== 0) {
            result = await client.query('INSERT INTO "Post" ("Content", "UserId", "TopicId") VALUES ($1, $2, $3) RETURNING "PostId"', [content, userid, topicId]);
        } else {
            result = await client.query('INSERT INTO "Post" ("Content", "UserId") VALUES ($1, $2) RETURNING "PostId"', [content, userid]);
        }

        const id = result.rows[0].PostId;
        return NextResponse.json({ result: result, id: id }, { status: 200 });
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    } finally {
        if (client) {
            client.release();
        }
    }
}
