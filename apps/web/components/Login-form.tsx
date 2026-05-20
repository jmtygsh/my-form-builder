"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { useState } from "react";
import { toast } from "sonner";

import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "./ui/field";
import { Input } from "./ui/input";
import { useSignIn } from "~/hooks/api/auth";


type SignIpFormValues = {
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

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, },
        getValues
    } = useForm<SignIpFormValues>({
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onTouched"
    });


    const submitForm = async (data: SignIpFormValues) => {
        setSubmitError(null);
        try {
            await signInUserWithEmailAndPasswordAsync({
                email: data.email,
                password: data.password,
            });

            toast.success("login successfully");
            router.push("/dashboard");
        } catch (error) {
            // console.log(error);
            const message = "Failed to login into your account"
            setSubmitError(message);
            toast.error(message);
        }
    }


    function handleGoogleLogin() {
        console.log("sibmitted google")
    }

    return (
        <div className={cn("flex flex-col gap-6 drop-shadow-yellow-500", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2"
                >
                    <form className="p-6 md:p-8" onSubmit={handleSubmit(submitForm)}>
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">Welcome Back</h1>
                                <p className="text-muted-foreground text-balance">
                                    Login to your MakeMyForm
                                </p>
                            </div>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your email"
                                    required
                                    {...register("email", { required: "email is required" })}
                                    disabled={isSubmitting}
                                />
                                <FieldError errors={[errors.email]} />
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <Link
                                        href="/test-route"
                                        className="ml-auto text-sm underline-offset-2 hover:underline"
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    {...register("password", { required: "password is required" })}
                                    disabled={isSubmitting}
                                />
                            </Field>

                            <Field>
                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? "Signing in..." : "Login"}
                                </Button>
                            </Field>
                            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                Or continue with
                            </FieldSeparator>
                            <Field className="grid grid-cols-2 gap-4">

                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    disabled={isSubmitting}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width="24"
                                        height="24"
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
                                    <span className="sr-only">Login with Google</span>
                                </Button>

                                <Button variant="outline" type="button">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path
                                            d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                                            fill="currentColor"
                                        />
                                    </svg>
                                </Button>


                            </Field>
                            <FieldDescription className="text-center">
                                Don&apos;t have an account?{" "}
                                <Link href="/test-sign-in">Sign up</Link>
                            </FieldDescription>
                        </FieldGroup>
                    </form>

                    <div className="bg-muted relative hidden md:block mask-l-from-80% mask-l-to-110%">
                        <Image
                            src="/assets/log-in.jpg"
                            alt="Login Image"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </CardContent>
            </Card>


            <FieldDescription className="px-6 text-center">
                By clicking continue, you agree to our{" "}
                <Link href="/test-terms">Terms of Service</Link> and{" "}
                <Link href="/test-terms">Privacy Policy</Link>.
            </FieldDescription>
        </div>
    );
}
