import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET(request: Request) {
    const session = await getServerSession();

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user in the database using their email from the session BECAUSE the email is an unique identifier.
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    // Fetch playlists for the authenticated user
    const playlists = await prisma.playlist.findMany({
        where: { userId: user?.id },
    });

    // Return the playlists as JSON response
    return NextResponse.json({ playlists });
}

export async function POST(request: Request) {
    const session = await getServerSession();

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const { name } = body;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });


    try {
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const playlist = await prisma.playlist.create({
            data: {
                name,
                userId: user?.id,
            }
        });

        return NextResponse.json({
            message: "Playlist created successfully.",
            playlist: playlist,
        });
    }

    catch (error) {
        return NextResponse.json(
            { error: 'Error creating playlist.' },
            { status: 500 }
        );
    }

}