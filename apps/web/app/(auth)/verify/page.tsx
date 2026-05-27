"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import {
    FieldDescription,
    FieldGroup,
} from "~/components/ui/field";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
    CircleCheckIcon,
    InfoIcon,
    Mail,
    MousePointerClick,
    Loader2,
    XCircleIcon,
} from "lucide-react";
import { useVerifyEmail } from "~/hooks/api/auth";

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

function VerifyContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");
    const { verifyUserEmailWithTokenAsync } = useVerifyEmail();

    const [verificationState, setVerificationState] = useState<
        "idle" | "verifying" | "success" | "error"
    >(token ? "verifying" : "idle");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (token) {
            let isMounted = true;
            verifyUserEmailWithTokenAsync({ token })
                .then(() => {
                    if (isMounted) setVerificationState("success");
                })
                .catch((err) => {
                    if (isMounted) {
                        setVerificationState("error");
                        setErrorMessage(
                            err.message || "Failed to verify email. The link might be expired."
                        );
                    }
                });
            return () => {
                isMounted = false;
            };
        }
    }, [token, verifyUserEmailWithTokenAsync]);

    if (verificationState === "verifying") {
        return (
            <Card className="overflow-hidden p-0 mb-8">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <div className="p-6 md:p-7 border-r flex flex-col items-center justify-center min-h-[400px] text-center gap-4">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <h1 className="text-xl font-bold">Verifying your email...</h1>
                        <p className="text-muted-foreground text-sm">
                            Please wait while we confirm your account.
                        </p>
                    </div>
                    <div className="bg-muted relative hidden md:block mask-l-from-70% mask-l-to-110%">
                        <Image
                            src="/assets/auth-use.jpg"
                            alt="Verifying"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (verificationState === "success") {
        return (
            <Card className="overflow-hidden p-0 mb-8">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <div className="p-6 md:p-7 border-r flex flex-col items-center justify-center min-h-[400px] text-center gap-6">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                            <CircleCheckIcon className="h-8 w-8 text-green-500" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold">Email Verified!</h1>
                            <p className="text-muted-foreground text-sm text-balance">
                                Your account has been successfully verified. You can now access all
                                features.
                            </p>
                        </div>
                        <Button
                            className="w-full max-w-sm mt-4"
                            onClick={() => router.push("/")}
                        >
                            Continue to Dashboard
                        </Button>
                    </div>
                    <div className="bg-muted relative hidden md:block mask-l-from-70% mask-l-to-110%">
                        <Image
                            src="/assets/auth-use.jpg"
                            alt="Success"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (verificationState === "error") {
        return (
            <Card className="overflow-hidden p-0 mb-8">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <div className="p-6 md:p-7 border-r flex flex-col items-center justify-center min-h-[400px] text-center gap-6">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                            <XCircleIcon className="h-8 w-8 text-destructive" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold">Verification Failed</h1>
                            <p className="text-muted-foreground text-sm text-balance">
                                {errorMessage}
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full max-w-sm mt-4"
                            onClick={() => router.push("/login")}
                        >
                            Return to Login
                        </Button>
                    </div>
                    <div className="bg-muted relative hidden md:block mask-l-from-70% mask-l-to-110%">
                        <Image
                            src="/assets/auth-use.jpg"
                            alt="Error"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Default / idle state
    return (
        <Card className="overflow-hidden p-0 mb-8">
            <CardContent className="grid p-0 md:grid-cols-2">
                <div className="p-6 md:p-7 border-r">
                    <FieldGroup>
                        <div className="flex flex-col items-center gap-1.5 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                <CircleCheckIcon className="h-6 w-6 text-primary" />
                            </div>
                            <h1 className="text-xl font-bold">You&apos;re almost done!</h1>
                            <p className="text-muted-foreground text-sm text-balance">
                                We&apos;ve sent you an email to finish setting up your account
                            </p>
                        </div>

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
    );
}

export default function Page() {
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
                <Suspense
                    fallback={
                        <Card className="overflow-hidden p-0 mb-8">
                            <CardContent className="flex min-h-[400px] items-center justify-center">
                                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                            </CardContent>
                        </Card>
                    }
                >
                    <VerifyContent />
                </Suspense>
                <FieldDescription className="px-6 text-center mt-2">
                    By continuing, you agree to our{" "}
                    <Link href="/terms">Terms of Service</Link> and{" "}
                    <Link href="/terms">Privacy Policy</Link>.
                </FieldDescription>
            </div>
        </div>
    );
}
