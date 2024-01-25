import { GetClient } from "@/client/mysql";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const client = await GetClient();
        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }

        const result = await client.query(`SELECT * from post`);
        const posts = result[0];
        return NextResponse.json({ posts }, { status: 200 });
    } catch (error: any ) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
