import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { TopicType } from '@/type/post';

//get one topic and post count for a user
export async function GET(request: NextRequest){
    console.log('GET /api/profile/OneTopic');
    try {
        const client = await sql.connect();
        const username = request.nextUrl.searchParams.get("username")
        const topicname = request.nextUrl.searchParams.get("topicname")
        if (username == null || topicname == null) {
            let missingParam: string;
            if (username == null) missingParam = 'username';
            else missingParam = 'topicname';
        
            return NextResponse.json({ error: `Missing "${missingParam}" parameter` }, { status: 500 });
        }

        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }

        const result = await client.query(
            `SELECT 
                Post."TopicId",
                Topic."Name",
                Topic."Description",
                COUNT(*) AS PostCount
            FROM 
                "Post"
            JOIN 
                "Topic" ON Post."TopicId" = Topic."TopicId"
            JOIN 
                "User" ON Post."UserId" = User."UserID"
            WHERE 
                User."Name" = $1 AND Topic."Name" = $2
            GROUP BY 
                Post."TopicId", Topic."Name"
            `, [username, topicname]);
        const topic = result.rows[0] as TopicType; 

        
        if (client) {
            client.release();
        }
        return NextResponse.json({ topic }, { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
