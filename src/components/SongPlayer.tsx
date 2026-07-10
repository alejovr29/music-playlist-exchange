import type { Song } from "@/types/music";

const SongPlayer = ({ song }: { song: Song }) => {
    const songUrl = song.externalUrl;
    const songTitle = song.title ?? "Song Player";

    const regexId = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?vi?=|&vi?=))([^#&?]*).*/;
    const isYouTube = songUrl.match(regexId);

    // Only YouTube handling is implemented for now. This can be extended to Spotify or other platforms.
    const handlerPlatform = (url: string) => {
        if (isYouTube) {
            const videoId = isYouTube[1];
            return `https://www.youtube.com/embed/${videoId}`;
        }
        return url;
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="rounded-3xl bg-slate-950 p-4 shadow-lg">
                <h2 className="text-2xl font-semibold">{song.title}</h2>
                <p className="text-sm pt-1 text-slate-400">{song.artist}</p>
            </div>

            <div className="aspect-video overflow-hidden rounded-3xl bg-black">
                <iframe
                    width="100%"
                    height="100%"
                    src={handlerPlatform(songUrl)}
                    title={songTitle}
                    allow="accelerometer; clipboard-write; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="h-full w-full"
                />
            </div>
        </div>
    );
}

export default SongPlayer;