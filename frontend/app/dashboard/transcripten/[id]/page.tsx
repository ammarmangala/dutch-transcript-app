export default function TranscriptDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h1 className="text-xl font-semibold text-zinc-900">Transcript</h1>
      <p className="mt-2 text-sm text-zinc-400">id: {params.id}</p>
    </div>
  );
}
