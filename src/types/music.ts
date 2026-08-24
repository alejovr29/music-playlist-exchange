export type Platform = "YOUTUBE" | "SPOTIFY";

export interface Song {
  id: number;
  title: string;
  artist: string;
  album?: string | null;
  imageUrl?: string | null;
  externalUrl: string;
  platform: Platform;
}

export interface Playlist {
  id: number;
  name: string;
  platform: Platform;
  userId: number;
  isPublic: boolean;
  user?: {
    id: number;
    name: string | null;
  };
}
