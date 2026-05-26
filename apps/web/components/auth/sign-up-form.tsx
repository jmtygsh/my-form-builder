"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Eye, EyeOff, ChevronLeft } from "lucide-react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";

import { useSignUp } from "~/hooks/api/auth";


type SignUpFormValues = {
    fullname: string;
    email: string;
    password: string;
    terms: boolean;
};


export function SignUpForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const router = useRouter();
    const { createUserWithEmailAndPasswordAsync } = useSignUp();
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

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
        control,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormValues>({
        defaultValues: {
            fullname: "",
            email: "",
            password: "",
            terms: false,
        },
        mode: "onSubmit"
    });

    const submitForm = async (data: SignUpFormValues) => {
        setSubmitError(null);

        if (!data.terms) {
            toast.error("Please accept the terms");
            return;
        }

        try {
            await createUserWithEmailAndPasswordAsync({
                fullName: data.fullname,
                email: data.email,
                password: data.password,
            });

            toast.success("Form submitted successfully");
            router.push("/verify");
        } catch (error) {
            // console.log(error);
            const message = "Failed to create account"
            setSubmitError(message);
            toast.error(message);
        }
    }

    return (
        <div className={cn("min-h-screen w-full bg-background text-foreground flex", className)} {...props}>

            <div className="flex-1 flex flex-col relative z-50">
                {/* Back Button */}
                <div className="absolute top-6 left-6 z-10">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 bg-background-secondary border-border text-foreground-muted hover:text-foreground hover:bg-card hover:border-border-hover rounded-lg"
                        asChild
                    >
                        <Link href="/">
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                    </Button>


                </div>



                <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                    <div className="w-full max-w-[360px] ">

                        <div className="flex items-center justify-center gap-2.5 mb-6 absolute top-10 left-1/2 -translate-x-1/2">
                            <Link href="/" className="flex items-center gap-2">
                                <span className="font-script text-3xl md:text-4xl text-foreground leading-none -mt-1 tracking-tight">
                                    mmf.
                                </span>

                            </Link>
                        </div>
                        <h1 className="text-center text-xl font-medium text-foreground mb-12">Create your account for free!</h1>


                        {/* Form */}
                        <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
                            <FieldGroup className="space-y-4">
                                <Field>
                                    <FieldLabel htmlFor="fullname" className="text-[13px] text-foreground font-normal">Full Name</FieldLabel>
                                    <Input
                                        id="fullname"
                                        type="text"
                                        placeholder="Please enter full name"
                                        className="bg-transparent border-border text-[13px] text-foreground placeholder:text-foreground-placeholder focus-visible:ring-ring focus-visible:border-primary h-10 rounded-lg"
                                        {...register("fullname", { required: "Full name is required" })}
                                        disabled={isSubmitting}
                                    />
                                    <FieldError errors={[errors.fullname]} />
                                </Field>

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

                                <Field>
                                    <FieldLabel htmlFor="Password" className="text-[13px] text-foreground font-normal">Password</FieldLabel>
                                    <div className="relative">
                                        <Input
                                            id="Password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Please enter your password"
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




                                <Field className="pt-2">
                                    <div className="flex items-start space-x-3">
                                        <Controller
                                            name="terms"
                                            control={control}
                                            rules={{ required: "You must agree to the terms" }}
                                            render={({ field }) => (
                                                <Checkbox
                                                    id="terms"
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    disabled={isSubmitting}
                                                    className="mt-1 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded-[4px]"
                                                />
                                            )}
                                        />
                                        <label
                                            htmlFor="terms"
                                            className="text-sm text-foreground-muted font-normal leading-relaxed"
                                        >
                                            I agree to the MakeMyForm's <Link href="/terms" className="text-foreground underline underline-offset-2 hover:text-primary">Terms of Use</Link> and <Link href="/privacy" className="text-foreground underline underline-offset-2 hover:text-primary">Privacy Policy</Link>.
                                        </label>
                                    </div>
                                    <FieldError errors={[errors.terms]} />
                                </Field>

                                <FieldError>{submitError}</FieldError>

                                <Button
                                    type="submit"
                                    className="w-full bg-button hover:bg-button-hover text-button-foreground h-10 text-sm font-medium rounded-lg mt-2 transition-colors border-0"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Signing up..." : "Sign up for free"}
                                </Button>
                            </FieldGroup>
                        </form>

                        <div className="mt-8 text-center text-sm text-foreground-muted">
                            Already have an account?{" "}
                            <Link href="/login" className="text-primary hover:text-primary-hover font-medium">
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>


            <div className="hidden lg:block w-[48%] max-w-3xl p-4 pl-0">
                <div className="w-full h-full bg-background-secondary rounded-xl p-12 flex flex-col relative overflow-hidden">
                    <div className="max-w-xl mx-auto w-full pt-12 relative z-10 flex flex-col h-full">
                        <h2 className="text-[34px] font-heading leading-tight mb-4 text-heading">
                            Launch forms in  <span className="text-primary">seconds</span>

                        </h2>
                        <p className="text-foreground text-[14px] leading-relaxed mb-8">
                            Experience the fastest way to build engaging forms, surveys, and quizzes. No coding required—just drag, drop, and publish.
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
