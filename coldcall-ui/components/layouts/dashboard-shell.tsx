"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, RadioTower, LayoutDashboard, Phone, TrendingUp, Users, Megaphone, LogOut, Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuthContext } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/prospects", label: "Prospects", icon: Users },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/calls", label: "Call Log", icon: Phone },
  { href: "/reports", label: "Reports", icon: TrendingUp },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthContext();
  const pathname = usePathname();

  const navLinkClass = (href: string) =>
    cn(
      "gap-2 text-sm font-medium transition-colors",
      pathname === href || pathname.startsWith(`${href}/`)
        ? "bg-surface-container-high text-on-surface shadow-sm"
        : "text-on-surface-variant hover:bg-surface-container-high/60 hover:text-on-surface",
    );

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-background text-on-surface">
      <header className="z-50 shrink-0 border-b border-outline-variant/20 bg-surface-container-low/95 backdrop-blur-md supports-[backdrop-filter]:bg-surface-container-low/80">
        <div className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-8">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0 md:hidden" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[min(100%,20rem)] border-outline-variant/20 bg-surface-container-low p-0">
                <SheetHeader className="border-b border-outline-variant/15 px-4 py-4 text-left">
                  <SheetTitle className="flex items-center gap-2 text-primary">
                    <RadioTower className="size-5" />
                    CallAgent
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 p-3">
                  {nav.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SheetClose key={item.href} asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium",
                            pathname === item.href || pathname.startsWith(`${item.href}/`)
                              ? "bg-surface-container-high text-on-surface"
                              : "text-on-surface-variant hover:bg-surface-container-high/70 hover:text-on-surface",
                          )}
                        >
                          <Icon className="size-5 shrink-0 opacity-80" />
                          {item.label}
                        </Link>
                      </SheetClose>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/dashboard" className="flex min-w-0 items-center gap-2 text-lg font-bold tracking-tight text-primary sm:text-xl">
              <RadioTower className="size-5 shrink-0" />
              <span className="truncate">CallAgent</span>
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {nav.map((item) => {
                const Icon = item.icon;
                return (
                  <Button key={item.href} variant="ghost" size="sm" className={navLinkClass(item.href)} asChild>
                    <Link href={item.href}>
                      <Icon className="size-4 shrink-0 opacity-70" />
                      {item.label}
                    </Link>
                  </Button>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Notifications">
                  <Bell className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Notifications</TooltipContent>
            </Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative size-9 rounded-full p-0" aria-label="Account menu">
                  <Avatar className="size-8 border border-outline-variant">
                    <AvatarFallback className="bg-surface-container-high text-xs font-semibold text-on-surface">
                      {user?.name?.slice(0, 2).toUpperCase() ?? "AG"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-[min(calc(100vw-2rem),17rem)] overflow-hidden rounded-xl border-0 bg-surface-container-highest p-0 shadow-xl shadow-black/20"
              >
                <div className="relative border-b border-outline-variant/10 bg-gradient-to-br from-primary/[0.08] via-transparent to-transparent px-4 py-4">
                  <div className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-primary/10 blur-2xl" aria-hidden />
                  <div className="relative flex items-center gap-3">
                    <Avatar className="size-11 shrink-0 border border-outline-variant/30 shadow-sm">
                      <AvatarFallback className="bg-surface-container-high text-sm font-bold text-primary">
                        {user?.name?.slice(0, 2).toUpperCase() ?? "AG"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold leading-tight text-on-surface">{user?.name ?? "Signed in"}</p>
                      {user?.email ? (
                        <p className="mt-1 truncate text-xs leading-tight text-on-surface-variant" title={user.email}>
                          {user.email}
                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-on-surface-variant/80">CallAgent workspace</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-1.5">
                  <DropdownMenuItem
                    variant="destructive"
                    className="cursor-pointer gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold focus:bg-destructive/15"
                    onSelect={(e) => {
                      e.preventDefault();
                      void logout();
                    }}
                  >
                    <LogOut className="size-4 shrink-0" />
                    Log out
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="mx-auto flex min-h-0 w-full max-w-screen-2xl flex-1 flex-col overflow-hidden px-4 pt-5 pb-10 sm:px-6 sm:pt-7 sm:pb-12">
        <div className="grid min-h-0 min-w-0 flex-1 [grid-template-rows:minmax(0,1fr)]">
          <div className="box-border flex h-full min-h-0 min-w-0 flex-col px-1 pb-2 pt-1 sm:px-2 sm:pb-3 sm:pt-2">{children}</div>
        </div>
      </main>
    </div>
  );
}
