export interface Song {
  id: number;
  title: string;
  artist: string;
  album?: string | null;
  imageUrl?: string | null;
  externalUrl: string;
}

export interface Playlist {
  id: number;
  name: string;
}
