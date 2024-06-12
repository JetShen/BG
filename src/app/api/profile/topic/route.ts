import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { TopicType } from '@/type/post';

//get all post related to a topic and a user
export async function GET(request: NextRequest){
    console.log('GET /api/profile/topic');
    try {
        const client = await sql.connect();
        const cursor = request.nextUrl.searchParams.get("cursor")
        const username = request.nextUrl.searchParams.get("username")
        const topicName = request.nextUrl.searchParams.get("topicName")
        if (username == null || cursor == null || topicName == null) {
            let missingParam: string;
            if (username == null) missingParam = 'username';
            else if (cursor == null) missingParam = 'cursor';
            else missingParam = 'topicName';
        
            return NextResponse.json({ error: `Missing "${missingParam}" parameter` }, { status: 500 });
        }
        

        const cursorValue = parseInt(cursor as string) || 0;

        const pageSize = 7;
        const pageParam = cursorValue * pageSize;

        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }

        const result = await client.query(
            `SELECT 
                p."PostId",
                p."Content",
                u."UserID",
                u."Name",
                u."Username",
                COUNT(L."LikeID") AS cantidad_likes,
                COUNT(r."PostId") AS cantidad_respuestas
            FROM 
                "Post" p
            JOIN 
                "User" u ON p."UserID" = u."UserID"
            LEFT JOIN 
                "Likes" l ON p."PostId" = l."PostId"
            LEFT JOIN 
                "Post" r ON p."PostId" = r."ParentPostId"
            JOIN
                "Topic" t ON p."TopicID" = t."TopicID"
            WHERE
                u."Name" = $1 AND t."Name" = $2
            GROUP BY 
                p."PostId", p."Content", u."UserID", u."Name", u."Username"
            ORDER BY 
                p."PostId" DESC     
            LIMIT $3 OFFSET $4
            `, [username, topicName, pageSize, pageParam]);
        const topics: Array<TopicType> = result.rows as Array<TopicType>;
        const len = Object.keys(topics);
        const ln: number = len.length;
        
        const nextId = ln < pageSize ? null : cursorValue + 1;
        const previousId = cursorValue > 0 ? cursorValue -1 : null;

        
        if(client){
            client.release();
        }
        return NextResponse.json({ topics, nextId, previousId }, { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
