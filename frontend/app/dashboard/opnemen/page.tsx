"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AppIcon } from "@/components/app/AppIcon";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import RecordOrUploadTabs from "@/features/opnemen/components/RecordOrUploadTabs";

type Status = "idle" | "uploading" | "error";

export default function OpnemenPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");

  async function handleAudio(blob: Blob, filename: string) {
    setStatus("uploading");

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
        toast.error(json.error ?? "Er ging iets mis. Probeer het opnieuw.");
        setStatus("error");
        return;
      }

      const transcript = await resp.json();
      router.push(`/dashboard/transcripten/${transcript.id}`);
    } catch {
      toast.error("Networkfout. Controleer je verbinding en probeer opnieuw.");
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Nieuw</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Nieuw transcript</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Neem live op of upload een bestaand audiobestand.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {status === "uploading" ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            initial={{ opacity: 0, y: 8 }}
            key="uploading"
          >
            <Card className="border-border bg-card">
              <CardContent className="flex flex-col items-center justify-center gap-5 py-14 text-center">
                <div className="flex size-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <AppIcon name="wave" size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium">Bezig met transcriberen...</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Dit kan even duren afhankelijk van de lengte.
                  </p>
                </div>
                <Progress className="h-1.5 w-56" value={65} />
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            initial={{ opacity: 0, y: 8 }}
            key="form"
          >
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Audio toevoegen</CardTitle>
                <CardDescription>Kies hoe je het transcript wilt starten.</CardDescription>
              </CardHeader>
              <CardContent>
                <RecordOrUploadTabs onAudio={handleAudio} />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
