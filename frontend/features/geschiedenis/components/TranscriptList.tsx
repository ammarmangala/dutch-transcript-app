"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { TranscriptSummary } from "@/lib/types";

interface Props {
  initialItems: TranscriptSummary[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SourceIcon({ source }: { source: TranscriptSummary["source"] }) {
  if (source === "recording") {
    return (
      <svg className="h-4 w-4 text-red-400" viewBox="0 0 20 20" fill="currentColor">
        <circle cx="10" cy="10" r="5" />
      </svg>
    );
  }
  return (
    <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  );
}

export default function TranscriptList({ initialItems }: Props) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    if (!confirm("Transcript verwijderen?")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/geschiedenis/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((t) => t.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-zinc-400">Nog geen transcripten.</p>
        <a
          href="/dashboard/opnemen"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Maak je eerste transcript
        </a>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white shadow-sm">
      {items.map((t) => (
        <li
          key={t.id}
          onClick={() => router.push(`/dashboard/transcripten/${t.id}`)}
          className="flex cursor-pointer items-center gap-4 px-5 py-4 hover:bg-zinc-50"
        >
          <SourceIcon source={t.source} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-zinc-900">{t.title}</p>
            <p className="truncate text-xs text-zinc-400">
              {t.original_filename} · {formatDate(t.created_at)}
            </p>
          </div>
          <button
            onClick={(e) => handleDelete(e, t.id)}
            disabled={deletingId === t.id}
            className="shrink-0 rounded p-1 text-zinc-300 hover:bg-red-50 hover:text-red-400 disabled:opacity-40"
            aria-label="Verwijder transcript"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        </li>
      ))}
    </ul>
  );
}
