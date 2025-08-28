
import TravelLogin from "@/assets/images/travel-login.jpg";
import LoginForm from "@/modules/Authentication/LoginForm";
import Logo from "@/assets/logo/logo";

export default function Login() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start mx-auto">
                    <a href="#" className="flex items-center gap-2 font-medium ">
                        <Logo />
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <LoginForm />
                    </div>
                </div>
            </div>
            <div className="bg-muted relative hidden lg:block">
                <img
                    src={TravelLogin}
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.8] "
                />
            </div>
        </div>
    )
}
