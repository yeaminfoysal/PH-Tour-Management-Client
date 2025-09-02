import AddDivision from "@/pages/Admin/AddDivision";
import AddTour from "@/pages/Admin/AddTour";
import AddTourType from "@/pages/Admin/AddTourType";
import { lazy } from "react";
// import Analytics from "@/pages/Admin/Analytics";

const Analytics = lazy(() => import("@/pages/Admin/Analytics"));

export const adminSidebarItems = [
    {
        title: "Dashboard",
        items: [
            {
                title: "Analytics",
                url: "/admin/analytics",
                component: Analytics
            }
        ],
    },
    {
        title: "Division Management",
        items: [
            {
                title: "Add Division",
                url: "/admin/add-division",
                component: AddDivision
            },
        ]
    },
    {
        title: "Tour Management",
        items: [
            {
                title: "Add Tour",
                url: "/admin/add-tour",
                component: AddTour
            },
            {
                title: "Add Tour Type",
                url: "/admin/add-tour-type",
                component: AddTourType
            }
        ],
    }
]