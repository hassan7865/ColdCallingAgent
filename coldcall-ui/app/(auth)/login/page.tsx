"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useLogin } from "@/hooks/use-auth";
import { LoginSchema, loginSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  return (
    <div className="min-h-screen bg-surface text-on-surface selection:bg-primary selection:text-on-primary">
      <main className="relative flex min-h-[calc(100dvh-8rem)] flex-col items-center justify-center overflow-hidden px-4 py-8 sm:min-h-[calc(100vh-121px)] sm:p-6 sm:py-12">
        <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[30%] w-[30%] rounded-full bg-secondary-container/5 blur-[120px]" />

        <div className="z-10 w-full max-w-[420px]">
          <div className="mb-8 flex flex-col items-center sm:mb-10">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl border-0 bg-surface-container-highest shadow-2xl shadow-primary/20 sm:h-16 sm:w-16">
              <span className="material-symbols-outlined text-3xl text-primary sm:text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                mic
              </span>
            </div>
            <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">CallAgent</h1>
            <p className="mt-2 max-w-[280px] text-center text-sm font-medium tracking-wide text-on-surface-variant sm:max-w-none">
              Sign in to continue to your workspace
            </p>
          </div>

          <Card className="relative gap-0 rounded-xl border-0 bg-surface-container py-0 shadow-2xl ring-0 sm:rounded-[10px]">
            <CardContent className="px-8 pb-0 pt-8">
            <form className="space-y-6" onSubmit={onSubmit}>
              <div>
                <Label htmlFor="email" className="mb-2 block text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant">
                  Work Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="you@company.com"
                  className="glow-input w-full rounded-lg border border-outline-variant/30 bg-surface-container-low px-4 py-3 text-on-surface placeholder:text-outline/50 transition-all duration-300 focus:border-primary focus:outline-none focus:ring-0"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <Label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant">
                    Password
                  </Label>
                  <Button variant="link" className="h-auto p-0 text-[10px] font-bold uppercase tracking-[0.1em] text-primary" asChild>
                    <Link href="#">Forgot Password</Link>
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...form.register("password")}
                  placeholder="••••••••"
                  className="glow-input w-full rounded-lg border border-outline-variant/30 bg-surface-container-low px-4 py-3 text-on-surface placeholder:text-outline/50 transition-all duration-300 focus:border-primary focus:outline-none focus:ring-0"
                />
              </div>

              <div className="flex items-center gap-3 py-2">
                <Checkbox
                  id="remember"
                  className="h-4 w-4 rounded border-outline-variant/30 bg-surface-container-low text-primary focus:ring-primary focus:ring-offset-surface"
                />
                <Label htmlFor="remember" className="text-xs font-medium text-on-surface-variant">
                  Keep me signed in
                </Label>
              </div>

              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="flex h-auto w-full items-center justify-center gap-2 rounded-[8px] bg-gradient-to-b from-primary to-primary-container py-3.5 text-xs font-bold uppercase tracking-widest text-on-primary shadow-lg shadow-primary/20 transition-all duration-200 hover:shadow-primary/30 active:scale-[0.98]"
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <span className="material-symbols-outlined text-sm">login</span>
                  </>
                )}
              </Button>
            </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 border-t border-outline-variant/10 bg-transparent px-8 pb-8 pt-6">
              <p className="text-center text-xs text-on-surface-variant">
                Need an account?{" "}
                <Button variant="link" className="h-auto p-0 font-semibold text-secondary" asChild>
                  <Link href="/register">Create one</Link>
                </Button>
              </p>
            </CardFooter>
          </Card>

          <div className="mt-8 text-center">
            <div className="mb-4 flex justify-center gap-6">
              <span className="material-symbols-outlined text-xl text-outline/30">shield</span>
              <span className="material-symbols-outlined text-xl text-outline/30">bolt</span>
              <span className="material-symbols-outlined text-xl text-outline/30">language</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="flex w-full flex-col items-center justify-between gap-4 border-t border-outline-variant/20 bg-surface-container-low px-4 py-6 sm:px-10 sm:py-8 md:flex-row">
        <div className="text-[10px] font-medium uppercase tracking-widest text-on-surface-variant">
          © 2024 CallAgent AI. Kinetic Terminal Precision.
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
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
      </footer>
    </div>
  );
}
