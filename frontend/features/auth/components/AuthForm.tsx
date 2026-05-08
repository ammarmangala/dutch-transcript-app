"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppIcon } from "@/components/app/AppIcon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

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

export default function AuthForm({
  mode,
}: Readonly<{
  mode: Mode;
}>) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    if (mode === "login") {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (authError) {
        setError(translateError(authError.message));
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } else {
      const { data, error: authError } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (authError) {
        setError(translateError(authError.message));
        return;
      }

      if (data.session) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setEmailSent(true);
      }
    }
  }

  if (emailSent) {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="mb-2 flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <AppIcon name="mail" size={18} />
          </div>
          <CardTitle>Controleer je inbox</CardTitle>
          <CardDescription>
            We hebben een bevestigingslink gestuurd naar{" "}
            <span className="font-medium text-foreground">{email}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border bg-muted/35 p-3 text-xs leading-5 text-muted-foreground">
            Gebruik dezelfde mail om later weer in te loggen.
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => setEmailSent(false)} type="button" variant="outline">
            Geen mail ontvangen? Probeer opnieuw
          </Button>
        </CardFooter>
      </Card>
    );
  }

  let submitLabel = "Account aanmaken";
  if (loading) {
    submitLabel = "Even geduld...";
  } else if (mode === "login") {
    submitLabel = "Inloggen";
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="mb-2 flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <AppIcon name={mode === "login" ? "login" : "signup"} size={18} />
        </div>
        <CardTitle>{mode === "login" ? "Welkom terug" : "Account aanmaken"}</CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Log in om je transcripten te bekijken."
            : "Maak een gratis account aan om te beginnen."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-xs font-medium" htmlFor="email">
              E-mailadres
            </label>
            <div className="relative">
              <AppIcon
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                name="mail"
              />
              <Input
                autoComplete="email"
                className="h-9 pl-8"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jij@voorbeeld.nl"
                required
                type="email"
                value={email}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium" htmlFor="password">
              Wachtwoord
            </label>
            <div className="relative">
              <AppIcon
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                name="lock"
              />
              <Input
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className="h-9 pl-8"
                id="password"
                minLength={6}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "signup" ? "Minimaal 6 tekens" : "********"}
                required
                type="password"
                value={password}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs leading-5 text-destructive">
              {error}
            </div>
          )}

          <Button className="h-9 w-full" disabled={loading} type="submit">
            {submitLabel}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t border-border">
        <p className="text-center text-xs text-muted-foreground">
          {mode === "login" ? (
            <>
              Nog geen account?{" "}
              <Link className="font-medium text-primary underline-offset-4 hover:underline" href="/signup">
                Aanmelden
              </Link>
            </>
          ) : (
            <>
              Al een account?{" "}
              <Link className="font-medium text-primary underline-offset-4 hover:underline" href="/login">
                Inloggen
              </Link>
            </>
          )}
        </p>
      </CardFooter>
    </Card>
  );
}
