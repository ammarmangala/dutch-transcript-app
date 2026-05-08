import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TranscriptDetail from "@/features/geschiedenis/components/TranscriptDetail";
import type { Transcript } from "@/lib/types";
import { redirect } from "next/navigation";

export default async function TranscriptDetailPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("transcripts")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) notFound();

  return <TranscriptDetail transcript={data as Transcript} />;
}
