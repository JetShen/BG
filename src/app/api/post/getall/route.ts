import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { PostType } from '@/type/post';

export async function GET(request: NextRequest) {
    try {
        const client = await sql.connect();
        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }

        const cursor = request.nextUrl.searchParams.get("cursor");
        const userid = request.nextUrl.searchParams.get("userid");

        if (!userid) return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        if (!cursor) return NextResponse.json({ error: 'Cursor is required' }, { status: 400 });

        const cursorValue = parseInt(cursor as string) || 0;
        const userIdValue = parseInt(userid as string) || 0;
        const pageSize = 7;
        const pageParam = cursorValue * pageSize;

        const result = await client.query(
            `SELECT
                p."PostId", 
                p."Content", 
                ou."UserId",
                ou."Name", 
                ou."Username",
                ou."ProfilePicture",
                COALESCE(u."Username", null) AS "RepostBy",
                (SELECT COUNT(*) FROM "Post" AS c WHERE c."ParentPostId" = p."PostId") AS "cantidad_respuestas",
                (SELECT COUNT(*) FROM "Likes" AS l WHERE l."PostId" = p."PostId") AS "cantidad_likes",
                (SELECT COUNT(*) FROM "Saved" AS sv WHERE sv."PostId" = p."PostId") AS "cantidad_saved",
                (SELECT COUNT(*) FROM "Share" AS s WHERE s."PostId" = p."PostId") AS "cantidad_share",
                STRING_AGG(media."Url", ', ') AS "urls_images"
            FROM 
                "Post" p
            INNER JOIN 
                "User" ou ON p."UserId" = ou."UserId"
            LEFT JOIN 
                "Media" media ON p."PostId" = media."PostId"
            LEFT JOIN 
                "Share" s ON p."PostId" = s."PostId"
            LEFT JOIN 
                "User" u ON s."UserId" = u."UserId"
            LEFT JOIN 
                "Follow" f ON (ou."UserId" = f."FollowedId" OR u."UserId" = f."FollowedId")
            WHERE 
                f."UserId" = $1 AND p."ParentPostId" is null
            GROUP BY 
                p."PostId", p."Content", ou."UserId", ou."Name", ou."Username", ou."ProfilePicture",
                u."UserId", u."Name", u."Username", u."ProfilePicture", s."UserId"
            ORDER BY 
                p."PostId" DESC        
            LIMIT $2 OFFSET $3
            `, [userIdValue, pageSize, pageParam]);
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
