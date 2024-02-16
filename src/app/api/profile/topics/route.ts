import { GetClient } from "@/client/mysql";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { TopicType } from '@/type/post';


export async function GET(request: NextRequest){
    console.log('GET /api/profile/topics');
    try {
        const client = await GetClient();
        const cursor = request.nextUrl.searchParams.get("cursor")
        const username = request.nextUrl.searchParams.get("username")
        if (username === undefined || username === null) {
            return NextResponse.json({ error: 'Missing "username" parameter' }, { status: 500 });
        }

        if (cursor === undefined || cursor === null) {
            return NextResponse.json({ error: 'Missing "cursor" parameter' }, { status: 500 });
        }

        const cursorValue = parseInt(cursor as string) || 0;
        const pageSize = 7;
        const pageParam = cursorValue * pageSize;

        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }

        const result = await client.query(
            `SELECT 
                Post.TopicId,
                Topic.Name,
                Topic.Description,
                COUNT(*) AS PostCount
            FROM 
                Post
            JOIN 
                Topic ON Post.TopicId = Topic.TopicId
            JOIN 
                User ON Post.UserId = User.UserID
            WHERE 
                User.Name = ?
            GROUP BY 
                Post.TopicId, Topic.Name
            LIMIT ? OFFSET ?
            `, [username, pageSize, pageParam]);
        const topics: Array<TopicType> = result[0] as Array<TopicType>;
        const len = Object.keys(topics);
        const ln: number = len.length;
        
        const nextId = ln < pageSize ? null : cursorValue + 1;
        const previousId = cursorValue > 0 ? cursorValue -1 : null;

        

        return NextResponse.json({ topics, nextId, previousId }, { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
