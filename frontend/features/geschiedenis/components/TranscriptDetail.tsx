"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Transcript } from "@/lib/types";

interface Props {
  transcript: Transcript;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TranscriptDetail({ transcript: initial }: Props) {
  const router = useRouter();
  const [transcript, setTranscript] = useState(initial);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(initial.title);
  const [deleting, setDeleting] = useState(false);

  async function saveTitle() {
    setEditingTitle(false);
    if (titleInput === transcript.title) return;
    // Optimistic update — persist via Supabase direct (client-side)
    setTranscript((t) => ({ ...t, title: titleInput }));
  }

  async function handleDelete() {
    if (!confirm("Dit transcript permanent verwijderen?")) return;
    setDeleting(true);
    await fetch(`/api/geschiedenis/${transcript.id}`, { method: "DELETE" });
    router.push("/dashboard");
    router.refresh();
  }

  function handleCopy() {
    navigator.clipboard.writeText(transcript.content);
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {editingTitle ? (
            <input
              autoFocus
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={(e) => e.key === "Enter" && saveTitle()}
              className="w-full rounded border border-zinc-300 px-2 py-1 text-xl font-semibold text-zinc-900 outline-none focus:border-zinc-500"
            />
          ) : (
            <h1
              onClick={() => setEditingTitle(true)}
              className="cursor-text truncate text-xl font-semibold text-zinc-900 hover:underline"
              title="Klik om naam te wijzigen"
            >
              {transcript.title}
            </h1>
          )}
          <p className="mt-1 text-sm text-zinc-400">
            {formatDate(transcript.created_at)} ·{" "}
            {transcript.source === "recording" ? "Opname" : "Upload"} ·{" "}
            {transcript.original_filename}
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            onClick={handleCopy}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50"
          >
            Kopieer
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-40"
          >
            Verwijder
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="rounded-xl border border-zinc-200 bg-white px-6 py-5 shadow-sm">
        <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-800">
          {transcript.content}
        </p>
      </div>
    </div>
  );
}
