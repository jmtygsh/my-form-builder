"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "~/hooks/api/auth";
import { redirect, RedirectType } from 'next/navigation'
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "~/components/ui/button";

export default function Home() {
  const { user } = useUser()
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Initialize mounted state to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    if (user && user.id) {
      console.log(user)
      // redirect('/redirect-to', RedirectType.replace)
    }
  }, [user])

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-border bg-background sticky top-0 z-50">
        <div className="container mx-auto h-full flex items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-foreground rotate-45 flex items-center justify-center rounded-[4px]">
              <div className="w-2 h-2 bg-background rounded-[1px] -rotate-45" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground dark:text-white">MakeMyForm</span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            <Link
              href="/pricing"
              className="text-sm font-medium text-foreground-muted hover:text-foreground transition-colors"
            >
              Pricing
            </Link>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="cursor-pointer h-8 w-8 bg-background-secondary/10  text-foreground-muted hover:text-foreground hover:bg-card  rounded-lg"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            <Link
              href="/login"
              className="text-sm font-medium text-foreground-muted hover:text-foreground transition-colors"
            >
              Log in
            </Link>

            <Button
              asChild
              className="bg-button hover:bg-button-hover text-button-foreground h-9 px-4 text-sm font-medium rounded-lg transition-colors border-0"
            >
              <Link href="/sign-up">
                Get started
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex justify-center items-center">
        {/* Page content goes here */}
      </main>
    </div>
  );
}
