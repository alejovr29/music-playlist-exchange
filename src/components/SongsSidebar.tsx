import type { Playlist, Song } from "@/types/music";

const SongsSidebar = ({ songs, playlist, onSongSelect }: { songs: Song[]; playlist: Playlist; onSongSelect: (songId: number) => void }) => {

    const playlistName = playlist.name.length > 20 ? playlist.name.slice(0, 20) + "..." : playlist.name;
    const privacy = playlist.isPublic ? "Public" : "Private";

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col gap-4 overflow-y-auto">
            <div className="rounded-3xl bg-slate-950 p-4 shadow-inner flex text-slate-400 items-center gap-2">
                <p className="text-lg cursor-pointer">{playlistName}</p>
                <p className="text-sm ">({songs.length} songs)</p>
            </div>
            <div className="rounded-3xl bg-slate-950 p-4 shadow-inner flex text-slate-400 items-center gap-2">
                <p className="text-lg cursor-pointer">By {playlist.user?.name || "Unknown Artist"}</p>
                <p className="text-sm ">| {privacy}</p>
            </div>

            <div className="space-y-3">
                {songs.map((song) => (
                    <button
                        key={song.id}
                        type="button"
                        onClick={() => onSongSelect(song.id)}
                        className="flex w-full gap-4 overflow-hidden rounded-3xl bg-slate-900 p-3 text-left transition hover:bg-slate-800 cursor-pointer"
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
                ))}
            </div>
        </div>
    );
}

export default SongsSidebar;