"use server";
import { GetClient } from "@/client/mysql";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";

// This is the route for the register page
export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const client = await GetClient();
        if (!client) {
            return NextResponse.json({ error: 'Database Connection Failed!' }, { status: 500 });
        }
        const username = request.nextUrl.searchParams.get('username');
        const password = request.nextUrl.searchParams.get('password');
        
        if (!username || !password) {
            return NextResponse.json({ error: 'Invalid Request!' }, { status: 400 });
        }
        const result = await client.query('SELECT * FROM user WHERE user.username = ?', [ username]);
        const data = result[0] as any;
        const passwordHashed = data[0]?.Password;
        const match = await bcrypt.compare(password, passwordHashed);

        return NextResponse.json({ result: match  }, { status: 200 });
    } catch (error: any ) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}