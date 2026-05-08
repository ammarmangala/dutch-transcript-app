"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
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

const listVariants = {
  show: { transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" as const } },
};

export default function TranscriptList({ initialItems }: Props) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeletingId(id);
    setConfirmId(null);
    try {
      await fetch(`/api/geschiedenis/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((t) => t.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  if (items.length === 0) {
    return (
      <Card className="border-dashed border-border bg-card">
        <CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
          <div className="flex size-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <AppIcon name="wave" size={20} />
          </div>
          <div>
            <p className="text-sm font-medium">Nog geen transcripten.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Neem audio op of upload een bestand om je eerste transcript te maken.
            </p>
          </div>
          <Button onClick={() => router.push("/dashboard/opnemen")} size="lg">
            <AppIcon name="add" />
            Maak je eerste transcript
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <motion.ul
        animate="show"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        variants={listVariants}
      >
        <AnimatePresence>
          {items.map((t) => (
            <motion.li
              exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15 } }}
              key={t.id}
              layout
              variants={itemVariants}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
            >
              <Card
                className="h-full cursor-pointer border-border bg-card transition-colors hover:bg-accent/45"
                onClick={() => router.push(`/dashboard/transcripten/${t.id}`)}
              >
                <CardContent className="flex h-full flex-col gap-4 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <AppIcon name={t.source === "recording" ? "mic" : "upload"} size={17} />
                    </div>
                    <Button
                      aria-label="Verwijder transcript"
                      disabled={deletingId === t.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmId(t.id);
                      }}
                      size="icon"
                      variant="ghost"
                    >
                      <AppIcon name="delete" />
                    </Button>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium leading-5">{t.title}</p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {t.original_filename}
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground">{formatDate(t.created_at)}</p>
                </CardContent>
              </Card>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <AlertDialog
        onOpenChange={(open) => {
          if (!open) setConfirmId(null);
        }}
        open={confirmId !== null}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <AppIcon name="delete" />
            </AlertDialogMedia>
            <AlertDialogTitle>Transcript verwijderen?</AlertDialogTitle>
            <AlertDialogDescription>
              Dit kan niet ongedaan gemaakt worden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuleer</AlertDialogCancel>
            <AlertDialogAction
              disabled={deletingId !== null}
              onClick={() => confirmId && handleDelete(confirmId)}
              variant="destructive"
            >
              Verwijder
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
