import { useRoutes } from "react-router-dom";

import employeeRoutes from "../employee/routes";

import adminRoutes from "../admin/routes";

export default function AppRouter() {
    const routes = [
        ...employeeRoutes,

        ...adminRoutes
    ]

    return useRoutes(routes)
}