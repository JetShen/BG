import { GetClient } from "@/client/mysql";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { NotificationType } from '@/type/post';


export async function GET(request: NextRequest){
    console.log('GET /api/profile/notification/get');
    try {
        const client = await GetClient();
        const cursor = request.nextUrl.searchParams.get("cursor")
        const userid = request.nextUrl.searchParams.get("userid")
        if (userid === undefined || userid === null) {
            return NextResponse.json({ error: 'Missing "userid" parameter' }, { status: 500 });
        }

        if (cursor === undefined || cursor === null) {
            return NextResponse.json({ error: 'Missing "cursor" parameter' }, { status: 500 });
        }

        const cursorValue = parseInt(cursor as string) || 0;
        const pageSize = 7;
        const pageParam = cursorValue * pageSize;

        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }

        const result = await client.query(
            `SELECT 
                u.UserId,
                u.Name,
                u.Username,
                u.ProfilePicture,
                n.NotificationId,
                n.PostId,
                n.Type,
                n.Seen,
                n.DestinationId
            FROM 
                Notification n
            JOIN 
                User u ON n.UserId = u.UserId
            WHERE
                n.DestinationId = ?
            ORDER BY 
                n.NotificationId DESC        
            LIMIT ? OFFSET ?
            `, [userid, pageSize, pageParam]);
        const notifications: Array<NotificationType> = result[0] as Array<NotificationType>;
        const len = Object.keys(notifications);
        const ln: number = len.length;
        
        const nextId = ln < pageSize ? null : cursorValue + 1;
        const previousId = cursorValue > 0 ? cursorValue -1 : null;

        

        return NextResponse.json({ notifications, nextId, previousId }, { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
