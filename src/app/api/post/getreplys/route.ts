import { GetClient } from "@/client/mysql";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { PostType } from '@/type/post';


export async function GET(request: NextRequest){
    try {
        const client = await GetClient();
        const cursor = request.nextUrl.searchParams.get("cursor")
        const postId = request.nextUrl.searchParams.get("postid")
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
                p.UserID, 
                u.Name, 
                u.Username,
                u.ProfilePicture,
                p.ParentPostId,
                (SELECT Username FROM User u2 WHERE u2.UserId = Parent.UserId) AS ParentPostUsername,
                (SELECT COUNT(*) FROM Post AS c WHERE c.ParentPostId = p.PostId) AS cantidad_respuestas,
                (SELECT COUNT(*) FROM Likes AS l WHERE l.PostId = p.PostId) AS cantidad_likes,
                (SELECT COUNT(*) FROM Saved AS s WHERE s.PostId = p.PostId) AS cantidad_saved,
                GROUP_CONCAT(media.Url SEPARATOR ', ') AS urls_images
            FROM 
                Post p
            INNER JOIN 
                User u ON p.UserId = u.UserId
            LEFT JOIN 
                Media media ON p.PostId = media.PostId
            LEFT JOIN 
                Post Parent ON p.ParentPostId = Parent.PostId
            WHERE 
                p.ParentPostId = ?
            GROUP BY 
                p.PostId, p.Content, p.UserID, u.Name, u.Username, p.ParentPostId
            ORDER BY 
                p.PostID DESC
            LIMIT ? OFFSET ?
            `, [postId, pageSize, pageParam]);
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
