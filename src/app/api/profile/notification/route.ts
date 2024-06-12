import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    console.log('POST /api/profile/notification');
    try {
        const client = await sql.connect();
        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }
        const json = await request.json();
        const { UserId, DestinationId, Type, PostId } = json;
        if (!UserId || !DestinationId || !Type) {
            if (!UserId) {
                return NextResponse.json({ error: 'Missing "UserId" parameter' }, { status: 400 });
            }
            if (!DestinationId) {
                return NextResponse.json({ error: 'Missing "DestinationId" parameter' }, { status: 400 });
            }
            if (!Type) {
                return NextResponse.json({ error: 'Missing "Type" parameter' }, { status: 400 });
            }
        }

        const useridValue = parseInt(UserId, 10);
        const destinationIdValue = parseInt(DestinationId, 10);
        if (isNaN(useridValue) || isNaN(destinationIdValue)) {
            return NextResponse.json({ error: 'Error parsing parameters' }, { status: 500 });
        }

        if (Type === 'Follow') {
            try {
                await client.query('INSERT INTO "Notification" ("UserId", "Type", "DestinationId") VALUES ($1, $2, $3)', [UserId, Type, DestinationId]);
                client.release();
                return NextResponse.json({ message: 'Notification inserted successfully' }, { status: 200 });
            } catch (error: any) {
                if (error.code === '23505') {
                    await client.query('DELETE FROM "Notification" WHERE "UserId" = $1 AND "Type" = $2 AND "DestinationId" = $3', [UserId, Type, DestinationId]);
                    client.release();

                    return NextResponse.json({ message: 'Notification removed successfully' }, { status: 200 });
                } else {
                    client.release();

                    throw error;
                }
            }
        } else {
            if (PostId === undefined || PostId === null) {
                client.release();

                return NextResponse.json({ error: 'PostId is required for this notification type' }, { status: 400 });
            }
            const postIdValue = parseInt(PostId, 10);
            if (isNaN(postIdValue)) {
                client.release();

                return NextResponse.json({ error: 'Error parsing PostId' }, { status: 500 });
            }
            try {
                await client.query('INSERT INTO "Notification" ("UserId", "PostId", "Type", "DestinationId") VALUES ($1, $2, $3, $4)', [UserId, postIdValue, Type, DestinationId]);
                client.release();

                return NextResponse.json({ message: 'Notification inserted successfully' }, { status: 200 });
            } catch (error: any) {
                if (error.code === '23505') {
                    await client.query('DELETE FROM "Notification" WHERE "UserId" = $1 AND "PostId" = $2 AND "Type" = $3 AND "DestinationId" = $4', [UserId, postIdValue, Type, DestinationId]);
                    client.release();

                    return NextResponse.json({ message: 'Notification removed successfully' }, { status: 200 });
                } else {
                    client.release();

                    throw error;
                }
            }
        }
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Internal Server Error', e }, { status: 500 });
    }
}
