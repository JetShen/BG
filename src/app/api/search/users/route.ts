import { GetClient } from "@/client/mysql";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { UserType } from '@/type/post';


export async function GET(request: NextRequest){
    console.log('GET /api/search/users');
    try {
        const client = await GetClient();
        const userid = request.nextUrl.searchParams.get("userid")

        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }

        const result = await client.query(
            `SELECT 
                UserId, 
                Name, 
                Username, 
                ProfilePicture 
            FROM 
                user 
            WHERE 
                Private is false 
            AND
                UserID != ?
            limit 3
            `, [userid]);
        const users: Array<UserType> = result[0] as Array<UserType>;

        return NextResponse.json({ users,  }, { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
