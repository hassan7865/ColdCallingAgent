"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRegister } from "@/hooks/use-auth";
import { RegisterSchema, registerSchema } from "@/lib/validations/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

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

  const nameErr = form.formState.errors.name?.message;
  const emailErr = form.formState.errors.email?.message;
  const passwordErr = form.formState.errors.password?.message;

  const marketing = (
    <>
      <Badge
        variant="outline"
        className="rounded-full border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary"
      >
        System initialization
      </Badge>
      <h2 className="text-balance text-2xl font-extrabold leading-tight tracking-tight text-on-surface sm:text-3xl lg:text-4xl lg:leading-[1.15]">
        Deploy your <span className="text-primary">autonomous</span> sales workspace
      </h2>
      <p className="max-w-md text-pretty text-sm leading-relaxed text-on-surface-variant sm:text-base">
        High-density automation for revenue teams—pipeline, campaigns, and call intelligence in one place.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <Card className="rounded-xl border border-outline-variant/10 bg-surface-container-low/60 shadow-none ring-0">
          <CardContent className="px-4 py-4 pt-4">
            <div className="text-xl font-bold text-primary sm:text-2xl">99.9%</div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">Uptime focus</div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border border-outline-variant/10 bg-surface-container-low/60 shadow-none ring-0">
          <CardContent className="px-4 py-4 pt-4">
            <div className="text-xl font-bold text-primary sm:text-2xl">12ms</div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">API latency</div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  return (
    <div className="relative min-h-dvh bg-[#070e1d] text-on-surface selection:bg-primary/30 selection:text-on-primary">
      {/* Ambient background — same as login */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[20%] -top-[30%] h-[min(90vw,520px)] w-[min(90vw,520px)] rounded-full bg-primary/[0.12] blur-[100px]" />
        <div className="absolute -right-[15%] top-1/3 h-[min(70vw,420px)] w-[min(70vw,420px)] rounded-full bg-secondary/8 blur-[90px]" />
        <div className="absolute bottom-0 left-1/2 h-px w-[min(100%,48rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      </div>

      <div className="relative z-10 flex min-h-dvh flex-col">
        <main className="flex flex-1 flex-col justify-center px-4 py-10 sm:py-12 lg:py-16">
          <div className="mx-auto grid w-full max-w-[1100px] items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
            {/* Left: marketing (stack on mobile) */}
            <div className="space-y-4 text-center lg:space-y-8 lg:text-left">
              <div className="space-y-4 lg:hidden">{marketing}</div>
              <div className="hidden space-y-8 lg:block">{marketing}</div>
            </div>

            {/* Right: form — same panel + fields as login */}
            <div className="mx-auto w-full max-w-[440px] lg:mx-0 lg:max-w-none">
              <header className="mb-6 text-center lg:mb-8 lg:text-left">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/90">CallAgent</p>
                <h1 className="text-balance text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
                  Create your account
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                  Initialize your credentials to open the dashboard.
                </p>
              </header>

              <div className="rounded-2xl bg-gradient-to-b from-primary/[0.15] via-primary/[0.06] to-transparent p-px shadow-2xl shadow-black/40">
                <div className="rounded-[15px] border border-outline-variant/10 bg-surface-container/95 px-5 py-7 backdrop-blur-sm sm:px-8 sm:py-8">
                  <form className="space-y-5" onSubmit={onSubmit} noValidate>
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs font-semibold text-on-surface-variant">
                        Full name
                      </Label>
                      <div className="relative">
                        <User
                          className="pointer-events-none absolute left-3.5 top-1/2 size-[1.125rem] -translate-y-1/2 text-on-surface-variant/70"
                          aria-hidden
                        />
                        <Input
                          id="name"
                          type="text"
                          autoComplete="name"
                          {...form.register("name")}
                          placeholder="Alex Morgan"
                          className={cn(
                            "h-12 rounded-xl border border-outline-variant/25 bg-surface-container-low pl-11 pr-4 text-[15px] text-on-surface shadow-inner shadow-black/10 placeholder:text-on-surface-variant/50",
                            "transition-colors focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/25",
                            nameErr && "border-error/50 focus-visible:border-error/60 focus-visible:ring-error/20",
                          )}
                        />
                      </div>
                      {nameErr ? <p className="text-xs font-medium text-error">{nameErr}</p> : null}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-semibold text-on-surface-variant">
                        Work email
                      </Label>
                      <div className="relative">
                        <Mail
                          className="pointer-events-none absolute left-3.5 top-1/2 size-[1.125rem] -translate-y-1/2 text-on-surface-variant/70"
                          aria-hidden
                        />
                        <Input
                          id="email"
                          type="email"
                          autoComplete="email"
                          {...form.register("email")}
                          placeholder="you@company.com"
                          className={cn(
                            "h-12 rounded-xl border border-outline-variant/25 bg-surface-container-low pl-11 pr-4 text-[15px] text-on-surface shadow-inner shadow-black/10 placeholder:text-on-surface-variant/50",
                            "transition-colors focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/25",
                            emailErr && "border-error/50 focus-visible:border-error/60 focus-visible:ring-error/20",
                          )}
                        />
                      </div>
                      {emailErr ? <p className="text-xs font-medium text-error">{emailErr}</p> : null}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-xs font-semibold text-on-surface-variant">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock
                          className="pointer-events-none absolute left-3.5 top-1/2 size-[1.125rem] -translate-y-1/2 text-on-surface-variant/70"
                          aria-hidden
                        />
                        <Input
                          id="password"
                          type="password"
                          autoComplete="new-password"
                          {...form.register("password")}
                          placeholder="At least 8 characters"
                          className={cn(
                            "h-12 rounded-xl border border-outline-variant/25 bg-surface-container-low pl-11 pr-4 text-[15px] text-on-surface shadow-inner shadow-black/10 placeholder:text-on-surface-variant/50",
                            "transition-colors focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/25",
                            passwordErr && "border-error/50 focus-visible:border-error/60 focus-visible:ring-error/20",
                          )}
                        />
                      </div>
                      {passwordErr ? <p className="text-xs font-medium text-error">{passwordErr}</p> : null}
                    </div>

                    <Button
                      type="submit"
                      disabled={registerMutation.isPending}
                      className="mt-2 h-12 w-full rounded-xl bg-primary text-[13px] font-bold uppercase tracking-[0.12em] text-on-primary shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-primary/35 disabled:opacity-60"
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" />
                          Creating account…
                        </>
                      ) : (
                        <>
                          Create account
                          <span className="material-symbols-outlined ml-2 text-lg" aria-hidden>
                            arrow_forward
                          </span>
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>

              <p className="mt-8 text-center text-sm text-on-surface-variant lg:text-left">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </main>

        <p className="px-4 pb-6 text-center text-[11px] text-on-surface-variant/70">
          Encrypted connection · Your credentials are never stored in plain text
        </p>

        <footer className="border-t border-outline-variant/10 px-4 py-8 sm:px-8">
          <div className="mx-auto flex max-w-[1100px] flex-col items-center justify-between gap-4 text-[10px] uppercase tracking-wider text-on-surface-variant/80 sm:flex-row">
            <span>© {new Date().getFullYear()} CallAgent</span>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              <Link href="/terms" className="hover:text-on-surface-variant">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-on-surface-variant">
                Privacy
              </Link>
              <Link href="/security" className="hover:text-on-surface-variant">
                Security
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
