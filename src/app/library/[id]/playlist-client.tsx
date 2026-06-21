"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Song {
    id: number;
    title: string;
    artist: string;
    album: string;
    imageUrl?: string;
}

interface Playlist {
    id: number;
    name: string;
}

export default function PlaylistClient({ playlistId }: { playlistId: number }) {
    const router = useRouter();
    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const [songs, setSongs] = useState<Song[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

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
                setSongs([...songs, data.song]);
                setExternalUrl("");
                setShowForm(false);

                setTimeout(() => setSubmitStatus("idle"), 5000);
            } else {
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

    return (
        <main className="p-6">
            <h1 className="text-3xl font-bold mb-8">
                {playlist?.name}'s songs
            </h1>

            {songs.length === 0 ? (
                <div>
                    <p>No songs yet. Add your first song 👇</p>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-indigo-600 p-4 rounded w-48 h-48 cursor-pointer"
                    >
                        Add Song
                    </button>
                </div>
            ) : (
                <div className="flex gap-4 items-center flex-wrap">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-indigo-500 flex gap-4 p-4 rounded w-48 h-48"
                    >
                        + New Song
                    </button>

                    {songs.map((song) => (
                        <div key={song.id} className="bg-teal-500 p-4 rounded w-48 h-48">
                            {song.title}
                            <p className="text-sm text-gray-600">{song.artist}</p>
                            <p className="text-sm text-gray-600">{song.album}</p>
                            {song.imageUrl && (
                                <img
                                    src={song.imageUrl}
                                    alt={song.title}
                                    className="mt-2 w-20 h-20 object-fill rounded"
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <form onSubmit={handleCreateSongInPlaylist} className="mt-4">
                    <input
                        type="url"
                        placeholder="Song URL"
                        value={externalUrl}
                        onChange={(e) => setExternalUrl(e.target.value)}
                        className="p-2 mr-2 rounded text-white bg-slate-500"
                    />

                    <button type="submit" className="ml-2 bg-blue-500 px-3 py-2 rounded">
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="ml-2 bg-red-500 px-3 py-2 rounded"
                    >
                        Cancel
                    </button>
                </form>
            )}
        </main>
    );
}