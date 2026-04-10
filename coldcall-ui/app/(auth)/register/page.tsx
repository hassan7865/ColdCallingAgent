"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useRegister } from "@/hooks/use-auth";
import { RegisterSchema, registerSchema } from "@/lib/validations/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegister();
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await registerMutation.mutateAsync(values);
      router.replace("/dashboard");
    } catch {
      // Mutation toasts already handle user feedback.
    }
  });

  return (
    <div className="flex min-h-dvh flex-col bg-surface text-on-surface">
      <header className="fixed top-0 z-50 w-full bg-surface-container-low/80 shadow-2xl shadow-primary/5 backdrop-blur-xl">
        <nav className="flex h-14 max-w-full items-center justify-between px-4 sm:h-16 sm:px-6">
          <div className="flex min-w-0 items-center gap-2 text-lg font-bold text-primary sm:text-xl">
            <span className="material-symbols-outlined">terminal</span>
            <span className="tracking-tight">CallAgent</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" type="button" aria-label="Help">
              <span className="material-symbols-outlined text-on-surface-variant">help_outline</span>
            </Button>
          </div>
        </nav>
      </header>

      <main className="relative flex flex-grow items-center justify-center overflow-hidden px-4 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[4.5rem] sm:pb-12 sm:pt-20">
        <div className="absolute -left-20 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -right-20 bottom-1/4 h-96 w-96 rounded-full bg-secondary/5 blur-[120px]" />

        <div className="grid w-full max-w-[1100px] items-center gap-8 sm:gap-10 md:grid-cols-2 md:gap-12">
          <div className="space-y-4 md:hidden">
            <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-primary">
              System Initialization
            </Badge>
            <h1 className="text-2xl font-extrabold leading-tight tracking-tighter text-on-surface sm:text-3xl">
              Deploy your <span className="text-primary">autonomous</span> sales force
            </h1>
            <p className="text-sm leading-relaxed text-on-surface-variant">High-density automation for revenue teams.</p>
          </div>
          <div className="hidden space-y-8 md:block">
            <div className="space-y-4">
              <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-primary">
                System Initialization
              </Badge>
              <h1 className="text-5xl font-extrabold leading-tight tracking-tighter text-on-surface">
                Deploy Your <br />
                <span className="text-primary">Autonomous</span> <br />
                Sales Force.
              </h1>
              <p className="max-w-md text-lg leading-relaxed text-on-surface-variant">
                Experience the Kinetic Terminal. High-density automation for precision-focused revenue teams.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="ghost-border gap-2 rounded-[10px] border-0 bg-surface-container-low py-4 ring-0">
                <CardContent className="px-6 pt-0">
                  <div className="mb-1 text-2xl font-bold text-primary">99.9%</div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">Uptime Reliability</div>
                </CardContent>
              </Card>
              <Card className="ghost-border gap-2 rounded-[10px] border-0 bg-surface-container-low py-4 ring-0">
                <CardContent className="px-6 pt-0">
                  <div className="mb-1 text-2xl font-bold text-primary">12ms</div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">Latency Precision</div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="relative">
            <Card className="ghost-border relative z-10 gap-0 rounded-xl border-0 bg-surface-container py-0 shadow-2xl ring-0 sm:rounded-[10px] md:p-0">
              <CardHeader className="space-y-2 px-5 pb-2 pt-6 sm:px-8 sm:pt-8 md:px-10 md:pt-10">
                <CardTitle className="text-xl font-bold sm:text-2xl">Create Account</CardTitle>
                <CardDescription className="text-sm text-on-surface-variant">Initialize your agent credentials to begin.</CardDescription>
              </CardHeader>
              <CardContent className="px-5 pb-6 sm:px-8 md:px-10">
              <form className="space-y-6" onSubmit={onSubmit}>
                <div className="active-glow space-y-1.5 transition-all">
                  <Label className="ml-1 text-[10px] font-medium uppercase tracking-widest text-on-surface-variant">Full Name</Label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-on-surface-variant">person</span>
                    <Input
                      type="text"
                      placeholder="John Wick"
                      {...form.register("name")}
                      className="w-full rounded-lg border-none bg-surface-container-low py-3 pl-10 pr-4 text-on-surface placeholder:text-surface-variant focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>

                <div className="active-glow space-y-1.5 transition-all">
                  <Label className="ml-1 text-[10px] font-medium uppercase tracking-widest text-on-surface-variant">Work Email</Label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-on-surface-variant">
                      alternate_email
                    </span>
                    <Input
                      type="email"
                      placeholder="you@company.com"
                      {...form.register("email")}
                      className="w-full rounded-lg border-none bg-surface-container-low py-3 pl-10 pr-4 text-on-surface placeholder:text-surface-variant focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>

                <div className="active-glow space-y-1.5 transition-all">
                  <Label className="ml-1 text-[10px] font-medium uppercase tracking-widest text-on-surface-variant">Access Key</Label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-on-surface-variant">lock</span>
                    <Input
                      type="password"
                      placeholder="••••••••••••"
                      {...form.register("password")}
                      className="w-full rounded-lg border-none bg-surface-container-low py-3 pl-10 pr-4 text-on-surface placeholder:text-surface-variant focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={registerMutation.isPending}
                    className="kinetic-gradient h-auto w-full rounded-[8px] py-4 font-bold text-on-primary shadow-lg shadow-primary/10 transition-transform active:scale-[0.98]"
                  >
                    {registerMutation.isPending ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <span className="material-symbols-outlined">arrow_forward</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
              </CardContent>
              <CardFooter className="flex flex-col items-center gap-4 bg-transparent px-5 pb-6 pt-0 text-center sm:px-8 sm:pb-8 md:px-10">
                <div className="flex w-full items-center gap-3">
                  <Separator className="flex-1 bg-outline-variant/50" />
                  <span className="shrink-0 text-[10px] uppercase tracking-widest text-on-surface-variant">Already Registered?</span>
                  <Separator className="flex-1 bg-outline-variant/50" />
                </div>
                <Button variant="link" className="h-auto font-semibold text-primary" asChild>
                  <Link href="/login">Sign In to Dashboard</Link>
                </Button>
              </CardFooter>
            </Card>

            <div className="absolute -bottom-6 -right-6 hidden h-32 w-32 overflow-hidden rounded-[10px] border-4 border-surface shadow-2xl lg:block">
              <img
                className="h-full w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4Gf3omholz824Ccf4CP0D3snkJCQNtAG-DCWrQPbIFiEBKpM4MGMFLOb4CV95yWd7tpONQU59lJvhpHf2uqH-qn-Cyd1uePP07Wzr-wO70XBL3QW82eQu4A83368LWXdNXwERickqffG08IjC6EzHbZj_jxGh4ErSAH81dWWt1Ql72Jzci3X86eEF8C3i-u4UBEO1I6G3fw3egvFCaUeYAStixq7YXt9t6tFBs15cOVZzspmUgrI_D3zHRAO4TT1-fQPnjqJdHikk"
                alt="Tech accent"
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto w-full border-t border-outline-variant/20 bg-surface-container-low pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pt-8 sm:pb-[max(2rem,env(safe-area-inset-bottom))]">
        <div className="flex flex-col items-center justify-between gap-4 px-4 sm:px-10 md:flex-row">
          <div className="text-[10px] font-medium uppercase tracking-widest text-on-surface-variant">
            © 2024 CallAgent AI. Kinetic Terminal Precision.
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <Button variant="link" className="h-auto p-0 text-[10px] font-medium uppercase tracking-widest text-on-surface-variant" asChild>
              <Link href="#">Terms of Service</Link>
            </Button>
            <Button variant="link" className="h-auto p-0 text-[10px] font-medium uppercase tracking-widest text-on-surface-variant" asChild>
              <Link href="#">Privacy Policy</Link>
            </Button>
            <Button variant="link" className="h-auto p-0 text-[10px] font-medium uppercase tracking-widest text-on-surface-variant" asChild>
              <Link href="#">Security Status</Link>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
