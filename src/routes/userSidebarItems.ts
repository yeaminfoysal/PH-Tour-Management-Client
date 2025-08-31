import Bookings from "@/pages/User/Bookings";

export const userSidebarItems = [
    {
        title: "History",
        items: [
            {
                title: "Bookings",
                url: "/user/bookings",
                component: Bookings
            }
        ],
    },
]