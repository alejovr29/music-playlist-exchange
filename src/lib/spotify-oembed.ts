export default async function fetchSpotifyOEmbed(externalUrl: string) {
  if (!externalUrl.includes("spotify.com")) {
    return null;
  }

  try {
    const endpoint = `https://open.spotify.com/oembed?url=${encodeURIComponent(externalUrl)}`;
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`Spotify oEmbed request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching Spotify oEmbed data:", error);
    return null;
  }
}
