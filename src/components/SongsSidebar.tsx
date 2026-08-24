import type { Playlist, Song } from "@/types/music";

type SongsSidebarProps = {
    songs: Song[];
    playlist: Playlist;
    currentSong: number;
    onSongSelect: (songId: number) => void;
};

const SongsSidebar = ({ songs, playlist, currentSong, onSongSelect }: SongsSidebarProps) => {

    const playlistName = playlist.name.length > 20 ? playlist.name.slice(0, 20) + "..." : playlist.name;
    const playlistUser = playlist.user?.name || "Unknown Artist";
    const privacy = playlist.isPublic ? "Public" : "Private";

    const songsStyles = {
        normal: "flex w-full items-center gap-4 overflow-hidden rounded-3xl bg-slate-900 p-3 text-left transition hover:bg-sky-800 cursor-pointer",
        active: "flex w-full items-center shadow-md shadow-sky-300/30 gap-4 overflow-hidden rounded-3xl border-1 border-sky-600 bg-slate-950 p-3 text-left transition cursor-pointer"
    }

    return (
        <div className="flex h-full flex-col gap-4 overflow-y-auto">
            <div className="rounded-3xl bg-slate-950 p-4 shadow-inner flex text-slate-400 items-center gap-2">
                <p className="text-lg cursor-pointer">{playlistName}</p>
                <p className="text-sm ">({songs.length} songs)</p>
            </div>
            <div className="rounded-3xl bg-slate-950 p-4 shadow-inner flex text-slate-400 items-center gap-2">
                <p className="text-lg">By
                    <span className="text-white cursor-pointer hover:text-cyan-500"> {playlistUser}</span>
                </p>
                <p className="text-sm ">| {privacy}</p>
            </div>

            <div className="space-y-3">
                {songs.map((song) => {
                    const isActive = song.id === currentSong;
                    const songTitle = song.title.length > 28 ? song.title.slice(0, 28) + "..." : song.title;


                    return (
                        <button
                            key={song.id}
                            type="button"
                            onClick={() => onSongSelect(song.id)}
                            aria-current={isActive ? "true" : undefined}

                            className={isActive ? songsStyles.active : songsStyles.normal}
                        >
                            {song.imageUrl ? (
                                <img
                                    src={song.imageUrl}
                                    alt={song.title}
                                    className="h-15 w-15 rounded-xl object-contain"
                                />
                            ) : (
                                <div className="flex h-15 w-15 items-center justify-center rounded-xl bg-slate-700 text-xs text-slate-300">
                                    No image
                                </div>
                            )}
                            <div>
                                <p className="font-semibold text-white text-md">{songTitle}</p>
                                <p className="text-sm text-slate-400">{song.artist}</p>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    );
}

export default SongsSidebar;