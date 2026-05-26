"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import Header from "~/components/layout/Header";
import { Footer } from "~/components/layout/Footer";
import { Button } from "~/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 text-center">
        <div className="max-w-2xl mx-auto space-y-8 mt-30">
          <h1 className="text-[80px] sm:text-[120px] font-heading leading-none text-primary drop-shadow-sm">
            404
          </h1>
          <h2 className="text-3xl sm:text-4xl font-heading text-heading">
            Page not found
          </h2>
          <p className="text-lg text-foreground-muted max-w-md mx-auto">
            Oops! The page you are looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>

          <div className="pt-4 flex justify-center">
            <Button variant="textured" className="h-12 px-8 text-base" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-5 w-5" />
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