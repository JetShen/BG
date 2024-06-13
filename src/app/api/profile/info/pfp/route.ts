import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { put } from "@vercel/blob";

export async function PUT(request: NextRequest) {
    console.log('Private /api/info/pfp');
    try {
        const client = await sql.connect();
        const body = await request.formData();
        const UserID = body.get('UserId') as string;
        const ProfilePicture = body.get('Picture') as Blob;
        const UserId = parseInt(UserID, 10);

        if (UserId === undefined || UserId === null || ProfilePicture === undefined || ProfilePicture === null) {
            return NextResponse.json({ error: 'Missing parameter' }, { status: 400 });
        }

        const blob = await put((ProfilePicture as File).name, ProfilePicture as Blob, { access: 'public' });

        const result = await client.query(
            `UPDATE
                "user"
            SET
                "ProfilePicture" = $1
            WHERE
                "UserID" = $2
            `, [blob.url, UserId]);
        if (client) {
            client.release();
        }
        return NextResponse.json({ message: 'Pfp Updated' }, { status: 200 });

    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: 'Internal Server Error', details: e.message }, { status: 500 });
    } finally {

    }
}
