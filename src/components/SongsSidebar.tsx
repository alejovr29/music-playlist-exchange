import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SongsSidebar = ({ songs, onSongSelect }: { songs: [any]; onSongSelect: (songId: number) => void }) => {



    return (
        <div className="flex gap-4 items-center flex-col bg-green-500">
            <p className="small text-white">Playlist contains {songs.length} songs.</p>
            {songs.map((song) => (
                <div key={song.id} className="gap-4 p-4 rounded w-100 h-48 cursor-pointer" onClick={() => onSongSelect(song.id)}>
                    <img
                        src={song.imageUrl}
                        alt={song.title}
                        className="mt-2 w-20 h-20 object-fill rounded"
                    />
                    <p className="small">{song.title}</p>
                </div>
            ))
            }
        </div >
    )
}

export default SongsSidebar;