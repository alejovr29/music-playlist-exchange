const SongPlayer = ({ song }: { song: { externalUrl: string; title: string } }) => {
    const songUrl = song.externalUrl ?? ""; // If externalUrl does not exist it returns an empty string.
    const songTitle = song.title;

    const regexId = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?vi?=|&vi?=))([^#&?]*).*/;
    const isYouTube = songUrl.match(regexId);

    // To include later on regex for other platforms like Spotify, SoundCloud, etc. For now, I will only handle YouTube links.

    const handlerPlatform = (url: string) => {
        if (isYouTube) {
            const videoId = isYouTube[1];
            return `https://www.youtube.com/embed/${videoId}?`;
        }
        // If the song is not from YouTube, return the original URL
        return url;
    };

    return (
        <div>
            {/* Aaquí iría el iframe de la canción que se le pase como prop, el iframe es la propiedad "html" obtenida de cuando se llamó a sus metadatos o si no se usaría la estructura base de iframe de YouTube y simplemente se le cambia el ID del video por la url de esta canción */}
            <h1>Song Player</h1>

            <iframe width="560" height="315" src={handlerPlatform(songUrl)} title={songTitle} allow="accelerometer; clipboard-write; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </div>
    );
}

export default SongPlayer;