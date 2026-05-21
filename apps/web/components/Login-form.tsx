"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Eye, EyeOff, ChevronLeft } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "./ui/field";
import { Input } from "./ui/input";
import { useSignIn } from "~/hooks/api/auth";

type SignInFormValues = {
    email: string;
    password: string;
};

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const router = useRouter();
    const { signInUserWithEmailAndPasswordAsync } = useSignIn();
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormValues>({
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onSubmit"
    });

    const submitForm = async (data: SignInFormValues) => {
        setSubmitError(null);
        try {
            await signInUserWithEmailAndPasswordAsync({
                email: data.email,
                password: data.password,
            });

            toast.success("Login successfully");
            router.push("/dashboard");
        } catch (error) {
            const message = "Failed to login into your account";
            setSubmitError(message);
            toast.error(message);
        }
    }

    function handleGoogleLogin() {
        console.log("submitted google");
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
                        <Link href="/">
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                    <div className="w-full max-w-[360px]">
                        <div className="flex items-center justify-center gap-2.5 mb-6 absolute top-10 left-1/2 -translate-x-1/2">
                            <div className="w-5 h-5 bg-foreground rotate-45 flex items-center justify-center rounded-[3px]">
                                <div className="w-1.5 h-1.5 bg-background rounded-[1px] -rotate-45" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-foreground dark:text-white">MakeMyForm</span>
                        </div>

                        <h1 className="text-center text-xl font-medium text-foreground mb-8">Welcome back! 👋</h1>

                        <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
                            <FieldGroup className="space-y-4">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    disabled={isSubmitting}
                                    className="w-full bg-transparent border-border hover:bg-background-secondary text-foreground h-10 rounded-lg flex items-center justify-center gap-2"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width="18"
                                        height="18"
                                    >
                                        <path
                                            fill="#4285F4"
                                            d="M23.64 12.204c0-.793-.07-1.554-.2-2.284H12v4.318h6.32c-.272 1.44-1.088 2.66-2.32 3.474v2.88h3.74c2.184-2.014 3.46-4.978 3.46-8.388z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 24c3.24 0 5.966-1.074 7.954-2.914l-3.74-2.88c-1.04.694-2.36 1.102-4.214 1.102-3.24 0-5.987-2.19-6.964-5.138H1.22v3.09C3.196 21.51 7.38 24 12 24z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.036 14.224c-.242-.694-.38-1.432-.38-2.184s.138-1.49.38-2.184V6.766H1.22C.44 8.034 0 9.482 0 11s.44 2.966 1.22 4.234l3.816-1.01z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 4.84c1.762 0 3.344.606 4.588 1.796l3.438-3.438C17.964 1.094 15.24 0 12 0 7.38 0 3.196 2.49 1.22 6.766l3.816 3.09C6.013 7.03 8.76 4.84 12 4.84z"
                                        />
                                    </svg>
                                    <span className="text-[13px] font-medium">Sign in with Google</span>
                                </Button>

                                <div className="relative flex items-center py-2">
                                    <div className="flex-grow border-t border-border"></div>
                                    <span className="flex-shrink-0 mx-4 text-foreground-muted text-[11px] uppercase font-medium">OR</span>
                                    <div className="flex-grow border-t border-border"></div>
                                </div>

                                <Field>
                                    <FieldLabel htmlFor="email" className="text-[13px] text-foreground font-normal">Username or Email</FieldLabel>
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
                                    <FieldLabel htmlFor="password" className="text-[13px] text-foreground font-normal">Password</FieldLabel>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Please enter your password"
                                            className="bg-transparent border-border text-[13px] text-foreground placeholder:text-foreground-muted focus-visible:ring-ring focus-visible:border-primary h-10 rounded-lg"
                                            {...register("password", { required: "Password is required" })}
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
                                    <div className="flex justify-end mt-1.5">
                                        <Link
                                            href="/test-route"
                                            className="text-[12px] text-foreground-muted hover:text-foreground underline underline-offset-2 transition-colors"
                                        >
                                            Forgot your password?
                                        </Link>
                                    </div>
                                </Field>

                                <FieldError>{submitError}</FieldError>

                                <Button
                                    type="submit"
                                    className="w-full bg-button hover:bg-button-hover text-button-foreground h-10 text-sm font-medium rounded-lg mt-2 transition-colors border-0"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Logging in..." : "Login"}
                                </Button>
                            </FieldGroup>
                        </form>

                        <div className="mt-8 text-center text-sm text-foreground-muted">
                            You're new here?{" "}
                            <Link href="/registration" className="text-primary hover:text-primary-hover font-medium">
                                Sign up for free
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Pane Promo Mock UI */}
            <div className="hidden lg:block w-[48%] max-w-3xl p-4 pl-0">
                <div className="w-full h-full bg-background-secondary rounded-xl p-12 flex flex-col relative overflow-hidden">
                    <div className="max-w-xl mx-auto w-full pt-12 relative z-10">
                        <h2 className="text-[34px] font-medium leading-tight mb-4 text-heading">
                            Match your brandstyle &<br />
                            <span className="text-primary dark:text-blue-500">Impress your audience</span>
                        </h2>
                        <p className="text-foreground text-[14px] leading-relaxed mb-12">
                            Leave a lasting impression by choosing from 50+ themes or making customizations to showcase your flair and creativity.
                        </p>

                        {/* Form Builder Themes Mock UI */}
                        <div className="relative w-full aspect-4/3 mt-8">
                            <div className="absolute inset-0 bg-background rounded-2xl shadow-2xl overflow-hidden border border-border">
                                {/* Form Builder Header */}
                                <div className="h-14 border-b border-border flex items-center justify-between px-6 bg-card">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 bg-foreground rotate-45 flex items-center justify-center rounded-[3px]">
                                            <div className="w-1.5 h-1.5 bg-background rounded-[1px] -rotate-45" />
                                        </div>
                                    </div>
                                    <div className="flex gap-10 text-[11px] font-medium text-foreground-muted">
                                        <div className="flex flex-col items-center gap-1.5 cursor-pointer">
                                            <div className="w-3.5 h-3.5 bg-foreground-muted/20 rounded-[3px]"></div>
                                            Build
                                        </div>
                                        <div className="flex flex-col items-center gap-1.5 text-primary relative cursor-pointer">
                                            <div className="w-3.5 h-3.5 bg-primary/10 rounded-[3px]"></div>
                                            Settings
                                        </div>
                                        <div className="flex flex-col items-center gap-1.5 cursor-pointer">
                                            <div className="w-3.5 h-3.5 bg-foreground-muted/20 rounded-[3px]"></div>
                                            Connect
                                        </div>
                                        <div className="flex flex-col items-center gap-1.5 cursor-pointer">
                                            <div className="w-3.5 h-3.5 bg-foreground-muted/20 rounded-[3px]"></div>
                                            Share
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0">
                                        <div className="w-6 h-6 rounded-full bg-background-secondary"></div>
                                    </div>
                                </div>

                                {/* Form Builder Content */}
                                <div className="flex h-full p-5 gap-5 bg-background">
                                    {/* Sidebar mock (Themes) */}
                                    <div className="w-[160px] flex flex-col gap-4 bg-card p-4 rounded-xl border border-border shadow-sm h-fit">
                                        <div className="text-[10px] font-semibold text-foreground-muted mb-1">Basic themes</div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="w-full aspect-video bg-background border border-border rounded-md shadow-sm"></div>
                                            <div className="w-full aspect-video bg-primary/20 border border-primary/30 rounded-md shadow-sm"></div>
                                            <div className="w-full aspect-video bg-pink-500/20 border border-pink-500/30 rounded-md shadow-sm"></div>
                                            <div className="w-full aspect-video bg-blue-500/20 border border-blue-500/30 rounded-md shadow-sm"></div>
                                            <div className="w-full aspect-video bg-foreground border border-border rounded-md shadow-sm"></div>
                                            <div className="w-full aspect-video bg-black border border-border rounded-md shadow-sm"></div>
                                        </div>

                                        <div className="text-[10px] font-semibold text-foreground-muted mt-2 mb-1">Special crafts</div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="w-full aspect-video bg-gradient-to-br from-pink-500/20 to-orange-500/20 border border-border rounded-md shadow-sm"></div>
                                            <div className="w-full aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-border rounded-md shadow-sm"></div>
                                        </div>
                                    </div>

                                    {/* Form Canvas mock */}
                                    <div className="flex-1 flex flex-col gap-4 mx-auto relative">
                                        <div className="absolute top-0 right-0 bg-card border border-border rounded-full px-3 py-1.5 flex items-center gap-2 shadow-sm z-10">
                                            <span className="text-[10px] font-medium text-foreground-muted">Custom CSS</span>
                                            <div className="w-6 h-3.5 bg-foreground rounded-full relative">
                                                <div className="w-2.5 h-2.5 bg-background rounded-full absolute right-0.5 top-0.5"></div>
                                            </div>
                                        </div>

                                        <div className="bg-card p-6 rounded-xl border border-border shadow-sm mt-8 relative">
                                            <div className="flex gap-3 mb-6">
                                                <div className="text-foreground font-medium text-sm">1.</div>
                                                <div className="flex-1">
                                                    <div className="w-1/3 h-4 bg-background-secondary rounded mb-3"></div>
                                                    <div className="w-full h-10 bg-background rounded border border-border"></div>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="text-foreground font-medium text-sm">2.</div>
                                                <div className="flex-1">
                                                    <div className="w-1/4 h-4 bg-background-secondary rounded mb-3"></div>
                                                    <div className="w-full h-10 bg-background rounded border border-border flex items-center px-3">
                                                        <div className="w-4 h-4 bg-background-secondary rounded-sm mr-2"></div>
                                                        <div className="w-24 h-3 bg-background-secondary rounded"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Customization Badges */}
                            <div className="absolute -bottom-6 right-12 flex gap-4 z-20">
                                <div className="bg-card text-foreground p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.15)] border border-border w-[140px] border-t-pink-500 border-t-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="font-medium text-[12px]">Color</span>
                                        <div className="flex gap-1">
                                            <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mb-3 pt-3 border-t border-border">
                                        <span className="font-medium text-[12px]">Font</span>
                                        <span className="font-serif text-sm">Tt</span>
                                    </div>
                                    <div className="flex justify-between pt-3 border-t border-border">
                                        <div className="w-5 h-5 rounded border border-border flex items-center justify-center"><div className="w-2 h-2 rounded-full border border-foreground-muted"></div></div>
                                        <div className="w-5 h-5 rounded border border-border flex items-center justify-center"><div className="w-3 h-3 rounded-sm border border-foreground-muted"></div></div>
                                        <div className="w-5 h-5 rounded border border-border flex items-center justify-center"><div className="w-3 h-2 rounded-sm border border-foreground-muted"></div></div>
                                    </div>
                                </div>

                                <div className="bg-card text-foreground p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.15)] border border-border w-[140px] flex flex-col justify-end">
                                    <div className="bg-primary/10 border border-primary/20 text-primary text-[10px] font-medium py-1.5 px-3 rounded-lg text-center mb-3">
                                        Upload your logo
                                    </div>
                                    <div className="h-16 bg-primary rounded-xl flex items-center justify-center relative overflow-hidden">
                                        <div className="w-8 h-8 rounded-full border-2 border-primary-foreground/30 flex items-center justify-center">
                                            <div className="w-3 h-3 bg-primary-foreground rounded-sm rotate-45"></div>
                                        </div>
                                        <div className="absolute top-0 right-0 w-8 h-8 bg-white/10 rounded-bl-full"></div>
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
