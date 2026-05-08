export interface TranscriptSummary {
  id: string;
  title: string;
  original_filename: string;
  source: "recording" | "upload";
  status: "processing" | "completed" | "failed";
  created_at: string;
  duration_seconds: number | null;
}

export interface Transcript extends TranscriptSummary {
  content: string;
  language: string;
  model: string;
  updated_at: string;
  error_message: string | null;
}
