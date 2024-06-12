import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


export async function PUT(request: NextRequest){
    console.log('Private /api/profile/private');
    try {
        const client = await sql.connect();
        const username = request.nextUrl.searchParams.get("Username")
        if (username === undefined || username === null) {
            return NextResponse.json({ error: 'Missing "username" parameter' }, { status: 500 });
        }
        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }

        const resultUserID = await client.query(
            `SELECT 
                "UserID", "Private"
            FROM 
                "user"
            WHERE
                "Username" = $1
            `, [username]);
        const userid = resultUserID.rows[0] as any;
        const privateValue = parseInt(userid[0].Private, 10);
        const useridValue = parseInt(userid[0].UserID, 10);

        if (privateValue === undefined || privateValue === null || useridValue === undefined || useridValue === null) {
            return NextResponse.json({ error: 'User not found' }, { status: 500 });
        }
        
        if (privateValue === 1) {
            await client.query(
                `UPDATE 
                    "User"
                SET
                    "Private" = 0
                WHERE
                    "UserID" = $1
                `, [useridValue]);
            if (client) {
                client.release();
            }
            return NextResponse.json({ message: 'User public' }, { status: 200 });
        }
        await client.query(
            `UPDATE 
                "User"
            SET
                "Private" = 1
            WHERE
                "UserID" = $1
            `, [useridValue]);
        return NextResponse.json({ message: 'User public' }, { status: 200 });
        
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Internal Server Error', e }, { status: 500 });
    }
}