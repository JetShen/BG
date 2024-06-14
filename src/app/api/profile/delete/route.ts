import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function DELETE(request: NextRequest) {
    console.log('DELETE /api/profile/delete');
    try {
        const client = await sql.connect();
        const username = request.nextUrl.searchParams.get("Username");

        if (username === undefined || username === null) {
            return NextResponse.json({ error: 'Missing "username" parameter' }, { status: 500 });
        }

        const resultUserID = await client.query(
            `SELECT 
                "UserId"
            FROM 
                "User"
            WHERE
                "Username" = $1
            `, [username]);

        if (resultUserID.rowCount === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const useridValue = resultUserID.rows[0].UserId;

        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }

        const result = await client.query(
            `DELETE FROM "User" WHERE "UserId" = $1`, [useridValue]);
        if (client) {
            client.release();
        }
        return NextResponse.json({ message: 'User deleted' }, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Internal Server Error', e }, { status: 500 });
    } finally {

    }
}
