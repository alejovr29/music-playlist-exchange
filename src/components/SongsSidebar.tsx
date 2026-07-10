import type { Song } from "@/types/music";

const SongsSidebar = ({ songs, onSongSelect }: { songs: Song[]; onSongSelect: (songId: number) => void }) => {
    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col gap-4 overflow-y-auto">
            <div className="rounded-3xl bg-slate-950 p-4 shadow-inner">
                <p className="text-sm text-slate-400">Playlist contains {songs.length} songs.</p>
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