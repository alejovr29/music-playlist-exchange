"use client";

import { useParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";

export default function PlaylistPage() {
    const params = useParams();
    const id = params.id as string;
    const { data: session, status } = useSession();
    const router = useRouter();


    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);


    const [playlist, setPlaylist] = useState<any>(null)
    const [songs, setSongs] = useState<any[]>([])
    const [showForm, setShowForm] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

    // Song data states
    const [title, setTitle] = useState("")
    const [artist, setArtist] = useState("")
    const [album, setAlbum] = useState("")
    const [imageUrl, setimageUrl] = useState("")

    {/* Handler that gets songs of current playlist from the API once user arrives the page*/ }
    useEffect(() => {
        if (status === "authenticated") {
            const fetchSongsInPlaylist = async () => {
                setSubmitStatus("loading")

                try {
                    const response = await fetch(`/api/playlists/${id}/songs`);

                    const data = await response.json();

                    if (response.ok) {
                        setSubmitStatus("success")
                        setPlaylist(data.playlist)
                        setSongs(data.songs)

                        // Hide success message after 5 seconds
                        setTimeout(() => setSubmitStatus("idle"), 5000)
                    } else {
                        setSubmitStatus("error")
                        setTimeout(() => setSubmitStatus("idle"), 5000)
                    }
                } catch (error) {
                    setSubmitStatus("error")
                    setTimeout(() => setSubmitStatus("idle"), 5000)
                }
            };
            fetchSongsInPlaylist();
        }
    }, [status, id])


    {/* Handler that creates a new song in the playlist through the API */ }
    const handleCreateSongInPlaylist = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitStatus("loading")

        try {
            const response = await fetch(`/api/playlists/${id}/songs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, artist, album, imageUrl })
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitStatus("success")
                setSongs([...songs, data.song])
                setTitle("")
                setArtist("")
                setAlbum("")
                setimageUrl("")
                setShowForm(false)

                // Hide success message after 5 seconds
                setTimeout(() => setSubmitStatus("idle"), 5000)
            } else {
                setSubmitStatus("error")
                setTimeout(() => setSubmitStatus("idle"), 5000)
            }
        } catch (error) {
            setSubmitStatus("error")
            setTimeout(() => setSubmitStatus("idle"), 5000)
        }
    }

    if (status === "loading") {
        return <p className="p-4">Loading songs...</p>;
    }


    return (
        <main className="p-6">
            <h1 className="text-3xl font-bold mb-4">
                {playlist ? `${playlist.name}'s songs'` : 'Loading songs...'}
            </h1>

            {songs.length === 0 ? (
                <div>
                    <p>No songs yet. Add your first song 👇</p>
                    <button onClick={() => showForm === false ? setShowForm(true) : setShowForm(false)}
                        className="bg-indigo-600 p-4 rounded w-48 h-48 cursor-pointer">Add Song</button>
                </div>
            ) : (
                <div className='flex gap-4  items-center flex-wrap'>
                    <button onClick={() => showForm === false ? setShowForm(true) : setShowForm(false)} className="bg-indigo-500  flex gap-4 mt-4 p-4 rounded w-48 h-48">+ New Song</button>

                    <div className="flex gap-4 mt-4">
                        {songs.map((song) => (
                            <div key={song.id} className="bg-teal-500 p-4 rounded w-48 h-48">
                                {song.title}
                                <p className="text-sm text-gray-300">{song.artist}</p>
                                <p className="text-sm text-gray-300">{song.album}</p>
                                {song.imageUrl && <img src={song.imageUrl} alt={song.title} className="mt-2 w-full h-24 object-cover rounded" />}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showForm && (
                <form onSubmit={handleCreateSongInPlaylist} className="mt-4">
                    <input
                        type="text"
                        placeholder="Song title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="p-2 rounded text-white bg-slate-500"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Artist"
                        value={artist}
                        onChange={(e) => setArtist(e.target.value)}
                        className="p-2 rounded text-white bg-slate-500"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Album"
                        value={album}
                        onChange={(e) => setAlbum(e.target.value)}
                        className="p-2 rounded text-white bg-slate-500"
                    />
                    <input
                        type="url"
                        placeholder="Image URL"
                        value={imageUrl}
                        onChange={(e) => setimageUrl(e.target.value)}
                        className="p-2 rounded text-white bg-slate-500"
                    />

                    <button type="submit" className="ml-2 bg-blue-500 px-3 py-2 rounded">
                        Save
                    </button>
                    <button type="button" onClick={() => setShowForm(false)} className="ml-2 bg-red-500 px-3 py-2 rounded">
                        Cancel
                    </button>
                </form>
            )}
        </main>
    );
}