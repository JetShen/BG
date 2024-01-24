import { GetClient } from "@/client/mysql";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
    console.log("like route");
    const client = await GetClient();
    try {
        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }

        const requestBody = await request.json();
        const postId = requestBody.PostID;
        const userId = requestBody.UserID;

        if (!postId || !userId) {
            return NextResponse.json({ error: 'Invalid Request!' }, { status: 400 });
        }

        await client.beginTransaction();

        try {
            // Intentar insertar el like
            await client.query('INSERT INTO likes (PostId, UserId) VALUES (?, ?)', [postId, userId]);
            await client.commit();
            return NextResponse.json({ message: 'Like inserted successfully' }, { status: 200 });
        } catch (error: any) {
            if (error.code === 'ER_DUP_ENTRY') {
                // Si ya existe un like, intentar eliminarlo (unlike)
                await client.query('DELETE FROM likes WHERE PostId = ? AND UserId = ?', [postId, userId]);
                await client.commit();
                return NextResponse.json({ message: 'Like removed successfully (unlike)' }, { status: 200 });
            } else {
                // Si el error no es por duplicado, lanzar el error
                await client.rollback();
                throw error;
            }
        }
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    } finally {
        await client.end();
    }
}
