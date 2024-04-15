import { GetClient } from "@/client/mysql";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


export async function PUT(request: NextRequest){
    console.log('Private /api/info/username');
    try {
        const client = await GetClient();
        const body = await request.json();
        const { UserId, Username } = body;
        if (UserId === undefined || UserId === null || Username === undefined || Username === null) {
            return NextResponse.json({ error: 'Missing parameter' }, { status: 500 });
            }
        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }

        const result = await client.query(
            `UPDATE
                user
            SET
                Username = ?
            WHERE
                UserID = ?
            `, [Username ,UserId]);
        return NextResponse.json({ message: 'Username Updated' }, { status: 200 });
        
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Internal Server Error', e }, { status: 500 });
    }
}