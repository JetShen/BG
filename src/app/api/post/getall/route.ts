import { GetClient } from "@/client/mysql";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { PostType } from '@/type/post';


export async function GET(request: NextRequest){
    try {
        const client = await GetClient();
        const cursor = request.nextUrl.searchParams.get("cursor")

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
                post.PostID,
                post.Content,
                user.UserID,
                user.Name,
                user.Username,
                COUNT(likes.LikeID) AS cantidad_likes
            FROM 
                post
            JOIN 
                user ON post.UserID = user.UserID
            LEFT JOIN 
                likes ON post.PostID = likes.PostID
            GROUP BY 
                post.PostID, post.Content, user.UserID, user.Name, user.Username
            ORDER BY 
                post.PostID DESC
            LIMIT ? OFFSET ?
            `, [pageSize, pageParam]);
        const posts: Array<PostType> = result[0] as Array<PostType>;
        const len = Object.keys(posts);
        const ln: number = len.length;
        
        const nextId = ln < pageSize ? null : cursorValue + 1;
        const previousId = cursorValue > 0 ? cursorValue -1 : null;

        

        return NextResponse.json({ posts, nextId, previousId }, { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
