"use client";

import { useRef, useState } from "react";

const ALLOWED_TYPES = new Set([
  "audio/mpeg", "audio/mp3", "audio/mp4", "audio/wav",
  "audio/webm", "audio/x-m4a", "audio/ogg", "video/webm",
]);
const MAX_BYTES = 25 * 1024 * 1024;

interface Props {
  onFile: (file: File) => void;
}

export default function AudioUploader({ onFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validate(file: File): string | null {
    const type = file.type.split(";")[0].trim().toLowerCase();
    if (!ALLOWED_TYPES.has(type)) return `Bestandstype niet ondersteund: ${file.type || file.name}`;
    if (file.size > MAX_BYTES) return `Bestand te groot: ${(file.size / 1024 / 1024).toFixed(1)} MB (max 25 MB)`;
    return null;
  }

  function handleFile(file: File) {
    setError(null);
    const err = validate(file);
    if (err) { setError(err); return; }
    onFile(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div className="flex flex-col gap-4 py-6">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-12 transition-colors ${
          dragOver ? "border-zinc-500 bg-zinc-100" : "border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50"
        }`}
      >
        <svg className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
        </svg>
        <div className="text-center">
          <p className="text-sm font-medium text-zinc-700">Sleep een audiobestand hierheen</p>
          <p className="text-xs text-zinc-400">of klik om te bladeren</p>
          <p className="mt-1 text-xs text-zinc-400">MP3, MP4, WAV, WebM, OGG · max 25 MB</p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="audio/*,video/webm"
        className="hidden"
        onChange={handleChange}
      />

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
      )}
    </div>
  );
}
