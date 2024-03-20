import { GetClient } from "@/client/mysql";
import { NextResponse } from "next/server";
// This is the route for the register page
export async function POST(request: Request): Promise<NextResponse> {
    try {
        const client = await GetClient();
        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }

        const requestBody = await request.json();
        const name = requestBody.name;
        const username = requestBody.username;
        const email = requestBody.email;
        const password = requestBody.password;

        if (!username || !email || !password) {
            return NextResponse.json({ error: 'Invalid Request!' }, { status: 400 });
        }
        const result = await client.query('INSERT INTO user (Name, Username, Email, Password) VALUES (?, ?, ?, ?)', [name, username, email, password]);
        return NextResponse.json({ result: result }, { status: 200 });
    } catch (error: any ) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}