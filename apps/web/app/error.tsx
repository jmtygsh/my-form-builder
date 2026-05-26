"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

import Header from "~/components/layout/Header";
import { Footer } from "~/components/layout/Footer";
import { Button } from "~/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-heading text-heading">
            Something went wrong
          </h1>
          <p className="text-lg text-foreground-muted max-w-md mx-auto">
            We apologize for the inconvenience. An unexpected error has occurred.
            Our team has been notified.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              variant="textured"
              className="h-12 px-8 text-base w-full sm:w-auto"
              onClick={() => reset()}
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Try again
            </Button>

            <Button
              variant="outline"
              className="h-12 px-8 text-base w-full sm:w-auto bg-transparent border-border hover:bg-background-secondary"
              asChild
            >
              <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}