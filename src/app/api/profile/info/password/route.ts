import { GetClient } from "@/client/mysql";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


export async function PUT(request: NextRequest){
    console.log('Private /api/info/password');
    try {
        const client = await GetClient();
        const body = await request.json();
        const { UserId, Password } = body;
        if (UserId === undefined || UserId === null || Password === undefined || Password === null) {
            return NextResponse.json({ error: 'Missing parameter' }, { status: 500 });
        }
        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }

        const result = await client.query(
            `UPDATE
                user
            SET
                Password = ?
            WHERE
                UserID = ?
            `, [Password ,UserId]);
        return NextResponse.json({ message: 'Password Updated' }, { status: 200 });
        
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Internal Server Error', e }, { status: 500 });
    }
}