"use client";

type PlayerControlsProps = {
  isReady: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  platform: string;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
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

export default function PlayerControls({
  isReady,
  isPlaying,
  currentTime,
  duration,
  volume,
  muted,
  platform,
  onPlay,
  onPause,
  onStop,
  onMute,
  onUnmute,
  onVolumeChange,
  onSeek,
  onPrev,
  onNext,
  disabled = false,
}: PlayerControlsProps) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-4 rounded-3xl bg-slate-900 p-4 shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">Platform</p>
          <p className="font-semibold">{platform}</p>
        </div>
        <div className="text-right text-sm text-slate-400">
          <p>{isReady ? "Ready" : "Loading player..."}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-full bg-slate-700 px-3 py-2 text-sm transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:bg-slate-800"
          onClick={onPrev}
          disabled={disabled}
        >
          Prev
        </button>
        <button
          type="button"
          className="rounded-full bg-slate-700 px-3 py-2 text-sm transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:bg-slate-800"
          onClick={onPlay}
          disabled={disabled || isPlaying}
        >
          Play
        </button>
        <button
          type="button"
          className="rounded-full bg-slate-700 px-3 py-2 text-sm transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:bg-slate-800"
          onClick={onPause}
          disabled={disabled || !isPlaying}
        >
          Pause
        </button>
        <button
          type="button"
          className="rounded-full bg-slate-700 px-3 py-2 text-sm transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:bg-slate-800"
          onClick={onStop}
          disabled={disabled}
        >
          Stop
        </button>
        <button
          type="button"
          className="rounded-full bg-slate-700 px-3 py-2 text-sm transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:bg-slate-800"
          onClick={muted ? onUnmute : onMute}
          disabled={disabled}
        >
          {muted ? "Unmute" : "Mute"}
        </button>
        <button
          type="button"
          className="rounded-full bg-slate-700 px-3 py-2 text-sm transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:bg-slate-800"
          onClick={onNext}
          disabled={disabled}
        >
          Next
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={(event) => onSeek(Number(event.target.value))}
          disabled={disabled || duration === 0}
          className="w-full accent-teal-500"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>Volume</span>
          <span>{volume}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={volume}
          onChange={(event) => onVolumeChange(Number(event.target.value))}
          disabled={disabled}
          className="w-full accent-teal-500"
        />
      </div>
    </div>
  );
}
