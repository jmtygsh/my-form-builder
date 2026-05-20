"use client";


import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "~/components/ui/field";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import {
    CircleCheckIcon,
    InfoIcon,
    Mail,
    MailIcon,
    MousePointerClick,
} from "lucide-react";


const steps = [
    {
        number: 1,
        icon: Mail,
        title: "Check your email inbox",
        description: "Look for an email from us (it might take a minute)",
    },
    {
        number: 2,
        icon: MousePointerClick,
        title: "Click the link in the email",
        description: "This will confirm your account and keep it safe",
    },
];

function StepItem({
    number,
    icon: Icon,
    title,
    description,
    isLast,
}: {
    number: number;
    icon: React.ElementType;
    title: string;
    description: string;
    isLast: boolean;
}) {
    return (
        <div className="relative flex gap-3">
            {!isLast && (
                <div className="absolute left-[18px] top-9 bottom-0 w-px bg-border" />
            )}
            <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-primary">
                <Icon className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 pb-5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Step {number}
                </span>
                <h3 className="text-sm font-semibold text-foreground leading-snug">
                    {title}
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
}

export default function Page() {
    const [email] = useState<string | null>(() => {
        // Initialize email from sessionStorage on client side
        if (typeof window !== "undefined") {
            return sessionStorage.getItem("signup_email");
        }
        return null;
    });

    return (
        <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/7 via-background to-primary/3" />
            <div
                className="absolute inset-0 z-[1] bg-[linear-gradient(to_right,_var(--muted)_1px,_transparent_1px),linear-gradient(to_bottom,_var(--muted)_1px,_transparent_1px)] bg-[length:32px_32px]"
                style={{
                    WebkitMaskImage:
                        "radial-gradient(ellipse 60% 60% at 0% 0%, #000 30%, transparent 90%), radial-gradient(ellipse 80% 80% at 100% 100%, #000 50%, transparent 90%)",
                    maskImage:
                        "radial-gradient(ellipse 80% 80% at 0% 0%, #000 40%, transparent 90%), radial-gradient(ellipse 80% 80% at 100% 100%, #000 50%, transparent 90%)",
                }}
            />
            <div className="relative z-10 w-full max-w-4xl">
                <Card className="overflow-hidden p-0 mb-8">
                    <CardContent className="grid p-0 md:grid-cols-2">
                        <div className="p-6 md:p-7 border-r">
                            <FieldGroup>
                                <div className="flex flex-col items-center gap-1.5 text-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                        <CircleCheckIcon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h1 className="text-xl font-bold">
                                        You&apos;re almost done!
                                    </h1>
                                    <p className="text-muted-foreground text-sm text-balance">
                                        We&apos;ve sent you an email to finish setting up your
                                        account
                                    </p>
                                </div>

                                {email && (
                                    <Field>
                                        <FieldLabel>Email sent to:</FieldLabel>
                                        <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2">
                                            <MailIcon className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">{email}</span>
                                        </div>
                                    </Field>
                                )}

                                <Card className="w-full">
                                    <CardHeader className="pb-1 pt-4 px-4">
                                        <CardTitle className="text-base">What to do next</CardTitle>
                                        <CardDescription className="text-xs">
                                            Follow these steps to complete your account setup
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="px-4 pb-3 pt-2">
                                        {steps.map((step, index) => (
                                            <StepItem
                                                key={step.number}
                                                number={step.number}
                                                icon={step.icon}
                                                title={step.title}
                                                description={step.description}
                                                isLast={index === steps.length - 1}
                                            />
                                        ))}
                                    </CardContent>
                                </Card>

                                <Alert className="py-2.5">
                                    <InfoIcon className="h-4 w-4" />
                                    <AlertTitle className="text-sm">
                                        Can&apos;t find the email?
                                    </AlertTitle>
                                    <AlertDescription>
                                        <ul className="mt-1 space-y-1 text-xs list-disc list-inside">
                                            <li>Check your spam or junk folder</li>
                                            <li>Make sure you entered the correct email address</li>
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            </FieldGroup>
                        </div>
                        <div className="bg-muted relative hidden md:block mask-l-from-70% mask-l-to-110%">
                            <Image
                                src="/assets/auth-use.jpg"
                                alt="Sign up success"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </CardContent>
                </Card>
                <FieldDescription className="px-6 text-center">
                    By continuing, you agree to our{" "}
                    <Link href="/terms">Terms of Service</Link> and{" "}
                    <Link href="/terms">Privacy Policy</Link>.
                </FieldDescription>
            </div>
        </div>
    );
}
