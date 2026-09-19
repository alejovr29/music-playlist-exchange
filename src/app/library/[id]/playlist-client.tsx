"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Playlist, Song } from "@/types/music";
import { FaYoutube, FaSpotify } from "react-icons/fa";
import {
    FaArrowRight,
    FaGear,
    FaHeart,
    FaPen,
    FaPlay,
    FaPlus,
    FaSliders,
} from "react-icons/fa6";
import { MdMusicOff } from "react-icons/md";

export default function PlaylistClient({ playlistId }: { playlistId: number }) {
    const router = useRouter();
    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const [songs, setSongs] = useState<Song[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const platformIcon = playlist?.platform === "YOUTUBE" ? <FaYoutube className="text-red-600" /> : playlist?.platform === "SPOTIFY" ? <FaSpotify className="text-green-500" /> : <MdMusicOff />;
    const platformMessage = playlist?.platform === "YOUTUBE" ? "Paste a YouTube URL" : "Paste a Spotify URL";

    // Song form states
    const [externalUrl, setExternalUrl] = useState("");

    // Load playlist data (playlist info + songs) when the component mounts
    useEffect(() => {
        const fetchPlaylistData = async () => {
            try {
                const response = await fetch(`/api/playlists/${playlistId}/songs`);
                const data = await response.json();

                if (response.ok) {
                    setPlaylist(data.playlist);
                    setSongs(data.songs);
                } else {
                    // If the playlist doesn't exist or user doesn't have access, redirect to not-found page
                    router.replace("/not-found");
                }
            } catch (error) {
                router.replace("/not-found");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlaylistData();
    }, [playlistId, router]);

    const handleCreateSongInPlaylist = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        setSubmitStatus("loading");

        try {
            const response = await fetch(`/api/playlists/${playlistId}/songs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ externalUrl }),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitStatus("success");
                setSongs([data.song, ...songs]);
                setExternalUrl("");
                setShowForm(false);

                setTimeout(() => setSubmitStatus("idle"), 5000);
            } else {
                setErrorMessage(
                    data.error ??
                    data.message ??
                    "Unable to add song."
                );
                setSubmitStatus("error");

                setTimeout(() => setSubmitStatus("idle"), 5000);
            }
        } catch (error) {
            setSubmitStatus("error");
            setTimeout(() => setSubmitStatus("idle"), 5000);
        }
    };

    // Displays a loader while fetching playlist data
    if (isLoading) {
        return <p className="p-4">Loading playlist...</p>;
    }

    const featuredImage = songs.find((song) => song.imageUrl)?.imageUrl ?? null;

    return (
        <main className="playlist-page min-h-full w-full text-slate-100">
            <section
                className="playlist-hero relative overflow-hidden rounded-b-[2rem] border-b border-cyan-200/10 bg-slate-950 shadow-2xl"
                style={featuredImage ? { "--playlist-image": `url(${featuredImage})` } as React.CSSProperties : undefined}
            >
                <div className="playlist-hero-backdrop" aria-hidden="true" />
                <div className="relative flex min-h-[18rem] flex-col justify-between gap-8 p-6 sm:p-8 lg:min-h-[21rem] lg:p-10">
                    <div className="flex items-start justify-between gap-6">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                                <button type="button" onClick={() => router.push("/library")} className="transition hover:text-cyan-200">Library</button>
                                <FaArrowRight className="text-xs text-cyan-300/70" aria-hidden="true" />
                                <span className="truncate text-slate-500">{playlist?.name}</span>
                            </div>
                            <div className="mt-4 flex items-center gap-3">
                                <h1 className="truncate text-3xl font-semibold tracking-tight text-white sm:text-4xl">{playlist?.name}</h1>
                                <span title={`${playlist?.platform} playlist`} className="shrink-0 text-2xl">{platformIcon}</span>
                            </div>
                        </div>
                        <button type="button" aria-label="Playlist settings" title="Playlist settings" className="playlist-icon-button"><FaGear aria-hidden="true" /></button>
                    </div>

                    <div className="max-w-3xl">
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-300">
                            <span>{songs.length} {songs.length === 1 ? "song" : "songs"}</span>
                            <span className="text-slate-600">|</span>
                            <span className="text-cyan-100/80">Total duration unavailable</span>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-4">
                            <button type="button" onClick={() => setShowForm((visible) => !visible)} className="playlist-primary-button"><FaPlus aria-hidden="true" />Add Song</button>
                            <span className="text-slate-500">|</span>
                            <button type="button" onClick={() => songs[0] && router.push(`/library/${playlistId}/player/${songs[0].id}`)} disabled={songs.length === 0} className="playlist-action-button disabled:cursor-not-allowed disabled:opacity-40"><FaPlay aria-hidden="true" />Listen</button>
                            <button type="button" aria-label="Save playlist as favorite" title="Save as favorite" className="playlist-action-button px-2 hover:text-rose-300"><FaHeart aria-hidden="true" /></button>
                        </div>

                        {showForm && (
                            <form onSubmit={handleCreateSongInPlaylist} className="playlist-add-form mt-4 flex flex-col gap-3 sm:flex-row">
                                <input type="url" required placeholder={platformMessage} value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} className="min-w-0 flex-1 rounded-xl border border-white/15 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/70" />
                                <button type="submit" disabled={submitStatus === "loading"} className="playlist-primary-button justify-center disabled:cursor-wait disabled:opacity-60">{submitStatus === "loading" ? "Adding..." : "Save song"}</button>
                                <button type="button" onClick={() => { setShowForm(false); setExternalUrl(""); setSubmitStatus("idle"); }} className="playlist-cancel-button">Cancel</button>
                            </form>
                        )}

                        {submitStatus !== "idle" && submitStatus !== "loading" && <p className={`mt-3 text-sm ${submitStatus === "success" ? "text-emerald-300" : "text-rose-300"}`}>{submitStatus === "success" ? "Song added successfully." : errorMessage || "Unable to add song."}</p>}
                    </div>
                </div>
            </section>

            <section className="px-6 py-8 sm:px-8 lg:px-10">
                <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/70">Playlist collection</p>
                        <h2 className="mt-2 text-3xl font-semibold text-white">All Songs</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button type="button" className="playlist-toolbar-button"><FaSliders aria-hidden="true" />Sorting</button>
                        <button type="button" className="playlist-toolbar-button"><FaPen aria-hidden="true" />Bulk Editing</button>
                    </div>
                </div>

                {songs.length === 0 ? <div className="py-16 text-center text-slate-400">No songs in this playlist yet.</div> : (
                    <div className="playlist-songs-viewport mt-6">
                        <div className="playlist-songs-grid">
                            {songs.map((song) => (
                                <article key={song.id} className="vinyl-card" onClick={() => router.push(`/library/${playlistId}/player/${song.id}`)}>
                                    <div className="vinyl-artwork">
                                        <div className="vinyl-disc" aria-hidden="true"><span /></div>
                                        <div className="vinyl-cover-frame">
                                            {song.imageUrl ? <img src={song.imageUrl} alt={song.title} className="vinyl-cover" /> : <div className="flex h-full w-full items-center justify-center bg-slate-800 text-xs text-slate-500">No image</div>}
                                        </div>
                                        <div className="vinyl-play" aria-hidden="true"><FaPlay /></div>
                                        <button type="button" aria-label={`Edit ${song.title}`} title="Edit song" onClick={(event) => event.stopPropagation()} className="vinyl-edit"><FaPen /></button>
                                    </div>
                                    <h3 className="truncate text-sm font-semibold text-white">{song.title}</h3>
                                    <p className="mt-1 mb-3 truncate text-sm text-slate-500">{song.artist}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}