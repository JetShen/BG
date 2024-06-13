import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
    console.log('/api/post/repost');
    try {
        const client = await sql.connect();
        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }

        const requestBody = await request.json();
        const userid = requestBody.UserId;
        const postid = requestBody.PostId;

        if (!userid || !postid) {
            return NextResponse.json({ error: 'Invalid Request!' }, { status: 400 });
        }

        const userIdValue = parseInt(userid);
        const postIdValue = parseInt(postid);

        const result = await client.query(
            'INSERT INTO "Share" ("UserId", "PostId") VALUES ($1, $2) RETURNING *',
            [userIdValue, postIdValue]
        );
        if (client) {
            client.release();
        }
        return NextResponse.json({ result: result.rows[0] }, { status: 200 });
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
