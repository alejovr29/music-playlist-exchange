"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useYouTubePlayer } from "@/lib/use-youtube-player";
import { getPlatformFromUrl, getSpotifyEmbedUrl, getYouTubeEmbedUrl, getYouTubeVideoId } from "@/lib/media-platforms";
import PlayerControls, { PlayerProgress } from "@/components/PlayerControls";
import type { Song } from "@/types/music";

interface SongPlayerProps {
  song: Song;
  songs: Song[];
  onSongChange: (songId: number) => void;
}

const SongPlayer = ({ song, songs, onSongChange }: SongPlayerProps) => {
  const platform = useMemo(() => getPlatformFromUrl(song.externalUrl) ?? "YOUTUBE", [song.externalUrl]);
  const youTubeVideoId = useMemo(
    () => (platform === "YOUTUBE" ? getYouTubeVideoId(song.externalUrl) : null),
    [platform, song.externalUrl]
  );
  const spotifyEmbedUrl = useMemo(
    () => (platform === "SPOTIFY" ? getSpotifyEmbedUrl(song.externalUrl) : null),
    [platform, song.externalUrl]
  );
  const youTubeEmbedUrl = useMemo(
    () => (platform === "YOUTUBE" && youTubeVideoId ? getYouTubeEmbedUrl(youTubeVideoId) : null),
    [platform, youTubeVideoId]
  );

  const { containerRef, ready, state, controls } = useYouTubePlayer(youTubeVideoId ?? "");

  // useEffect(() => {
  //   if (platform === "YOUTUBE" && youTubeVideoId && ready) {
  //     controls.loadVideoById(youTubeVideoId);
  //   }
  // }, [platform, youTubeVideoId, ready, controls]);

  const songIndex = useMemo(() => songs.findIndex((item) => item.id === song.id), [songs, song.id]);


  const handlePrev = useCallback(() => {
    if (songIndex === 0) {
      onSongChange(songs[songs.length - 1].id);
    } else {
      onSongChange(songs[songIndex - 1].id);
    }
  }, [onSongChange, songIndex, songs]);

  const handleNext = useCallback(() => {
    if (songIndex === songs.length - 1) {
      onSongChange(songs[0].id);
    } else {
      onSongChange(songs[songIndex + 1].id);
    }
  }, [onSongChange, songIndex, songs]);

  const embedUrl = platform === "YOUTUBE" ? youTubeEmbedUrl : spotifyEmbedUrl;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-950 p-6 shadow-lg">
        <h2 className="text-3xl font-semibold">{song.title}</h2>
        <p className="mt-2 text-sm text-slate-400">{song.artist}</p>
        <p className="mt-1 text-sm text-slate-500">{platform}</p>
      </div>

      <div className="aspect-video overflow-hidden rounded-3xl bg-black">
        {platform === "YOUTUBE" ? (
          <div ref={containerRef} className="h-full w-full" />
        ) : embedUrl ? (
          <iframe
            src={embedUrl}
            title={song.title ?? "Song Player"}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="h-full w-full"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-slate-900 text-slate-300">
            Unable to render this track.
          </div>
        )}
      </div>

      <PlayerControls
        isReady={ready}
        isPlaying={state.isPlaying}
        volume={state.volume}
        muted={state.muted}
        platform={platform}
        onPlay={controls.play}
        onPause={controls.pause}
        onStop={controls.stop}
        onMute={controls.mute}
        onUnmute={controls.unMute}
        onVolumeChange={controls.setVolume}
        onPrev={handlePrev}
        onNext={handleNext}
        disabled={!embedUrl && platform !== "YOUTUBE"}
      />
      <PlayerProgress
        currentTime={state.currentTime}
        duration={state.duration}
        onSeek={controls.seekTo}
        disabled={!embedUrl && platform !== "YOUTUBE"}
      />
    </div>
  );
};

export default SongPlayer;
