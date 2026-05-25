"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "~/hooks/api/auth";
import { redirect, RedirectType } from 'next/navigation'
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "~/components/ui/button";

import { motion } from "framer-motion";

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
    <div className="min-h-screen bg-background text-foreground flex flex-col ">
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
              <Link href="/dashboard">
                Get started
              </Link>
            </Button>
          </div>
        </div>
      </header>



      <img
        src="/assets/picsvg_download.svg"
        alt="Cherry Blossom Branch Left"
        className="absolute bottom-0 left-0 w-60 sm:w-64 md:w-96 lg:w-[800px] xl:w-[600px] object-contain pointer-events-none z-0"
      />
      <img
        src="/assets/flower-right-top.png"
        alt="Cherry Blossom Branch Left"
        className="absolute top-0 right-0 w-60 sm:w-64 md:w-96 lg:w-[800px] xl:w-[600px] object-contain pointer-events-none z-0"
      />

      {/* Main Content Area */}
      <main className="flex-1 flex justify-center items-center p-4 relative overflow-hidden !bg-[linear-gradient(127deg,#e1dbff,transparent_50%,#e1dbff)] dark:!bg-dark dark:!bg-[linear-gradient[linear-gradient(1deg, #e1dbff, #0000 50%, #040406)]">
        {/* Cherry Blossom Ambient Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-300/20 dark:bg-rose-500/10 rounded-full blur-[100px] -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-300/20 dark:bg-pink-500/10 rounded-full blur-[100px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Static Cherry Blossom Branches */}
        {/* <img
          src="/animation/left-side.svg"
          alt="Cherry Blossom Branch Left"
          className="absolute bottom-0 left-0 w-32 sm:w-64 md:w-96 lg:w-[500px] xl:w-[600px] object-contain pointer-events-none z-0"
        /> */}
        <img
          src="/animation/right-side.svg"
          alt="Cherry Blossom Branch Right"
          className="absolute bottom-0 right-0 w-32 sm:w-64 md:w-96 lg:w-[500px] xl:w-[600px] object-contain pointer-events-none z-0"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl space-y-8 flex flex-col items-center z-10"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-4xl sm:text-7xl text-center font-bold tracking-tight text-foreground"
          >
            Online form builder
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 text-transparent bg-clip-text mt-2"
            >
              that gets more responses
            </motion.p>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="text-sm sm:text-2xl text-foreground-muted text-center max-w-3xl leading-relaxed"
          >
            Build engaging online forms, surveys, or quizzes in seconds with makemyform, your online form maker. Get registrations, applications, reports,  orders, and more meaningful data with online forms!
          </motion.p>


        </motion.div>
      </main>
    </div>
  );
}
