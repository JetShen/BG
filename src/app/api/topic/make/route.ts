import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const client = await sql.connect();
        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }

        const requestBody = await request.json();
        const Name = requestBody.Name;
        const Description = requestBody.Description;

        if (!Name || !Description) {
            return NextResponse.json({ error: 'Invalid Request!' }, { status: 400 });
        }
        
        try {
            await client.query('START TRANSACTION');
            const result = await client.query(
                'INSERT INTO "Topic" ("Name", "Description") VALUES ($1, $2)',
                [Name, Description]
            );
            await client.query('COMMIT');
            const {rows}  = await client.query('SELECT * FROM "Topic" WHERE "Name" = $1', [Name]);
            return NextResponse.json({ topicId: rows }, { status: 200 });
        } catch (error:any) {
            if (error.code === '23505') {
                await client.query('ROLLBACK');
                const {rows}  = await client.query('SELECT * FROM "Topic" WHERE "Name" = $1', [Name]);
                return NextResponse.json({ topicId: rows }, { status: 200 });
            }
            await client.query('ROLLBACK');
            return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
        }
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
