import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

async function getPostById(postId: number, client: any, posts: any[] = []) {
    const result = await client.query(
        `SELECT
            p."PostId", 
            p."Content", 
            p."UserID", 
            u."ProfilePicture",
            u."Name", 
            u."Username",
            p."ParentPostId",
            (SELECT COUNT(*) FROM "Post" AS c WHERE c."ParentPostId" = p."PostId") AS "cantidad_respuestas",
            (SELECT COUNT(*) FROM "Likes" AS l WHERE l."PostID" = p."PostId") AS "cantidad_likes",
            (SELECT COUNT(*) FROM "Saved" AS s WHERE s."PostID" = p."PostId") AS "cantidad_saved",
            STRING_AGG(media."Url", ', ') AS "urls_images"
        FROM 
            "Post" p
        INNER JOIN 
            "User" u ON p."UserID" = u."UserID"
        LEFT JOIN 
            "Media" media ON p."PostId" = media."PostId"
        WHERE 
            p."PostId" = $1
        GROUP BY 
            p."PostId", p."Content", p."UserID", u."Name", u."Username", u."ProfilePicture"
        `, [postId]);

    const post = result.rows;

    if (post[0] && post[0].ParentPostId !== null) {
        posts.splice(0, 0, post[0]); 
        return getPostById(post[0].ParentPostId, client, posts);
    } else {
        posts.splice(0, 0, post[0]); 
        return posts;
    }
}

export async function GET(request: NextRequest) {
    try {
        const client = await sql.connect();
        const postId = Number(request.nextUrl.searchParams.get("postId"));

        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }

        const posts = await getPostById(postId, client);

        return NextResponse.json({ post: posts }, { status: 200, headers: { 'Content-Type': 'application/json' } });
        
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
