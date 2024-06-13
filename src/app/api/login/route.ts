"use server";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";

// This is the route for the register page
export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const client = await sql.connect();
        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }
        const username = request.nextUrl.searchParams.get('username');
        const password = request.nextUrl.searchParams.get('password');
        
        if (!username || !password) {
            return NextResponse.json({ error: 'Invalid Request!' }, { status: 400 });
        }
        const result = await client.query('SELECT * FROM "User" WHERE "Username" = $1', [username]);
        const data = result.rows;

        if (data.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const passwordHashed = data[0].Password;
        const match = await bcrypt.compare(password, passwordHashed);

        return NextResponse.json({ result: { match: match, username: username } }, { status: 200 });
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
