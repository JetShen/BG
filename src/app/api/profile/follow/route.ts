import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
    console.log('POST /api/profile/follow');
    try {
        const client = await sql.connect();
        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }

        const requestBody = await request.formData();
        const userid = requestBody.get('userid') as string;
        const followid = requestBody.get('followid') as string;
        const userValue = parseInt(userid, 10);
        const followValue = parseInt(followid, 10);
        
        if (isNaN(userValue) || isNaN(followValue)) {
            return NextResponse.json({ error: 'Missing or invalid parameter' }, { status: 400 });
        }

        try {
            const result = await client.query(
                `INSERT INTO 
                    "Follow" ("UserId", "FollowedId") 
                VALUES 
                    ($1, $2)`, [userValue, followValue]);
            return NextResponse.json({ message: 'Followed' }, { status: 200 });
        } catch (e: any) {
            if (e.code === '23505') { // PostgreSQL unique violation error code
                await client.query(
                    `DELETE FROM 
                        "Follow" 
                    WHERE 
                        "UserId" = $1 
                    AND 
                        "FollowedId" = $2`, [userValue, followValue]);
                return NextResponse.json({ message: 'Unfollowed' }, { status: 200 });
            } else {
                throw e;
            }
        } finally {
            if (client) {
                client.release();
            }
        }
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
