"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { AppIcon } from "@/components/app/AppIcon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ALLOWED_TYPES = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/wav",
  "audio/webm",
  "audio/x-m4a",
  "audio/ogg",
  "video/webm",
]);
const MAX_BYTES = 25 * 1024 * 1024;

interface Props {
  onFile: (file: File) => void;
}

export default function AudioUploader({ onFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  function validate(file: File): string | null {
    const type = file.type.split(";")[0].trim().toLowerCase();
    if (!ALLOWED_TYPES.has(type)) return `Bestandstype niet ondersteund: ${file.type || file.name}`;
    if (file.size > MAX_BYTES) return `Bestand te groot: ${(file.size / 1024 / 1024).toFixed(1)} MB (max 25 MB)`;
    return null;
  }

  function handleFile(file: File) {
    const err = validate(file);
    if (err) {
      toast.error(err);
      return;
    }
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
    <div
      className={cn(
        "flex min-h-72 cursor-pointer flex-col items-center justify-center gap-5 rounded-lg border border-dashed px-6 py-10 text-center transition-colors",
        dragOver
          ? "border-primary bg-primary/10"
          : "border-border bg-muted/20 hover:bg-muted/35"
      )}
      onClick={() => inputRef.current?.click()}
      onDragLeave={() => setDragOver(false)}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDrop={handleDrop}
    >
      <div className="flex size-12 items-center justify-center rounded-md bg-card text-muted-foreground ring-1 ring-border">
        <AppIcon className={dragOver ? "text-primary" : undefined} name="upload" size={24} />
      </div>

      <div>
        <p className="text-sm font-medium">Sleep een audiobestand hierheen</p>
        <p className="mt-1 text-xs text-muted-foreground">
          MP3, MP4, WAV, WebM, OGG - max 25 MB
        </p>
      </div>

      <Button
        className="h-9"
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current?.click();
        }}
        size="lg"
      >
        <AppIcon name="folder" />
        Bladeren
      </Button>

      <input
        accept="audio/*,video/webm"
        className="hidden"
        onChange={handleChange}
        ref={inputRef}
        type="file"
      />
    </div>
  );
}
