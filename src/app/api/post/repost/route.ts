import { GetClient } from "@/client/mysql";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
    console.log('/api/post/repost');
    try {
        const client = await GetClient();
        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }

        const requestBody = await request.json();
        const userid = requestBody.UserID;
        const postid = requestBody.PostID;

        if (!userid || !postid) {
            return NextResponse.json({ error: 'Invalid Request!' }, { status: 400 });
        }
        const userIdValue = parseInt(userid);
        const postIdValue = parseInt(postid);
        const result = await client.query('INSERT INTO Share (UserId, PostId) VALUES (?, ?)', [userIdValue, postIdValue]);
        return NextResponse.json({ result }, { status: 200 });
    } catch (error: any ) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}