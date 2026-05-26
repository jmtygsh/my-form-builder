"use client";

import React from 'react'
import Link from 'next/link'
import {
    useRive,
    Layout,
    Fit,
    Alignment,
} from "@rive-app/react-canvas";
import { Button } from "~/components/ui/button";
import { MoveRight, Linkedin, Facebook } from "lucide-react";

const PRODUCT_LINKS = [
    { name: "Form Builder", href: "#" },
    { name: "Survey Maker", href: "#" },
    { name: "Quiz Maker", href: "#" },
    { name: "Templates", href: "#" },
    { name: "Integrations", href: "#" },
];

const RESOURCE_LINKS = [
    { name: "Blog", href: "#" },
    { name: "Help Center", href: "#" },
    { name: "API Documentation", href: "#" },
];

export const Footer = () => {
    // The Rive animation is loaded but kept subtle in the background
    const { RiveComponent } = useRive({
        src: "/riv/footer.riv",
        autoplay: true,
        stateMachines: "state_footer",
        layout: new Layout({
            fit: Fit.Cover,
            alignment: Alignment.BottomCenter,
        }),
    });

    return (
        <footer className="bg-[#FFFAF5] relative overflow-hidden flex flex-col">

            {/* Top Animation Landscape */}
            <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] w-full relative z-0">
                <RiveComponent className="w-full h-full object-cover" />
            </div>

            {/* Footer Content */}
            <div className="container mx-auto px-4 relative z-10 pt-12 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">

                    {/* Brand Column */}
                    <div className="flex flex-col gap-6 lg:pr-8">
                        <Link href="/" className="inline-block">
                            <span className="font-script text-4xl text-black leading-none tracking-tight">
                                mmf.
                            </span>
                        </Link>
                        <p className="text-lg font-medium text-black">
                            Build engaging online forms, surveys, or quizzes in seconds.
                        </p>
                        <div className="mt-2">
                            <Button variant="textured" className="h-12 text-base">
                                Log in
                                <MoveRight className="ml-2 size-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Services Column */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-heading italic text-2xl text-black border-b-[1.5px] border-black/20 pb-2 mb-2">
                            Product
                        </h3>
                        <ul className="flex flex-col gap-3">
                            {PRODUCT_LINKS.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-black font-medium hover:underline underline-offset-4">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Education Column */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-heading italic text-2xl text-black border-b-[1.5px] border-black/20 pb-2 mb-2">
                            Resources
                        </h3>
                        <ul className="flex flex-col gap-3">
                            {RESOURCE_LINKS.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-black font-medium hover:underline underline-offset-4">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-heading italic text-2xl text-black border-b-[1.5px] border-black/20 pb-2 mb-2">
                            Contact
                        </h3>
                        <div className="flex flex-col gap-3 text-black font-medium">
                            <p>Email: <a href="mailto:hello@mmf.com" className="hover:underline underline-offset-4">hello@mmf.com</a></p>
                        </div>

                        <div className="flex flex-col gap-4 mt-6">
                            <a href="#" className="flex items-center gap-4 group">
                                <div className="w-10 h-10 bg-primary border-[1.5px] border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all">
                                    <Linkedin className="w-5 h-5 text-black stroke-[2]" />
                                </div>
                                <span className="font-heading italic text-xl text-black">Linkedin</span>
                            </a>
                            <a href="#" className="flex items-center gap-4 group">
                                <div className="w-10 h-10 bg-primary border-[1.5px] border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all">
                                    <Facebook className="w-5 h-5 text-black stroke-[2]" />
                                </div>
                                <span className="font-heading italic text-xl text-black">Facebook</span>
                            </a>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-black font-medium">
                    <p>Copyright © 2024, mmf.</p>
                    <div className="flex flex-wrap justify-center gap-4 gap-y-2">
                        <span>All Rights Reserved.</span>
                        <Link href="#" className="underline underline-offset-4 hover:opacity-70">Terms of Use</Link>
                        <Link href="#" className="underline underline-offset-4 hover:opacity-70">Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}