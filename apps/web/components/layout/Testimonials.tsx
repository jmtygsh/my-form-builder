"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    quote: "mmf. is a great solution for research! With mmf. I can always be sure to gather a reliable source of info from my dedicated research surveys, also integrating it with Zapier to streamline the process!",
    name: "Juan Pablo R.",
    role: "Sales Marketing Manager"
  },
  {
    quote: "The best form builder I've ever used. The neo-brutalist aesthetic perfectly matches our brand, and the conversion rates have skyrocketed since we switched. Highly recommended for any creative team.",
    name: "Sarah Jenkins",
    role: "Creative Director"
  },
  {
    quote: "I was looking for something that didn't look like every other boring corporate form. This is exactly it. It's fun, engaging, and incredibly easy to set up. My audience loves it.",
    name: "Marcus Thorne",
    role: "Indie Hacker"
  },

  {
    quote: "We've tried dozens of form tools, but mmf. is the only one that genuinely feels like an extension of our own product. The completion rates have been phenomenal since we launched.",
    name: "Elena Rodriguez",
    role: "Product Manager"
  }
];

export default function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false
  });

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="py-24 overflow-hidden ">

      <div className="container mx-auto px-4 mb-16 relative z-10">
        <h2 className="text-3xl md:text-4xl font-heading italic text-foreground text-center">
          Here's what people say about us
        </h2>
      </div>

      <div className="relative  px-4 overflow-hidden cursor-grab">

        {/* Global Section Texture Masks - Attached to the far left and right edges of the carousel area */}
        <div
          className="absolute inset-y-0 left-0 w-3 pointer-events-none opacity-40 mix-blend-multiply z-40"
          style={{
            backgroundImage: "url('/assets/quote-side.png')",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "left center"
          }}
        >
        </div>
        <div
          className="absolute inset-y-0 right-0 w-3 pointer-events-none opacity-40 mix-blend-multiply -scale-x-100 z-40"
          style={{
            backgroundImage: "url('/assets/quote-side.png')",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "left center"
          }}
        ></div>

        {/* Navigation Arrows - Custom Drawn SVGs */}
        {/* <div className="absolute top-1/2 -translate-y-1/2 left-0 md:left-[10%] lg:left-[12%] z-30 hidden sm:block">
          <button
            onClick={scrollPrev}
            className="w-12 h-12 flex items-center justify-center text-black hover:opacity-70 transition-opacity cursor-pointer"
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 12H4M4 12L10 6M4 12L10 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="sketchy-line" />
            </svg>
          </button>
        </div> */}

        {/* <div className="absolute top-1/2 -translate-y-1/2 right-0 md:right-[10%] lg:right-[12%] z-30 hidden sm:block">
          <button
            onClick={scrollNext}
            className="w-12 h-12 flex items-center justify-center text-black hover:opacity-70 transition-opacity cursor-pointer"
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="sketchy-line" />
            </svg>
          </button>
        </div> */}

        {/* Carousel */}
        <div className="overflow-visible" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex-[0_0_85%] sm:flex-[0_0_70%] md:flex-[0_0_60%] lg:flex-[0_0_40%] min-w-0 px-5 md:px-8 py-4"
              >
                <div className="relative group h-full">

                  {/* Neo-Brutalist Shadow using texture */}
                  <div className="absolute inset-0 z-0 translate-x-[6px] translate-y-[6px] rounded-2xl border-[1.5px] border-black bg-[url('/assets/texture.png')] bg-repeat transition-transform group-hover:translate-x-[3px] group-hover:translate-y-[3px]"></div>

                  {/* Card Content - Clean White with Black Border */}
                  <div className="bg-white border-[1.5px] border-black rounded-2xl p-8 md:p-12 relative z-10 h-full flex flex-col overflow-hidden transition-transform group-hover:-translate-y-1 group-hover:-translate-x-1">

                    {/* Content Wrapper */}
                    <div className="relative z-20 flex flex-col h-full">
                      {/* Quote Icon Top Left */}
                      <div className="mb-6">
                        <Quote className="w-10 h-10 fill-black text-black rotate-180" />
                      </div>

                      <p className="text-base md:text-lg font-medium text-black mb-12 leading-relaxed grow">
                        {testimonial.quote}
                      </p>

                      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">

                        {/* Name with underline (Signature style) */}
                        <div className="w-full sm:w-2/3 border-b border-black/30 pb-2">
                          <span className="font-script text-3xl md:text-4xl text-black">
                            {testimonial.name.split(' ')[0]}
                          </span>
                        </div>

                        {/* Fake BBB / 5-Star Rating block */}
                        <div className="flex items-center gap-3 shrink-0">
                          {/* Mock BBB Logo Shape */}
                          <div className="flex flex-col items-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-1">
                              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="black" />
                            </svg>
                            <span className="text-[10px] font-bold tracking-tighter">BBB</span>
                          </div>

                          <div className="flex flex-col">
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <Star key={i} className="w-3 h-3 fill-black text-black" />
                              ))}
                            </div>
                            <span className="text-[10px] font-bold mt-0.5">5-Star</span>
                            <span className="text-[10px] font-medium leading-none">Verified Review</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}