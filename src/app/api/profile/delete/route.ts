import { GetClient } from "@/client/mysql";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


export async function DELETE(request: NextRequest){
    console.log('DELETE /api/profile/delete');
    try {
        const client = await GetClient();
        const username = request.nextUrl.searchParams.get("Username")
        if (username === undefined || username === null) {
            return NextResponse.json({ error: 'Missing "username" parameter' }, { status: 500 });
        }
        const resultUserID = await client.query(
            `SELECT 
                UserID
            FROM 
                user
            WHERE
                Username = ?
            `, [username]);
        const userid = resultUserID[0] as any;
        const useridValue = parseInt(userid[0].UserID, 10);

        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }

        const result = await client.query(
            `DELETE FROM user WHERE UserID = ?`, [useridValue]);
        return NextResponse.json({ message: 'User deleted' }, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Internal Server Error', e }, { status: 500 });
    }
}