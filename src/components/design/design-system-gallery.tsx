"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const brand = [
  {
    token: "--brand-plum / --primary",
    hex: "#44376d",
    label: "Plum · primary chrome",
  },
  {
    token: "--brand-sky / --accent",
    hex: "#a7c8f9",
    label: "Sky · highlights",
  },
  {
    token: "--canvas / --background",
    hex: "#f9f1ed",
    label: "Canvas · backdrop",
    borderClass: "border border-border",
  },
];

export function DesignSystemGallery() {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-[var(--canvas)] text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">
        <div className="mb-8 md:mb-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Flint Phase 1
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Design system elements
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Palette, typography, and UI primitives aligned with the recruiter workspace shell.
          </p>
        </div>

        <Tabs defaultValue="foundations">
          <TabsList className="mb-8 flex flex-wrap rounded-xl bg-muted/80 p-1">
            <TabsTrigger value="foundations" className="rounded-lg">
              Foundations
            </TabsTrigger>
            <TabsTrigger value="components" className="rounded-lg">
              Components
            </TabsTrigger>
            <TabsTrigger value="surfaces" className="rounded-lg">
              Surfaces
            </TabsTrigger>
          </TabsList>

          <TabsContent value="foundations" className="space-y-8">
            <section>
              <h2 className="text-base font-semibold">Brand literal colors</h2>
              <p className="mt-1 max-w-prose text-sm text-muted-foreground">
                Mapped to CSS tokens in{" "}
                <code className="font-mono text-xs">globals.css</code>. Surrounding neutrals
                derive from recruiter readability goals on the canvas.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {brand.map((c) => (
                  <Card
                    key={c.hex}
                    className="overflow-hidden border-border p-0 shadow-sm"
                  >
                    <div
                      className={`h-28 w-full ${c.borderClass ?? ""}`}
                      style={{ backgroundColor: c.hex }}
                    />
                    <div className="space-y-2 p-4 text-sm">
                      <p className="font-semibold">{c.label}</p>
                      <code className="block font-mono text-xs text-muted-foreground">
                        {c.hex}
                      </code>
                      <p className="text-xs text-muted-foreground">{c.token}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-base font-semibold">Semantic pairings</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <Card className="border-border p-6">
                  <div className="rounded-xl bg-popover px-4 py-3 text-popover-foreground shadow-sm">
                    <p className="text-sm font-semibold">Popover foreground</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Used for overlays and ephemeral panels.
                    </p>
                  </div>
                  <Separator className="my-6" />
                  <div className="rounded-xl border border-primary/40 bg-secondary px-4 py-3 text-secondary-foreground">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Secondary pairing
                    </p>
                    <p className="mt-3 text-lg font-semibold">Secondary surface</p>
                  </div>
                </Card>
                <Card className="border-border bg-gradient-to-br from-accent/40 via-card to-card p-6">
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="text-sm font-semibold text-foreground">Card</h3>
                    <p className="mt-3 text-xs leading-snug text-muted-foreground">
                      Default conversation + composer surfaces reuse this treatment with{" "}
                      <code className="font-mono text-[11px]">rounded-xl+</code> geometry.
                    </p>
                  </div>
                  <Badge className="mt-4 rounded-full">Accent wash</Badge>
                </Card>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-base font-semibold">Typography</h2>
              <Card className="mt-4 border-border p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">Display-ish</p>
                    <p className="font-sans text-3xl font-semibold tracking-tight">
                      Nurses deserve calm tooling
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">Body</p>
                    <p className="text-base leading-relaxed text-muted-foreground">
                      DM Sans is loaded at 400–700 with antialiased rasterization. Supporting
                      text uses <span className="font-medium text-foreground">semi-bold emphasis</span>{" "}
                      instead of microscopic weights so dense timelines stay readable.
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">Monospace</p>
                    <code className="block rounded-xl bg-muted px-3 py-2 font-mono text-sm">
                      /api/recruiter-assist • POST • mock: true
                    </code>
                  </div>
                </div>
              </Card>
            </section>
          </TabsContent>

          <TabsContent value="components">
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-semibold">Buttons</h2>
                <Card className="mt-4 border-border p-6">
                  <div className="flex flex-wrap gap-3">
                    <Button size="sm" className="rounded-xl">
                      Primary send
                    </Button>
                    <Button size="sm" variant="secondary" className="rounded-xl">
                      Secondary outline
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-xl">
                      Ghost bordered
                    </Button>
                    <Button size="sm" variant="ghost" className="rounded-xl">
                      Ghost naked
                    </Button>
                  </div>
                </Card>
              </div>
              <div>
                <h2 className="text-base font-semibold">Badges + tooltip</h2>
                <Card className="mt-4 flex flex-wrap items-center gap-3 border-border p-6">
                  <Badge>New</Badge>
                  <Badge variant="secondary">Active</Badge>
                  <Badge variant="outline">Waiting</Badge>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" className="rounded-xl">
                        Hover me
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Radix-backed tooltip cue</TooltipContent>
                  </Tooltip>
                </Card>
              </div>
              <div>
                <h2 className="text-base font-semibold">Inputs</h2>
                <Card className="mt-4 space-y-3 border-border p-6">
                  <Input className="rounded-xl" placeholder="Search candidates..." />
                  <Textarea rows={3} className="rounded-xl" placeholder="Compose SMS…" />
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="surfaces">
            <Card className="border-border p-8 shadow-md">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Shell preview
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-[1fr_minmax(0,1.35fr)]">
                <aside className="rounded-3xl bg-sidebar px-5 py-4 text-sidebar-foreground shadow-inner">
                  <p className="text-xs uppercase text-muted-foreground">Sidebar</p>
                  <div className="mt-6 space-y-3">
                    {[1, 2, 3].map((n) => (
                      <div
                        key={`row-${String(n)}`}
                        className="rounded-2xl bg-sidebar-accent/80 px-3 py-3 text-xs"
                      >
                        Candidate row skeleton {n}
                      </div>
                    ))}
                  </div>
                </aside>
                <div className="space-y-3 rounded-[2rem] border border-border bg-card p-5">
                  <p className="text-sm font-semibold">Main pane</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Candidate-first layout keeps profile + mocked AI tooling above chronology —
                    echoes the recruiter shell without loading live PHI.
                  </p>
                  <Separator />
                  <Button size="sm" className="rounded-xl">
                    Open timeline
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="mt-12 max-w-prose text-center text-xs leading-relaxed text-muted-foreground md:text-left">
          This page is deliberately static/lightweight — it complements the richer README prose and
          production routes at <Link className="font-medium underline" href="/candidates">
            /candidates
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
