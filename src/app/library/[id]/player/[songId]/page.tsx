import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import PlayerClient from "./player-client";

export default async function PlayerPage({ params }: { params: Promise<{ id: string; songId: string; }> }) {
    const { id, songId } = await params;
    const playlistId = Number(id);
    const currentSong = Number(songId)

    const session = await getServerSession();

    // Is it a valid number?
    if (Number.isNaN(playlistId) || Number.isNaN(currentSong)) {
        notFound();
    }

    // Is user authenticated?
    if (!session?.user?.email) {
        notFound();
    }

    // Is user in the DB?
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        notFound();
    }

    // Is playlist valid?
    const playlist = await prisma.playlist.findUnique({
        where: { id: playlistId },
    });

    // Is song valid?
    const song = await prisma.song.findUnique({
        where: { id: currentSong },
    });

    if (!playlist || !song) {
        notFound();
    }

    // Has this song relation with the playlist in the playlistSong pivot table? if not, redirect to notFound()
    const songInPlaylist = await prisma.playlistSong.findFirst({
        where: {
            playlistId: playlistId,
            songId: currentSong,
        },
    });

    if (!songInPlaylist) {
        notFound();
    }

    // Is user allowed to view it?
    if (!playlist.isPublic && playlist.userId !== user.id) {
        notFound();
    }

    const playlistSongs = await prisma.playlistSong.findMany({
        where: {
            playlistId: playlistId,
        },
    });

    const songs = await prisma.song.findMany({
        where: {
            id: {
                in: playlistSongs.map((ps) => ps.songId),
            },
        },
    });

    console.log("Canción actual:", song)

    console.log("IDs de canciones en Playlist:", playlistSongs)

    console.log("Listado de Canciones:", songs)


    // If everything is fine, render the client component that will handle the rest of the logic (fetching songs, creating songs, etc.)

    return <PlayerClient playlist={playlist} song={song} songs={songs} />;
}