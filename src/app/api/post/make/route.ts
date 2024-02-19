import { GetClient } from "@/client/mysql";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const client = await GetClient();
        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }

        const requestBody = await request.json();
        const content = requestBody.content;
        const userid = requestBody.userid;
        const topicId = requestBody.topicId;

        if (!content || !userid) {
            return NextResponse.json({ error: 'Invalid Request!' }, { status: 400 });
        }
        if (topicId !== 0 ) {
            const result = await client.query('INSERT INTO post (content, userid, topicId) VALUES (?, ?, ?)', [content, userid, topicId]);
            return NextResponse.json({ result }, { status: 200 });
        }
        const result = await client.query('INSERT INTO post (content, userid) VALUES (?, ?)', [content, userid]);
        return NextResponse.json({ result }, { status: 200 });
    } catch (error: any ) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}