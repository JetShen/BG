import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { PostType } from '@/type/post';

export async function GET(request: NextRequest) {
    console.log('GET /api/LikesP');
    try {
        const client = await sql.connect();
        const cursor = request.nextUrl.searchParams.get("cursor");
        const userid = request.nextUrl.searchParams.get("userid");
        
        if (!userid) {
            return NextResponse.json({ error: 'Missing "userid" parameter' }, { status: 400 });
        }
        const useridValue = parseInt(userid, 10);

        if (!cursor) {
            return NextResponse.json({ error: 'Missing "cursor" parameter' }, { status: 400 });
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
                ou."UserID",
                ou."Name", 
                ou."Username",
                ou."ProfilePicture",
                (SELECT COUNT(*) FROM "Post" AS c WHERE c."ParentPostId" = p."PostId") AS "cantidad_respuestas",
                (SELECT COUNT(*) FROM "Likes" AS l WHERE l."PostId" = p."PostId") AS "cantidad_likes",
                (SELECT COUNT(*) FROM "Saved" AS sv WHERE sv."PostId" = p."PostId") AS "cantidad_saved",
                (SELECT COUNT(*) FROM "Share" AS s WHERE s."PostId" = p."PostId") AS "cantidad_share",
                STRING_AGG(media."Url", ', ') AS "urls_images"
            FROM 
                "Post" p
            INNER JOIN 
                "User" ou ON p."UserID" = ou."UserID"
            LEFT JOIN 
                "Media" media ON p."PostId" = media."PostId"
            LEFT JOIN 
                "Likes" l ON l."PostId" = p."PostId"
            WHERE
                l."UserID" = $1
            GROUP BY 
                p."PostId", p."Content", ou."UserID", ou."Name", ou."Username", ou."ProfilePicture"
            ORDER BY 
                p."PostId" DESC
            LIMIT $2 OFFSET $3`,
            [useridValue, pageSize, pageParam]
        );

        const posts: Array<PostType> = result.rows as Array<PostType>;
        const ln = posts.length;

        const nextId = ln < pageSize ? null : cursorValue + 1;
        const previousId = cursorValue > 0 ? cursorValue - 1 : null;
        if (client) {
            client.release();
        }
        return NextResponse.json({ posts, nextId, previousId }, { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
