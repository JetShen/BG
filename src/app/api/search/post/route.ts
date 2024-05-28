import { GetClient } from "@/client/mysql";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { PostType } from '@/type/post';


export async function GET(request: NextRequest){
    console.log('GET /api/search/post');
    try {
        const client = await GetClient();
        const cursor = request.nextUrl.searchParams.get("cursor")
        const query = request.nextUrl.searchParams.get("query")
        if (query === undefined || query === null || query === '') {
            return NextResponse.json({ error: 'Missing "query" parameter' }, { status: 500 });
        }

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
                p.PostID, 
                p.Content, 
                u.UserID,
                u.Name, 
                u.Username,
                u.ProfilePicture,
                (SELECT COUNT(*) FROM Post AS c WHERE c.ParentPostId = p.PostId) AS cantidad_respuestas,
                (SELECT COUNT(*) FROM Likes AS l WHERE l.PostId = p.PostId) AS cantidad_likes,
                (SELECT COUNT(*) FROM Saved AS sv WHERE sv.PostId = p.PostId) AS cantidad_saved,
                (SELECT COUNT(*) FROM Share AS s WHERE s.PostId = p.PostId) AS cantidad_share,
                GROUP_CONCAT(m.Url SEPARATOR ', ') AS urls_images
            FROM 
                post p
            JOIN 
                user u ON p.UserID = u.UserID
            LEFT JOIN 
                likes ON p.PostID = likes.PostID
            LEFT JOIN
                Media m ON m.PostId = p.PostId
            WHERE
                p.Content LIKE CONCAT('%', ?, '%')
            GROUP BY 
                p.PostID, p.Content, u.UserID, u.Name, u.Username
            ORDER BY 
                p.PostID DESC
            LIMIT ? OFFSET ?
            `, [query, pageSize, pageParam]);
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
