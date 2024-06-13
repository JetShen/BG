import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest){
    console.log('PUT /api/profile/notification');
    try {
        const client = await sql.connect();
        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed' }, { status: 500 });
        }
        const NotificationId = request.nextUrl.searchParams.get("NotificationId");
        if (!NotificationId) {
            return NextResponse.json({ error: 'missing parameter "NotificationId"' }, { status: 400 });
        }

        const notificationIdValue = parseInt(NotificationId, 10);
        if (isNaN(notificationIdValue)) {
            return NextResponse.json({ error: 'error in NotificationId' }, { status: 500 });
        }

        try {
            await client.query('UPDATE "Notification" SET "Seen" = true WHERE "NotificationId" = $1', [notificationIdValue]);
            client.release();
            return NextResponse.json({ message: 'Updated' }, { status: 200 });
        } catch (error: any) {
            await client.query('ROLLBACK');
            throw error;
        }
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'internal server error', e }, { status: 500 });
    }
}
