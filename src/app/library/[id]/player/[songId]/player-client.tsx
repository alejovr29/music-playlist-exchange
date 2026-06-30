"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SongPlayer from "@/components/SongPlayer";
import SongsSidebar from "@/components/SongsSidebar";


export default function PlayerClient({ playlist, song, songs }: { playlist: any; song: any; songs: []; }) {

    const router = useRouter();
    const [currentSong, setCurrentSong] = useState(song);
    const [songList, setSongList] = useState(songs);
    const [playlistData, setPlaylistData] = useState(playlist);

    // Esta es la página que dibujará todo el reproductor de canciones, y se encargará de manejar la lógica de reproducción de canciones, como cambiar de canción, reproducir/pausar, etc.

    // Fetch the song data from the database using Prisma
    // Use useState to store the current song data
    // Use useEffect to fetch the song data when the component mounts

    // 

    const handleChangeSong = (songId: number) => {
        const selectedSong = songId;
        setCurrentSong(selectedSong);
        router.push(`/library/${playlistData.id}/player/${selectedSong}`);
    }

    return (<div>
        Player Client
        <div className="grid grid-flow-col grid-rows-1 w-1 h-1">
            <div className="sticky">{SongPlayer({ song: currentSong })}</div>
            <div className="overflow-y">{SongsSidebar({ songs: songList, onSongSelect: handleChangeSong })}</div>
        </div>
    </div>)
}