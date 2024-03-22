import { GetClient } from "@/client/mysql";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { UserType } from '@/type/post';

//get one topic and post count for a user
export async function GET(request: NextRequest){
    try {
        const client = await GetClient();
        const username = request.nextUrl.searchParams.get("username")
        if (username == null ) {
            return NextResponse.json({ error: 'Username not provided' }, { status: 400 });
        }

        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }

        const result = await client.query(
            `SELECT
                UserId, Name, Username
            FROM 
                user
            WHERE
                Username = ?
            `, [username]);
        const user  = (result[0] as any)[0] as UserType; 

        

        return NextResponse.json({ user }, { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
