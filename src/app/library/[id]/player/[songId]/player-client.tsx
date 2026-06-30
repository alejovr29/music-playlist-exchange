"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SongPlayer from "@/components/SongPlayer";
import prisma from "@/lib/prisma";


export default function PlayerClient({ playlist, song, songs }: { playlist: any; song: any; songs: any[]; }) {

    const router = useRouter();
    const [currentSong, setCurrentSong] = useState(song);
    const [songList, setSongList] = useState(songs);
    const [playlistData, setPlaylistData] = useState(playlist);

    // Esta es la página que dibujará todo el reproductor de canciones, y se encargará de manejar la lógica de reproducción de canciones, como cambiar de canción, reproducir/pausar, etc.

    // Fetch the song data from the database using Prisma
    // Use useState to store the current song data
    // Use useEffect to fetch the song data when the component mounts

    // 

    return (<div>
        Player Client
        {SongPlayer({ song: currentSong })}
    </div>)
}