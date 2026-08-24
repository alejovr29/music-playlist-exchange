import { memo, useState } from "react";
import type { Playlist, Song } from "@/types/music";

type SongsSidebarProps = {
    songs: Song[];
    playlist: Playlist;
    currentSong: number;
    onSongSelect: (songId: number) => void;
};

const SongsSidebar = ({ songs, playlist, currentSong, onSongSelect }: SongsSidebarProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const playlistName = playlist.name.length > 20 ? playlist.name.slice(0, 20) + "..." : playlist.name;
    const playlistUser = playlist.user?.name || "Unknown user";
    const privacy = playlist.isPublic ? "Public" : "Private";

    const songsStyles = {
        normal: "flex w-full items-center gap-4 overflow-hidden rounded-3xl bg-slate-900 p-3 text-left transition hover:bg-sky-800 cursor-pointer",
        active: "flex w-full items-center shadow-md shadow-sky-300/30 gap-4 overflow-hidden rounded-3xl border-1 border-sky-600 bg-slate-950 p-3 text-left transition cursor-pointer"
    }

    const visibleSongs = isCollapsed ? songs.filter((song) => song.id === currentSong) : songs;

    const handleShare = async () => {
        const shareUrl = window.location.href;
        await navigator.clipboard.writeText(shareUrl);
    };

    return (
        <div className="flex max-h-[calc(100vh-3rem)] flex-col overflow-hidden rounded-2xl bg-slate-950/40">
            <section className="shrink-0 border-b border-slate-700/70 p-4">
                <div className="flex min-w-0 items-baseline gap-2">
                    <h2 className="min-w-0 truncate text-lg font-semibold text-cyan-300">{playlistName}</h2>
                    <p className="shrink-0 text-xs text-slate-500">
                        ({songs.length} {songs.length === 1 ? "song" : "songs"})
                    </p>
                </div>
                <p className="mt-3 truncate text-sm text-slate-300">
                    <span className="text-xs uppercase tracking-wide text-slate-500">By </span>
                    <span className="font-medium text-white">{playlistUser}</span>
                    <span className="mx-2 text-slate-600">|</span>
                    <span className={playlist.isPublic ? "text-emerald-300" : "text-amber-300"}>{privacy}</span>
                </p>
            </section>

            <section className="songs-scrollbar max-h-[41rem] overflow-y-auto p-3">
                <div className="space-y-3">
                    {visibleSongs.map((song) => {
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
                                        className="h-14 w-14 shrink-0 rounded-xl object-cover"
                                    />
                                ) : (
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-700 text-xs text-slate-300">
                                        No image
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <p className="truncate text-left text-sm font-semibold text-white">{songTitle}</p>
                                    <p className="truncate text-left text-sm text-slate-400">{song.artist}</p>
                                    {isActive && <p className="mt-1 text-[10px] uppercase tracking-widest text-cyan-300">Playing</p>}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </section>

            <section className="grid shrink-0 grid-cols-[1fr_2fr] gap-2 border-t border-slate-700/70 p-3">
                <button
                    type="button"
                    onClick={() => setIsCollapsed((collapsed) => !collapsed)}
                    aria-expanded={!isCollapsed}
                    className="rounded-xl border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-cyan-400 hover:text-white"
                >
                    {isCollapsed ? "Open" : "Close"}
                </button>
                <button
                    type="button"
                    onClick={handleShare}
                    className="rounded-xl bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                    Share
                </button>
            </section>
        </div>
    );
}

// Playback time changes elsewhere should not rerender this sidebar. Compare the
// playlist fields it displays instead of relying only on object identity.
export default memo(SongsSidebar, (previous, next) => (
    previous.songs === next.songs &&
    previous.playlist.id === next.playlist.id &&
    previous.playlist.name === next.playlist.name &&
    previous.playlist.userId === next.playlist.userId &&
    previous.playlist.isPublic === next.playlist.isPublic &&
    previous.currentSong === next.currentSong &&
    previous.onSongSelect === next.onSongSelect
));