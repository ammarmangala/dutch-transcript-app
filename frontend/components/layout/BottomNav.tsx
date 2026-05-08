"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppIcon } from "@/components/app/AppIcon";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Transcripten", href: "/dashboard", icon: "dashboard" as const },
  { label: "Nieuw", href: "/dashboard/opnemen", icon: "mic" as const },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur md:hidden">
      <div className="grid grid-cols-2 p-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              className={cn(
                "flex h-11 flex-col items-center justify-center gap-1 rounded-md text-[0.7rem] transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              href={item.href}
              key={item.href}
            >
              <AppIcon name={item.icon} size={17} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
