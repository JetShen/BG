import { GetClient } from "@/client/mysql";
import { ResultSetHeader } from "mysql2";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

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
        const match = data[0]?.Password === password;


        return NextResponse.json({ result: match  }, { status: 200 });
    } catch (error: any ) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}