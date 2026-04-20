
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";



export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession();
    const { id } = await params;
    const playlistId = Number(id);

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

    if (!playlist) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!playlistId) {
        return NextResponse.json({ error: "Missing playlist" }, { status: 400 });
    }

    // If the playlist is not public and doesn't belong to the user, return forbidden. This is a security measure in case someone tries to add songs to a playlist that is not theirs by changing the URL
    if (!playlist.isPublic && playlist.userId !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch songs for the retrieved playlist
    const playlistSongs = await prisma.playlistSong.findMany({
        where: { playlistId },
        include: { song: true },
    });

    // Extract songs from the playlistSongs to return only the song information in the response, because otherwise it would return the playlistSong information and we would have to use song.song to access the song information in the frontend, which is not ideal
    const songs = playlistSongs.map((ps) => ps.song);

    // Return the songs as JSON response
    return NextResponse.json({ playlist, songs });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession();
    const { title, artist, album, imageUrl } = await request.json();
    const { id } = await params;
    const playlistId = Number(id);

    // Security check to ensure the user is authenticated before allowing them to add songs to a playlist
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

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!playlist) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // If the playlist is not public and doesn't belong to the user, return forbidden. This is a security measure in case someone tries to add songs to a playlist that is not theirs by changing the URL
    if (!playlist.isPublic && playlist.userId !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Validate required fields
    if (!title || !artist || !playlistId) {
        return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
        );
    }

    // Convert playlistID provided by URL to a number, since it's received as a string
    const playlistIdNumber = Number(playlistId);

    // Obtains song from DB
    let song = await prisma.song.findFirst({
        where: { title, artist },
    });

    // If song doesn't exist, creates it in the DB
    if (!song) {
        song = await prisma.song.create({
            data: { title, artist, album, imageUrl },
        });
    }

    // Check if the song is already in the playlist to avoid duplicates
    const existing = await prisma.playlistSong.findUnique({
        where: {
            playlistId_songId: {
                playlistId: playlistIdNumber,
                songId: song.id,
            },
        },
    });

    // If the song is already in the playlist, return a message indicating that
    if (existing) {
        return NextResponse.json({
            message: "Song already in playlist",
        });
    }

    // If the song is not in the playlist, create the association in the database
    await prisma.playlistSong.create({
        data: {
            playlistId: playlistIdNumber,
            songId: song.id,
        },
    });

    return NextResponse.json({
        message: "Song added to playlist",
        song,
    });
}