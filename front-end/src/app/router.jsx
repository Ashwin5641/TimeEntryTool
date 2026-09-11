import { useRoutes } from "react-router-dom";

import PublicRoute from "../shared/guards/PublicRoute";

import Login from "../features/auth/pages/Login";

import employeeRoutes from "../employee/routes";

import adminRoutes from "../admin/routes";

export default function AppRouter() {
    const routes = [

        {
            path: '/login',
            element: (
                <PublicRoute>
                    <Login />
                </PublicRoute>
            )
        },

        ...employeeRoutes,

        ...adminRoutes
    ]

    return useRoutes(routes)
}