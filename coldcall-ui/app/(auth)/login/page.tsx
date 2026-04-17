"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { useLogin } from "@/hooks/use-auth";
import { LoginSchema, loginSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await loginMutation.mutateAsync(values);
      router.replace("/dashboard");
    } catch {
      // Mutation toasts already handle user feedback.
    }
  });

  const emailErr = form.formState.errors.email?.message;
  const passwordErr = form.formState.errors.password?.message;

  return (
    <div className="relative min-h-dvh bg-[#070e1d] text-on-surface selection:bg-primary/30 selection:text-on-primary">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[20%] -top-[30%] h-[min(90vw,520px)] w-[min(90vw,520px)] rounded-full bg-primary/[0.12] blur-[100px]" />
        <div className="absolute -right-[15%] top-1/3 h-[min(70vw,420px)] w-[min(70vw,420px)] rounded-full bg-secondary/8 blur-[90px]" />
        <div className="absolute bottom-0 left-1/2 h-px w-[min(100%,48rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[440px] flex-col px-4 py-10 sm:justify-center sm:py-12">
        {/* Brand */}
        <header className="mb-8 text-center sm:mb-10">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/90">CallAgent</p>
          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-on-surface sm:text-[2rem] sm:leading-tight">
            Welcome back
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-pretty text-sm leading-relaxed text-on-surface-variant">
            Sign in with your work email to open your pipeline workspace.
          </p>
        </header>

        {/* Form panel */}
        <div className="rounded-2xl bg-gradient-to-b from-primary/[0.15] via-primary/[0.06] to-transparent p-px shadow-2xl shadow-black/40">
          <div className="rounded-[15px] border border-outline-variant/10 bg-surface-container/95 px-5 py-7 backdrop-blur-sm sm:px-8 sm:py-8">
            <form className="space-y-5" onSubmit={onSubmit} noValidate>
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
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="password" className="text-xs font-semibold text-on-surface-variant">
                    Password
                  </Label>
                  <Button variant="link" className="h-auto p-0 text-xs font-medium text-primary" asChild>
                    <Link href="#">Forgot password?</Link>
                  </Button>
                </div>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-3.5 top-1/2 size-[1.125rem] -translate-y-1/2 text-on-surface-variant/70"
                    aria-hidden
                  />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    {...form.register("password")}
                    placeholder="Enter your password"
                    className={cn(
                      "h-12 rounded-xl border border-outline-variant/25 bg-surface-container-low pl-11 pr-4 text-[15px] text-on-surface shadow-inner shadow-black/10 placeholder:text-on-surface-variant/50",
                      "transition-colors focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/25",
                      passwordErr && "border-error/50 focus-visible:border-error/60 focus-visible:ring-error/20",
                    )}
                  />
                </div>
                {passwordErr ? <p className="text-xs font-medium text-error">{passwordErr}</p> : null}
              </div>

              <div className="flex items-center gap-3 pt-1">
                <Checkbox
                  id="remember"
                  className="border-outline-variant/40 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                />
                <Label htmlFor="remember" className="text-sm font-normal leading-none text-on-surface-variant">
                  Keep me signed in on this device
                </Label>
              </div>

              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="mt-2 h-12 w-full rounded-xl bg-primary text-[13px] font-bold uppercase tracking-[0.12em] text-on-primary shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-primary/35 disabled:opacity-60"
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <span className="material-symbols-outlined ml-2 text-lg" aria-hidden>
                      arrow_forward
                    </span>
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-on-surface-variant">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-primary underline-offset-4 hover:underline">
            Create one
          </Link>
        </p>

        <p className="mt-10 text-center text-[11px] text-on-surface-variant/70">
          Encrypted connection · Your credentials are never stored in plain text
        </p>

        <footer className="mt-auto border-t border-outline-variant/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-[10px] uppercase tracking-wider text-on-surface-variant/80 sm:flex-row sm:gap-6">
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
