"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { authKeys } from "@/lib/query-keys";
import { authApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bolt, Gauge, Sparkles, Activity } from "lucide-react";

function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center px-6 md:px-12 lg:px-24 overflow-hidden pt-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[120%] h-full opacity-[0.08]">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="absolute -left-[30%] -top-[20%] h-[600px] w-[600px] rounded-full bg-primary/[0.15] blur-[120px]" />
        <div className="absolute right-[10%] top-[40%] h-[300px] w-[300px] rounded-full bg-secondary/[0.08] blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-outline-variant/30 bg-surface-container/50">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-primary">Status: Terminal Active</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-on-surface leading-[1.1] tracking-tight mb-6">
          The <span className="text-primary drop-shadow-[0_0_12px_rgba(78,222,163,0.5)]">Kinetic Terminal</span> for Sales Velocity.
        </h1>

        <p className="text-lg md:text-xl text-on-surface-variant font-light mb-10 max-w-2xl leading-relaxed">
          High-density automation for precision-focused revenue teams. Control the flow of every conversation with millisecond latency.
        </p>

        <div className="flex flex-wrap gap-4">
          <Button
            size="lg"
            className="h-12 px-8 rounded-xl bg-gradient-to-b from-primary to-primary-container text-on-primary-container text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(78,222,163,0.25)] hover:brightness-110 active:scale-95 transition-all"
            asChild
          >
            <Link href="/login">Initialize Terminal</Link>
          </Button>
        </div>
      </div>

      <div className="mt-16 lg:mt-24 relative w-full rounded-xl border border-outline-variant/20 bg-surface-container overflow-hidden shadow-2xl">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-high border-b border-outline-variant/15">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-error/80"></div>
            <div className="w-3 h-3 rounded-full bg-tertiary/80"></div>
            <div className="w-3 h-3 rounded-full bg-primary/80"></div>
          </div>
          <div className="ml-4 text-[10px] font-mono text-on-surface-variant uppercase tracking-widest">Call_Telemetry_v4.0.2</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[400px]">
          <div className="col-span-1 md:col-span-3 border-b md:border-b-0 md:border-r border-outline-variant/15 p-6 bg-surface-container-low">
            <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-6">Active Queue</div>
            <div className="space-y-3">
              <div className="p-3 bg-surface-container rounded-lg border-l-2 border-primary">
                <div className="text-sm font-semibold">Jonathan Vance</div>
                <div className="text-xs text-on-surface-variant">Global Logistics Hub</div>
              </div>
              <div className="p-3 bg-surface-container-low/30 rounded-lg opacity-60">
                <div className="text-sm font-semibold">Sarah Miller</div>
                <div className="text-xs text-on-surface-variant">TechFlow Systems</div>
              </div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-6 p-8 relative">
            <div className="absolute top-6 right-6">
              <div className="flex items-center gap-2 text-primary">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-xs font-mono">00:42:12</span>
              </div>
            </div>

            <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">AI SCRIPT ENGINE</div>

            <div className="text-xl font-medium leading-relaxed text-on-surface">
              &ldquo;I understand your concern regarding the integration timeline. Most of our partners at <span className="text-primary bg-primary/10 px-1">Global Logistics</span> see a full sync within <span className="underline decoration-primary">14 days</span>.&rdquo;
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-outline-variant/20 bg-surface-container-highest/30">
                <div className="text-[10px] font-bold uppercase text-primary mb-2">Next Suggested Pivot</div>
                <div className="text-sm">Cost Efficiency vs. Legacy Systems</div>
              </div>
              <div className="p-4 rounded-lg border border-outline-variant/20 bg-surface-container-highest/30">
                <div className="text-[10px] font-bold uppercase text-secondary mb-2">Client Sentiment</div>
                <div className="text-sm">Neutral - Rising Interest</div>
              </div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-3 border-t md:border-t-0 md:border-l border-outline-variant/15 p-6 bg-surface-container-low">
            <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-6">Real-time Telemetry</div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs mb-2 uppercase font-semibold">
                  <span>Latency</span>
                  <span className="text-primary">85ms</span>
                </div>
                <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[85%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2 uppercase font-semibold">
                  <span>Confidence</span>
                  <span className="text-secondary">92%</span>
                </div>
                <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-[92%]"></div>
                </div>
              </div>
              <div className="pt-4 border-t border-outline-variant/20">
                <Activity className="w-8 h-8 text-primary/60 mb-2" />
                <div className="text-xs text-on-surface-variant">Live sentiment analysis powered by neural engine v4.2</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, description, stats }: { icon: React.ElementType; title: string; description: string; stats?: string }) {
  return (
    <Card className="relative overflow-hidden p-6 bg-surface-container border-outline-variant/20 hover:border-primary/30 transition-colors group">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <Icon className="w-10 h-10 text-primary mb-4 relative z-10" />
      <h3 className="text-xl font-bold mb-2 relative z-10">{title}</h3>
      <p className="text-sm text-on-surface-variant relative z-10">{description}</p>
      {stats && (
        <div className="mt-6 pt-4 border-t border-outline-variant/15">
          <span className="text-3xl font-extrabold text-primary">{stats}</span>
          <span className="text-[10px] uppercase font-bold text-on-surface-variant ml-2">Increase</span>
        </div>
      )}
    </Card>
  );
}

function FeaturesSection() {
  return (
    <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-24">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight mb-4">Precision at Scale.</h2>
          <p className="text-on-surface-variant text-base md:text-lg">Engineered for teams that demand sub-millisecond response times and flawless execution.</p>
        </div>
        <div className="text-right">
          <span className="text-primary font-mono text-xs tracking-widest">SYSTEM_OPTIMIZATION_LOAD: 12%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          icon={Bolt}
          title="Objection Quick-fire"
          description="Instantly served counter-arguments based on historical win rates and real-time competitor data."
        />
        <FeatureCard
          icon={Sparkles}
          title="AI Pre-filled Summaries"
          description="Zero post-call work. Our terminal drafts CRM entries as the conversation happens."
          stats="85%"
        />
        <FeatureCard
          icon={Gauge}
          title="High-Velocity Campaigns"
          description="Automated dialing sequences that adapt to prospect timezone and behavior patterns."
        />
      </div>
    </section>
  );
}

function MetricsSection() {
  const metrics = [
    { value: "99.9%", label: "System Uptime" },
    { value: "12ms", label: "Global Latency" },
    { value: "10M+", label: "Calls Processed" },
  ];

  return (
    <section className="py-24 lg:py-32 bg-surface-container-lowest relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="w-full h-full" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #4edea3 1px, transparent 0)", backgroundSize: "40px 40px" }}></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-primary uppercase tracking-[0.4em] mb-4">Infrastructure Integrity</p>
          <h2 className="text-3xl md:text-5xl font-extrabold">Zero Room for Error.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {metrics.map((metric, index) => (
            <div key={index}>
              <div className="text-5xl md:text-7xl font-extrabold text-on-surface mb-3 drop-shadow-[0_0_12px_rgba(78,222,163,0.4)]">{metric.value}</div>
              <div className="text-xs font-bold uppercase tracking-widest text-primary">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-32 px-6 flex flex-col items-center text-center">
      <div className="relative max-w-3xl rounded-2xl border border-outline-variant/20 p-12 lg:p-16 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/[0.08] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/[0.08] rounded-full blur-3xl pointer-events-none" />

        <h2 className="text-3xl md:text-5xl font-extrabold text-on-surface mb-6 leading-tight relative z-10">
          Ready to synchronize?
        </h2>
        <p className="text-on-surface-variant text-lg mb-10 relative z-10">
          Initialize your terminal today and experience the future of high-density sales automation.
        </p>

        <div className="flex justify-center relative z-10">
          <Button size="lg" className="h-14 px-10 rounded-xl bg-primary text-on-primary text-sm font-bold uppercase tracking-widest shadow-[0_0_30px_rgba(78,222,163,0.3)] hover:scale-105 active:scale-95 transition-all" asChild>
            <Link href="/login">Initialize your terminal</Link>
          </Button>
        </div>

        <div className="mt-10 text-[10px] font-mono text-on-surface-variant uppercase tracking-widest">
          v6.1.0-STABLE // ENCRYPTION: AES-256-GCM
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const links = [
    { label: "Privacy Protocol", href: "/privacy" },
    { label: "Security Audit", href: "/security" },
    { label: "Terms of Service", href: "/terms" },
  ];

  return (
    <footer className="w-full border-t border-outline-variant/15 bg-surface-container-lowest">
      <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-lg font-bold text-primary uppercase tracking-widest">CallAgent</div>
        <div className="flex flex-wrap justify-center gap-6">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="text-[10px] uppercase tracking-[0.2em] font-medium text-on-surface-variant hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="text-[10px] uppercase tracking-[0.2em] font-medium text-on-surface-variant">
          © {new Date().getFullYear()} CALLAGENT KINETIC SYSTEMS. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}

function Nav() {
  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-4 backdrop-blur-xl bg-surface-dim/80 border-b border-outline-variant/10">
      <Link href="/" className="text-xl font-extrabold tracking-widest text-primary uppercase">CallAgent</Link>
      <Button className="bg-primary-container text-on-primary-container px-5 py-2 rounded-lg font-bold uppercase tracking-wider text-xs hover:bg-primary transition-all active:scale-95" asChild>
        <Link href="/login">Connect Terminal</Link>
      </Button>
    </nav>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  
  const { data, isLoading } = useQuery({
    queryKey: authKeys.me(),
    queryFn: authApi.me,
    retry: false,
    staleTime: 0,
  });

  useEffect(() => {
    if (!isLoading && !hasCheckedAuth) {
      setHasCheckedAuth(true);
      if (data?.data) {
        router.replace("/dashboard");
      }
    }
  }, [isLoading, data, router, hasCheckedAuth]);

  return (
    <div className="min-h-screen bg-surface-dim text-on-surface selection:bg-primary/30 selection:text-on-primary">
      <Nav />
      <main className="pt-16">
        <HeroSection />
        <FeaturesSection />
        <MetricsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}