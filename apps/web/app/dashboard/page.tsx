"use client";

import { useEffect, useState } from "react";
import type { EntryType, PublicEntry } from "@diary/shared";
import { apiRequest } from "@/lib/api";

const ENTRY_TYPES: EntryType[] = ["DIARY", "NOTE", "ARTICLE"];

type CreatePayload = {
  title: string;
  content: string;
  type: EntryType;
  isPublic: boolean;
};

export default function DashboardPage() {
  const [token, setToken] = useState("");
  const [entries, setEntries] = useState<PublicEntry[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<EntryType>("DIARY");
  const [isPublic, setIsPublic] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("token") ?? "";
    setToken(savedToken);
  }, []);

  useEffect(() => {
    if (!token) return;

    apiRequest<PublicEntry[]>("/entries/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(setEntries)
      .catch((error) => setMessage(error instanceof Error ? error.message : "Load error"));
  }, [token]);

  const submitEntry = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) {
      setMessage("Сначала войдите в систему на главной странице.");
      return;
    }

    try {
      const payload: CreatePayload = { title, content, type, isPublic };
      await apiRequest<PublicEntry>("/entries", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const updated = await apiRequest<PublicEntry[]>("/entries/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEntries(updated);
      setTitle("");
      setContent("");
      setType("DIARY");
      setIsPublic(false);
      setMessage("Запись создана.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Create error");
    }
  };

  const toggleVisibility = async (entry: PublicEntry) => {
    if (!token) return;

    try {
      await apiRequest<PublicEntry>(`/entries/${entry.id}/visibility`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isPublic: !entry.isPublic }),
      });

      const updated = await apiRequest<PublicEntry[]>("/entries/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries(updated);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Update error");
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-5xl space-y-6 p-6 md:p-10">
      <header className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-slate-600">Создавай личные записи и публикуй их в общий feed.</p>
      </header>

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-3 text-xl font-semibold">Новая запись</h2>
        <form onSubmit={submitEntry} className="space-y-3">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
            placeholder="Заголовок"
            required
          />
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="h-32 w-full rounded-lg border border-slate-200 px-3 py-2"
            placeholder="Текст"
            required
          />

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={type}
              onChange={(event) => setType(event.target.value as EntryType)}
              className="rounded-lg border border-slate-200 px-3 py-2"
            >
              {ENTRY_TYPES.map((entryType) => (
                <option key={entryType} value={entryType}>
                  {entryType}
                </option>
              ))}
            </select>

            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(event) => setIsPublic(event.target.checked)}
              />
              Публичная запись
            </label>
          </div>

          <button className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white">Сохранить</button>
        </form>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-3 text-xl font-semibold">Мои записи</h2>
        <div className="space-y-3">
          {entries.map((entry) => (
            <article key={entry.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold">{entry.title}</h3>
                <button
                  onClick={() => toggleVisibility(entry)}
                  className="rounded-md bg-slate-100 px-3 py-1 text-sm"
                >
                  {entry.isPublic ? "Снять с публикации" : "Опубликовать"}
                </button>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{entry.content}</p>
              <p className="mt-2 text-xs text-slate-500">
                {entry.type} • {new Date(entry.createdAt).toLocaleString()} • {entry.isPublic ? "public" : "private"}
              </p>
            </article>
          ))}
          {entries.length === 0 && <p className="text-sm text-slate-500">Записей пока нет.</p>}
        </div>
      </section>

      {message && <p className="rounded-lg bg-slate-100 p-3 text-sm">{message}</p>}
    </main>
  );
}
