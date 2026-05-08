"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Mode = "login" | "signup";

function translateError(msg: string): string {
  if (msg.includes("Invalid login credentials")) return "E-mailadres of wachtwoord klopt niet.";
  if (msg.includes("Email not confirmed")) return "Bevestig eerst je e-mailadres via de link in je inbox.";
  if (msg.includes("User already registered")) return "Er bestaat al een account met dit e-mailadres.";
  if (msg.includes("Password should be at least")) return "Wachtwoord moet minimaal 6 tekens bevatten.";
  if (msg.includes("Unable to validate email")) return "Ongeldig e-mailadres.";
  if (msg.includes("rate limit")) return "Te veel pogingen. Wacht even en probeer opnieuw.";
  return "Er ging iets mis. Probeer het opnieuw.";
}

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    if (mode === "login") {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (authError) { setError(translateError(authError.message)); return; }
      router.push("/dashboard");
      router.refresh();
    } else {
      const { data, error: authError } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (authError) { setError(translateError(authError.message)); return; }

      // Supabase stuurt een bevestigingsmail als e-mailverificatie aan staat.
      // In dat geval is data.session null maar data.user aanwezig.
      if (data.session) {
        // Verificatie uitgeschakeld — direct ingelogd
        router.push("/dashboard");
        router.refresh();
      } else {
        setEmailSent(true);
      }
    }
  }

  if (emailSent) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-zinc-900">Controleer je inbox</h1>
        <p className="text-sm text-zinc-500">
          We hebben een bevestigingslink gestuurd naar{" "}
          <span className="font-medium text-zinc-800">{email}</span>.<br />
          Klik op de link om je account te activeren.
        </p>
        <p className="text-xs text-zinc-400">
          Geen mail ontvangen?{" "}
          <button
            onClick={() => setEmailSent(false)}
            className="underline hover:text-zinc-600"
          >
            Probeer opnieuw
          </button>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-zinc-900">
        {mode === "login" ? "Inloggen" : "Account aanmaken"}
      </h1>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-zinc-700">
          E-mailadres
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium text-zinc-700">
          Wachtwoord
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
        />
        {mode === "signup" && (
          <p className="text-xs text-zinc-400">Minimaal 6 tekens</p>
        )}
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
      >
        {loading
          ? "Even geduld…"
          : mode === "login"
            ? "Inloggen"
            : "Account aanmaken"}
      </button>

      <p className="text-center text-sm text-zinc-500">
        {mode === "login" ? (
          <>
            Nog geen account?{" "}
            <a href="/signup" className="font-medium text-zinc-900 underline">
              Aanmelden
            </a>
          </>
        ) : (
          <>
            Al een account?{" "}
            <a href="/login" className="font-medium text-zinc-900 underline">
              Inloggen
            </a>
          </>
        )}
      </p>
    </form>
  );
}
