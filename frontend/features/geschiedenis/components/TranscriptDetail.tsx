"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AppIcon } from "@/components/app/AppIcon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  async function saveTitle() {
    setEditingTitle(false);
    if (titleInput === transcript.title) return;
    setTranscript((t) => ({ ...t, title: titleInput }));
  }

  async function handleDelete() {
    setDeleting(true);
    setShowDeleteDialog(false);
    await fetch(`/api/geschiedenis/${transcript.id}`, { method: "DELETE" });
    router.push("/dashboard");
    router.refresh();
  }

  function handleCopy() {
    navigator.clipboard.writeText(transcript.content);
    toast.success("Gekopieerd naar klembord");
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      <Card className="border-border bg-card">
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                Transcript
              </p>

              {editingTitle ? (
                <Input
                  autoFocus
                  className="mt-2 h-10 text-lg font-medium"
                  onBlur={saveTitle}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveTitle()}
                  value={titleInput}
                />
              ) : (
                <h1
                  className="mt-2 cursor-text text-2xl font-semibold tracking-tight transition-colors hover:text-primary"
                  onClick={() => setEditingTitle(true)}
                  title="Klik om naam te wijzigen"
                >
                  {transcript.title}
                </h1>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <AppIcon name="calendar" size={14} />
                  {formatDate(transcript.created_at)}
                </span>
                <span>-</span>
                <span className="inline-flex items-center gap-1">
                  <AppIcon name={transcript.source === "recording" ? "mic" : "upload"} size={14} />
                  {transcript.source === "recording" ? "Opname" : "Upload"}
                </span>
                <span>-</span>
                <span className="truncate">{transcript.original_filename}</span>
              </div>
            </div>

            <div className="flex shrink-0 gap-2">
              <Button className="h-9" onClick={handleCopy} size="lg" variant="outline">
                <AppIcon name="copy" />
                <span className="hidden sm:inline">Kopieer</span>
              </Button>
              <Button
                className="h-9"
                disabled={deleting}
                onClick={() => setShowDeleteDialog(true)}
                size="lg"
                variant="destructive"
              >
                <AppIcon name="delete" />
                <span className="hidden sm:inline">Verwijder</span>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="border-border bg-card">
        <CardContent className="p-5 sm:p-6">
          <p className="whitespace-pre-wrap text-sm leading-7 text-card-foreground">
            {transcript.content}
          </p>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <AppIcon name="delete" />
            </AlertDialogMedia>
            <AlertDialogTitle>Transcript permanent verwijderen?</AlertDialogTitle>
            <AlertDialogDescription>
              Dit kan niet ongedaan gemaakt worden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuleer</AlertDialogCancel>
            <AlertDialogAction disabled={deleting} onClick={handleDelete} variant="destructive">
              Verwijder
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
