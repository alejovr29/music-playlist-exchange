import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
    const body = await request.json();

    const { email, password } = body;

    try {
        const user = await prisma.user.findUnique({
            where: {email}
        });

        if (!user){ 
            return NextResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
        );
        }

        const passwordMatched = await bcrypt.compare(password, user.password);

        if (!passwordMatched){ 
            return NextResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
        );
        }

        return NextResponse.json({
            message: "Logged in successfully",
            user:{
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    }

    catch (error) {
        return NextResponse.json(
            { error: 'Invalid email or password' },
            { status: 500 }
        );
    }
}