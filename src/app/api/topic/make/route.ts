import { GetClient } from "@/client/mysql";
import { NextResponse } from "next/server";
import {RowDataPacket, ResultSetHeader} from "mysql2/promise";

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const client = await GetClient();
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
                'INSERT INTO topic(Name, Description) VALUES (?, ?)',
                [Name, Description]
            );
            await client.query('COMMIT');
            const topicId = (result[0] as ResultSetHeader).insertId;
            return NextResponse.json({ topicId: topicId }, { status: 200 });
        } catch (error:any) {
            if (error.code === 'ER_DUP_ENTRY') {
                await client.query('ROLLBACK');
                const [rows]  = await client.query('SELECT * FROM topic WHERE Name = ?', [Name]);
                const topocId = (rows as RowDataPacket[])[0].TopicId;
                console.log('topocId:', topocId);
                return NextResponse.json({ topicId: topocId }, { status: 200 });
            }
            await client.query('ROLLBACK');
            return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
        }
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
