"use client";

import * as React from 'react'

import {
    useRive,
    Layout,
    Fit,
    Alignment,
} from "@rive-app/react-canvas";
import { Button } from "~/components/ui/button";
import { MoveRight } from "lucide-react";

const LegacyAnimation = () => {

    const { RiveComponent, rive } = useRive({
        src: "/riv/tax-planning.riv",
        autoplay: true,
        stateMachines: "state_tax-planning", // Add if needed
        layout: new Layout({
            fit: Fit.Contain,
            alignment: Alignment.BottomCenter,
        }),
    });




    return (
        <section className="py-24">
            <div className="w-full h-auto sm:h-96 relative flex flex-col md:flex-row justify-between items-center container mx-auto px-4 gap-12 lg:gap-20">
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-foreground mb-6 leading-tight">
                        A vast library of ready-to-use form templates
                    </h2>

                    <p className="text-lg md:text-xl text-foreground-muted font-medium leading-relaxed max-w-2xl mx-auto md:mx-0 mb-8">
                        You have free access to 5000+ pre-built form templates on makemyform. Each template is customizable, comes with the necessary form fields, and is reviewed by a form-making expert from our team, so you can create forms for free and fast.
                    </p>

                    <div className="flex justify-center md:justify-start">
                        <Button variant="textured" className="h-12 px-8 text-base">
                            Explore templates
                            <MoveRight className="ml-2 size-5" />
                        </Button>
                    </div>
                </div>
                <div className="flex-1 w-full h-64 sm:h-full relative">
                    <RiveComponent className="w-full h-[320px] sm:h-full" />
                </div>
            </div>
        </section>
    )
}

export default LegacyAnimation
