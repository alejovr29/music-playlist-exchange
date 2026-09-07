import type { Playlist, Song } from "@/types/music";
import { useState, useEffect } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

const Rating = ({ playlist, song }: { playlist: Playlist; song: Song }) => {

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
                    setSongRating(0)
                }
            }
            catch (error) {
                console.log(`An error ocurred while attempting to apply the song rating: ${error}`)
            }
        }
        fetchSongRatingData();
    }, [songId, playlistId]);

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
        <div className="flex flex-col items-center gap-2 border-t border-slate-800/80 pt-5 text-center">
            <p className="text-lg font-medium tracking-wide text-slate-300">Rate this song</p>
            <div className="flex items-center justify-center gap-1 text-4xl text-amber-300">
                {[1, 2, 3, 4, 5].map((value) => (
                    <button
                        key={value}
                        type="button"
                        aria-label={`Rate ${value} out of 5`}
                        className="flex cursor-pointer items-center p-1 transition hover:scale-110 hover:text-amber-200"
                        onMouseEnter={() => handleMouseEnter(value)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleRateSong(value)}
                    >
                        {displayRating >= value ? <FaStar /> : <FaRegStar />}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Rating;