import { SignUpForm } from "../../../components/auth/sign-up-form";

export default function Page() {
    return (
        <div className="relative flex min-h-svh w-full items-center justify-center">
            <div className="relative z-10 w-full">
                <SignUpForm />
            </div>
        </div>
    );
}
