import { GetClient } from "@/client/mysql";
import { NextResponse } from "next/server";

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
            await client.query(
                `insert into topic(Name, Description) values (?, ?)`, 
                [Name, Description]
            );
            return NextResponse.json({ message: 'Status: 200' }, { status: 200 });
        } catch (error:any) {
            if (error.code === 'ER_DUP_ENTRY') {
                return NextResponse.json({ error: 'Duplicate entry for Name field' }, { status: 400 });
            }
            throw error;
        }
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
