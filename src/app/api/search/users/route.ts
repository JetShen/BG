import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { UserType } from '@/type/post';


export async function GET(request: NextRequest){
    console.log('GET /api/search/users');
    try {
        const client = await sql.connect();
        const userid = request.nextUrl.searchParams.get("userid")

        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }

        const result = await client.query(
            `SELECT 
                u."UserId", 
                u."Name", 
                u."Username", 
                u."ProfilePicture" 
            FROM 
                "User" u
            LEFT JOIN 
                "Follow" f ON u."UserId" = f."FollowedId" AND f."UserId" = $1
            WHERE 
                u."Private" = false
                AND u."UserId" != $2
                AND f."UserId" IS NULL
            LIMIT 3 OFFSET 0
            `, [userid, userid]);
        const users: Array<UserType> = result.rows as Array<UserType>;

        return NextResponse.json({ users,  }, { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
