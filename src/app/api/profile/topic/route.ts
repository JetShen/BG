import { GetClient } from "@/client/mysql";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { TopicType } from '@/type/post';

//get all post related to a topic and a user
export async function GET(request: NextRequest){
    console.log('GET /api/profile/topic');
    try {
        const client = await GetClient();
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
                post.PostID,
                post.Content,
                user.UserID,
                user.Name,
                user.Username,
                COUNT(likes.LikeID) AS cantidad_likes,
                COUNT(respuestas.PostID) AS cantidad_respuestas
            FROM 
                post
            JOIN 
                user ON post.UserID = user.UserID
            LEFT JOIN 
                likes ON post.PostID = likes.PostID
            LEFT JOIN 
                Post respuestas ON post.PostID = respuestas.ParentPostID
            JOIN
                Topic ON post.TopicID = Topic.TopicID
            WHERE
                user.Name = ? AND Topic.Name = ?
            GROUP BY 
                post.PostID, post.Content, user.UserID, user.Name, user.Username
            ORDER BY 
                post.PostID DESC     
            LIMIT ? OFFSET ?
            `, [username, topicName, pageSize, pageParam]);
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
