import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { PostType } from '@/type/post';

export async function GET(request: NextRequest){
    try {
        const client = await sql.connect();
        const cursor = request.nextUrl.searchParams.get("cursor");
        const PostId = request.nextUrl.searchParams.get("PostId");

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
                p."PostId", 
                p."Content", 
                p."UserID", 
                u."Name", 
                u."Username",
                u."ProfilePicture",
                p."ParentPostId",
                (SELECT "Username" FROM "User" u2 WHERE u2."UserID" = "Parent"."UserID") AS "ParentPostUsername",
                (SELECT COUNT(*) FROM "Post" AS c WHERE c."ParentPostId" = p."PostId") AS "cantidad_respuestas",
                (SELECT COUNT(*) FROM "Likes" AS l WHERE l."PostId" = p."PostId") AS "cantidad_likes",
                (SELECT COUNT(*) FROM "Saved" AS s WHERE s."PostId" = p."PostId") AS "cantidad_saved",
                STRING_AGG(media."Url", ', ') AS "urls_images"
            FROM 
                "Post" p
            INNER JOIN 
                "User" u ON p."UserID" = u."UserID"
            LEFT JOIN 
                "Media" media ON p."PostId" = media."PostId"
            LEFT JOIN 
                "Post" "Parent" ON p."ParentPostId" = "Parent"."PostId"
            WHERE 
                p."ParentPostId" = $1
            GROUP BY 
                p."PostId", p."Content", p."UserID", u."Name", u."Username", u."ProfilePicture", p."ParentPostId"
            ORDER BY 
                p."PostId" DESC
            LIMIT $2 OFFSET $3
            `, [PostId, pageSize, pageParam]);

        const posts: Array<PostType> = result.rows as Array<PostType>;
        const len = Object.keys(posts);
        const ln: number = len.length;
        
        const nextId = ln < pageSize ? null : cursorValue + 1;
        const previousId = cursorValue > 0 ? cursorValue - 1 : null;

        return NextResponse.json({ posts, nextId, previousId }, { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
