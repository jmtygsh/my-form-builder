import * as React from "react";
import {
  Type,
  CheckCircle2,
  HelpCircle,
  PenTool,
  Star,
  Calculator,
  ChevronUp,
  GripVertical
} from "lucide-react";

export default function Features() {
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="text-center max-w-5xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-foreground mb-6">
          More than your standard form builder
        </h2>
        <p className="text-lg text-foreground-muted max-w-2xl mx-auto font-medium">
          mmf. is a powerful online form builder that offers more than just forms. Build free online forms, surveys,
          and quizzes to connect with your audience and get refined data in one nifty place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Card 1: Purple - Forms */}
        <div className="relative group">
          {/* Brutalist Textured Shadow */}
          <div className="absolute inset-0 z-0 translate-x-[8px] translate-y-[8px] rounded-[32px] border-2 border-black bg-[url('/assets/texture.png')] bg-repeat transition-transform group-hover:translate-x-[4px] group-hover:translate-y-[4px]"></div>

          <div className="bg-[#e9e4ff] border-2 border-black rounded-[32px] p-6 flex flex-col h-[500px] relative z-10 overflow-hidden">
            <div className="flex-1 pt-8 px-2 flex flex-col gap-4">
              {/* Mock UI Elements - Neo-Brutalist */}
              <div className="bg-white border-2 border-black rounded-xl p-3 flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform transition-transform group-hover:-translate-y-1">
                <div className="bg-purple-200 border-2 border-black p-1.5 rounded-md text-black">
                  <Type className="w-4 h-4 stroke-[3]" />
                </div>
                <span className="text-sm font-bold text-black">Short Text</span>
              </div>

              <div className="bg-white border-2 border-black rounded-xl p-3 flex items-center justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform scale-105 z-20">
                <div className="flex items-center gap-3">
                  <div className="bg-[#4b3c7a] border-2 border-black p-1.5 rounded-full text-white">
                    <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                  </div>
                  <span className="text-sm font-bold text-black">Single Selection</span>
                </div>
                <GripVertical className="w-5 h-5 text-black" />
              </div>

              <div className="bg-white border-2 border-black rounded-xl p-3 flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform transition-transform group-hover:translate-y-1">
                <div className="bg-purple-200 border-2 border-black p-1.5 rounded-full text-black">
                  <HelpCircle className="w-4 h-4 stroke-[3]" />
                </div>
                <span className="text-sm font-bold text-black">Yes / No</span>
              </div>

              <div className="bg-[#f3f4f6] border-2 border-black rounded-xl p-3 flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform transition-transform group-hover:translate-y-2">
                <div className="bg-white border-2 border-black p-1.5 rounded-md text-black">
                  <PenTool className="w-4 h-4 stroke-[3]" />
                </div>
                <span className="text-sm font-bold text-black">Signature</span>
              </div>
            </div>

            {/* Text Box */}
            <div className="bg-white border-2 border-black rounded-2xl p-6 relative z-20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-auto">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg text-black">Create forms</h3>
                <ChevronUp className="w-5 h-5 text-black stroke-[3]" />
              </div>
              <p className="text-sm text-foreground-muted font-medium leading-relaxed">
                From contact forms to registration forms, build any type of form with the easiest online form builder.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Green - Surveys */}
        <div className="relative group">
          <div className="absolute inset-0 z-0 translate-x-[8px] translate-y-[8px] rounded-[32px] border-2 border-black bg-[url('/assets/texture.png')] bg-repeat transition-transform group-hover:translate-x-[4px] group-hover:translate-y-[4px]"></div>

          <div className="bg-[#d1f4e0] border-2 border-black rounded-[32px] p-6 flex flex-col h-[500px] relative z-10 overflow-hidden">
            <div className="flex-1 pt-8 px-2 flex flex-col gap-5">
              {/* Mock UI Elements */}
              <div className="bg-white border-2 border-black rounded-xl p-4 flex justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-2">
                {[1, 2, 3, 4].map((i) => (
                  <Star key={i} className="w-6 h-6 fill-[#5ccdb1] text-black stroke-2" />
                ))}
                <Star className="w-6 h-6 fill-white text-black stroke-2" />
              </div>

              <div className="bg-white border-2 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between text-sm mb-3 text-black">
                  <span className="font-bold">Very satisfied</span>
                  <span className="font-bold">50%</span>
                </div>
                <div className="w-full bg-green-100 border-2 border-black rounded-full h-4 overflow-hidden relative">
                  <div className="bg-[#5ccdb1] border-r-2 border-black h-full w-1/2 transition-all duration-1000 group-hover:w-[60%]"></div>
                </div>
              </div>

              <div className="bg-white border-2 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between text-sm mb-3 text-black">
                  <span className="font-bold">Satisfied</span>
                  <span className="font-bold">20%</span>
                </div>
                <div className="w-full bg-green-100 border-2 border-black rounded-full h-4 overflow-hidden relative">
                  <div className="bg-[#5ccdb1] border-r-2 border-black h-full w-1/5 transition-all duration-1000 group-hover:w-[25%]"></div>
                </div>
              </div>
            </div>

            {/* Text Box */}
            <div className="bg-white border-2 border-black rounded-2xl p-6 relative z-20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-auto">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg text-black">Make surveys</h3>
                <ChevronUp className="w-5 h-5 text-black stroke-[3]" />
              </div>
              <p className="text-sm text-foreground-muted font-medium leading-relaxed">
                Gather data & insights effortlessly to understand your audience with powerful survey forms.
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Pink - Quizzes */}
        <div className="relative group">
          <div className="absolute inset-0 z-0 translate-x-[8px] translate-y-[8px] rounded-[32px] border-2 border-black bg-[url('/assets/texture.png')] bg-repeat transition-transform group-hover:translate-x-[4px] group-hover:translate-y-[4px]"></div>

          <div className="bg-[#ffe4f0] border-2 border-black rounded-[32px] p-6 flex flex-col h-[500px] relative z-10 overflow-hidden">
            <div className="flex-1 pt-8 px-2 flex flex-col gap-5">
              {/* Mock UI Elements */}
              <div className="bg-white border-2 border-black rounded-xl p-4 flex items-center gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="bg-pink-200 border-2 border-black p-2 rounded-lg text-black">
                  <Calculator className="w-5 h-5 stroke-[3]" />
                </div>
                <span className="text-sm font-bold text-black text-lg">Your score: 80</span>
              </div>

              <div className="bg-white border-2 border-black rounded-2xl p-6 flex flex-col items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-4 h-40 transform transition-transform group-hover:scale-105">
                <span className="text-sm font-bold text-black mb-4 text-center">
                  Thank you for your participation!
                </span>
                <div className="text-4xl animate-bounce mt-2">
                  🙌
                </div>
              </div>
            </div>

            {/* Text Box */}
            <div className="bg-white border-2 border-black rounded-2xl p-6 relative z-20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-auto">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg text-black">Run quizzes</h3>
                <ChevronUp className="w-5 h-5 text-black stroke-[3]" />
              </div>
              <p className="text-sm text-foreground-muted font-medium leading-relaxed">
                Engage your audience, get more leads, and drive more sales with interactive quiz forms.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
