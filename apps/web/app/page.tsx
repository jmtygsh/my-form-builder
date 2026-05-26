"use client";

import { useEffect } from "react";
import Link from "next/link";
import { redirect, RedirectType } from 'next/navigation'


import { useUser } from "~/hooks/api/auth";
import { MoveRight } from "lucide-react";

// local file import 
import { Button } from "~/components/ui/button";
import Header from "~/components/layout/Header";
import Animate from "~/components/layout/Animate";
import LogoTicker from "~/components/layout/LogoTicker";
import Features from "~/components/layout/Features";
import Testimonials from "~/components/layout/Testimonials";
import DashedAnimation from "~/components/layout/DashedAnimation";
import LegacyAnimation from "~/components/layout/LegacyAnimation";
import PowerfulFeatures from "~/components/layout/PowerfulFeatures";
import { Contact } from "~/components/layout/Contact";
import { Footer } from "~/components/layout/Footer";




export default function Home() {
  const { user } = useUser()


  // ignore for now
  useEffect(() => {
    if (user && user.id) {
      console.log(user)
      // redirect('/redirect-to', RedirectType.replace)
    }
  }, [user])


  return (
    <div className="min-h-screen text-foreground flex flex-col">
      < Header />
      <main className="min-h-[calc(60vh-30px)] sm:min-h-[calc(100vh-80px)] flex-none relative flex flex-col p-4 md:p-6 text-center">
        <div className="absolute inset-0 w-full h-full pointer-events-none mt-10">
          <Animate />
        </div>

        {/* Overlay Content */}
        <div className="relative z-10 max-w-6xl mx-auto p-10">
          <h1 className="mt-10 sm:mt-20 mb-8 text-4xl sm:text-[80px] font-heading drop-shadow-2xl drop-shadow-primary/20">
            Online form builder,<br />
            that gets more responses
          </h1>
          <p className="mb-8 text-lg md:text-xl text-foreground-muted text-shadow-sm">
            Build engaging online forms, surveys, or quizzes in seconds.
          </p>



          <div className="mt-8 flex justify-center">
            <Button variant="textured" className="h-12 px-8 text-base">
              Create your form
              <MoveRight className="ml-2 size-5" />
            </Button>
          </div>

        </div>

      </main >
      <LogoTicker />
      <Features />
      <Testimonials />
      <DashedAnimation />
      <LegacyAnimation />
      <PowerfulFeatures />
      <Contact />
      <Footer />
    </div >
  );
}
