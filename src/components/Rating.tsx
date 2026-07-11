import type { Playlist, Song } from "@/types/music";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

const Rating = ({ playlist, song }: { playlist: Playlist; song: Song }) => {

    const router = useRouter();
    const playlistId = playlist.id;
    const songId = song.id;

    const [songRating, setSongRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const displayRating = hoverRating || songRating;

    // Search and load rating for current song if existing.
    useEffect(() => {
        const fetchSongRatingData = async () => {
            try {
                const response = await fetch(`/api/playlists/${playlistId}/songs/${songId}/rating`);
                const data = await response.json();

                if (response.ok) {
                    setSongRating(data?.vote?.value)
                } else {
                    console.log('No rating found for this song.')
                }
            }
            catch (error) {
                console.log(`An error ocurred while attempting to apply the song rating: ${error}`)
            }
        }
        fetchSongRatingData();
    }, [song, router]);

    const handleMouseEnter = (value: number) => setHoverRating(value);
    const handleMouseLeave = () => setHoverRating(0);

    const handleRateSong = async (value: number) => {

        setSongRating(value);

        try {
            const response = await fetch(`/api/playlists/${playlistId}/songs/${songId}/rating`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ value }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log(`Rating of ${data.songVote} successfully applied to song ${data.song.title}`)
            }
        } catch (error) {
            console.log(`An error ocurred while attempting to apply the song rating: ${error}`)
        }
    }

    return (
        <>
            <div className="flex mt-2 text-amber-300">
                <p className="text-sm text-slate-400">Rate this song:</p>&nbsp;
                {[1, 2, 3, 4, 5].map((value) => (
                    <button
                        key={value}
                        type="button"
                        className="cursor-pointer px-0.5"
                        onMouseEnter={() => handleMouseEnter(value)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleRateSong(value)}
                    >
                        {displayRating >= value ? <FaStar /> : <FaRegStar />}
                    </button>
                ))}
            </div>
        </>
    )
}

export default Rating;