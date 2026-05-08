import Link from "next/link";
import { AppIcon } from "@/components/app/AppIcon";
import { ThemeToggle } from "@/components/app/ThemeToggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TopAppBar() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground md:hidden">
          <AppIcon name="wave" size={17} />
        </div>
        <div>
          <p className="text-sm font-medium leading-none">Transcribeer</p>
          <p className="mt-1 hidden text-[0.7rem] text-muted-foreground sm:block">
            Audio naar tekst
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link
          className={cn(buttonVariants({ size: "lg" }), "hidden md:inline-flex")}
          href="/dashboard/opnemen"
        >
          <AppIcon name="add" />
          Nieuw transcript
        </Link>
      </div>
    </header>
  );
}
