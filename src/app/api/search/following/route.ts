import { GetClient } from "@/client/mysql";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { UserType } from '@/type/post';


export async function GET(request: NextRequest){
    console.log('GET /api/search/following');
    try {
        const client = await GetClient();
        const userid = request.nextUrl.searchParams.get("userid")
        const cursor = request.nextUrl.searchParams.get("cursor")

        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }
        const userValue = parseInt(userid as string, 10);
        const cursorValue = parseInt(cursor as string) || 0;
        const pageSize = 7;
        const pageParam = cursorValue * pageSize;
        
        const result = await client.query(
            `SELECT 
                u.UserId, 
                u.Name, 
                u.Username, 
                u.ProfilePicture,
                f.UserId as FollowedBy
            FROM 
                User u
            LEFT JOIN 
                Follow f ON u.UserId = f.FollowedId
            WHERE
                f.UserId = ?
            GROUP BY 
                u.UserId, u.Name, u.Username, u.ProfilePicture, FollowedBy
            ORDER BY 
                f.FollowId DESC
            LIMIT ? OFFSET ?
            `, [userValue, pageSize, pageParam]);
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
