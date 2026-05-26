import * as React from "react";
import {
  Grip,
  Smartphone,
  GitBranch,
  Layers,
  PenTool
} from "lucide-react";

export default function PowerfulFeatures() {
  const features = [
    {
      icon: <Grip className="w-8 h-8 stroke-[1.5]" />,
      title: "Drag & drop form builder",
      description: "The easiest way to create a custom form. Simply drag and drop a form field from the menu, and that's it."
    },
    {
      icon: <Smartphone className="w-8 h-8 stroke-[1.5]" />,
      title: "Mobile-ready layouts",
      description: "Your online forms are mobile-responsive from the get-go. Offer a smooth experience on all devices."
    },
    {
      icon: <GitBranch className="w-8 h-8 stroke-[1.5]" />,
      title: "Conditional logic",
      description: "Create dynamic forms with personalized experiences. Show or hide your questions based on answers."
    },
    {
      icon: <Layers className="w-8 h-8 stroke-[1.5]" />,
      title: "Multiple pages",
      description: "Long forms, no problem. Add page breaks to make your form easy to follow and easy to fill out."
    },
    {
      icon: <PenTool className="w-8 h-8 stroke-[1.5]" />,
      title: "E-signatures",
      description: "Need signatures from your respondents? Use our free form builder to collect legally binding signatures through your online forms."
    },
    {
      icon: <PenTool className="w-8 h-8 stroke-[1.5]" />,
      title: "E-signatures",
      description: "Need signatures from your respondents? Use our free form builder to collect legally binding signatures through your online forms."
    }
  ];

  return (
    <section className="container mx-auto px-4 py-24">
      <div className="text-center max-w-4xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-foreground mb-6">
          Powerful form features for more conversions
        </h2>
        <p className="text-lg text-foreground-muted max-w-2xl mx-auto font-medium">
          As a powerful online form builder, mmf. makes creating and managing forms easy for everyone. So, you can build all you need in one form, or another.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="relative group">
            {/* Neo-Brutalist Shadow using your texture */}
            <div className="absolute inset-0 z-0 translate-x-[6px] translate-y-[6px] rounded-2xl border-[1.5px] border-black bg-[url('/assets/texture.png')] bg-repeat transition-transform group-hover:translate-x-[3px] group-hover:translate-y-[3px]"></div>

            {/* Card Content */}
            <div className="bg-white border-[1.5px] border-black rounded-2xl p-8 relative z-10 h-full flex flex-col transition-transform group-hover:-translate-y-1 group-hover:-translate-x-1">
              <div className="mb-6 text-black">
                {feature.icon}
              </div>

              <h3 className="font-bold text-xl text-black mb-4">
                {feature.title}
              </h3>

              <p className="text-base text-foreground-muted font-medium leading-relaxed flex-grow">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}