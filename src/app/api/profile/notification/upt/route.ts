import { GetClient } from "@/client/mysql";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest){
    console.log('PUT /api/profile/notification');
    try {
        const client = await GetClient();
        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }
        const NotificationId = request.nextUrl.searchParams.get("NotificationId");
        if (!NotificationId) {
            return NextResponse.json({ error: 'Missing "NotificationId" parameter' }, { status: 400 });
        }

        const notificationIdValue = parseInt(NotificationId, 10);
        if (isNaN(notificationIdValue)) {
            return NextResponse.json({ error: 'Error parsing NotificationId' }, { status: 500 });
        }

        try {
            await client.query('UPDATE Notification SET Seen = true WHERE NotificationId = ?', [notificationIdValue]);
            return NextResponse.json({ message: 'Notification updated successfully' }, { status: 200 });
        } catch (error: any) {
            await client.rollback();
            throw error;
        }
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Internal Server Error', e }, { status: 500 });
    }
}