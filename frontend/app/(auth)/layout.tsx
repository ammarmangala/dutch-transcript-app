import { AppIcon } from "@/components/app/AppIcon";
import { ThemeToggle } from "@/components/app/ThemeToggle";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const highlights = [
  {
    icon: "mic" as const,
    title: "Opnemen",
    description: "Neem audio op en laat de app het transcript maken.",
  },
  {
    icon: "upload" as const,
    title: "Uploaden",
    description: "Gebruik bestaande audio zonder extra stappen.",
  },
  {
    icon: "wave" as const,
    title: "Overzicht",
    description: "Bewaar transcripten in een rustige werkomgeving.",
  },
];

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>

        <div className="grid flex-1 items-center gap-6 py-8 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="hidden min-h-[34rem] justify-between border-border bg-card/90 lg:flex">
            <CardContent className="flex flex-1 flex-col justify-between gap-10 p-8">
              <div className="space-y-10">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <AppIcon name="wave" size={22} />
                  </div>
                  <div>
                    <p className="text-base font-medium leading-none">
                      Transcribeer
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Nederlandse audio naar tekst
                    </p>
                  </div>
                </div>

                <div className="max-w-xl space-y-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                    Werkruimte
                  </p>
                  <h1 className="text-4xl font-semibold tracking-tight text-foreground">
                    Leg gesprekken vast zonder visuele ruis.
                  </h1>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Dezelfde transcriptieflow, opnieuw opgebouwd met de donkere
                    shadcn preset.
                  </p>
                </div>

                <Separator />

                <div className="grid gap-3 sm:grid-cols-3">
                  {highlights.map((item) => (
                    <div
                      className="rounded-lg border border-border bg-muted/35 p-4"
                      key={item.title}
                    >
                      <AppIcon
                        className="text-primary"
                        name={item.icon}
                        size={20}
                      />
                      <p className="mt-4 text-sm font-medium">{item.title}</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-border bg-muted/35 px-4 py-3">
                <p className="text-sm font-medium">
                  Light mode blijft beschikbaar.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  De app start standaard donker en onthoudt je keuze.
                </p>
              </div>
            </CardContent>
          </Card>

          <section className="mx-auto w-full max-w-md">{children}</section>
        </div>
      </div>
    </div>
  );
}
