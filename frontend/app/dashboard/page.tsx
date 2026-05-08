import { createClient } from "@/lib/supabase/server";
import TranscriptList from "@/features/geschiedenis/components/TranscriptList";
import type { TranscriptSummary } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("transcripts")
    .select("id, title, original_filename, source, status, created_at, duration_seconds")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const items = (data ?? []) as TranscriptSummary[];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-zinc-900">Mijn transcripten</h1>
        <a
          href="/dashboard/opnemen"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Nieuw transcript
        </a>
      </div>
      <TranscriptList initialItems={items} />
    </div>
  );
}
