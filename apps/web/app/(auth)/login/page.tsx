
import { LoginForm } from "../../../components/Login-form";


export default function Page() {



    return (
        <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="absolute inset-0 z-0 bg-linear-to-br from-primary/7 via-background to-primary/3" />
            <div
                className="absolute inset-0 z-0 bg-[linear-gradient(to_right,_var(--muted)_1px,_transparent_1px),linear-gradient(to_bottom,_var(--muted)_1px,_transparent_1px)] bg-[length:32px_32px]"
                style={{
                    WebkitMaskImage:
                        "radial-gradient(ellipse 60% 60% at 0% 0%, #000 30%, transparent 90%), radial-gradient(ellipse 80% 80% at 100% 100%, #000 50%, transparent 90%)",
                    maskImage:
                        "radial-gradient(ellipse 80% 80% at 0% 0%, #000 40%, transparent 90%), radial-gradient(ellipse 80% 80% at 100% 100%, #000 50%, transparent 90%)",
                }}
            />
            <div className="relative z-10 w-full max-w-sm md:max-w-4xl">
                <LoginForm />
            </div>
        </div>
    );
}
