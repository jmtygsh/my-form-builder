"use client";

import React from 'react'
import {
    useRive,
    Layout,
    Fit,
    Alignment,
} from "@rive-app/react-canvas";
import { Button } from "~/components/ui/button";
import { MoveRight } from "lucide-react";

export const Contact = () => {
    const { RiveComponent } = useRive({
        src: "/riv/question-jar.riv",
        autoplay: true,
        layout: new Layout({
            fit: Fit.Contain,
            alignment: Alignment.Center,
        }),
    });

    return (
        <section className="py-24 bg-[#FFFAF5]">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-5xl md:text-6xl font-heading text-black mb-4">
                        Have any questions?
                    </h2>
                    <p className="text-lg text-black font-medium">
                        You've got questions, we've got answers!
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 max-w-6xl mx-auto items-start">

                    {/* Form Side */}
                    <div className="flex-1 w-full max-w-xl">
                        <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>

                            {/* Full Name */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="name" className="font-heading text-lg text-black">
                                    Full name*
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    required
                                    className="w-full h-12 bg-transparent border-[1.5px] border-black rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="email" className="font-heading text-lg text-black">
                                    Email*
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    className="w-full h-12 bg-transparent border-[1.5px] border-black rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            {/* Phone */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="phone" className="font-heading text-lg text-black">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    className="w-full h-12 bg-transparent border-[1.5px] border-black rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            {/* Questions Select */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="questions" className="font-heading text-lg text-black">
                                    Questions
                                </label>
                                <div className="relative">
                                    <select
                                        id="questions"
                                        className="w-full h-12 bg-transparent border-[1.5px] border-black rounded-lg px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                                    >
                                        <option value="">Select</option>
                                        <option value="pricing">Pricing</option>
                                        <option value="support">Technical Support</option>
                                        <option value="sales">Sales</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1.5L6 6.5L11 1.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Message */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="message" className="font-heading text-lg text-black">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    className="w-full bg-transparent border-[1.5px] border-black rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                ></textarea>
                            </div>

                            {/* Consent Checkbox */}
                            <div className="flex flex-col gap-3 mt-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            className="peer appearance-none w-5 h-5 border-[1.5px] border-black rounded-sm checked:bg-black transition-colors cursor-pointer"
                                        />
                                        <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <span className="text-black font-medium">I agree to receive text messages</span>
                                </label>
                                <p className="text-xs text-black leading-relaxed font-medium">
                                    By providing your mobile phone number and checking this box, you opt in to receive SMS. You may unsubscribe at any point by texting the word 'STOP'. Reply HELP for help. Privacy Policy and Terms & Conditions.
                                </p>
                            </div>

                            {/* Submit Button */}
                            <div className="mt-4 flex flex-col items-start gap-4">
                                <Button variant="textured" className="h-12 px-8 text-base">
                                    Submit
                                    <MoveRight className="ml-2 size-5" />
                                </Button>
                                <span className="text-xs text-black font-medium">* Required field</span>
                            </div>
                        </form>
                    </div>

                    {/* Rive Animation Side */}
                    <div className="flex-1 w-full h-[600px] sticky top-24 hidden md:block">
                        <RiveComponent className="w-full h-full object-contain" />
                    </div>

                </div>
            </div>
        </section>
    )
}
