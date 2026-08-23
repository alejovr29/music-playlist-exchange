export const supportedPlatforms = ["YOUTUBE", "SPOTIFY"] as const;
export type Platform = (typeof supportedPlatforms)[number];

export function isYouTubeUrl(url: string): boolean {
  return /(?:youtube\.com|youtu\.be)/i.test(url);
}

export function isSpotifyUrl(url: string): boolean {
  return /spotify\.com/i.test(url);
}

export function getPlatformFromUrl(url: string): Platform | null {
  if (isYouTubeUrl(url)) return "YOUTUBE";
  if (isSpotifyUrl(url)) return "SPOTIFY";
  return null;
}

export function getYouTubeVideoId(url: string): string | null {
  const regex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?vi?=|&vi?=))([^#&?]*).*/;
  const match = url.match(regex);
  return match?.[1] ?? null;
}

export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=0&rel=0&modestbranding=1&disablekb=1`;
}

export function getSpotifyEmbedUrl(url: string): string | null {
  const match = url.match(/spotify\.com\/(track|episode|album|playlist)\/([^?]+)/i);
  if (!match) {
    return null;
  }
  const [_, type, id] = match;
  return `https://open.spotify.com/embed/${type}/${id}`;
}
