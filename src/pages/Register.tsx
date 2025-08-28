
import TravelRegister from "@/assets/images/travel-register.jpg";
import RegisterForm from "@/modules/Authentication/RegisterForm";
import Logo from "@/assets/logo/logo";

export default function Register() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="bg-muted relative hidden lg:block">
                <img
                    src={TravelRegister}
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.8] "
                />
            </div>
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start mx-auto">
                    <a href="#" className="flex items-center gap-2 font-medium ">
                        <Logo/>
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <RegisterForm />
                    </div>
                </div>
            </div>
        </div>
    )
}
