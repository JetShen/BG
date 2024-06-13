import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
    console.log('Private /api/info/username');
    try {
        const client = await sql.connect();
        const body = await request.json();
        const { UserId, Username } = body;

        if (!UserId || !Username) {
            return NextResponse.json({ error: 'Missing parameter' }, { status: 400 });
        }

        const result = await client.query(
            `UPDATE "user"
            SET "Username" = $1
            WHERE "UserID" = $2`,
            [Username, UserId]
        );
        if (client) {
            client.release();
        }
        return NextResponse.json({ message: 'Username Updated' }, { status: 200 });

    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: 'Internal Server Error', details: e.message }, { status: 500 });
    } finally {
        
    }
}
