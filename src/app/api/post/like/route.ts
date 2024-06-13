import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
    console.log("like route");
    const client = await sql.connect();
    try {
        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }

        const requestBody = await request.json();
        const postId = requestBody.PostID;
        const userId = requestBody.UserID;

        if (!postId || !userId) {
            return NextResponse.json({ error: 'Invalid Request!' }, { status: 400 });
        }

        try {
            await client.query('BEGIN');
            await client.query('INSERT INTO "Likes" ("PostId", "UserId") VALUES ($1, $2)', [postId, userId]);
            await client.query('COMMIT');
            return NextResponse.json({ message: 'Like inserted successfully' }, { status: 200 });
        } catch (error: any) {
            await client.query('ROLLBACK');
            if (error.code === '23505') { // PostgreSQL error code for unique violation
                await client.query('DELETE FROM "Likes" WHERE "PostId" = $1 AND "UserId" = $2', [postId, userId]);
                return NextResponse.json({ message: 'Like removed successfully (unlike)' }, { status: 200 });
            } else {
                throw error;
            }
        }
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    } finally {
        client.release();
    }
}
