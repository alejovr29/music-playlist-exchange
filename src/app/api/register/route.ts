import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
    const body = await request.json();

    const { name, email, password } = body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return NextResponse.json({
            message: "User created successfully",
            user,
        });
    }

    catch (error) {
        return NextResponse.json(
            { error: 'Error creating user' },
            { status: 400 }
        );
    }
}