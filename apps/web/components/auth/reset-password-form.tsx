"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Eye, EyeOff, ChevronLeft } from "lucide-react";
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

type ResetPasswordFormValues = {
    password: string;
    confirmPassword: string;
};

interface ResetPasswordFormProps extends React.ComponentPropsWithoutRef<"div"> {
    id: string;
}

export function ResetPasswordForm({
    id,
    className,
    ...props
}: ResetPasswordFormProps) {
    const router = useRouter();
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Console log the ID from URL as requested
    useEffect(() => {
        console.log("Reset Password ID from URL:", id);
    }, [id]);

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
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordFormValues>({
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
        mode: "onSubmit"
    });

    const passwordValue = watch("password");

    const submitForm = async (data: ResetPasswordFormValues) => {
        setSubmitError(null);
        try {
            // Mocking API call for reset password
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("Submitting new password for ID:", id);

            toast.success("Password reset successfully");
            router.push("/login");
        } catch (error) {
            const message = "Failed to reset password. Please try again.";
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

                        <h1 className="text-center text-xl font-medium text-foreground mb-4">Set new password 🔒</h1>
                        <p className="text-center text-sm text-foreground-muted mb-8">
                            Please enter your new password below.
                        </p>

                        <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
                            <FieldGroup className="space-y-4">
                                <Field>
                                    <FieldLabel htmlFor="password" className="text-[13px] text-foreground font-normal">New Password</FieldLabel>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your new password"
                                            className="bg-transparent border-border text-[13px] text-foreground placeholder:text-foreground-muted focus-visible:ring-ring focus-visible:border-primary h-10 rounded-lg"
                                            {...register("password", {
                                                required: "Password is required",
                                                minLength: {
                                                    value: 6,
                                                    message: "Password must be at least 6 characters",
                                                },
                                            })}
                                            disabled={isSubmitting}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
                                        >
                                            {showPassword ? (
                                                <Eye className="h-4 w-4" />
                                            ) : (
                                                <EyeOff className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    <FieldError errors={[errors.password]} />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="confirmPassword" className="text-[13px] text-foreground font-normal">Confirm Password</FieldLabel>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm your new password"
                                            className="bg-transparent border-border text-[13px] text-foreground placeholder:text-foreground-muted focus-visible:ring-ring focus-visible:border-primary h-10 rounded-lg"
                                            {...register("confirmPassword", {
                                                required: "Please confirm your password",
                                                validate: (value) =>
                                                    value === passwordValue || "Passwords do not match",
                                            })}
                                            disabled={isSubmitting}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
                                        >
                                            {showConfirmPassword ? (
                                                <Eye className="h-4 w-4" />
                                            ) : (
                                                <EyeOff className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    <FieldError errors={[errors.confirmPassword]} />
                                </Field>

                                <FieldError>{submitError}</FieldError>

                                <Button
                                    type="submit"
                                    className="w-full bg-button hover:bg-button-hover text-button-foreground h-10 text-sm font-medium rounded-lg mt-2 transition-colors border-0"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Updating..." : "Update password"}
                                </Button>
                            </FieldGroup>
                        </form>
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