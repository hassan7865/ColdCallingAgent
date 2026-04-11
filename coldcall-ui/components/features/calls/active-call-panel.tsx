"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export function ActiveCallPanel() {
  return (
    <div className="grid h-full min-h-0 min-w-0 w-full grid-rows-[auto_minmax(0,1fr)] gap-6 sm:gap-8">
      <div className="min-w-0">
        <div className="relative overflow-hidden rounded-2xl border-0 bg-surface-container-low/40 p-5 shadow-xl shadow-black/15 sm:p-7">
          <div className="pointer-events-none absolute -left-16 top-0 h-48 w-48 rounded-full bg-primary/10 blur-[90px]" />
          <div className="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-secondary/10 blur-[90px]" />
          <div className="relative flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/35 bg-primary/10 text-[10px] uppercase tracking-widest text-primary">Call log</Badge>
              <span className="text-[10px] font-medium uppercase tracking-widest text-on-surface-variant">Live session</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">Live conversation workspace</h1>
            <p className="max-w-2xl text-sm text-on-surface-variant">Capture call outcome and notes with fewer context switches while the line is active.</p>
          </div>
        </div>
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col border-t border-outline-variant/15 pt-5 text-on-surface sm:pt-6">
        <div
          className="custom-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain pb-1 [scrollbar-gutter:stable]"
          role="region"
          aria-label="Live call workspace"
        >
              <div className="space-y-6 p-1 sm:space-y-8 sm:p-2">
      <Card className="relative grid w-full grid-cols-1 overflow-hidden rounded-xl border-0 bg-surface-container lg:grid-cols-12">
        <CardContent className="col-span-7 flex flex-col p-6 sm:p-8 lg:p-10">
          <div className="mb-7 flex justify-center">
            <div className="relative flex items-center justify-center">
              <div className="pulse-ring absolute size-14 rounded-full bg-primary/20" />
              <div className="size-4 rounded-full bg-primary shadow-[0_0_15px_var(--primary)]" />
            </div>
          </div>

          <div className="mb-10 space-y-2 text-center">
            <Badge variant="outline" className="border-primary/30 bg-primary/5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Live call</Badge>
            <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl md:text-4xl">Karri Saarinen</h2>
            <p className="text-base font-medium text-on-surface-variant sm:text-lg">Linear</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-outline-variant/20 bg-surface-container-low px-4 py-1.5">
              <span className="material-symbols-outlined text-sm text-primary">schedule</span>
              <span className="font-mono text-lg text-on-surface">00:02:34</span>
            </div>
          </div>

          <div className="mt-auto flex flex-wrap items-center justify-center gap-3 pt-8 sm:gap-4">
            <Button size="icon" variant="secondary" className="size-12 rounded-full border border-outline-variant/25 bg-surface-container-highest sm:size-14">
              <span className="material-symbols-outlined">mic_off</span>
            </Button>
            <Button size="icon" variant="secondary" className="size-12 rounded-full border border-outline-variant/25 bg-surface-container-highest sm:size-14">
              <span className="material-symbols-outlined">pause</span>
            </Button>
            <Button size="icon" variant="secondary" className="size-12 rounded-full border border-outline-variant/25 bg-surface-container-highest sm:size-14">
              <span className="material-symbols-outlined">edit_note</span>
            </Button>
            <Separator orientation="vertical" className="mx-1 hidden h-10 bg-outline-variant/30 sm:block" />
            <Separator orientation="horizontal" className="my-1 w-full bg-outline-variant/30 sm:hidden" />
            <Button className="h-12 w-full gap-2 rounded-xl bg-error-container px-6 font-semibold text-on-error-container hover:brightness-110 sm:h-14 sm:w-auto sm:px-8">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                call_end
              </span>
              End call
            </Button>
          </div>
        </CardContent>

        <CardContent className="col-span-5 flex flex-col gap-6 bg-surface-container-low p-6 sm:p-8">
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-on-surface-variant">
              <span className="size-1.5 rounded-full bg-primary" />
              Live script tracking
            </h3>
            <Tabs defaultValue="intro" className="w-full">
              <TabsList className="mb-4 h-auto w-full flex-wrap justify-start gap-1 rounded-xl border-0 bg-surface-container p-1">
                <TabsTrigger value="intro" className="text-xs">Introduction</TabsTrigger>
                <TabsTrigger value="value" className="text-xs">Value prop</TabsTrigger>
                <TabsTrigger value="objections" className="text-xs">Objections</TabsTrigger>
              </TabsList>
              <TabsContent value="intro" className="mt-0 space-y-4">
                <div className="rounded-xl border border-primary/30 bg-surface-container p-4">
                  <Badge className="mb-2 bg-primary/15 text-[10px] font-bold uppercase tracking-wider text-primary">Current</Badge>
                  <p className="italic leading-relaxed text-on-surface">
                    &quot;Hi Karri, I&apos;m calling because I noticed Linear is scaling sales ops. I wanted to share how our
                    agent helps teams like yours...&quot;
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="value" className="mt-0 rounded-xl border-0 bg-surface-container p-4">
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Value proposition</p>
                <p className="leading-relaxed text-on-surface-variant">Discuss the 30% reduction in call latency and AI-driven prospect qualification.</p>
              </TabsContent>
              <TabsContent value="objections" className="mt-0 rounded-xl border-0 bg-surface-container p-4">
                <p className="text-sm text-on-surface-variant">Use quick-fire buttons below for common objections.</p>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <h3 className="mb-3 text-xs uppercase tracking-[0.12em] text-on-surface-variant">Objection quick-fire</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {["Too Busy", "Not Interested", "Send Info", "Call Later"].map((item) => (
                <Button key={item} variant="secondary" className="rounded-xl border border-outline-variant/25 bg-surface-container-highest py-2.5 text-xs font-semibold hover:bg-primary hover:text-on-primary">
                  {item}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-auto rounded-xl border-0 bg-surface-container p-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-10 border border-outline-variant/25">
                <AvatarImage
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB22HFIya-5_guCz6sZO_YH_G1lgu13O6rn3gcOO3puFRT9a1U48ADyvThwiReASZEoTbbGr3Ynkc_F4N1j3AAmFxExRJbKXAPbLF7E5fogUWimvYIxKQZWs-kQpYCVeWc9cTdMkJYs9b83dOo2OR_YpO1yOIhGMuKzjRj0GXSghn3xbd-ZHnYEmx8XWKSY61LKh8qvB46gjxGWqt1BvxADXNHtaluUnrTct5dZ9SwVO_YMjyQzPEOSI62XGKerxIbwydvaHRVpTUPE"
                  alt="Company logo"
                />
                <AvatarFallback className="bg-surface-container-high text-xs">LI</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-bold text-on-surface">Linear Inc.</p>
                <p className="text-xs text-on-surface-variant">Last touch: 2 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative w-full overflow-hidden rounded-2xl border-0 bg-surface-container-highest/75 py-6 shadow-xl backdrop-blur-xl sm:py-7">
        <Badge className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-primary-container px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-on-primary-container sm:right-4 sm:top-4 sm:px-2.5 sm:py-1 sm:text-[10px]">
          <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
          AI pre-filled
        </Badge>
        <CardHeader className="space-y-1 px-5 pb-4 pt-0 sm:px-7">
          <CardTitle className="text-base font-bold sm:text-lg">Call summary</CardTitle>
          <p className="text-xs text-on-surface-variant">Confirm outcome and commit notes to timeline.</p>
        </CardHeader>
        <CardContent className="space-y-5 px-5 pb-6 pt-0 sm:px-7 sm:pb-7">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Outcome</Label>
              <Select defaultValue="meeting_scheduled">
                <SelectTrigger className="h-10 border border-outline-variant/25 bg-surface-container-low text-on-surface">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting_scheduled">Meeting scheduled</SelectItem>
                  <SelectItem value="follow_up">Follow-up required</SelectItem>
                  <SelectItem value="wrong_poc">Wrong point of contact</SelectItem>
                  <SelectItem value="not_fit">Not a fit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Next step</Label>
              <Input className="h-10 border border-outline-variant/25 bg-surface-container-low" defaultValue="Send calendar invite" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Notes</Label>
            <Textarea
              className="min-h-[96px] border border-outline-variant/25 bg-surface-container-low text-sm text-on-surface"
              defaultValue="Karri was interested in performance metrics for high-volume enterprise accounts. Scheduling a demo for Thursday morning to dive deeper into API integrations."
            />
          </div>
          <div className="flex justify-stretch pt-1 sm:justify-end">
            <Button className="w-full rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-on-primary shadow-lg shadow-primary/20 sm:w-auto">Submit &amp; log call</Button>
          </div>
        </CardContent>
      </Card>
              </div>
        </div>
      </div>
    </div>
  );
}
