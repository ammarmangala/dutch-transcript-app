"use client";

import { AnimatePresence, motion } from "motion/react";
import { AppIcon } from "@/components/app/AppIcon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDuration, useAudioRecorder } from "../hooks/useAudioRecorder";

interface Props {
  onBlob: (blob: Blob, filename: string) => void;
}

function Waveform({ audioLevel, isRecording }: { audioLevel: number; isRecording: boolean }) {
  return (
    <div className="flex h-16 items-center justify-center gap-1.5">
      {Array.from({ length: 11 }).map((_, index) => {
        const multiplier = 18 + index * 5;
        const height = isRecording ? Math.max(8, Math.min(56, 8 + audioLevel * multiplier)) : 12;

        return (
          <motion.span
            animate={{ height }}
            className={cn(
              "w-1.5 rounded-full bg-primary/75",
              !isRecording && "bg-muted-foreground/35"
            )}
            key={index}
            transition={{ duration: 0.15 }}
          />
        );
      })}
    </div>
  );
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
    <div className="flex flex-col gap-4">
      <Card className="border-border bg-card">
        <CardContent className="flex flex-col items-center gap-6 p-6">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Opnameduur
            </p>
            <p className="mt-2 text-5xl font-semibold tabular-nums">
              {formatDuration(durationSeconds)}
            </p>
          </div>

          <Waveform audioLevel={audioLevel} isRecording={state === "recording"} />

          <AnimatePresence mode="wait">
            {state === "idle" && (
              <motion.div
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.95 }}
                key="idle"
              >
                <Button
                  aria-label="Start opname"
                  className="size-20 rounded-full"
                  onClick={start}
                  size="icon-lg"
                >
                  <AppIcon name="mic" size={28} />
                </Button>
              </motion.div>
            )}

            {state === "recording" && (
              <motion.div
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3"
                exit={{ opacity: 0, scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.95 }}
                key="recording"
              >
                <motion.div
                  animate={{ opacity: [0.45, 1, 0.45], scale: [1, 1.08, 1] }}
                  className="flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  transition={{ duration: 1.4, repeat: Infinity }}
                >
                  <span className="size-2 rounded-full bg-primary" />
                  REC
                </motion.div>
                <Button
                  aria-label="Stop opname"
                  className="size-20 rounded-full"
                  onClick={stop}
                  size="icon-lg"
                  variant="destructive"
                >
                  <AppIcon name="stop" size={26} />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <AnimatePresence>
        {state === "stopped" && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-2"
            exit={{ opacity: 0, y: 6 }}
            initial={{ opacity: 0, y: 6 }}
          >
            <Button className="h-9" onClick={handleUse} size="lg">
              <AppIcon name="wave" />
              Transcribeer
            </Button>
            <Button className="h-9" onClick={reset} size="lg" variant="outline">
              <AppIcon name="refresh" />
              Opnieuw
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs leading-5 text-destructive">
          {error}
        </div>
      )}
    </div>
  );
}
