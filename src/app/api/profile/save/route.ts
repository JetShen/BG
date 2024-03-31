import { GetClient } from "@/client/mysql";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


export async function POST(request: NextRequest){
    console.log('Save /api/profile/save');
    try {
        const client = await GetClient();
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
            await client.query('INSERT INTO saved (UserId, PostId) VALUES (?, ?)', [useridValue, postIdValue]);
            return NextResponse.json({ message: 'Saved inserted successfully' }, { status: 200 });
        } catch (error: any) {
            if (error.code === 'ER_DUP_ENTRY') {
                await client.query('DELETE FROM saved WHERE UserId = ? AND PostId = ?', [useridValue, postIdValue]);
                return NextResponse.json({ message: 'Saved removed successfully' }, { status: 200 });
            } else {
                await client.rollback();
                throw error;
            }
        }
        
        
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Internal Server Error', e }, { status: 500 });
    }
}