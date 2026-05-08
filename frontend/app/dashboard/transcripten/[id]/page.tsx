import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TranscriptDetail from "@/features/geschiedenis/components/TranscriptDetail";
import type { Transcript } from "@/lib/types";

export default async function TranscriptDetailPage({
  params,
}: Readonly<{
  params: { id: string };
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("transcripts")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user!.id)
    .single();

  if (error || !data) notFound();

  return <TranscriptDetail transcript={data as Transcript} />;
}
