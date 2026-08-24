"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface YouTubePlayerState {
  isReady: boolean;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  muted: boolean;
  error: string | null;
}

interface YouTubePlayerControls {
  play: () => void;
  pause: () => void;
  stop: () => void;
  seekTo: (seconds: number) => void;
  setVolume: (volume: number) => void;
  mute: () => void;
  unMute: () => void;
  loadVideoById: (videoId: string) => void;
}

function loadYouTubeApi(): Promise<void> {
  return new Promise((resolve, reject) => {

    // Check if the YouTube API is already loaded
    if (typeof window === "undefined") {
      reject(new Error("YouTube API requires a browser environment."));
      return;
    }

    // Check if the YouTube API is already loaded
    if ((window as any).YT?.Player) {
      resolve();
      return;
    }

    // Check if the script is already in the document
    const existingScript = document.querySelector("script#youtube-iframe-api");
    if (existingScript) { // If the script is already present, wait for it to load
      existingScript.addEventListener("load", () => resolve());
      existingScript.addEventListener("error", () => reject(new Error("Failed to load YouTube iframe API script.")));
      return; // Exit early if the script is already present
    }

    // Create a new script element to load the YouTube IFrame API
    const tag = document.createElement("script");
    tag.id = "youtube-iframe-api";
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
    // Set up event listeners for load and error events
    tag.onload = () => {
      if ((window as any).YT?.Player) { //| If the YT.Player is already available, resolve immediately
        resolve();
      }
    };
    tag.onerror = () => reject(new Error("Failed to load YouTube iframe API script."));

    document.body.appendChild(tag); // Append/Insert the script created to the document body (DOM)

    // Set up the global callback for when the YouTube API is ready
    (window as any).onYouTubeIframeAPIReady = () => {
      resolve();
    };
  });
}

export function useYouTubePlayer(initialVideoId: string) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<YouTubePlayerState>({
    isReady: false,
    isPlaying: false,
    duration: 0,
    currentTime: 0,
    volume: 100,
    muted: false,
    error: null,
  });

  useEffect(() => {
    if (!initialVideoId) {
      return;
    }

    let intervalId: number | undefined; // To store the interval ID for clearing later
    let playerInstance: any; // To store the YouTube player instance
    let cancelled = false;

    // Function to initialize the YouTube player
    const initializePlayer = async () => {
      try {
        await loadYouTubeApi(); // Load the YouTube API script and wait for it to be ready

        if (cancelled) {
          return;
        }

        if (!containerRef.current) { // Check if the container ref is available
          throw new Error("YouTube player container not found.");
        }

        const videoId = initialVideoId;
        // Create a new YouTube player instance and attach it to the container
        playerInstance = new (window as any).YT.Player(containerRef.current, {
          height: "100%",
          width: "100%",
          videoId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            rel: 0,
            modestbranding: 1,
            disablekb: 1,
          },
          events: { // Set up event handlers for the player
            onReady: () => {
              playerRef.current = playerInstance;
              setReady(true);
              setState((prev) => ({
                ...prev,
                isReady: true,
                duration: Number.isFinite(playerInstance.getDuration()) ? playerInstance.getDuration() : 0,
                volume: Number.isFinite(playerInstance.getVolume()) ? playerInstance.getVolume() : 100,
              })); // The API provides these values once the player has finished initializing.
            },
            onStateChange: (event: any) => {
              const ytState = event.data;
              const isPlaying = ytState === (window as any).YT.PlayerState.PLAYING;
              const isPaused = ytState === (window as any).YT.PlayerState.PAUSED;
              if (isPlaying) {
                setState((prev) => ({ ...prev, isPlaying: true }));
              }
              if (isPaused || ytState === (window as any).YT.PlayerState.ENDED) {
                setState((prev) => ({ ...prev, isPlaying: false }));
              }
            },
            onError: (event: any) => {
              setState((prev) => ({ ...prev, error: `YouTube player error: ${event.data}` }));
            },
          },
        });

        // Only currentTime changes continuously. The other values are updated by player events or user actions.
        intervalId = window.setInterval(() => {
          if (playerRef.current && playerRef.current.getDuration) {
            const nextTime = playerRef.current.getCurrentTime();
            setState((prev) => prev.currentTime === nextTime
              ? prev
              : { ...prev, currentTime: Number.isFinite(nextTime) ? nextTime : 0 });
          }
        }, 500);
      } catch (error: any) {
        setState((prev) => ({ ...prev, error: error.message ?? String(error) }));
      }
    };

    initializePlayer();

    return () => {
      cancelled = true;
      if (intervalId) {
        window.clearInterval(intervalId);
      }
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [initialVideoId]);

  const play = useCallback(() => playerRef.current?.playVideo(), []);
  const pause = useCallback(() => playerRef.current?.pauseVideo(), []);
  const stop = useCallback(() => playerRef.current?.stopVideo(), []);
  const seekTo = useCallback((seconds: number) => playerRef.current?.seekTo(seconds, true), []);
  const setVolume = useCallback((volume: number) => {
    const safeVolume = Math.max(0, Math.min(100, volume));
    playerRef.current?.setVolume(safeVolume);
    setState((prev) => ({ ...prev, volume: safeVolume }));
  }, []);
  const mute = useCallback(() => {
    playerRef.current?.mute();
    setState((prev) => ({ ...prev, muted: true }));
  }, []);
  const unMute = useCallback(() => {
    playerRef.current?.unMute();
    setState((prev) => ({ ...prev, muted: false }));
  }, []);
  const loadVideoById = useCallback((videoId: string) => playerRef.current?.loadVideoById(videoId), []);

  const controls = useMemo(() => ({
    play,
    pause,
    stop,
    seekTo,
    setVolume,
    mute,
    unMute,
    loadVideoById,
  }), [play, pause, stop, seekTo, setVolume, mute, unMute, loadVideoById]);

  return {
    containerRef,
    ready,
    state,
    controls,
  };
}
