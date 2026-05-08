"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppIcon } from "@/components/app/AppIcon";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" as const },
  { label: "Nieuw transcript", href: "/dashboard/opnemen", icon: "mic" as const },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 flex-col border-r border-sidebar-border bg-sidebar p-4 text-sidebar-foreground md:flex">
      <div className="flex h-12 items-center gap-3 rounded-xl border border-sidebar-border bg-sidebar-accent px-3">
        <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <AppIcon name="wave" size={18} />
        </div>
        <div>
          <p className="text-sm font-medium leading-none">Transcribeer</p>
          <p className="mt-1 text-[0.7rem] text-muted-foreground">Dutch transcript app</p>
        </div>
      </div>

      <Separator className="my-4" />

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex h-9 items-center gap-2 rounded-md px-3 text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
              href={item.href}
              key={item.href}
            >
              <AppIcon name={item.icon} size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Separator className="my-4" />

      <form action="/api/auth/logout" method="POST">
        <Button
          className="w-full justify-start"
          size="lg"
          type="submit"
          variant="ghost"
        >
          <AppIcon name="logout" />
          Uitloggen
        </Button>
      </form>
    </aside>
  );
}
