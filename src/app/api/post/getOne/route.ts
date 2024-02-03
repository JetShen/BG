import { GetClient } from "@/client/mysql";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

async function getPostById(postId: number, client: any, posts: any[] = []) {
    // console.log(posts)
    const result = await client.query(
        `SELECT 
            post.PostID,
            post.Content,
            post.ParentPostId,
            user.UserID,
            user.Name,
            user.Username,
            COUNT(respuestas.PostID) AS cantidad_respuestas,
            COUNT(likes.LikeID) AS cantidad_likes
        FROM 
            Post post
        JOIN 
            User user ON post.UserID = user.UserID
        LEFT JOIN 
            Likes likes ON post.PostID = likes.PostID
        LEFT JOIN 
            Post respuestas ON post.PostID = respuestas.ParentPostID
        WHERE
            post.PostID = ?
        GROUP BY 
            post.PostID, post.Content, user.UserID, user.Name, user.Username
        `, [postId]);

    const post = result[0];

    if (post[0] && post[0].ParentPostId !== null) {
        posts.splice(0, 0, post[0]); 
        return getPostById(post[0].ParentPostId, client, posts);
    } else {
        posts.splice(0, 0, post[0]); 
        return posts;
    }
}

export async function GET(request: NextRequest){
    try {
        const client = await GetClient();
        const postId = Number(request.nextUrl.searchParams.get("postId"));

        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }

        const posts = await getPostById(postId, client);

        return NextResponse.json({ post:posts }, { status: 200, headers: { 'Content-Type': 'application/json' } });
        
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
