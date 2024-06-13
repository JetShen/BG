import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { UserType } from '@/type/post';

// Get one topic and post count for a user
export async function GET(request: NextRequest) {
    try {
        const client = await sql.connect();
        const username = request.nextUrl.searchParams.get("username");

        if (username == null) {
            return NextResponse.json({ error: 'Username not provided' }, { status: 400 });
        }

        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }

        const result = await client.query(
            `SELECT
                u."UserId", 
                u."Name", 
                u."Username", 
                u."Private", 
                u."ProfilePicture",
                (SELECT COUNT("UserId") FROM "Follow" f WHERE f."UserId" = u."UserId") as "Following",
                (SELECT COUNT("FollowedId") FROM "Follow" f WHERE f."FollowedId" = u."UserId") as "Followers"
            FROM 
                "User" u
            WHERE
                u."Username" = $1
            `, [username]
        );
        
        const user = result.rows[0] as UserType;
        if(client){
            client.release();
        }
        return NextResponse.json({ user }, { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
