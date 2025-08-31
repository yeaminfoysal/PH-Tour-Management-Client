import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import type { ComponentType } from "react"
import { Navigate } from "react-router";

export const withAuth = (Component: ComponentType, reqiredRole?: string) => {
    return function AuthWrapper() {
        const { data, isLoading } = useUserInfoQuery(undefined);

        if (!isLoading && !data?.data?.email) {
            return <Navigate to={"/login"} />
        }

        if (reqiredRole && !isLoading && reqiredRole !== data?.data?.role) {
            return <Navigate to={"/unauthorized"} />
        }

        return <Component />
    }
}