import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
    console.log('Private /api/info/password');
    try {
        const client = await sql.connect();
        const body = await request.json();
        const { UserId, Password } = body;

        if (UserId === undefined || UserId === null || Password === undefined || Password === null) {
            return NextResponse.json({ error: 'Missing parameter' }, { status: 400 });
        }

        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }

        const result = await client.query(
            `UPDATE
                "user"
            SET
                "Password" = $1
            WHERE
                "UserID" = $2
            `, [Password, UserId]);
        if (client) {
            client.release();
        }
        return NextResponse.json({ message: 'Password Updated' }, { status: 200 });

    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: 'Internal Server Error', details: e.message }, { status: 500 });
    } finally {

    }
}
