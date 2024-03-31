import { GetClient } from "@/client/mysql";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


export async function PUT(request: NextRequest){
    console.log('Private /api/profile/private');
    try {
        const client = await GetClient();
        const username = request.nextUrl.searchParams.get("Username")
        if (username === undefined || username === null) {
            return NextResponse.json({ error: 'Missing "username" parameter' }, { status: 500 });
        }
        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }

        const resultUserID = await client.query(
            `SELECT 
                UserID, Private
            FROM 
                user
            WHERE
                Username = ?
            `, [username]);
        const userid = resultUserID[0] as any;
        const privateValue = parseInt(userid[0].Private, 10);
        const useridValue = parseInt(userid[0].UserID, 10);

        if (privateValue === undefined || privateValue === null || useridValue === undefined || useridValue === null) {
            return NextResponse.json({ error: 'User not found' }, { status: 500 });
        }
        
        if (privateValue === 1) {
            await client.query(
                `UPDATE 
                    user
                SET
                    Private = 0
                WHERE
                    UserID = ?
                `, [useridValue]);
            return NextResponse.json({ message: 'User public' }, { status: 200 });
        }
        await client.query(
            `UPDATE 
                user
            SET
                Private = 1
            WHERE
                UserID = ?
            `, [useridValue]);
        return NextResponse.json({ message: 'User public' }, { status: 200 });
        
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Internal Server Error', e }, { status: 500 });
    }
}