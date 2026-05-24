"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Eye, EyeOff, ChevronLeft } from "lucide-react";

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
                <div className="absolute top-6 left-6">
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
                            <div className="w-5 h-5 bg-foreground rotate-45 flex items-center justify-center rounded-[3px]">
                                <div className="w-1.5 h-1.5 bg-background rounded-[1px] -rotate-45" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-foreground dark:text-white">MakeMyForm</span>
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

                    <div className="max-w-xl mx-auto w-full pt-12 relative z-10">
                        <h2 className="text-[34px] font-medium leading-tight mb-4 text-heading">
                            Create your forms<br />
                            <span className="text-primary  dark:text-blue-500">Get results in minutes</span>

                        </h2>
                        <p className="text-foreground text-[14px] leading-relaxed mb-12">
                            makemyform.in is a great tool to get started with your forms. Build your forms in minutes and connect them to your favorite apps.
                        </p>

                        {/* Form Builder Mock UI */}
                        <div className="relative w-full aspect-4/3 mt-8">
                            <div className="absolute inset-0 bg-background rounded-2xl shadow-2xl overflow-hidden border border-border">
                                {/* Form Builder Header */}
                                <div className="h-14 border-b border-border flex items-center justify-between px-6 bg-card">
                                    <div className="flex gap-10 text-[11px] font-medium text-foreground-muted">
                                        <div className="flex flex-col items-center gap-1.5 text-primary relative cursor-pointer">
                                            <div className="w-3.5 h-3.5 bg-primary/10 rounded-[3px]"></div>
                                            Build
                                        </div>

                                        <div className="flex flex-col items-center gap-1.5 cursor-pointer">
                                            <div className="w-3.5 h-3.5 bg-foreground-muted/20 rounded-[3px]"></div>
                                            Share
                                        </div>
                                        <div className="flex flex-col items-center gap-1.5 cursor-pointer">
                                            <div className="w-3.5 h-3.5 bg-foreground-muted/20 rounded-[3px]"></div>
                                            Results
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-background-secondary flex items-center justify-center border border-border">
                                            <div className="w-3 h-3 bg-foreground-muted rounded-[2px]"></div>
                                        </div>
                                        <div className="h-7 px-3 bg-primary text-primary-foreground text-[11px] font-medium rounded-md flex items-center justify-center">
                                            Publish
                                        </div>
                                    </div>
                                </div>
                                {/* Form Builder Content */}
                                <div className="flex h-full p-5 gap-5 bg-background">
                                    {/* Sidebar mock (Field Types) */}
                                    <div className="w-[160px] flex flex-col gap-3 bg-card p-3 rounded-xl border border-border shadow-sm h-fit">
                                        <div className="text-[10px] font-semibold text-foreground-muted mb-1">Basic Fields</div>
                                        {[
                                            { icon: 'T', name: 'Short Text' },
                                            { icon: '≡', name: 'Long Text' },

                                            { icon: '▼', name: 'Dropdown' },
                                            { name: 'More..' },
                                        ].map((field, i) => (
                                            <div key={i} className="flex items-center gap-2.5 p-1.5 rounded-md hover:bg-background-secondary cursor-pointer">
                                                <div className="w-5 h-5 bg-background-secondary text-foreground-muted text-[10px] font-bold rounded flex items-center justify-center">
                                                    {field.icon}
                                                </div>
                                                <div className="text-[10px] text-foreground font-medium">{field.name}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Form Canvas mock */}
                                    <div className="flex-1 flex flex-col gap-4 mx-auto">
                                        {/* Form Title */}
                                        <div className="bg-card p-4 rounded-xl border border-border hover:border-primary shadow-sm">
                                            <div className="w-3/4 h-5 bg-background-secondary rounded mb-2"></div>
                                            <div className="w-full h-2.5 bg-background-secondary rounded"></div>
                                        </div>



                                        {/* Form Field 2 (Active/Selected) */}
                                        <div className="bg-card p-4 rounded-xl shadow-sm border border-primary relative">
                                            {/* Selection Handle */}
                                            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-md"></div>
                                            <div className="w-1/2 h-3.5 bg-primary/80 rounded mb-3"></div>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full border-2 border-foreground-muted"></div>
                                                    <div className="w-1/2 h-2.5 bg-background-secondary rounded"></div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full border-2 border-primary flex items-center justify-center">
                                                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                                    </div>
                                                    <div className="w-2/3 h-2.5 bg-background-secondary rounded"></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Add Field Button */}
                                        <div className="w-full h-10 border-2 border-dashed border-border hover:border-border-hover rounded-xl flex items-center justify-center text-foreground-muted cursor-pointer transition-colors">
                                            <div className="w-4 h-4 rounded-full bg-background-secondary flex items-center justify-center text-lg leading-none pb-0.5">+</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Integration Badge */}
                            <div className="absolute -bottom-12 -right-12 bg-card text-foreground p-5 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] z-20 w-[180px] border border-border">
                                <span className="font-semibold text-[13px] block text-center mb-3">Easy to Build</span>
                                <div className="flex justify-center items-center h-16 relative">
                                    {/* Abstract build icons */}
                                    <div className="w-10 h-10 bg-primary/20 rounded-full absolute left-4 bottom-2 flex items-center justify-center">
                                        <div className="w-4 h-1 bg-primary rounded-full"></div>
                                    </div>
                                    <div className="w-12 h-12 bg-primary rounded-xl absolute right-5 top-1 shadow-lg flex flex-col items-center justify-center gap-1.5">
                                        <div className="w-5 h-1.5 bg-primary-foreground/80 rounded-full"></div>
                                        <div className="w-7 h-1.5 bg-primary-foreground/40 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
