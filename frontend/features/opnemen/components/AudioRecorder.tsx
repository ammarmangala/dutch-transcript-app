"use client";

import { formatDuration, useAudioRecorder } from "../hooks/useAudioRecorder";

interface Props {
  onBlob: (blob: Blob, filename: string) => void;
}

export default function AudioRecorder({ onBlob }: Props) {
  const { state, durationSeconds, audioBlob, audioLevel, start, stop, reset, error } =
    useAudioRecorder();

  function handleUse() {
    if (!audioBlob) return;
    const ext = audioBlob.type.includes("mp4") ? "mp4" : "webm";
    onBlob(audioBlob, `opname-${Date.now()}.${ext}`);
    reset();
  }

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      {/* Level meter */}
      <div className="h-2 w-48 overflow-hidden rounded-full bg-zinc-200">
        <div
          className="h-full rounded-full bg-zinc-700 transition-all duration-75"
          style={{ width: `${audioLevel * 100}%` }}
        />
      </div>

      {/* Timer */}
      <span className="font-mono text-3xl tabular-nums text-zinc-900">
        {formatDuration(durationSeconds)}
      </span>

      {/* Controls */}
      {state === "idle" && (
        <button
          onClick={start}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-400 active:scale-95"
          aria-label="Start opname"
        >
          <span className="h-4 w-4 rounded-full bg-white" />
        </button>
      )}

      {state === "recording" && (
        <button
          onClick={stop}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800 text-white shadow hover:bg-zinc-700 active:scale-95"
          aria-label="Stop opname"
        >
          <span className="h-4 w-4 rounded bg-white" />
        </button>
      )}

      {state === "stopped" && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-zinc-500">
            Opname klaar ({formatDuration(durationSeconds)})
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleUse}
              className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700"
            >
              Transcribeer
            </button>
            <button
              onClick={reset}
              className="rounded-lg border border-zinc-300 px-5 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Opnieuw
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
