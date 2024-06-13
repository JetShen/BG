import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


export async function POST(request: NextRequest){
    console.log('Save /api/profile/save');
    try {
        const client = await sql.connect();
        const { userid, postId } = await request.json();
        if (!userid || !postId) {
            return NextResponse.json({ error: 'Invalid Request!' }, { status: 400 });
        }

        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }

        const useridValue = parseInt(userid, 10);
        const postIdValue = parseInt(postId, 10);

        if (isNaN(useridValue) || isNaN(postIdValue)) {
            return NextResponse.json({ error: 'Error parsing parameters' }, { status: 500 });
        }
        try {
            await client.query('INSERT INTO "Saved" ("PostId", "UserId") VALUES ($1, $2)', [postIdValue, useridValue]);
            return NextResponse.json({ message: 'Saved inserted successfully' }, { status: 200 });
        } catch (error: any) {
            if (error.code === '23505') {
                await client.query('DELETE FROM "Saved" WHERE "UserId" = $1 AND "PostId" = $2', [useridValue, postIdValue]);
                return NextResponse.json({ message: 'Saved removed successfully' }, { status: 200 });
            } else {
                await client.query('ROLLBACK');
                client.release();
                throw error;
            }
        }
        
        
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Internal Server Error', e }, { status: 500 });
    }
}