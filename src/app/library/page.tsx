"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";


export default function LibraryPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    const [playlists, setPlaylists] = useState<any[]>([])
    const [name, setName] = useState("")
    const [showForm, setShowForm] = useState(false);

    const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

    {/* Handler that gets playlists from the API once user arrives the page*/ }
    useEffect(() => {
        if (status === "authenticated") {
            const fetchPlaylists = async () => {
                setSubmitStatus("loading")

                try {
                    const response = await fetch("/api/playlists");

                    const data = await response.json();

                    if (response.ok) {
                        setSubmitStatus("success")
                        setPlaylists(data.playlists)

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
            fetchPlaylists();
        }
    }, [status])

    {/* Handler that creates a new playlist through the API */ }
    const handleCreatePlaylist = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitStatus("loading")

        try {
            const response = await fetch("/api/playlists", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name })
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitStatus("success")
                setPlaylists([...playlists, data.playlist])
                setName("")
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
        return <p className="p-4">Loading library...</p>;
    }

    return (
        <main className="p-6">
            <h1 className="text-3xl font-bold mb-8">
                {session?.user?.name}'s Library
            </h1>

            {playlists.length === 0 ? (
                <div>
                    <p>No playlists yet. Create your first one 👇</p>
                    <button onClick={() => setShowForm(true)}
                        className="bg-indigo-600 p-4 rounded w-48 h-48 cursor-pointer">Create Playlist</button>
                </div>
            ) : (
                <div className='flex gap-4  items-center flex-wrap'>
                    <button onClick={() => showForm === false ? setShowForm(true) : setShowForm(false)} className="bg-indigo-500  flex gap-4 p-4 rounded w-48 h-48 cursor-pointer">+ New Playlist</button>


                    {playlists.map((playlist) => (
                        <div key={playlist.id}
                            onClick={() => router.push(`/library/${playlist.id}`)}
                            className="bg-teal-500 p-4 rounded w-48 h-48 cursor-pointer">
                            {playlist.name}
                        </div>
                    ))}
                </div>

            )
            }

            {
                showForm && (
                    <form onSubmit={handleCreatePlaylist} className="mt-4">
                        <input
                            type="text"
                            placeholder="Playlist name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="p-2 rounded text-white bg-slate-500"
                            required
                        />

                        <button type="submit" className="ml-2 bg-blue-500 px-3 py-2 rounded cursor-pointer">
                            Save
                        </button>
                        <button type="button" onClick={() => {
                            setShowForm(false);
                            setName("");
                        }} className="ml-2 bg-red-500 px-3 py-2 rounded cursor-pointer">
                            Cancel
                        </button>
                    </form>
                )
            }
        </main >
    );
}