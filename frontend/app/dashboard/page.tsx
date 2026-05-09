import Link from "next/link";
import { redirect } from "next/navigation";
import { AppIcon } from "@/components/app/AppIcon";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TranscriptList from "@/features/geschiedenis/components/TranscriptList";
import { createClient } from "@/lib/supabase/server";
import type { TranscriptSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("transcripts")
    .select(
      "id, title, original_filename, source, status, created_at, duration_seconds",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const items = (data ?? []) as TranscriptSummary[];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="grid gap-4 lg:grid-cols-[1fr_18rem]">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardDescription className="uppercase tracking-[0.18em] text-primary">
              Welkom terug
            </CardDescription>
            <CardTitle className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Maak je gedachten tastbaar.
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Link
              className={cn(buttonVariants({ size: "lg" }), "h-9")}
              href="/dashboard/opnemen"
            >
              <AppIcon name="mic" />
              Opnemen
            </Link>
            <Link
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "h-9",
              )}
              href="/dashboard/opnemen"
            >
              <AppIcon name="upload" />
              Uploaden
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardDescription>Mijn transcripten</CardDescription>
            <CardTitle className="text-4xl font-semibold tabular-nums">
              {items.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {items.length === 1 ? "transcript" : "transcripten"} totaal
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-medium">Recente transcripten</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Je nieuwste opnames en uploads.
            </p>
          </div>
        </div>
        <TranscriptList initialItems={items} />
      </section>
    </div>
  );
}
