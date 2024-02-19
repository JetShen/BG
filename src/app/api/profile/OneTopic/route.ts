import { GetClient } from "@/client/mysql";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { TopicType } from '@/type/post';

//get one topic and post count for a user
export async function GET(request: NextRequest){
    console.log('GET /api/profile/OneTopic');
    try {
        const client = await GetClient();
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
                Post.TopicId,
                Topic.Name,
                Topic.Description,
                COUNT(*) AS PostCount
            FROM 
                Post
            JOIN 
                Topic ON Post.TopicId = Topic.TopicId
            JOIN 
                User ON Post.UserId = User.UserID
            WHERE 
                User.Name = ? AND Topic.Name = ?
            GROUP BY 
                Post.TopicId, Topic.Name
            `, [username, topicname]);
        const topic = result[0]; 

        

        return NextResponse.json({ topic }, { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
