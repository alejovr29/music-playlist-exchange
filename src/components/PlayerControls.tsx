"use client";

import { memo } from "react";
import {
    FaBackwardStep,
    FaForwardStep,
    FaHeart,
    FaPause,
    FaPlay,
    FaRepeat,
    FaShuffle,
    FaVolumeHigh,
    FaVolumeXmark,
} from "react-icons/fa6";
import type { Song } from "@/types/music";

type PlayerControlsProps = {
    song: Song;
    isPlaying: boolean;
    volume: number;
    muted: boolean;
    currentTime: number;
    duration: number;
    onPlay: () => void;
    onPause: () => void;
    onMute: () => void;
    onUnmute: () => void;
    onVolumeChange: (value: number) => void;
    onSeek: (value: number) => void;
    onPrev: () => void;
    onNext: () => void;
    disabled?: boolean;
};

function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

const iconButtonClass =
    "inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-800 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-40";

function PlayerControls({
    song,
    isPlaying,
    volume,
    muted,
    currentTime,
    duration,
    onPlay,
    onPause,
    onMute,
    onUnmute,
    onVolumeChange,
    onSeek,
    onPrev,
    onNext,
    disabled = false,
}: PlayerControlsProps) {
    const progressDisabled = disabled || duration === 0;
    const progressPercentage = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;
    const volumePercentage = muted ? 0 : Math.min(100, Math.max(0, volume));

    return (
        <div className="music-player-bar fixed bottom-0 z-50 border-t border-cyan-300/15 bg-slate-950/95 shadow-[0_-12px_40px_rgba(8,47,73,0.35)] backdrop-blur-xl">
            <div className="mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-3 px-4 py-3 sm:px-6 lg:grid-cols-[minmax(220px,1fr)_minmax(360px,1.5fr)_minmax(180px,1fr)] lg:gap-6">
                <div className="flex min-w-0 items-center gap-3">
                    {song.imageUrl ? (
                        <img
                            src={song.imageUrl}
                            alt=""
                            className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-white/10"
                        />
                    ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-xs text-slate-500">
                            No image
                        </div>
                    )}
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{song.title}</p>
                        <p className="truncate text-xs text-slate-400">{song.artist}</p>
                    </div>
                    <button
                        type="button"
                        aria-label="Add song to favorites"
                        title="Favorite"
                        className={`${iconButtonClass} ml-auto shrink-0 hover:text-rose-300`}
                    >
                        <FaHeart aria-hidden="true" />
                    </button>
                </div>

                <div className="min-w-0">
                    <div className="flex items-center justify-center gap-1">
                        <button type="button" aria-label="Shuffle" title="Shuffle" className={iconButtonClass}>
                            <FaShuffle aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            aria-label="Previous song"
                            title="Previous song"
                            onClick={onPrev}
                            disabled={disabled}
                            className={iconButtonClass}
                        >
                            <FaBackwardStep aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            aria-label={isPlaying ? "Pause" : "Play"}
                            title={isPlaying ? "Pause" : "Play"}
                            onClick={isPlaying ? onPause : onPlay}
                            disabled={disabled}
                            className="mx-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-cyan-300 text-slate-950 shadow-[0_0_22px_rgba(103,232,249,0.35)] transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {isPlaying ? <FaPause aria-hidden="true" /> : <FaPlay className="ml-0.5" aria-hidden="true" />}
                        </button>
                        <button
                            type="button"
                            aria-label="Next song"
                            title="Next song"
                            onClick={onNext}
                            disabled={disabled}
                            className={iconButtonClass}
                        >
                            <FaForwardStep aria-hidden="true" />
                        </button>
                        <button type="button" aria-label="Repeat song" title="Repeat song" className={iconButtonClass}>
                            <FaRepeat aria-hidden="true" />
                        </button>
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-[11px] tabular-nums text-cyan-200/80">
                        <span className="w-9 text-right">{formatTime(currentTime)}</span>
                        <input
                            type="range"
                            min={0}
                            max={duration || 0}
                            step={0.1}
                            value={currentTime}
                            onChange={(event) => onSeek(Number(event.target.value))}
                            disabled={progressDisabled}
                            aria-label="Song progress"
                            style={{
                                background: `linear-gradient(to right, #67e8f9 ${progressPercentage}%, #1e293b ${progressPercentage}%)`,
                            }}
                            className="player-range w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                        />
                        <span className="w-9 text-slate-500">{formatTime(duration)}</span>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                    <button
                        type="button"
                        aria-label={muted ? "Unmute" : "Mute"}
                        title={muted ? "Unmute" : "Mute"}
                        onClick={muted ? onUnmute : onMute}
                        disabled={disabled}
                        className={iconButtonClass}
                    >
                        {muted ? <FaVolumeXmark aria-hidden="true" /> : <FaVolumeHigh aria-hidden="true" />}
                    </button>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={volume}
                        onChange={(event) => onVolumeChange(Number(event.target.value))}
                        disabled={disabled}
                        aria-label="Volume"
                        style={{
                            background: `linear-gradient(to right, #a5f3fc ${volumePercentage}%, #1e293b ${volumePercentage}%)`,
                        }}
                        className="player-range w-24 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                    />
                </div>
            </div>
        </div>
    );
}

export default memo(PlayerControls);
