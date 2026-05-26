"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";

type ForgotPasswordFormValues = {
    email: string;
};

export function ForgotPasswordForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const { RiveComponent } = useRive({
        src: "/riv/tax-planning.riv",
        autoplay: true,
        stateMachines: "state_tax-planning",
        layout: new Layout({
            fit: Fit.Contain,
            alignment: Alignment.Center,
        }),
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordFormValues>({
        defaultValues: {
            email: "",
        },
        mode: "onSubmit"
    });

    const submitForm = async (data: ForgotPasswordFormValues) => {
        setSubmitError(null);
        try {
            // Mocking API call for forgot password
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("Password reset requested for:", data.email);

            setIsSuccess(true);
            toast.success("Password reset link sent to your email");
        } catch (error) {
            const message = "Failed to send reset link. Please try again.";
            setSubmitError(message);
            toast.error(message);
        }
    }

    return (
        <div className={cn("min-h-screen w-full bg-background text-foreground flex", className)} {...props}>
            <div className="flex-1 flex flex-col relative">
                {/* Back Button */}
                <div className="absolute top-6 left-6 z-50">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 bg-background-secondary border-border text-foreground-muted hover:text-foreground hover:bg-card hover:border-border-hover rounded-lg"
                        asChild
                    >
                        <Link href="/login">
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                    <div className="w-full max-w-[360px]">
                        <div className="flex items-center justify-center gap-2.5 mb-6 absolute top-10 left-1/2 -translate-x-1/2">
                            <Link href="/" className="flex items-center gap-2">
                                <span className="font-script text-3xl md:text-4xl text-foreground leading-none -mt-1 tracking-tight">
                                    mmf.
                                </span>
                            </Link>
                        </div>

                        <h1 className="text-center text-xl font-medium text-foreground mb-4">Reset your password 🔐</h1>
                        <p className="text-center text-sm text-foreground-muted mb-8">
                            Enter your email address and we will send you a link to reset your password.
                        </p>

                        {!isSuccess ? (
                            <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
                                <FieldGroup className="space-y-4">
                                    <Field>
                                        <FieldLabel htmlFor="email" className="text-[13px] text-foreground font-normal">Email</FieldLabel>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="example@domain.com"
                                            className="bg-transparent border-border text-[13px] text-foreground placeholder:text-foreground-muted focus-visible:ring-ring focus-visible:border-primary h-10 rounded-lg"
                                            {...register("email", { required: "Email is required" })}
                                            disabled={isSubmitting}
                                        />
                                        <FieldError errors={[errors.email]} />
                                    </Field>

                                    <FieldError>{submitError}</FieldError>

                                    <Button
                                        type="submit"
                                        className="w-full bg-button hover:bg-button-hover text-button-foreground h-10 text-sm font-medium rounded-lg mt-2 transition-colors border-0"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Sending link..." : "Send reset link"}
                                    </Button>
                                </FieldGroup>
                            </form>
                        ) : (
                            <div className="bg-card border border-border rounded-xl p-6 text-center">
                                <p className="text-sm text-foreground mb-4">
                                    We've sent a password reset link to your email. Please check your inbox (and spam folder).
                                </p>
                                <Button
                                    variant="outline"
                                    className="w-full h-10"
                                    onClick={() => setIsSuccess(false)}
                                >
                                    Try another email
                                </Button>
                            </div>
                        )}

                        <div className="mt-8 text-center text-sm text-foreground-muted">
                            Remember your password?{" "}
                            <Link href="/login" className="text-primary hover:text-primary-hover font-medium">
                                Log in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Pane Promo Animation */}
            <div className="hidden lg:block w-[48%] max-w-3xl p-4 pl-0">
                <div className="w-full h-full bg-background-secondary rounded-xl p-12 flex flex-col relative overflow-hidden">
                    <div className="max-w-xl mx-auto w-full pt-12 relative z-10 flex flex-col h-full">
                        <h2 className="text-[34px] font-heading leading-tight mb-4 text-heading">
                            Match your brandstyle &<br />
                            <span className="text-primary">Impress your audience</span>
                        </h2>
                        <p className="text-foreground text-[14px] leading-relaxed mb-8">
                            Leave a lasting impression by choosing from 50+ themes or making customizations to showcase your flair and creativity.
                        </p>

                        <div className="relative w-full flex-1 min-h-[400px]">
                            <RiveComponent className="w-full h-full absolute inset-0" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}