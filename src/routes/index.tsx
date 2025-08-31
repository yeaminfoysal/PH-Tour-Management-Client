import App from "@/App";
import DashboardLayout from "@/components/layout/DashboardLayout";
import About from "@/pages/About";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Verify from "@/pages/Verify";
import { generateRoutes } from "@/utils/generateRoutes";
import { createBrowserRouter, Navigate } from "react-router";
import { adminSidebarItems } from "./adminSidebarItems";
import { userSidebarItems } from "./userSidebarItems";
import Unauthorized from "@/pages/Unauthorized";
import { withAuth } from "@/utils/withAuth";
import { role } from "@/constants/role";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: App,
        children: [
            {
                path: "about",
                Component: About
            }
        ]
    },
    {
        path: "/admin",
        Component: withAuth(DashboardLayout, role.superAdmin),
        children: [
            {
                index: true,
                element: <Navigate to={"/admin/analytics"} />
            },
            ...generateRoutes(adminSidebarItems)
        ]
    },
    {
        path: "/user",
        Component: withAuth(DashboardLayout, role.user),
        children: [
            {
                index: true,
                element: <Navigate to={"/user/bookings"} />
            },
            ...generateRoutes(userSidebarItems)
        ]
    },
    {
        path: "/login",
        Component: Login
    },
    {
        path: "/register",
        Component: Register
    },
    {
        path: "/verify",
        Component: Verify
    },
    {
        path: "/unauthorized",
        Component: Unauthorized
    }
]);