"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import RecordOrUploadTabs from "@/features/opnemen/components/RecordOrUploadTabs";

type Status = "idle" | "uploading" | "error";

export default function OpnemenPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleAudio(blob: Blob, filename: string) {
    setStatus("uploading");
    setErrorMsg(null);

    const source = filename.startsWith("opname-") ? "recording" : "upload";

    const form = new FormData();
    form.append("file", blob, filename);
    form.append("source", source);

    try {
      const resp = await fetch("/api/transcriptie", {
        method: "POST",
        body: form,
      });

      if (!resp.ok) {
        const json = await resp.json().catch(() => ({}));
        setErrorMsg(json.error ?? "Er ging iets mis. Probeer het opnieuw.");
        setStatus("error");
        return;
      }

      const transcript = await resp.json();
      router.push(`/dashboard/transcripten/${transcript.id}`);
    } catch {
      setErrorMsg("Networkfout. Controleer je verbinding en probeer opnieuw.");
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-xl font-semibold text-zinc-900">
        Nieuw transcript
      </h1>

      {status === "uploading" ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-zinc-200 bg-white px-6 py-16 shadow-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-700" />
          <p className="text-sm text-zinc-500">Bezig met transcriberen…</p>
        </div>
      ) : (
        <>
          <RecordOrUploadTabs onAudio={handleAudio} />
          {status === "error" && errorMsg && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMsg}
            </p>
          )}
        </>
      )}
    </div>
  );
}
