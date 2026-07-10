import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string; songId: string }> }) {
    const session = await getServerSession();
    const { id, songId } = await params;
    const playlistId = Number(id)
    const SongIdNumber = Number(songId)


    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    if (isNaN(playlistId)) {
        return NextResponse.json({ error: "Invalid playlist id" }, { status: 400 });
    }

    // Import user and playlist from the database to perform security checks
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    const playlist = await prisma.playlist.findUnique({
        where: { id: playlistId },
    });

    const song = await prisma.song.findUnique({
        where: { id: SongIdNumber },
    });

    const songVoted = await prisma.vote.findUnique({
        where: {
            userId_songId: {
                userId: user?.id,
                songId: SongIdNumber
            }
        },
    }); // Por qué falla??

    if (!playlist) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!playlistId) {
        return NextResponse.json({ error: "Missing playlist" }, { status: 400 });
    }

    if (!song) {
        return NextResponse.json({ error: "Missing song" }, { status: 400 });
    }

    // If the playlist is not public and doesn't belong to the user, return forbidden. This is a security measure in case someone tries to add songs to a playlist that is not theirs by changing the URL
    if (!playlist.isPublic && playlist.userId !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    console.log('Valor de la votación es: ', songVoted)

    return NextResponse.json({ vote: songVoted });
}