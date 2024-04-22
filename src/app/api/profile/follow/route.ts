import { GetClient } from "@/client/mysql";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const client = await GetClient();
        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }

        const requestBody = await request.formData();
        const userid = requestBody.get('userid') as string;
        const followid = requestBody.get('followid') as string;
        const userValue = parseInt(userid, 10);
        const followValue = parseInt(followid, 10);
        if (userValue === undefined || userValue === null || followValue === undefined || followValue === null) {
            return NextResponse.json({ error: 'Missing parameter' }, { status: 500 });
        }

        try {
            const result = await client.query(
                `INSERT INTO 
                    Follow (UserID, FollowedId) 
                VALUES 
                    (?, ?)`, [userValue, followValue]);
            return NextResponse.json({ message: 'Followed' }, { status: 200 });
        }
        catch (e:any) {
            if (e.code === 'ER_DUP_ENTRY') {
                await client.query(
                    `DELETE FROM 
                        Follow 
                    WHERE 
                        UserID = ? 
                    AND 
                        FollowedId = ?`, [userValue, followValue]);
                return NextResponse.json({ message: 'Unfollowed' }, { status: 200 });
            } else {
                throw e;
            }
        }
    
    } catch (error: any ) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}