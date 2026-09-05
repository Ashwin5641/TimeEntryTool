import EmployeeLayout from "./layout/EmployeeLayout";

import Employee from "./pages/employee/Employee";
import EmpFillDetails from "./pages/employee-fillDetails/EmpFillDetails";

const employeeRoutes = [
    {
        path: '/',
        element: <EmployeeLayout />,
        children: [
            {
                index: true,
                element: <Employee />
            },
            {
                path: '/employee-fillDetails/:employee_id',
                element: <EmpFillDetails />
            },
        ]
    }
]

export default employeeRoutes;