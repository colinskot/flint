"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
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
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BrandSwatch {
  token: string;
  hex: string;
  label: string;
  borderClass?: string;
}

const brand: BrandSwatch[] = [
  {
    token: "--brand-plum → --primary",
    hex: "#44376d",
    label: "Plum · primary chrome",
  },
  {
    token: "--brand-sky → --accent",
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

const chartTokens = [
  { token: "--chart-1", label: "Primary series" },
  { token: "--chart-2", label: "Accent series" },
  { token: "--chart-3", label: "Muted plum" },
  { token: "--chart-4", label: "Light sky" },
  { token: "--chart-5", label: "Foreground ink" },
] as const;

const semanticSwatches = [
  {
    token: "--destructive",
    label: "Destructive",
    style: { backgroundColor: "var(--destructive)" } as CSSProperties,
    fgClass: "text-white",
  },
  {
    token: "--muted",
    label: "Muted surface",
    style: { backgroundColor: "var(--muted)" } as CSSProperties,
    fgClass: "text-muted-foreground",
  },
  {
    token: "--border / --input",
    label: "Border & input",
    style: {
      backgroundColor: "var(--border)",
    } as CSSProperties,
    fgClass: "text-foreground",
  },
  {
    token: "--ring",
    label: "Focus ring",
    style: {
      backgroundColor: "var(--ring)",
    } as CSSProperties,
    fgClass: "text-primary-foreground",
  },
] as const;

const uiPrimitives = [
  "avatar.tsx",
  "badge.tsx",
  "button.tsx",
  "card.tsx",
  "dialog.tsx",
  "dropdown-menu.tsx",
  "input.tsx",
  "label.tsx",
  "popover.tsx",
  "radio-group.tsx",
  "scroll-area.tsx",
  "select.tsx",
  "separator.tsx",
  "sheet.tsx",
  "sonner.tsx",
  "tabs.tsx",
  "textarea.tsx",
  "tooltip.tsx",
] as const;

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
            Palette, typography, shadcn/Radix primitives, and shell surfaces aligned with the
            recruiter workspace. Tokens live in{" "}
            <code className="font-mono text-xs">globals.css</code>; components in{" "}
            <code className="font-mono text-xs">src/components/ui/</code>.
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
                Mapped to CSS variables in{" "}
                <code className="font-mono text-xs">globals.css</code>. Neutrals support dense
                recruiter timelines on the canvas.
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
              <h2 className="text-base font-semibold">Semantic & chart tokens</h2>
              <p className="mt-1 max-w-prose text-sm text-muted-foreground">
                Supporting roles for forms, focus states, and future charts (
                <code className="font-mono text-xs">--chart-1</code> …{" "}
                <code className="font-mono text-xs">--chart-5</code>).
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {semanticSwatches.map((s) => (
                  <Card key={s.token} className="overflow-hidden border-border p-0 shadow-sm">
                    <div
                      className={`flex h-24 items-end p-3 text-xs font-medium ${s.fgClass}`}
                      style={s.style}
                    >
                      {s.label}
                    </div>
                    <div className="p-3">
                      <code className="font-mono text-[11px] text-muted-foreground">
                        {s.token}
                      </code>
                    </div>
                  </Card>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {chartTokens.map((c, i) => (
                  <div
                    key={c.token}
                    className="flex min-w-[8.5rem] flex-1 flex-col rounded-xl border border-border bg-card p-3 shadow-sm"
                  >
                    <div
                      className="mb-2 h-10 w-full rounded-lg border border-border/60"
                      style={{
                        backgroundColor: `var(--chart-${String(i + 1)})`,
                      }}
                    />
                    <p className="text-xs font-medium">{c.label}</p>
                    <code className="mt-1 font-mono text-[10px] text-muted-foreground">
                      {c.token}
                    </code>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-base font-semibold">Radius & UI inventory</h2>
              <Card className="mt-4 border-border p-6">
                <p className="text-sm text-muted-foreground">
                  Base radius is <code className="font-mono text-xs">--radius: 1rem</code>{" "}
                  (<code className="font-mono text-xs">rounded-lg</code> on buttons/triggers). Larger
                  shells use <code className="font-mono text-xs">rounded-xl</code> /{" "}
                  <code className="font-mono text-xs">rounded-3xl</code> where specified.
                </p>
                <Separator className="my-4" />
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  src/components/ui
                </p>
                <ul className="mt-3 columns-2 gap-x-6 text-sm max-md:columns-1">
                  {uiPrimitives.map((f) => (
                    <li key={f} className="font-mono text-xs text-muted-foreground">
                      {f}
                    </li>
                  ))}
                </ul>
              </Card>
            </section>

            <Separator />

            <section>
              <h2 className="text-base font-semibold">Semantic pairings</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <Card className="border-border p-6">
                  <div className="rounded-xl bg-popover px-4 py-3 text-popover-foreground shadow-sm">
                    <p className="text-sm font-semibold">Popover foreground</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Used for overlays, selects, dropdowns, dialogs, and sheets.
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
                      Conversation and composer surfaces reuse this treatment with{" "}
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
                    <p className="text-xs uppercase text-muted-foreground">Sans & heading</p>
                    <p className="font-sans text-3xl font-semibold tracking-tight">
                      Nurses deserve calm tooling
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      DM Sans via <code className="font-mono">--font-dm-sans</code> (weights 400–700).
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">Body</p>
                    <p className="text-base leading-relaxed text-muted-foreground">
                      Default body uses medium weight with antialiasing. Supporting text uses{" "}
                      <span className="font-semibold text-foreground">semibold emphasis</span> so
                      dense timelines stay readable without hairline weights.
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">Monospace</p>
                    <code className="block rounded-xl bg-muted px-3 py-2 font-mono text-sm">
                      /api/recruiter-assist • POST • mock: true
                    </code>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Geist Mono via <code className="font-mono">--font-geist-mono</code>.
                    </p>
                  </div>
                </div>
              </Card>
            </section>
          </TabsContent>

          <TabsContent value="components">
            <div className="space-y-10">
              <section>
                <h2 className="text-base font-semibold">Buttons</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Variants and sizes from{" "}
                  <code className="font-mono text-xs">button.tsx</code> (shadcn radix-nova).
                </p>
                <Card className="mt-4 space-y-5 border-border p-6">
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                      Variants
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button size="sm" className="rounded-xl">
                        Primary
                      </Button>
                      <Button size="sm" variant="secondary" className="rounded-xl">
                        Secondary
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-xl">
                        Outline
                      </Button>
                      <Button size="sm" variant="ghost" className="rounded-xl">
                        Ghost
                      </Button>
                      <Button size="sm" variant="destructive" className="rounded-xl">
                        Destructive
                      </Button>
                      <Button size="sm" variant="link" className="rounded-xl px-1">
                        Link style
                      </Button>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                      Sizes
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button size="xs" className="rounded-lg">
                        XS
                      </Button>
                      <Button size="sm" className="rounded-lg">
                        SM
                      </Button>
                      <Button size="default" className="rounded-lg">
                        Default
                      </Button>
                      <Button size="lg" className="rounded-lg">
                        LG
                      </Button>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                      Icon buttons
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button size="icon-xs" variant="outline" aria-label="Add (xs)">
                        <PlusIcon />
                      </Button>
                      <Button size="icon-sm" variant="outline" aria-label="Add (sm)">
                        <PlusIcon />
                      </Button>
                      <Button size="icon" variant="outline" aria-label="Add (default)">
                        <PlusIcon />
                      </Button>
                      <Button size="icon-lg" variant="outline" aria-label="Add (lg)">
                        <PlusIcon />
                      </Button>
                    </div>
                  </div>
                </Card>
              </section>

              <section>
                <h2 className="text-base font-semibold">Badges</h2>
                <Card className="mt-4 flex flex-wrap gap-2 border-border p-6">
                  <Badge>New</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="ghost">Ghost</Badge>
                  <Badge variant="link" className="px-0">
                    Link
                  </Badge>
                </Card>
              </section>

              <section>
                <h2 className="text-base font-semibold">Avatar</h2>
                <Card className="mt-4 flex flex-wrap items-center gap-6 border-border p-6">
                  <div className="flex items-end gap-4">
                    <Avatar size="sm">
                      <AvatarFallback>SK</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarFallback>DM</AvatarFallback>
                    </Avatar>
                    <Avatar size="lg">
                      <AvatarFallback>LG</AvatarFallback>
                    </Avatar>
                  </div>
                  <AvatarGroup className="pt-1">
                    <Avatar>
                      <AvatarFallback className="text-xs">A</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarFallback className="text-xs">B</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarFallback className="text-xs">C</AvatarFallback>
                    </Avatar>
                    <AvatarGroupCount className="text-xs">+4</AvatarGroupCount>
                  </AvatarGroup>
                </Card>
              </section>

              <section>
                <h2 className="text-base font-semibold">Tooltip</h2>
                <Card className="mt-4 flex flex-wrap items-center gap-3 border-border p-6">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" className="rounded-xl">
                        Hover for tooltip
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Radix-backed tooltip (global provider)</TooltipContent>
                  </Tooltip>
                </Card>
              </section>

              <section>
                <h2 className="text-base font-semibold">Label & radio group</h2>
                <Card className="mt-4 border-border p-6">
                  <RadioGroup defaultValue="sms" className="max-w-xs gap-4">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="sms" id="ds-r-sms" />
                      <Label htmlFor="ds-r-sms">SMS</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="email" id="ds-r-email" />
                      <Label htmlFor="ds-r-email">Email</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="call" id="ds-r-call" />
                      <Label htmlFor="ds-r-call">Call log</Label>
                    </div>
                  </RadioGroup>
                </Card>
              </section>

              <section>
                <h2 className="text-base font-semibold">Select</h2>
                <Card className="mt-4 border-border p-6">
                  <Select defaultValue="active">
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="waiting">Waiting</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </Card>
              </section>

              <section>
                <h2 className="text-base font-semibold">Dropdown menu</h2>
                <Card className="mt-4 border-border p-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="rounded-xl">
                        Open menu
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-52">
                      <DropdownMenuLabel>Thread</DropdownMenuLabel>
                      <DropdownMenuItem>Copy link</DropdownMenuItem>
                      <DropdownMenuItem>Pin candidate</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">Archive</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Card>
              </section>

              <section>
                <h2 className="text-base font-semibold">Popover</h2>
                <Card className="mt-4 border-border p-6">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="rounded-xl">
                        Toggle popover
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start">
                      <p className="text-sm font-medium">Ephemeral panel</p>
                      <p className="mt-2 text-xs leading-snug text-muted-foreground">
                        Uses popover tokens with zoom/fade motion — same stack as menus and selects.
                      </p>
                    </PopoverContent>
                  </Popover>
                </Card>
              </section>

              <section>
                <h2 className="text-base font-semibold">Dialog</h2>
                <Card className="mt-4 border-border p-6">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="rounded-xl">
                        Open dialog
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm send</DialogTitle>
                        <DialogDescription>
                          Modal overlay pattern for blocking confirmations (mocked copy).
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" size="sm">
                          Cancel
                        </Button>
                        <Button size="sm">Send</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </Card>
              </section>

              <section>
                <h2 className="text-base font-semibold">Sheet</h2>
                <Card className="mt-4 border-border p-6">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="secondary" size="sm" className="rounded-xl">
                        Open sheet
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                      <SheetHeader>
                        <SheetTitle>Side panel</SheetTitle>
                        <SheetDescription>
                          Drawer-style surface for secondary tasks on narrow viewports or quick edits.
                        </SheetDescription>
                      </SheetHeader>
                    </SheetContent>
                  </Sheet>
                </Card>
              </section>

              <section>
                <h2 className="text-base font-semibold">Scroll area</h2>
                <Card className="mt-4 border-border p-6">
                  <ScrollArea className="h-36 w-full max-w-md rounded-xl border border-border">
                    <div className="space-y-3 p-4 pr-3">
                      {Array.from({ length: 12 }, (_, i) => (
                        <p key={`scroll-${String(i)}`} className="text-xs text-muted-foreground">
                          Timeline row {i + 1} — scrollable region with themed scrollbar thumb.
                        </p>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>
              </section>

              <section>
                <h2 className="text-base font-semibold">Inputs</h2>
                <Card className="mt-4 space-y-3 border-border p-6">
                  <Input className="rounded-xl" placeholder="Search candidates..." />
                  <Textarea rows={3} className="rounded-xl" placeholder="Compose SMS…" />
                </Card>
              </section>

              <section>
                <h2 className="text-base font-semibold">Toast (Sonner)</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  <code className="font-mono text-xs">Toaster</code> is mounted in{" "}
                  <code className="font-mono text-xs">AppProviders</code>; trigger with{" "}
                  <code className="font-mono text-xs">toast()</code> from{" "}
                  <code className="font-mono text-xs">sonner</code>.
                </p>
                <Card className="mt-4 border-border p-6">
                  <div className="flex flex-wrap gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl"
                      type="button"
                      onClick={() => toast.success("Message queued (demo)")}
                    >
                      Success toast
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl"
                      type="button"
                      onClick={() => toast.error("Something failed (demo)")}
                    >
                      Error toast
                    </Button>
                  </div>
                </Card>
              </section>
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
                    Candidate-first layout keeps profile and mocked AI tooling above chronology —
                    echoes the recruiter shell without loading live PHI.
                  </p>
                  <Separator />
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" className="rounded-xl">
                      Open timeline
                    </Button>
                    <Button size="sm" variant="destructive" className="rounded-xl">
                      Destructive action
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="mt-12 max-w-prose text-center text-xs leading-relaxed text-muted-foreground md:text-left">
          Static gallery for tokens and primitives — pair with production flows at{" "}
          <Link className="font-medium underline" href="/candidates">
            /candidates
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
