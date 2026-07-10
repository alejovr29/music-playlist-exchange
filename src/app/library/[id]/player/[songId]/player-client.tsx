"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SongPlayer from "@/components/SongPlayer";
import SongsSidebar from "@/components/SongsSidebar";
import Rating from "@/components/Rating"
import type { Playlist, Song } from "@/types/music";

export default function PlayerClient({ playlist, song, songs }: { playlist: Playlist; song: Song; songs: Song[]; }) {
    const router = useRouter();
    const [currentSong, setCurrentSong] = useState<Song>(song);

    // Playlist and song list are props only and do not need local state setters.
    // Only the currently active song is managed as local state.
    const handleChangeSong = (songId: number) => {
        const selectedSong = songs.find((item) => item.id === songId);
        if (!selectedSong) return;

        setCurrentSong(selectedSong);
        router.push(`/library/${playlist.id}/player/${songId}`);
    };

    return (
        <div className="min-h-screen text-white">
            <div className="mx-auto max-w-[1600px] px-4 py-6">
                <div className="grid gap-6 lg:grid-cols-[3fr_1fr]">
                    <div className="sticky top-6 self-start rounded-3xl bg-slate-900 p-6 shadow-xl">
                        <SongPlayer song={currentSong} />
                        <Rating playlist={playlist} song={currentSong} />
                    </div>

                    <div className="rounded-3xl bg-slate-900 p-4 shadow-xl">
                        <SongsSidebar songs={songs} onSongSelect={handleChangeSong} />
                    </div>
                </div>
            </div>
        </div>
    );
}