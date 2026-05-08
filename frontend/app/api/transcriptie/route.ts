import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  // 1. Auth check via anon client (leest sessie uit cookie)
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  // 2. Parse multipart form — audio file + metadata
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const source = (formData.get("source") as string) || "upload";

  if (!file) {
    return NextResponse.json({ error: "Geen bestand ontvangen" }, { status: 400 });
  }

  // 3. Forward audio to FastAPI
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  const upstream = new FormData();
  upstream.append("file", file, file.name);

  let transcriptText: string;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120_000);

    const headers: Record<string, string> = {};
    if (process.env.FASTAPI_INTERNAL_TOKEN) {
      headers["x-internal-token"] = process.env.FASTAPI_INTERNAL_TOKEN;
    }

    const resp = await fetch(`${apiUrl}/transcribe`, {
      method: "POST",
      headers,
      body: upstream,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!resp.ok) {
      const detail = await resp.text();
      console.error("FastAPI fout:", resp.status, detail);
      return NextResponse.json(
        { error: "Transcriptie mislukt. Probeer het opnieuw." },
        { status: 502 },
      );
    }

    const json = await resp.json();
    transcriptText = json.text;
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    console.error(isTimeout ? "FastAPI timeout" : "FastAPI onbereikbaar:", err);
    return NextResponse.json(
      {
        error: isTimeout
          ? "Transcriptie duurde te lang. Probeer een kortere opname."
          : "Transcriptieservice onbereikbaar.",
      },
      { status: 502 },
    );
  }

  // 4. Save to Supabase via service client (bypast RLS, user_id handmatig meegeven)
  const serviceSupabase = await createServiceClient();
  const { data: transcript, error: dbError } = await serviceSupabase
    .from("transcripts")
    .insert({
      user_id: user.id,
      original_filename: file.name,
      content: transcriptText,
      source: source === "recording" ? "recording" : "upload",
      status: "completed",
    })
    .select("id, title, created_at")
    .single();

  if (dbError) {
    console.error("Supabase insert fout:", dbError);
    return NextResponse.json(
      { error: "Opslaan mislukt. Probeer het opnieuw." },
      { status: 500 },
    );
  }

  return NextResponse.json(transcript, { status: 201 });
}
