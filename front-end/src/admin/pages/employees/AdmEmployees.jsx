import { useEffect, useState } from "react";
import './admEmployees.css'

import EmployeesForm from "../../components/employees/EmployeesForm";

import { useParams } from "react-router-dom";
import { getEmployeeById } from "../../api/admEmployeesListApi";

export default function AdmEmployees() {

    const {id} = useParams();

    useEffect(() => {
       fetchEmployeById();
    }, [id])

    const [editEmployee, setEditEmployee] = useState('');

    const fetchEmployeById = async () => {
        try {
            const res = await getEmployeeById(id);
            setEditEmployee(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="employees-dash">
            <div className="employees-dash-header">
                <h4>Employees Management</h4>
            </div>
            <div className="employees-dash-form">
                <EmployeesForm editEmployee={editEmployee} setEditEmployee={setEditEmployee} />
            </div>
        </div>
    )
}