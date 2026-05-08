"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Toggle } from "@/components/ui/toggle";
import { AppIcon } from "@/components/app/AppIcon";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme !== "light" : true;

  return (
    <Toggle
      aria-label={isDark ? "Schakel naar licht thema" : "Schakel naar donker thema"}
      className={cn("border border-border bg-card/80", className)}
      onPressedChange={() => setTheme(isDark ? "light" : "dark")}
      pressed={isDark}
      size="lg"
      variant="outline"
    >
      <AppIcon name={isDark ? "moon" : "sun"} size={16} />
    </Toggle>
  );
}
