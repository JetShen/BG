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
        const postid = requestBody.postid;
        const userid = requestBody.userid;


        if (!content || !userid || !postid) {
            return NextResponse.json({ error: 'Invalid Request!' }, { status: 400 });
        }
        const result = await client.query('INSERT INTO post (Content, ParentPostId, Userid) VALUES (?, ?, ?)', [content, postid, userid]);
        return NextResponse.json({ result }, { status: 200 });
    } catch (error: any ) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}