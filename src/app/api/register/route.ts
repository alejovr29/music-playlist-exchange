import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();

    console.log("Data received:", body);

    return NextResponse.json({
        message: "User received",
    });
}