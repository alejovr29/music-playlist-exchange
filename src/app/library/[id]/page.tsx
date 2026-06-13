import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import PlaylistClient from "./playlist-client";

export default async function PlaylistPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const playlistId = Number(id);

    const session = await getServerSession();

    // Is it a valid number?
    if (Number.isNaN(playlistId)) {
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

    if (!playlist) {
        notFound();
    }

    // Is user allowed to view it?
    if (!playlist.isPublic && playlist.userId !== user.id) {
        notFound();
    }

    // If everything is fine, render the client component that will handle the rest of the logic (fetching songs, creating songs, etc.)
    return <PlaylistClient playlistId={playlistId} />;
}