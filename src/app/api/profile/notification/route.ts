import { GetClient } from "@/client/mysql";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest){
    console.log('POST /api/profile/notification');
    try {
        const client = await GetClient();
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
            // Inserción para Follow
            try {
                await client.query('INSERT INTO Notification (UserId, Type, DestinationId) VALUES (?, ?, ?)', [useridValue, Type, destinationIdValue]);
                return NextResponse.json({ message: 'Notification inserted successfully' }, { status: 200 });
            } catch (error: any) {
                if (error.code === 'ER_DUP_ENTRY') {
                    await client.query('DELETE FROM Notification WHERE UserId = ? AND Type = ? AND DestinationId = ?', [useridValue, Type, destinationIdValue]);
                    return NextResponse.json({ message: 'Notification removed successfully' }, { status: 200 });
                } else {
                    await client.rollback();
                    throw error;
                }
            }
        } else {
            // Validación y conversión del PostId
            if (PostId === undefined || PostId === null) {
                return NextResponse.json({ error: 'PostId is required for this notification type' }, { status: 400 });
            }
            const postIdValue = parseInt(PostId, 10);
            if (isNaN(postIdValue)) {
                return NextResponse.json({ error: 'Error parsing PostId' }, { status: 500 });
            }
            // Inserción para otros tipos de notificación
            try {
                await client.query('INSERT INTO Notification (UserId, PostId, Type, DestinationId) VALUES (?, ?, ?, ?)', [useridValue, postIdValue, Type, destinationIdValue]);
                return NextResponse.json({ message: 'Notification inserted successfully' }, { status: 200 });
            } catch (error: any) {
                if (error.code === 'ER_DUP_ENTRY') {
                    await client.query('DELETE FROM Notification WHERE UserId = ? AND PostId = ? AND Type = ? AND DestinationId = ?', [useridValue, postIdValue, Type, destinationIdValue]);
                    return NextResponse.json({ message: 'Notification removed successfully' }, { status: 200 });
                } else {
                    await client.rollback();
                    throw error;
                }
            }
        }
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Internal Server Error', e }, { status: 500 });
    }
}
