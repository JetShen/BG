import { GetClient } from "@/client/mysql";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


export async function GET(request: NextRequest){
    try {
        const client = await GetClient();
        const postid  = request.nextUrl.searchParams.get("postId");
        const numberPost = Number(postid);

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
            WHERE post.PostID = ?
            GROUP BY 
                post.PostID, post.Content, user.UserID, user.Name, user.Username
            `, [numberPost]);

        const post = result[0];
        return NextResponse.json({ post }, { status: 200, headers: { 'Content-Type': 'application/json' } });
        
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
