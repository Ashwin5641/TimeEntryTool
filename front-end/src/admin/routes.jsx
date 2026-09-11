import AdminLayout from "./layout/AdminLayout";

import ProtectedRoute from "../shared/guards/ProtectedRoute";

import AdmDashboard from "./pages/dashboard/AdmDashboard";
import AdmDptmnt from "./pages/departments/AdmDptmnt";
import AdmEmployees from "./pages/employees/admEmployees";
import AdmEmpList from "./pages/employees-list/AdmEmpList";
import AdmProjects from "./pages/projects/AdmProjects";
import AdmActivities from "./pages/activities/AdmActivities";
import AdmDprtmntActivities from "./pages/department-activities/AdmDprtmntActivities";
import AdmSubActivities from "./pages/sub-activities/AdmSubActivities";
import AdmWorkType from "./pages/work-type/AdmWorkType";
import AdmDprtmntWrkTyp from "./pages/department-work-types/AdmDprtmntWrkTyp";
import AdmWorkLog from "./pages/work-logs/AdmWorkLog";

const adminRoutes = [
    {
        path: '/admin',
        element: (
            <ProtectedRoute role="admin">
                <AdminLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <AdmDashboard />
            },
            {
                path: 'employees',
                element: <AdmEmployees />
            },
            {
                path: 'employees/edit/:id',
                element: <AdmEmployees />
            },
            {
                path: 'employees-list',
                element: <AdmEmpList />
            },
            {
                path: 'departments',
                element: <AdmDptmnt />
            },
            {
                path: 'projects',
                element: <AdmProjects />
            },
            {
                path: 'activities',
                element: <AdmActivities />
            },
            {
                path: 'department-activities',
                element: <AdmDprtmntActivities />
            },
            {
                path: 'sub-activities',
                element: <AdmSubActivities />
            },
            {
                path: 'work-type',
                element: <AdmWorkType />
            },
            {
                path: 'department-workTypes',
                element: <AdmDprtmntWrkTyp />
            },
            {
                path: 'work-logs',
                element: <AdmWorkLog />
            }
        ]
    }
]

export default adminRoutes;