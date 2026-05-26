"use client";

import Link from "next/link";
import { Check } from "lucide-react";

import Header from "~/components/layout/Header";
import { Footer } from "~/components/layout/Footer";
import { Button } from "~/components/ui/button";

const PRICING_PLANS = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started and trying out the platform.",
    features: [
      "100 responses per month",
      "Unlimited forms",
      "Basic form templates",
      "Standard support",
    ],
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/mo",
    description: "Ideal for professionals and small teams building engaging forms.",
    features: [
      "3,000 responses per month",
      "Remove mmf. branding",
      "Custom domains",
      "Advanced form logic",
      "Priority email support",
    ],
    buttonText: "Upgrade to Pro",
    buttonVariant: "textured" as const,
    highlighted: true,
  },
  {
    name: "Business",
    price: "$49",
    period: "/mo",
    description: "For growing businesses needing advanced features and collaboration.",
    features: [
      "11,000 responses per month",
      "Team collaboration",
      "Advanced analytics",
      "API & Webhooks",
      "24/7 priority support",
    ],
    buttonText: "Upgrade to Business",
    buttonVariant: "outline" as const,
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-1 w-full pt-20 pb-32 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
            <h1 className="text-4xl md:text-5xl lg:text-[64px] font-heading leading-tight mb-6 text-heading">
              Simple, transparent <br className="hidden sm:block" />
              <span className="text-primary">pricing for everyone</span>
            </h1>
            <p className="text-lg text-foreground-muted">
              Whether you're just starting out or scaling your business, we have a plan that fits your needs. No hidden fees.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col p-8 rounded-2xl border ${
                  plan.highlighted
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                    : "border-border bg-card shadow-sm"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <p className="text-sm text-foreground-muted h-10 mb-6">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-heading">{plan.price}</span>
                    {plan.period && (
                      <span className="text-foreground-muted font-medium">
                        {plan.period}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold mb-4">What's included:</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm">
                        <Check className="h-5 w-5 text-primary shrink-0" />
                        <span className="text-foreground-muted">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  variant={plan.buttonVariant}
                  className={`w-full h-11 ${
                    !plan.highlighted
                      ? "bg-transparent border-border hover:bg-background-secondary"
                      : ""
                  }`}
                  asChild
                >
                  <Link href="/registration">{plan.buttonText}</Link>
                </Button>
              </div>
            ))}
          </div>

          {/* FAQ or Extra Info */}
          <div className="mt-32 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-heading mb-4">Need a custom enterprise plan?</h2>
            <p className="text-foreground-muted mb-8">
              We offer tailored solutions for high-volume usage, custom integrations, and dedicated support.
            </p>
            <Button variant="outline" className="h-11 px-8 rounded-full" asChild>
              <Link href="/">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}