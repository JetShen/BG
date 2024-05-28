import { GetClient } from "@/client/mysql";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { UserType } from '@/type/post';


export async function GET(request: NextRequest){
    console.log('GET /api/search/user');
    try {
        const client = await GetClient();
        const username = request.nextUrl.searchParams.get("username")
        const cursor = request.nextUrl.searchParams.get("cursor")

        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }
        
        if (cursor === undefined || cursor === null) {
            return NextResponse.json({ error: 'Missing "cursor" parameter' }, { status: 500 });
        }
        if (username === undefined || username === null || username === '') {
            return NextResponse.json({ error: 'Missing "username" parameter' }, { status: 500 });
        }

        const cursorValue = parseInt(cursor as string) || 0;
        const pageSize = 7;
        const pageParam = cursorValue * pageSize;

        const result = await client.query(
            `SELECT 
                u.UserId, 
                u.Name, 
                u.Username, 
                u.ProfilePicture,
                (select count(f.FollowId) from follow f where f.FollowedId = u.UserId) as Followers,
                (select count(f.FollowId) from follow f where f.UserId = u.UserId) as Following
            FROM 
                User u
            WHERE 
                u.Private = false AND u.Username LIKE CONCAT('%', ?, '%')
            LIMIT ? OFFSET ?
            `, [username, pageSize, pageParam]);
    
        const users: Array<UserType> = result[0] as Array<UserType>;
        const len = Object.keys(users);
        const ln: number = len.length;
        
        const nextId = ln < pageSize ? null : cursorValue + 1;
        const previousId = cursorValue > 0 ? cursorValue -1 : null;

        return NextResponse.json({ users, nextId, previousId }, { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
