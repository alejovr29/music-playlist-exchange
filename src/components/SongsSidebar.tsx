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
        normal: "flex w-full gap-4 overflow-hidden rounded-3xl bg-slate-900 p-3 text-left transition hover:bg-slate-800 cursor-pointer",
        active: "flex w-full gap-4 overflow-hidden rounded-3xl border-1 border-sky-600 bg-slate-950 p-3 text-left transition cursor-pointer"
    }

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col gap-4 overflow-y-auto">
            <div className="rounded-3xl bg-slate-950 p-4 shadow-inner flex text-slate-400 items-center gap-2">
                <p className="text-lg cursor-pointer">{playlistName}</p>
                <p className="text-sm ">({songs.length} songs)</p>
            </div>
            <div className="rounded-3xl bg-slate-950 p-4 shadow-inner flex text-slate-400 items-center gap-2">
                <p className="text-lg">By
                    <span className="text-white cursor-pointer hover:text-blue-500"> {playlistUser}</span>
                </p>
                <p className="text-sm ">| {privacy}</p>
            </div>

            <div className="space-y-3">
                {songs.map((song) => {
                    const isActive = song.id === currentSong;
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
                                    className="h-20 w-20 rounded-xl object-cover"
                                />
                            ) : (
                                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-slate-700 text-xs text-slate-300">
                                    No image
                                </div>
                            )}
                            <div>
                                <p className="font-semibold text-white">{song.title}</p>
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