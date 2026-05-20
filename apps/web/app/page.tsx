"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "~/hooks/api/auth";
import { redirect, RedirectType } from 'next/navigation'
import { Sun, Moon } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function Home() {
  const { user } = useUser()
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme preference
    if (typeof document !== 'undefined') {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    }
  }, []);

  const toggleTheme = () => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark');
      setIsDark(!isDark);
    }
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
              className="h-9 w-9 bg-background-secondary border-border text-foreground-muted hover:text-foreground hover:bg-card hover:border-border-hover rounded-lg"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
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
