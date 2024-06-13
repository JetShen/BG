import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { PostType } from '@/type/post';

export async function GET(request: NextRequest) {
    console.log('GET /api/profile/media');
    try {
        const client = await sql.connect();
        const userid = request.nextUrl.searchParams.get("userid");
        const cursor = request.nextUrl.searchParams.get("cursor");

        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }
        const userValue = parseInt(userid as string, 10);
        const cursorValue = parseInt(cursor as string) || 0;
        const pageSize = 7;
        const pageParam = cursorValue * pageSize;

        const result = await client.query(
            `SELECT
                p."PostId",
                p."Content",
                STRING_AGG(m."Url", ', ') AS "urls_images",
                u."Name",
                u."Username",
                u."UserID",
                u."ProfilePicture",
                (SELECT COUNT(*) FROM "Post" AS c WHERE c."ParentPostId" = p."PostId") AS "cantidad_respuestas",
                (SELECT COUNT(*) FROM "Likes" AS l WHERE l."PostId" = p."PostId") AS "cantidad_likes",
                (SELECT COUNT(*) FROM "Saved" AS sv WHERE sv."PostId" = p."PostId") AS "cantidad_saved",
                (SELECT COUNT(*) FROM "Share" AS s WHERE s."PostId" = p."PostId") AS "cantidad_share"
            FROM
                "Post" p
            LEFT JOIN
                "User" u ON p."UserId" = u."UserId"
            LEFT JOIN
                "Media" m ON p."PostId" = m."PostId"
            LEFT JOIN
                "Share" s ON p."PostId" = s."PostId"
            WHERE
                u."UserId" = $1 AND m."Url" IS NOT NULL
            GROUP BY
                p."PostId", p."Content", u."UserId", u."Name", u."Username", u."ProfilePicture", u."UserId"
            ORDER BY
                p."PostId" DESC
            LIMIT $2 OFFSET $3`,
            [userValue, pageSize, pageParam]
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
