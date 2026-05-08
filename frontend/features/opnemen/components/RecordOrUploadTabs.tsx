"use client";

import { useState } from "react";
import AudioRecorder from "./AudioRecorder";
import AudioUploader from "./AudioUploader";

type Tab = "opnemen" | "uploaden";

interface Props {
  onAudio: (blob: Blob, filename: string) => void;
}

export default function RecordOrUploadTabs({ onAudio }: Props) {
  const [tab, setTab] = useState<Tab>("opnemen");

  function handleFile(file: File) {
    onAudio(file, file.name);
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
      {/* Tab bar */}
      <div className="flex border-b border-zinc-200">
        {(["opnemen", "uploaden"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${
              tab === t
                ? "border-b-2 border-zinc-900 text-zinc-900"
                : "text-zinc-400 hover:text-zinc-600"
            }`}
          >
            {t === "opnemen" ? "Opnemen" : "Uploaden"}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="px-6">
        {tab === "opnemen" ? (
          <AudioRecorder onBlob={onAudio} />
        ) : (
          <AudioUploader onFile={handleFile} />
        )}
      </div>
    </div>
  );
}
