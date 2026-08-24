"use client";

import { useCallback, useEffect, useState } from "react";
import SongPlayer from "@/components/SongPlayer";
import SongsSidebar from "@/components/SongsSidebar";
import Rating from "@/components/Rating"
import type { Playlist, Song } from "@/types/music";

export default function PlayerClient({ playlist, song, songs }: { playlist: Playlist; song: Song; songs: Song[]; }) {
    const [currentSong, setCurrentSong] = useState<Song>(song);

    // The playlist stays mounted while only the selected song changes locally.
    // This preserves document scroll and the sidebar's collapsed state.
    const handleChangeSong = useCallback((songId: number) => {
        const selectedSong = songs.find((item) => item.id === songId);
        if (!selectedSong) return;

        setCurrentSong(selectedSong);
        window.history.pushState({}, "", `/library/${playlist.id}/player/${songId}`);
    }, [playlist.id, songs]);

    // Keep local state in sync when the browser Back/Forward buttons change the URL.
    useEffect(() => {
        const handlePopState = () => {
            const songId = Number(window.location.pathname.split("/").pop());
            const selectedSong = songs.find((item) => item.id === songId);

            if (selectedSong) {
                setCurrentSong(selectedSong);
            }
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [songs]);

    return (
        <div className="min-h-screen text-white">
            <div className="mx-auto max-w-[1600px] px-4 py-6">
                <div className="grid gap-6 lg:grid-cols-[3fr_1fr]">
                    <div className="sticky top-6 self-start rounded-3xl bg-slate-900 p-6 shadow-xl">
                        <SongPlayer song={currentSong} songs={songs} onSongChange={handleChangeSong} />
                        <Rating playlist={playlist} song={currentSong} />
                    </div>

                    <div className="rounded-3xl bg-slate-900 p-4 shadow-xl">
                        <SongsSidebar songs={songs} playlist={playlist} currentSong={currentSong.id} onSongSelect={handleChangeSong} />
                    </div>
                </div>
            </div>
        </div>
    );
}