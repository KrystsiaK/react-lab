import type { PublicEntry } from "@diary/shared";

const apiUrl = process.env.API_URL ?? "http://localhost:4000";

async function getEntries() {
  const response = await fetch(`${apiUrl}/entries/public`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to load public feed");
  }

  return (await response.json()) as PublicEntry[];
}

export default async function FeedPage() {
  const entries = await getEntries();

  return (
    <main className="min-h-screen bg-white p-4">
      <h1 className="mb-4 text-xl font-bold">Public Feed</h1>
      <div className="space-y-3">
        {entries.map((entry) => (
          <article key={entry.id} className="rounded-xl border border-slate-200 p-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-semibold">{entry.title}</h2>
              <span className="rounded bg-slate-100 px-2 py-1 text-xs">{entry.type}</span>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{entry.content}</p>
            <p className="mt-2 text-xs text-slate-500">
              by {entry.author.name} • {new Date(entry.createdAt).toLocaleString()}
            </p>
          </article>
        ))}
        {entries.length === 0 && <p className="text-sm text-slate-500">Пока нет опубликованных записей.</p>}
      </div>
    </main>
  );
}
