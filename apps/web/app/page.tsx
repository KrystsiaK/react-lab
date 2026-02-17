"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { AuthResponse } from "@diary/shared";
import { apiRequest } from "@/lib/api";

type AuthMode = "login" | "register";

export default function HomePage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const feedUrl = useMemo(() => process.env.NEXT_PUBLIC_FEED_APP_URL ?? "http://localhost:3002", []);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const path = mode === "login" ? "/auth/login" : "/auth/register";
      const payload = mode === "login" ? { email, password } : { email, password, name };

      const result = await apiRequest<AuthResponse>(path, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      localStorage.setItem("token", result.accessToken);
      localStorage.setItem("userName", result.user.name);
      setMessage(`Успех. Привет, ${result.user.name}. Переходи в Dashboard.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Auth error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 p-6 md:p-10">
      <header className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-bold">Diary Lab</h1>
        <p className="mt-2 text-slate-600">
          Fullstack демо: Next.js + NestJS + PostgreSQL + microfrontend (отдельный feed-app).
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => setMode("login")}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                mode === "login" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode("register")}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                mode === "register" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            {mode === "register" && (
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-slate-400"
                placeholder="Name"
                required
              />
            )}
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-slate-400"
              placeholder="Email"
              required
            />
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-slate-400"
              placeholder="Password (min 6)"
              required
            />
            <button
              disabled={loading}
              className="w-full rounded-lg bg-slate-900 px-4 py-2 font-medium text-white disabled:opacity-60"
            >
              {loading ? "Loading..." : mode === "login" ? "Login" : "Create account"}
            </button>
          </form>

          {message && <p className="mt-4 rounded-lg bg-slate-100 p-3 text-sm">{message}</p>}

          <Link href="/dashboard" className="mt-4 inline-block text-sm font-medium text-slate-800 underline">
            Перейти в Dashboard
          </Link>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Microfrontend: Public Feed</h2>
            <a href={feedUrl} target="_blank" rel="noreferrer" className="text-sm text-slate-700 underline">
              Открыть отдельно
            </a>
          </div>
          <iframe title="Public Feed" src={feedUrl} className="h-[520px] w-full rounded-xl border border-slate-200" />
        </div>
      </section>
    </main>
  );
}
