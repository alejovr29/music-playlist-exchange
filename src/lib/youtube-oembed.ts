
export default async function fetchYouTubeOEmbed(videoUrl: string) {

    if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
        try {
            const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`;

            const response = await fetch(endpoint);

            if (!response.ok) {
                throw new Error(`YouTube oEmbed request failed with status ${response.status}`);
            }

            return await response.json();
        }
        catch (error) {
            console.error('Error fetching YouTube oEmbed data:', error);
            return null;
        }

    }
}